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

const AI_ASSISTANT_ENABLED = process.env.AI_ASSISTANT_ENABLED !== 'false';
const GEMINI_MAX_MESSAGE_CHARS = Number(process.env.GEMINI_MAX_MESSAGE_CHARS || 2000);
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 20000);
const GEMINI_CONTEXT_MAX_CHUNKS = Number(process.env.GEMINI_CONTEXT_MAX_CHUNKS || 4);
const GEMINI_RATE_LIMIT_WINDOW_MS = Number(process.env.GEMINI_RATE_LIMIT_WINDOW_MS || 300000);
const GEMINI_RATE_LIMIT_MAX_REQUESTS = Number(process.env.GEMINI_RATE_LIMIT_MAX_REQUESTS || 10);
const GEMINI_DAILY_LIMIT_PER_IP = Number(process.env.GEMINI_DAILY_LIMIT_PER_IP || 120);
const GEMINI_CACHE_ENABLED = process.env.GEMINI_CACHE_ENABLED !== 'false';
const GEMINI_CACHE_TTL_MS = Number(process.env.GEMINI_CACHE_TTL_MS || 300000);
const GEMINI_CACHE_MAX_ENTRIES = Number(process.env.GEMINI_CACHE_MAX_ENTRIES || 300);
const GEMINI_CACHE_MIN_MESSAGE_CHARS = Number(process.env.GEMINI_CACHE_MIN_MESSAGE_CHARS || 20);
const GEMINI_CACHE_MAX_MESSAGE_CHARS = Number(process.env.GEMINI_CACHE_MAX_MESSAGE_CHARS || 1200);
const GEMINI_USER_RATE_LIMIT_WINDOW_MS = Number(process.env.GEMINI_USER_RATE_LIMIT_WINDOW_MS || 300000);
const GEMINI_USER_RATE_LIMIT_MAX_REQUESTS = Number(process.env.GEMINI_USER_RATE_LIMIT_MAX_REQUESTS || 20);
const GEMINI_USER_DAILY_LIMIT = Number(process.env.GEMINI_USER_DAILY_LIMIT || 200);
const CAPTCHA_ENFORCED = process.env.CAPTCHA_ENFORCED === 'true';
const CAPTCHA_PROVIDER = (process.env.CAPTCHA_PROVIDER || 'none').toLowerCase();
const CAPTCHA_SECRET_KEY = process.env.CAPTCHA_SECRET_KEY || '';
const CAPTCHA_SITE_KEY = process.env.CAPTCHA_SITE_KEY || '';

const ipWindowCounters = new Map();
const ipDailyCounters = new Map();
const userWindowCounters = new Map();
const userDailyCounters = new Map();
const geminiResponseCache = new Map();
let geminiCacheHits = 0;
let geminiCacheMisses = 0;

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

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }

  return req.socket?.remoteAddress || 'unknown';
}

function getDayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getClientId(req) {
  const rawClientId = req.headers['x-client-id'];
  const clientId = Array.isArray(rawClientId) ? rawClientId[0] : rawClientId;

  if (typeof clientId !== 'string') {
    return null;
  }

  const normalized = clientId.trim();
  if (!normalized || normalized.length > 128 || !/^[a-zA-Z0-9._:-]+$/.test(normalized)) {
    return null;
  }

  return normalized;
}

function enforceGeminiLimits(req, res) {
  const clientIp = getClientIp(req);
  const now = Date.now();
  const dayKey = getDayKey();

  const windowEntry = ipWindowCounters.get(clientIp);
  if (!windowEntry || now - windowEntry.windowStart >= GEMINI_RATE_LIMIT_WINDOW_MS) {
    ipWindowCounters.set(clientIp, { windowStart: now, count: 1 });
  } else {
    if (windowEntry.count >= GEMINI_RATE_LIMIT_MAX_REQUESTS) {
      const retryAfterSeconds = Math.ceil((GEMINI_RATE_LIMIT_WINDOW_MS - (now - windowEntry.windowStart)) / 1000);
      res.setHeader('Retry-After', String(Math.max(retryAfterSeconds, 1)));
      res.status(429).json({ error: 'Rate limit exceeded. Please retry later.' });
      return false;
    }
    windowEntry.count += 1;
    ipWindowCounters.set(clientIp, windowEntry);
  }

  const dailyEntry = ipDailyCounters.get(clientIp);
  if (!dailyEntry || dailyEntry.dayKey !== dayKey) {
    ipDailyCounters.set(clientIp, { dayKey, count: 1 });
  } else {
    if (dailyEntry.count >= GEMINI_DAILY_LIMIT_PER_IP) {
      res.status(429).json({ error: 'Daily usage limit reached. Please try again tomorrow.' });
      return false;
    }
    dailyEntry.count += 1;
    ipDailyCounters.set(clientIp, dailyEntry);
  }

  return true;
}

