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
