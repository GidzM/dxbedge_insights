import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 8080);

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_API_KEY;
  res.json({
    ok: true,
    service: 'dxb-edge-insight',
    keyConfigured: Boolean(apiKey),
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
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `You are the DxB Edge Insight AI.
MISSION: Transform SME knowledge and strategy into high-density educational guidance.
PRIMARY KNOWLEDGE: DXB Edge SME Insight, D33 Analysis, 2040 Analysis, Strategic Outlook.
TONE: Professional, unbiased, guide-not-salesperson.

FORMATTING RULES:
1. STRICT: DO NOT use italics (* or _ symbols for emphasis).
2. STRICT: DO NOT use markdown headers like ### or ##. Use UPPERCASE BOLD text for headers.
3. STRICT: DO NOT use markdown symbols (*, **, ###) in visible text. Use simple bolding for emphasis on figures.
4. BULLETS: Use only the simple dot symbol • for lists.
5. DATA FIRST: Bold statistics and major figures (e.g., AED 32T).
6. CITATION: Place [Source: Source Name] at the end of relevant paragraphs. Use: 'DXB Edge SME Insight', 'D33 Analysis', '2040 Analysis', or 'Strategic Outlook'.
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

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`DxB Edge server listening on ${port}`);
});