function enforceGeminiUserLimits(req, res) {
  const clientId = getClientId(req);
  const key = clientId || `ip:${getClientIp(req)}`;
  const now = Date.now();
  const dayKey = getDayKey();

  const windowEntry = userWindowCounters.get(key);
  if (!windowEntry || now - windowEntry.windowStart >= GEMINI_USER_RATE_LIMIT_WINDOW_MS) {
    userWindowCounters.set(key, { windowStart: now, count: 1 });
  } else {
    if (windowEntry.count >= GEMINI_USER_RATE_LIMIT_MAX_REQUESTS) {
      const retryAfterSeconds = Math.ceil((GEMINI_USER_RATE_LIMIT_WINDOW_MS - (now - windowEntry.windowStart)) / 1000);
      res.setHeader('Retry-After', String(Math.max(retryAfterSeconds, 1)));
      res.status(429).json({ error: 'User quota rate limit exceeded. Please retry later.' });
      return false;
    }
    windowEntry.count += 1;
    userWindowCounters.set(key, windowEntry);
  }

  const dailyEntry = userDailyCounters.get(key);
  if (!dailyEntry || dailyEntry.dayKey !== dayKey) {
    userDailyCounters.set(key, { dayKey, count: 1 });
  } else {
    if (dailyEntry.count >= GEMINI_USER_DAILY_LIMIT) {
      res.status(429).json({ error: 'User daily quota reached. Please try again tomorrow.' });
      return false;
    }
    dailyEntry.count += 1;
    userDailyCounters.set(key, dailyEntry);
  }

  return true;
}

