# Jua Quiz Game

## Overview
Jua is an engaging, Kahoot-inspired quiz game designed for fun learning and competition. Players answer multiple-choice questions across 4 sets of 5 questions each (20 total per game), earning points based on correct answers and time left. The game supports single-player mode and multi-player (host/join via PIN, with simulated players for testing). Questions are dynamically loaded from a Supabase database for variety, with fallback to static data for offline/resilience.

Key Features:
- **Random Questions**: 100+ questions from diverse topics (Science, History, Geography, Sports, Movies, Riddles, Math, Literature) shuffled for each playthrough.
- **Scoring**: 10 points per second left on correct answer; -5 for wrong, -10 for timeout.
- **Creative UI**: Animated timers, feedback (green/red buttons with pulse/shake), level complete screens with 5s countdown, emoji-rich results.
- **Progression**: 5s creative loading between sets ("Set X Conquered! 🚀 Gear up for Set Y..."); full 20 questions before interactive results.
- **End-Game**: Stop timer, animated leaderboard with medals/performance emojis; manual reset or menu; auto-back to start after 10s inactivity.
- **Deployment**: Hosted on Vercel with serverless API; GitHub for version control.

## How to Play
1. **Start**: Choose Single Player or Host/Join Game.
2. **Single Player**: Click "Single Player" – questions load, answer within 5s per question.
3. **Multi-Player**: Host generates PIN, others join; host starts quiz; turns simulated for testing.
4. **Gameplay**: Answer A-D options; correct = points (time-based), wrong = penalty + show correct.
5. **Sets**: After 5 questions, 5s loading to next set; complete 4 sets for results.
6. **Results**: Leaderboard with emojis/animations; reset or menu; auto-menu after 10s.

## Tech Stack
- **Frontend**: HTML5, CSS3 (animations), Vanilla JS (no frameworks).
- **Backend**: Vercel Serverless Functions (Node.js API).
- **Database**: Supabase (Postgres with JSONB for options).
- **Deployment**: Vercel (CDN for static, functions for API).
- **Version Control**: GitHub.

## Setup & Run Locally
1. Clone repo: `git clone https://github.com/DataMan7/quiz-app.git`
2. Install deps: `npm install`
3. Set env vars in `.env.local` (SUPABASE_URL, SUPABASE_ANON_KEY).
4. Run SQL in Supabase dashboard: Copy db-setup.sql to create/insert questions.
5. Dev server: `vercel dev` (full API + static) or `npm start` (static only).
6. Open http://localhost:3000.

## Deployment
- Push to GitHub main branch → Auto-deploys to Vercel.
- Set env vars in Vercel dashboard: SUPABASE_URL, SUPABASE_ANON_KEY.
- Live URL: https://quiz-h44m3aku2-datamans-projects.vercel.app

## Contributing
- Add questions to db-setup.sql and run in Supabase.
- Enhance UI/animations in styles.css/script.js.
- See ARCHITECTURE.md for system details, DATA_PIPELINE.md for data flow.

## License
MIT License – Free to use/modify.

---
Built with ❤️ by Kilo Code and Dataman
