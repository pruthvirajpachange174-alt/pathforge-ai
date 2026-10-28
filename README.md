# 🚀 PathForge AI — Your 24/7 AI Career Mentor

> Forge your engineering career, one path at a time.

PathForge AI is a full-stack AI-powered career mentor built for engineering students.
It combines RAG, vector search, and Gemini with optional OpenAI support to guide students through placements,
government exams, career paths, hackathons, and personalized roadmaps.

## ✨ Features

- 🎯 Placement Exam Guide (TCS NQT, Infosys, Google, Microsoft, Amazon…)
- 🏛️ Government & Higher Education Exams (GATE, CAT, GRE, UPSC, ISRO…)
- 💻 Technology Career Guide (AI/ML, Full Stack, Cloud, Cybersecurity…)
- 📚 Programming Language Guide (16+ languages)
- 🏆 Hackathon Hub (SIH, Company hackathons, personalized recs)
- 🇮🇳 India Education Directory (starter records for institutions, exams, skills, programs, employers, and sources)
- 🗺️ Personalized Semester-wise Roadmaps
- 🤖 AI Chat Assistant (Claude 3.5 Sonnet / GPT-4o with RAG)
- 📊 Beautiful glassmorphism dashboard with dark/light mode
- 🌐 India vs Global Tech Education Comparison

## 🧱 Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Shadcn UI, Zustand, Recharts
**Backend:** Node.js, Express, TypeScript, Prisma
**Database:** PostgreSQL
**Vector DB:** Pinecone or Chroma, selected with `VECTOR_DB`
**AI:** Gemini by default, with OpenAI support
**Auth:** Clerk
**Deployment:** Netlify (frontend) + a Node.js host and managed PostgreSQL (backend/data)

## 🚀 Quick Start

1. Install Node.js and pnpm, then run `pnpm install` from the project root.
2. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`.
3. Configure the Clerk keys, set `GEMINI_API_KEY` for chat and `OPENAI_API_KEY` for embeddings, and set the client API URL to `http://localhost:5000/api/v1`.
4. Choose a vector database in `server/.env` with `VECTOR_DB=pinecone` or `VECTOR_DB=chroma`. For Pinecone, set `PINECONE_API_KEY` and `PINECONE_INDEX`. For local Chroma, set `CHROMA_URL=http://localhost:8000` and start it with `docker compose up -d chroma`.
5. Apply migrations and seed the database with `pnpm db:migrate` and `pnpm db:seed`.
6. Start the client and API with `pnpm dev`.

The client runs at `http://localhost:5173`; the API health check is at `http://localhost:5000/health`.
Both vector databases use the configured OpenAI embedding model (`EMBEDDING_MODEL`) for indexing and question search. After setting up the database and seeding content, run `pnpm --filter pathforge-server ingest` to populate the selected vector database. Changing vector database does not migrate existing vectors; rerun ingestion for the selected database.

The seed command imports the India Education Directory records from `server/src/data/india-directory.json` without deleting existing data. To preview only the directory changes, run `pnpm --filter pathforge-server directory:dry-run`; to import those records separately, run `pnpm --filter pathforge-server directory:import`. The public `/directory` page identifies these as unverified starter records. It does not claim that exam applications or hackathons are currently open, or that listed employers have current vacancies.

## 🌐 Netlify deployment

Netlify hosts the React/Vite client using the root `netlify.toml`. The Express API and PostgreSQL database remain separate services; deploying the client alone does not deploy or seed either service.

1. Deploy this repository to Netlify. The build command and SPA route fallback are configured in `netlify.toml`.
2. Set Netlify environment variables:
   - `VITE_API_URL`: the public API base URL, including `/api/v1` (for example `https://api.example.com/api/v1`).
   - `VITE_CLERK_PUBLISHABLE_KEY`: the Clerk publishable key used for sign-in on personal features.
3. Deploy the Express server to a Node.js host and attach a managed PostgreSQL database. Configure the server's environment variables from `server/.env.example`.
4. Set server `CLIENT_URL` to the Netlify site origin (and any custom domain, comma-separated). Set `DATABASE_URL`, Clerk keys, and the AI provider key on the server host; never add server secrets to Netlify client variables.
5. Set `ADMIN_EMAILS` on the server to the comma-separated admin email allowlist. Only Clerk accounts with a verified matching email can access administration. Leave this empty to disable all admin access.
6. Run `pnpm db:migrate:deploy` and `pnpm db:seed` against the hosted database. Confirm the API `/health` endpoint before using the Netlify site. To refresh AI retrieval after seeding, configure the selected vector database and a working embeddings provider, then run `pnpm --filter pathforge-server ingest`; this step is optional for the public catalogs and makes embedding API calls.

The education catalogs (exams, placements, technology, languages, colleges, hackathons, and the India Education Directory) are public and read-only. Sign-in remains required for AI chat, saved/personal data, roadmaps, recommendations, and catalog administration. Annual exam dates, hiring drives, hackathon dates, eligibility, and prize terms can change; use the linked official notice for the current cycle. The catalog does not present an estimated date as a confirmed date. GATE 2026 dates are displayed only as historical dates, not as the next exam schedule.

## 📄 License

MIT