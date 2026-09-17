<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1a4f13f4-63ec-4fb5-942d-9ec8b55afcd7

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Supabase Candidate Registration

Admin registrations are stored in Supabase using:

- Database table: `applicants`
- Storage bucket: `candidate-photos`

1. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Open the Supabase SQL Editor and run [`supabase-schema.sql`](supabase-schema.sql).
3. Start the app with `npm run dev`.

The SQL policies match the current app, which uses a local admin gate instead of Supabase Auth. For production, replace these public insert policies with Supabase Auth and role-based policies.
