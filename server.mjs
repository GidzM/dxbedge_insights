import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { CANONICAL_SOURCE_LABELS, SOURCE_LABEL_OVERRIDES_BY_FILE } from './sourceLabels.js';
import {
  CALCULATOR_SCHEMA,
  SOURCE_CATALOG,
  SNAPSHOT_DATA,
  validateSnapshotRecord,
  computeCityScores,
} from './server/calculatorModel.mjs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 8080);

const CORE_KNOWLEDGE_DOCS = [
  {
    source: 'DXB Expert Insights',
    fileName: 'SME_Notes.txt',
  },
  {
    source: 'DXB Expert Insights',
    fileName: 'Investor_project_5_-_commerical_information.txt',
  },
];

const KNOWLEDGE_DIR = path.resolve(process.cwd(), 'knowledge');
const SUPPORTED_KNOWLEDGE_EXTENSIONS = new Set(['.txt', '.md']);
const EXCLUDED_KNOWLEDGE_FILES = new Set([
  'tmp_ubs_bubble_2025.txt',
  'knowledge/tmp_ubs_bubble_2025.txt',
]);
const SOURCE_LABEL_OVERRIDES = new Map(Object.entries(SOURCE_LABEL_OVERRIDES_BY_FILE));

function normalizeDocKey(fileName) {
  return fileName.replace(/\\/g, '/').toLowerCase();
}

function resolveSourceLabel(fileName, fallbackLabel) {
  return SOURCE_LABEL_OVERRIDES.get(normalizeDocKey(fileName)) || fallbackLabel;
}

function isExcludedKnowledgeFile(fileName) {
  return EXCLUDED_KNOWLEDGE_FILES.has(normalizeDocKey(fileName));
}

function toSourceLabel(fileName) {
  const extension = path.extname(fileName);
  const base = fileName.replace(extension, '');

  return base
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function discoverKnowledgeDocs() {
  const discoveredDocs = CORE_KNOWLEDGE_DOCS.map((doc) => ({
    ...doc,
    source: resolveSourceLabel(doc.fileName, doc.source),
  })).filter((doc) => !isExcludedKnowledgeFile(doc.fileName));
  const seenFiles = new Set(discoveredDocs.map((doc) => normalizeDocKey(doc.fileName)));

  if (fs.existsSync(KNOWLEDGE_DIR)) {
    const files = fs.readdirSync(KNOWLEDGE_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => SUPPORTED_KNOWLEDGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b));

    for (const fileName of files) {
      const relativeFile = path.join('knowledge', fileName);
      if (isExcludedKnowledgeFile(relativeFile) || seenFiles.has(normalizeDocKey(relativeFile))) {
        continue;
      }

      discoveredDocs.push({
        source: resolveSourceLabel(relativeFile, toSourceLabel(fileName)),
        fileName: relativeFile,
      });
      seenFiles.add(normalizeDocKey(relativeFile));
    }
  }

  return discoveredDocs;
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'your', 'you', 'are', 'was', 'were',
  'have', 'has', 'had', 'about', 'what', 'when', 'where', 'which', 'their', 'there', 'than', 'then',
  'them', 'they', 'but', 'not', 'can', 'will', 'would', 'could', 'should', 'how', 'why', 'who', 'our',
  'its', 'per', 'via', 'all', 'any', 'more', 'most', 'less', 'over', 'under', 'between', 'across',
  'also', 'very', 'only', 'just', 'each', 'such', 'been', 'being', 'is', 'of', 'to', 'in', 'on', 'as',
  'at', 'by', 'or', 'if', 'it', 'a', 'an'
]);

const KNOWLEDGE_DOCS = discoverKnowledgeDocs();
const KNOWLEDGE_INDEX = buildKnowledgeIndex();

function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

function tokenize(text) {
  return normalizeText(text)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function buildKnowledgeIndex() {
  const docs = [];

  for (const doc of KNOWLEDGE_DOCS) {
    const filePath = path.resolve(process.cwd(), doc.fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`[Knowledge] File not found: ${doc.fileName}`);
      continue;
    }

    const rawText = fs.readFileSync(filePath, 'utf8');
    const blocks = rawText
      .split(/\n\s*\n+/)
      .map((block) => block.replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    const chunks = blocks.map((chunkText, index) => ({
      source: doc.source,
      fileName: doc.fileName,
      index,
      text: chunkText,
      tokens: tokenize(chunkText),
    }));

    docs.push({
      ...doc,
      filePath,
      chunks,
    });
  }

  const totalChunks = docs.reduce((sum, doc) => sum + doc.chunks.length, 0);
  console.log(`[Knowledge] Loaded ${docs.length} docs with ${totalChunks} chunks.`);

  return docs;
}

function getRelevantContext(question, maxChunks = 6) {
  const queryTokens = tokenize(question);
  const queryTokenSet = new Set(queryTokens);

  const scored = [];

  for (const doc of KNOWLEDGE_INDEX) {
    for (const chunk of doc.chunks) {
      if (!chunk.tokens.length) {
        continue;
      }

      let overlap = 0;
      for (const token of chunk.tokens) {
        if (queryTokenSet.has(token)) {
          overlap += 1;
        }
      }

      const densityBonus = overlap > 0 ? overlap / Math.max(chunk.tokens.length, 1) : 0;
      const score = overlap + densityBonus;

      if (score > 0) {
        scored.push({
          score,
          source: chunk.source,
          text: chunk.text,
        });
      }
    }
  }

  if (scored.length === 0) {
    const fallback = KNOWLEDGE_INDEX
      .slice(0, 2)
      .flatMap((doc) => doc.chunks.slice(0, 2))
      .map((chunk) => ({
        source: chunk.source,
        text: chunk.text,
      }));

    return fallback;
  }

  const topByScore = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);

  return topByScore;
}

