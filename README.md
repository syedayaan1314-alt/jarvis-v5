# JARVIS Chrome Hologram

A responsive, installable Progressive Web App (PWA) with neon JARVIS branding, multi-AI selector (OpenAI/Gemini/Claude), chat, voice input/output toggle, and a camera hologram-style overlay.

## Deploy to Vercel
1. Upload the contents of this folder to your GitHub repository.
2. In Vercel, import the repository or wait for the connected project to redeploy.
3. Add the provider keys in Project → Settings → Environment Variables:
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `ANTHROPIC_API_KEY`
4. Save and redeploy. You only need keys for providers you want to use.
5. Open the deployed HTTPS site in Chrome.

## Install on Android Chrome
1. Open your deployed HTTPS JARVIS website in Chrome.
2. Tap Chrome's ⋮ menu.
3. Choose **Install app** or **Add to Home screen** (the wording varies).
4. Confirm **Install** / **Add**. Open JARVIS from the new home-screen icon.

## Notes
- API keys are never put in client-side JavaScript. Do not commit real keys to GitHub.
- This camera effect is an AR-style overlay on your screen, not a real hologram in open air.
- Camera and voice features require browser permission/support.
- AI providers have separate access and usage charges. A missing key produces a clear error.
- The default Claude model may need adjustment for your account; set `CLAUDE_MODEL` in Vercel if necessary.
- This starter has no user authentication or rate limiting. Do not expose a public deployment with active API keys without adding those protections.