async function withTimeout(task, timeoutMs) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Gemini request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([task(), timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildGeminiCacheKey(message) {
  return normalizeText(message).replace(/\s+/g, ' ').trim();
}

function getCachedGeminiResponse(cacheKey) {
  if (!GEMINI_CACHE_ENABLED) {
    return null;
  }

  const entry = geminiResponseCache.get(cacheKey);
  if (!entry) {
    geminiCacheMisses += 1;
    return null;
  }

  if (Date.now() >= entry.expiresAt) {
    geminiResponseCache.delete(cacheKey);
    geminiCacheMisses += 1;
    return null;
  }

  geminiResponseCache.delete(cacheKey);
  geminiResponseCache.set(cacheKey, entry);
  geminiCacheHits += 1;
  return entry.text;
}

function setCachedGeminiResponse(cacheKey, text) {
  if (!GEMINI_CACHE_ENABLED || !text) {
    return;
  }

  if (geminiResponseCache.size >= GEMINI_CACHE_MAX_ENTRIES) {
    const oldestKey = geminiResponseCache.keys().next().value;
    if (oldestKey !== undefined) {
      geminiResponseCache.delete(oldestKey);
    }
  }

  geminiResponseCache.set(cacheKey, {
    text,
    expiresAt: Date.now() + GEMINI_CACHE_TTL_MS,
  });
}

function shouldUseGeminiCache(message) {
  if (!GEMINI_CACHE_ENABLED) {
    return false;
  }

  const length = message.length;
  return length >= GEMINI_CACHE_MIN_MESSAGE_CHARS && length <= GEMINI_CACHE_MAX_MESSAGE_CHARS;
}

function getCaptchaVerifyUrl() {
  if (CAPTCHA_PROVIDER === 'turnstile') {
    return 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  }
  if (CAPTCHA_PROVIDER === 'hcaptcha') {
    return 'https://hcaptcha.com/siteverify';
  }
  return null;
}

async function verifyCaptchaToken(token, clientIp) {
  if (!CAPTCHA_ENFORCED) {
    return { success: true, skipped: true };
  }

  if (!token || typeof token !== 'string') {
    return { success: false, reason: 'Missing CAPTCHA token.' };
  }

  const verifyUrl = getCaptchaVerifyUrl();
  if (!verifyUrl) {
    return { success: false, reason: 'CAPTCHA provider is not configured.' };
  }

  if (!CAPTCHA_SECRET_KEY) {
    return { success: false, reason: 'CAPTCHA secret key is not configured.' };
  }

  const payload = new URLSearchParams({
    secret: CAPTCHA_SECRET_KEY,
    response: token,
    remoteip: clientIp,
  });

  try {
    const captchaResult = await withTimeout(
      async () => {
        const response = await fetch(verifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload.toString(),
        });
        return response.json();
      },
      8000
    );

    const success = Boolean(captchaResult?.success);
    return { success, reason: success ? '' : 'CAPTCHA verification failed.' };
  } catch (error) {
    console.error('CAPTCHA verification failed', error);
    return { success: false, reason: 'CAPTCHA verification unavailable.' };
  }
}

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_API_KEY;
  const knowledge = getKnowledgeSummary();

  res.json({
    ok: true,
    service: 'dxb-edge-insight',
    keyConfigured: Boolean(apiKey),
    aiAssistantEnabled: AI_ASSISTANT_ENABLED,
    geminiGuards: {
      maxMessageChars: GEMINI_MAX_MESSAGE_CHARS,
      timeoutMs: GEMINI_TIMEOUT_MS,
      contextMaxChunks: GEMINI_CONTEXT_MAX_CHUNKS,
      rateLimitWindowMs: GEMINI_RATE_LIMIT_WINDOW_MS,
      rateLimitMaxRequests: GEMINI_RATE_LIMIT_MAX_REQUESTS,
      dailyLimitPerIp: GEMINI_DAILY_LIMIT_PER_IP,
      userRateLimitWindowMs: GEMINI_USER_RATE_LIMIT_WINDOW_MS,
      userRateLimitMaxRequests: GEMINI_USER_RATE_LIMIT_MAX_REQUESTS,
      userDailyLimit: GEMINI_USER_DAILY_LIMIT,
      cacheEnabled: GEMINI_CACHE_ENABLED,
      cacheTtlMs: GEMINI_CACHE_TTL_MS,
      cacheMaxEntries: GEMINI_CACHE_MAX_ENTRIES,
      cacheMinMessageChars: GEMINI_CACHE_MIN_MESSAGE_CHARS,
      cacheMaxMessageChars: GEMINI_CACHE_MAX_MESSAGE_CHARS,
      cacheSize: geminiResponseCache.size,
      cacheHits: geminiCacheHits,
      cacheMisses: geminiCacheMisses,
    },
    captcha: {
      enforced: CAPTCHA_ENFORCED,
      provider: CAPTCHA_PROVIDER,
      siteKeyConfigured: Boolean(CAPTCHA_SITE_KEY),
      secretConfigured: Boolean(CAPTCHA_SECRET_KEY),
    },
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
    if (!AI_ASSISTANT_ENABLED) {
      res.status(503).json({ error: 'AI assistant is temporarily disabled.' });
      return;
    }

    const clientIp = getClientIp(req);
    const captchaToken = typeof req.body?.captchaToken === 'string' ? req.body.captchaToken.trim() : '';
    const captchaCheck = await verifyCaptchaToken(captchaToken, clientIp);
    if (!captchaCheck.success) {
      res.status(403).json({ error: captchaCheck.reason || 'CAPTCHA verification failed.' });
      return;
    }

    if (!enforceGeminiLimits(req, res)) {
      return;
    }

    if (!enforceGeminiUserLimits(req, res)) {
      return;
    }

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

    if (message.length > GEMINI_MAX_MESSAGE_CHARS) {
      res.status(413).json({
        error: `Message too long. Maximum allowed length is ${GEMINI_MAX_MESSAGE_CHARS} characters.`,
      });
      return;
    }

    const cacheEligible = shouldUseGeminiCache(message);
    const cacheKey = cacheEligible ? buildGeminiCacheKey(message) : null;
    if (cacheEligible && cacheKey) {
      const cachedText = getCachedGeminiResponse(cacheKey);
      if (cachedText) {
        res.json({ text: cachedText, cached: true });
        return;
      }
    }

    const ai = new GoogleGenAI({ apiKey });
    const contextChunks = getRelevantContext(message, GEMINI_CONTEXT_MAX_CHUNKS);
    const contextBlock = contextChunks
      .map((chunk, index) => `[Source: ${chunk.source}]\n${chunk.text}`)
      .join('\n\n');

    const response = await withTimeout(
      () => ai.models.generateContent({
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
      }),
      GEMINI_TIMEOUT_MS
    );

    const outputText = response.text || 'Communication timeout. Please re-verify strategic intent.';
    if (cacheEligible && cacheKey) {
      setCachedGeminiResponse(cacheKey, outputText);
    }
    res.json({ text: outputText, cached: false });
  } catch (error) {
    console.error('Gemini proxy request failed', error);
    if (error instanceof Error && error.message.includes('timed out')) {
      res.status(504).json({ error: 'Gemini request timed out. Please retry.' });
      return;
    }
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
