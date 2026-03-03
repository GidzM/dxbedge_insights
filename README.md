<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ovMc1uJsbYn9Rblcmi3IBJeg2whrN05Z

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Cloud Run deployment note

This app now uses a backend proxy endpoint (`/api/gemini`) so the Gemini key stays server-side and is never exposed to browser JavaScript.

Set one of these environment variables in Cloud Run (first one is preferred):

- `GEMINI_API_KEY`
- `VITE_GEMINI_API_KEY`
- `API_KEY`
- `VITE_API_KEY`

If multiple are set, the app resolves in that order.

Quick verification after deploy:

- `GET /api/health` returns service status and `keyConfigured` (true/false).

## AI knowledge base (outside AI Studio)

The chatbot is grounded from local text files in `server.mjs` via the `KNOWLEDGE_DOCS` list.

For best user performance (lowest latency), keep documents local and indexed in-memory on server startup.

Current sources include:

- `SME_Notes.txt` (`DXB Expert Insights`)
- `Investor_project_5_-_commerical_information.txt` (`DXB Expert Insights`)
- `knowledge/2040 doc analysis.txt` (`2040 Analysis`)
- `knowledge/D33 doc analysis.txt` (`D33 Analysis`)
- `knowledge/Combined d33 2040 doc analysis.txt` (`D33 and 2040 Strategic Outlook`)

To add or replace a source document:

1. Convert to `.txt` or `.md` if needed.
2. Place files in `knowledge/` at project root (or add controlled core docs in `server.mjs`).
3. Restart the server (`npm run dev` or `npm run start`) so the knowledge index reloads.

Fast-path for adding original AI Studio docs:

1. Export/download the original source docs from AI Studio.
2. Convert to `.txt` or `.md` if needed.
3. Place them in `knowledge/` at project root.
4. Restart the server; files in `knowledge/` are auto-discovered and indexed.

Notes:

- Core docs in project root remain explicitly named for stable citation labels.
- Auto-discovered docs in `knowledge/` use a source label derived from the file name.
- Excluded/disallowed files are blocked in `server.mjs` and are not indexed even if present.

At runtime, the backend retrieves relevant chunks from these documents per user query and sends them to Gemini with explicit source labels for citation.

Runtime verification:

- `GET /api/knowledge/sources` returns source labels, file names, and chunk counts loaded in memory.
- `GET /api/health` now also includes `knowledgeConfigured`, `knowledgeSourceCount`, and `knowledgeChunkCount`.

## Calculator API (compliant data foundation)

This app now includes a minimal backend scoring foundation for global city comparison.

- `GET /api/calculator/schema` returns model dimensions, required metadata fields, and source catalog.
- `GET /api/calculator/snapshots` returns current city-metric snapshot records with validation status.
- `POST /api/calculator/score` returns ranked city outputs based on user input.

Sample score request:

```bash
curl -X POST http://localhost:8080/api/calculator/score \
   -H "Content-Type: application/json" \
   -d '{
      "monthlyBudget": 3200,
      "objective": "balanced",
      "riskTolerance": "medium",
      "timeHorizon": "medium"
   }'
```

Compliance note:

- Only use sources with explicit open, licensed, or internal rights for reuse.
- Avoid scraping or republishing restricted third-party data without permission.
