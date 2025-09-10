# Jua Quiz Game - System Architecture

## Overview
The Jua Quiz Game is a full-stack web application built with a client-server architecture, leveraging modern serverless technologies for scalability and ease of deployment. The system is divided into three main layers: Frontend (Client-side UI and Logic), Backend (Serverless API), and Data Layer (Supabase Database). It supports single and multi-player modes, with dynamic question loading and real-time scoring. The architecture is stateless, with no persistent server, relying on Vercel for hosting and Supabase for data persistence.

The design prioritizes simplicity, resilience (fallback to static data), and performance (CDN for static assets, edge functions for API).

## High-Level Architecture Diagram
```
[User Browser (Multiple Tabs/Sessions)] <--- HTTP/HTTPS ---> [Vercel Edge Network]
  |                                                                 |
  | (Single/Multi-Player UI, Game State, Fetch API)                 | (Static CDN for HTML/CSS/JS)
  |                                                                 |
  v                                                                 v
[Frontend Layer] <--- JSON API Calls ---> [Backend Layer (Serverless Functions)]
  |                                                                 |
  | (Vanilla JS, DOM Manipulation, Shuffle Logic)                   | (Node.js API Route: /api/questions)
  |                                                                 | (Supabase JS Client, Query/Transform/Shuffle)
  v                                                                 v
[Local Storage (Scores, State - Ephemeral)] <--- Postgres Queries ---> [Data Layer (Supabase)]
  |                                                                 |
  v                                                                 v
[GitHub Repo (Source Code, CI/CD Trigger)] <--- Webhook ---> [Vercel Build/Deploy]
```

### Components Breakdown
1. **Frontend Layer (Client-Side)**
   - **Technologies**: HTML5, CSS3 (with animations via @keyframes for pulse, shake, fadeIn), Vanilla JavaScript (no frameworks like React).
   - **Key Modules** (in script.js):
     - Game State Management: `gameState` object tracks players, scores, current question/set index, timer.
     - UI Rendering: Dynamic updates to question-text, answer-btns, timer, waiting-screen, results-screen.
     - Logic: `initializeQuestions()` fetches/shuffles, `showQuestion()` displays/shuffles options, `selectAnswer()` scores, `nextQuestion()` advances (with set completion check).
     - Event Handling: Button clicks for modes, answers, reset/menu.
     - Animations: CSS classes for correct/incorrect feedback, fadeIn for results.
   - **Data Flow**: On start, fetch /api/questions → Parse JSON → Load 4 random sets (20 questions) → Progress through indices 0-19 → Results.
   - **State**: Ephemeral (in-memory per tab); no localStorage for persistence to encourage replays.
   - **Resilience**: Fallback to hardcoded 20 questions if API fails (alert + static data).

