# ACI People Helpdesk · PeopleBot — Gemini AI Edition

PeopleBot is now a real AI assistant. It answers from the 96-question ACI Service
Rules FAQ knowledge base (imported from FAQ_Lists.xlsx) using Google Gemini,
with the original offline rule-based engine kept as an automatic fallback.

## Architecture
- Static frontend (index.html / styles.css / app.js) — unchanged Apple Spectrum UI
- /api/chat.js — Vercel Serverless Function that calls the Gemini API
- /api/faq-data.json — knowledge base extracted from FAQ_Lists.xlsx
- GEMINI_API_KEY is stored ONLY as a Vercel environment variable (never in code)

## Demo login (unchanged)
1001/1001 Corporate · 2001/2001 Pharma · 3001/3001 Trade Union · 4001/4001 Field Force · 9999/9999 Admin

## STEP 1 — Get a Gemini API key (free)
1. Go to https://aistudio.google.com/apikey
2. Sign in with a Google account → "Create API key"
3. Copy the key (starts with AIza...). Keep it private — do not paste it into any code file.

## STEP 2 — Deploy to Vercel and get your visit link
Option A — GitHub (recommended):
1. Create a GitHub repository and upload this whole folder (keep the /api folder structure).
2. Go to https://vercel.com → sign up (free Hobby plan) → "Add New… → Project".
3. Import your GitHub repo. Framework preset: "Other". No build command needed.
4. Before clicking Deploy, open "Environment Variables" and add:
   Name:  GEMINI_API_KEY
   Value: (paste your key)
5. Click Deploy. In ~1 minute you get a live link like:
   https://aci-people-helpdesk.vercel.app
   Share this link — it works on any phone/laptop and installs as a PWA.

Option B — Vercel CLI (no GitHub):
1. Install Node.js, then: npm i -g vercel
2. In this folder run: vercel login  →  vercel
3. Add the key: vercel env add GEMINI_API_KEY  (choose Production)
4. Deploy live: vercel --prod  → the command prints your visit link.

## STEP 3 — Verify
- Open the link, log in as 1001/1001, ask: "How is gratuity calculated after 12 years?"
- The answer should come from the FAQ knowledge base (Gemini mode).
- Turn off Wi-Fi and ask again — you'll see "Offline guidance mode" (rule-based fallback).

## Updating the FAQ later
Edit api/faq-data.json (each entry: category, q, a) and redeploy.
Or send me the updated FAQ_Lists.xlsx and I'll regenerate the JSON.

## Security notes
- The API key never reaches the browser; the frontend only calls /api/chat.
- Demo login (Employee ID = password) is for demo only. For production use SSO/real authentication.
- Analytics remain in localStorage per device (demo behavior unchanged).

## Known knowledge gaps (escalate by design)
Pharmaceuticals division grade tables, workplace organization-based grade
structures, and detailed probation/joining formalities are not in the FAQ yet —
PeopleBot flags these for People Team follow-up instead of guessing.
