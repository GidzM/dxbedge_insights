# Copilot instructions for dxbedge_insights

## Architecture & key flows
- Vite + React 19 + TypeScript SPA with `HashRouter` in `App.tsx`; routes map to page components in `pages/`.
- Global layout lives in `App.tsx`: `Sidebar`, `DataTicker`, header/footer, plus `LeadCaptureModal` controlled by `openModal` and passed to `Calculators`.
- Pages are content-heavy and mostly static; reuse `components/Card.tsx` for card layouts and in-page drawers (see `pages/SMEInsights.tsx`).
- AI chat is isolated to `pages/AIAssistant.tsx` and uses `@google/genai` directly; message rendering uses `FormattedResponse` which parses plain text/tables and expects **no markdown headers/italics** from the model.

## Styling conventions
- Tailwind is injected via CDN in `index.html` with a custom `tailwind.config` block (colors, fonts, marquee animation). Keep utility-class styling consistent with these tokens.
- Shared colors are also exported in `constants.tsx` (used for semantic reference, not enforced).

## External integrations & env
- Gemini integration in `pages/AIAssistant.tsx` initialises `GoogleGenAI` with `process.env.API_KEY`.
- README instructs setting `GEMINI_API_KEY` in `.env.local`; verify env naming before changing any key references to avoid runtime auth issues.

## Developer workflows
- Install deps: `npm install`.
- Dev server: `npm run dev` (Vite).
- Production build/preview: `npm run build`, `npm run preview`.
- No automated tests or lint scripts are defined in `package.json`.

## File map (examples)
- Routing/layout: `App.tsx`, `components/Sidebar.tsx`, `components/DataTicker.tsx`.
- Rich content pages: `pages/SMEInsights.tsx`, `pages/MarketOverview.tsx`, `pages/CombinedStrategy.tsx`.
- Reusable UI blocks: `components/Card.tsx`, `components/LeadCaptureModal.tsx`.
