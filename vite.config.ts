import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { GoogleGenAI } from '@google/genai';
import { CALCULATOR_SCHEMA, SOURCE_CATALOG, SNAPSHOT_DATA, validateSnapshotRecord, computeCityScores } from './server/calculatorModel.mjs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        {
          name: 'gemini-dev-proxy',
          configureServer(server) {
            server.middlewares.use('/api/gemini', async (req, res, next) => {
              if (req.method !== 'POST') {
                next();
                return;
              }

              try {
                const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
                if (!apiKey) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Gemini API key is not configured for dev server.' }));
                  return;
                }

                let body = '';
                req.on('data', chunk => {
                  body += chunk;
                });

                req.on('end', async () => {
                  try {
                    const parsed = body ? JSON.parse(body) : {};
                    const message = typeof parsed.message === 'string' ? parsed.message.trim() : '';

                    if (!message) {
                      res.statusCode = 400;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ error: 'Message is required.' }));
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

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ text: response.text || 'Communication timeout. Please re-verify strategic intent.' }));
                  } catch (error) {
                    console.error('Dev Gemini proxy request failed', error);
                    res.statusCode = 502;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Gemini request failed.' }));
                  }
                });
              } catch (error) {
                console.error('Dev Gemini proxy request failed', error);
                res.statusCode = 502;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Gemini request failed.' }));
              }
            });

            server.middlewares.use('/api/calculator/schema', (req, res, next) => {
              if (req.method !== 'GET') {
                next();
                return;
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  ok: true,
                  schema: CALCULATOR_SCHEMA,
                  sourceCatalog: SOURCE_CATALOG,
                })
              );
            });

            server.middlewares.use('/api/calculator/snapshots', (req, res, next) => {
              if (req.method !== 'GET') {
                next();
                return;
              }

              const invalidRows = [] as { index: number; error: string }[];

              SNAPSHOT_DATA.forEach((row, index) => {
                const check = validateSnapshotRecord(row);
                if (!check.valid) {
                  invalidRows.push({ index, error: check.error || 'Invalid row' });
                }
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  ok: invalidRows.length === 0,
                  records: SNAPSHOT_DATA,
                  invalidRows,
                  total: SNAPSHOT_DATA.length,
                })
              );
            });

            server.middlewares.use('/api/calculator/score', (req, res, next) => {
              if (req.method !== 'POST') {
                next();
                return;
              }

              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });

              req.on('end', () => {
                try {
                  const parsed = body ? JSON.parse(body) : {};
                  const monthlyBudget = Number(parsed?.monthlyBudget ?? 3200);
                  const objective = typeof parsed?.objective === 'string' ? parsed.objective : 'balanced';
                  const riskTolerance = typeof parsed?.riskTolerance === 'string' ? parsed.riskTolerance : 'medium';
                  const timeHorizon = typeof parsed?.timeHorizon === 'string' ? parsed.timeHorizon : 'medium';

                  const result = computeCityScores({
                    monthlyBudget,
                    objective,
                    riskTolerance,
                    timeHorizon,
                  });

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: true, ...result }));
                } catch (error) {
                  console.error('Dev calculator scoring failed', error);
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: false, error: 'Invalid calculator input.' }));
                }
              });
            });
          },
        },
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