2. **Backend Layer (Serverless API)**
   - **Technologies**: Vercel Serverless Functions (Node.js ESM, @supabase/supabase-js v2.45.4).
   - **Key Module** (api/questions.js):
     - Handler: GET-only endpoint; rejects non-GET with 405.
     - Supabase Client: Initialized with env vars (SUPABASE_URL, SUPABASE_ANON_KEY).
     - Query: `supabase.from('questions').select('*').order('set_id')` – Fetches all ~100 questions.
     - Transformation: Group by set_id (20 sets), parse JSONB options, shuffle sets and intra-set questions.
     - Response: JSON array of 20 shuffled sets; 200 OK or 500 on error (with details log).
   - **Execution**: Cold start <1s; stateless, scales automatically on Vercel.
   - **Security**: Env vars for secrets; RLS on Supabase for read-only anon access.
   - **vercel.json**: Rewrites /api/* to functions for routing.

3. **Data Layer (Database)**
   - **Technologies**: Supabase (Postgres 15+, JSONB for options, RLS for security).
   - **Schema** (db-setup.sql): `questions` table with id (SERIAL PK), set_id (INTEGER 1-20), question (TEXT), options (JSONB array), correct_index (INTEGER 0-3).
     - ~100 rows inserted across 20 sets (5 questions each).
     - RLS Policy: Public SELECT (USING true) – Anon key reads without auth.
   - **Connection**: Supabase JS client in API; env vars for URL/anon key (valid until 2073).
   - **Data Flow**: API query → Group/Parse → Shuffle → JSON response → Frontend load.

4. **Deployment & Infrastructure Layer**
   - **Version Control**: GitHub (repo: DataMan7/quiz-app) – Main branch pushes trigger Vercel webhook.
   - **Hosting/Deployment**: Vercel – Auto-build on push; static files on CDN, functions on edge.
     - Env Vars: SUPABASE_URL, SUPABASE_ANON_KEY (encrypted, scoped to Production/Preview/Development).
     - CLI: `vercel link`, `vercel env add`, `vercel --prod` for manual deploys.
     - Logs: `vercel logs <url>` for function errors.
   - **CI/CD**: Git push → Vercel build (npm install, function bundle) → Deploy to URL (e.g., quiz-h44m3aku2-datamans-projects.vercel.app).
   - **Monitoring**: Vercel dashboard (deploys/logs), Supabase dashboard (queries/RLS), browser console for frontend.

## Debugging Framework
The system uses layered logging and tools for systematic diagnosis, following best practices for serverless apps.

### 1. **Frontend Debugging (Browser Console)**
   - **Console Logs**: Extensive in script.js:
     - `initializeQuestions()`: API success/error, sets loaded/selected, sample question.
     - `showQuestion()`: Index, set/question, total sets; "Waiting screen hidden".
     - `nextQuestion()`: Moving to index, set calculation.
     - `showLevelComplete()`: Completed set, timeout trigger, calling showQuestion.
     - `selectAnswer()`: Score updates, penalties.
     - `showResults()`: Final results, interaction timeout.
     - Errors: Fallback alert, out-of-bounds errors.
   - **Tools**:
     - Browser DevTools (F12): Console for logs, Network tab for API calls (check /api/questions status/JSON).
     - Breakpoints in script.js for step-through (e.g., index advancement).
     - Inspect Elements: Verify classList (hidden/visible), data-correct on buttons.
   - **Common Issues**:
     - Fallback: Check network for 500 on /api/questions; console.error for Supabase error.
     - Progression Loop: Logs show index reset or safety check (questions.length <4).
     - UI Stuck: Log "Waiting screen hidden" missing; check CSS .hidden.

### 2. **Backend Debugging (Vercel Logs)**
   - **Console Logs**: In api/questions.js:
     - Env vars presence (URL/key loaded).
     - Query result: Questions count, error message.
     - Processed: Sets count, sample size.
     - Errors: Full error in catch, returned in JSON details.
   - **Tools**:
     - Vercel CLI: `vercel logs <deployment-url>` – Function invocations, errors (e.g., env missing, Supabase throw).
     - Dashboard: Functions tab for logs, env vars verification.
     - Curl Test: `curl -X GET <url>/api/questions` – Raw JSON/response code.
   - **Common Issues**:
     - Env Missing: Log "false" for vars; 500 "Missing Supabase environment variables".
     - Query Fail: Count 0 or error (RLS, table empty); check Supabase SQL Editor: `SELECT COUNT(*) FROM questions;`.
     - Shuffle Error: JSON.parse fail on options (malformed JSONB).

### 3. **Data Layer Debugging (Supabase Dashboard)**
   - **Tools**:
     - SQL Editor: Run `SELECT * FROM questions LIMIT 5;` to verify data; check RLS policies.
     - Logs: Query history for select calls, errors (e.g., permission denied).
     - Table Editor: View/insert questions, validate JSONB options.
   - **Common Issues**:
     - Empty Table: Run db-setup.sql again.
     - RLS Block: Verify policy "Public read access" enabled.
     - Connection: Test anon key in dashboard API settings.

### 4. **End-to-End Debugging Workflow**
1. Local Test: `vercel dev` – Browser + console for full stack.
2. Deploy Test: Push to GitHub, check Vercel build logs, test live URL.
3. Isolate: Frontend (disable API, use fallback); Backend (curl API); Data (Supabase query).
4. Logs Chain: Browser fetch error → API log → Supabase query log.
5. Tools: VSCode debugger for JS, Postman for API, Supabase Studio for DB.

### 5. **Error Handling & Monitoring**
- Graceful Fallback: API fail → Static questions.
- Alerts: User-facing for fallback.
- Production Monitoring: Vercel Analytics for traffic/errors; Supabase usage dashboard.
- Future Enhancements: Sentry for error tracking, Datadog for logs.

This architecture ensures high availability (serverless), low latency (edge), and easy debugging (layered logs/tools). Scalable for thousands of players without infrastructure management.