function getKnowledgeSummary() {
  const sources = KNOWLEDGE_INDEX.map((doc) => ({
    source: doc.source,
    fileName: doc.fileName,
    chunkCount: doc.chunks.length,
  }));

  const totalChunks = sources.reduce((sum, source) => sum + source.chunkCount, 0);

  return {
    sourceCount: sources.length,
    totalChunks,
    sources,
  };
}

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_API_KEY;
  const knowledge = getKnowledgeSummary();

  res.json({
    ok: true,
    service: 'dxb-edge-insight',
    keyConfigured: Boolean(apiKey),
    knowledgeConfigured: knowledge.sourceCount > 0,
    knowledgeSourceCount: knowledge.sourceCount,
    knowledgeChunkCount: knowledge.totalChunks,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/knowledge/sources', (_req, res) => {
  res.json({
    ok: true,
    ...getKnowledgeSummary(),
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/gemini', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
      return;
    }

    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const contextChunks = getRelevantContext(message);
    const contextBlock = contextChunks
      .map((chunk, index) => `[Source: ${chunk.source}]\n${chunk.text}`)
      .join('\n\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `USER QUESTION:\n${message}\n\nRETRIEVED KNOWLEDGE CONTEXT:\n${contextBlock}\n\nINSTRUCTIONS:\n- Answer using only the retrieved knowledge context above.
- If a detail is not present in context, say it is not available in the verified knowledge base.
- Add [Source: ...] citations using only source names from the retrieved context.`,
      config: {
        systemInstruction: `You are the DxB Edge Insight AI.
MISSION: Transform SME knowledge and strategy into high-density educational guidance.
      PRIMARY KNOWLEDGE: ${CANONICAL_SOURCE_LABELS.join(', ')}.
TONE: Professional, unbiased, guide-not-salesperson.

FORMATTING RULES:
1. STRICT: DO NOT use italics (* or _ symbols for emphasis).
2. STRICT: DO NOT use markdown headers like ### or ##. Use UPPERCASE BOLD text for headers.
3. STRICT: DO NOT use markdown symbols (*, **, ###) in visible text. Use simple bolding for emphasis on figures.
4. BULLETS: Use only the simple dot symbol • for lists.
5. DATA FIRST: Bold statistics and major figures (e.g., AED 32T).
6. CITATION: Place [Source: Source Name] at the end of relevant paragraphs using source names present in the retrieved context.
7. TABLES: Use standard markdown table syntax for comparisons, which the UI will render into a premium table.
8. STYLE: Responses must be clean, executive, and high-density.`,
      },
    });

    res.json({ text: response.text || 'Communication timeout. Please re-verify strategic intent.' });
  } catch (error) {
    console.error('Gemini proxy request failed', error);
    res.status(502).json({ error: 'Gemini request failed.' });
  }
});

app.get('/api/calculator/schema', (_req, res) => {
  res.json({
    ok: true,
    schema: CALCULATOR_SCHEMA,
    sourceCatalog: SOURCE_CATALOG,
  });
});

app.get('/api/calculator/snapshots', (_req, res) => {
  const invalidRows = [];

  SNAPSHOT_DATA.forEach((row, index) => {
    const check = validateSnapshotRecord(row);
    if (!check.valid) {
      invalidRows.push({ index, error: check.error });
    }
  });

  res.json({
    ok: invalidRows.length === 0,
    records: SNAPSHOT_DATA,
    invalidRows,
    total: SNAPSHOT_DATA.length,
  });
});

app.post('/api/calculator/score', (req, res) => {
  try {
    const monthlyBudget = Number(req.body?.monthlyBudget ?? 3200);
    const objective = typeof req.body?.objective === 'string' ? req.body.objective : 'balanced';
    const riskTolerance = typeof req.body?.riskTolerance === 'string' ? req.body.riskTolerance : 'medium';
    const timeHorizon = typeof req.body?.timeHorizon === 'string' ? req.body.timeHorizon : 'medium';

    const result = computeCityScores({
      monthlyBudget,
      objective,
      riskTolerance,
      timeHorizon,
    });

    res.json({ ok: true, ...result });
  } catch (error) {
    console.error('Calculator scoring failed', error);
    res.status(400).json({ ok: false, error: 'Invalid calculator input.' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`DxB Edge server listening on ${port}`);
});
