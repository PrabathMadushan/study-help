# Study Help

**An interactive study and interview-prep platform** with structured topics, unlimited category trees, graph-based navigation, flashcards, and AI-powered voice-to-text. Built for learners who want to explore knowledge by topic and practice with spaced repetition.

---

## Overview

Study Help is a full-stack web application that helps users organize and study technical topics—especially front-end and software engineering interview content. It combines:

- **Structured content** — Notes organized in an unlimited nested category tree (containers and leaves)
- **Graph navigation** — Interactive mind-map style browsing with React Flow (radial layout, zoom, breadcrumbs)
- **Flashcards & practice** — Review mode with answer validation and progress tracking
- **Voice input** — Optional Gemini AI transcription for spoken answers (with browser API fallback)
- **Admin tools** — Category tree management, validation, and notes CRUD

Data is stored in **Firebase (Firestore)** with real-time updates. The app is built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## Features

### For learners

| Feature | Description |
|--------|-------------|
| **Graph view** | Browse root categories and drill down by clicking nodes; notes appear as nodes in leaf categories. |
| **Dashboard** | Track progress across subjects and review sessions. |
| **Review / practice** | Flashcard-style practice with written or **voice answers** (Gemini or browser speech). |
| **Rich notes** | Topic notes with code blocks, formatting, and syntax highlighting. |
| **Theme** | Light/dark theme support. |

### For admins

| Feature | Description |
|--------|-------------|
| **Category tree (V2)** | Create, edit, delete unlimited nested categories (containers vs leaves). |
| **Validation** | Run integrity checks: orphans, circular refs, path/depth consistency. |
| **Notes management** | Create and edit notes and attach them to leaf categories. |

### Content coverage

- **Front-end**: JavaScript (closures, `this`, prototypes, event loop, promises, async/await, debounce/throttle), TypeScript (types vs interfaces, utility types), CSS (Flexbox, Grid, animations), React (hooks, performance, patterns), Tailwind.
- **Other**: Algorithms, data structures, design patterns, back-end basics, DevOps, behavior questions.

---

## Tech stack

- **Frontend:** React 19, TypeScript, Vite 7, React Router 7, Tailwind CSS 4
- **UI / graph:** @xyflow/react (React Flow), TipTap (rich text), Prism.js (code highlighting)
- **Backend / data:** Firebase (Auth, Firestore)
- **AI / voice:** Google Gemini (`@google/generative-ai`) for optional voice-to-text; Groq as optional fallback for answer scoring

---

## Prerequisites

- **Node.js** 18+ (recommend LTS)
- **npm** (or compatible package manager)
- **Firebase project** (Auth + Firestore enabled)
- **Optional:** Gemini API key for voice-to-text and/or answer validation

---

## Getting started

### 1. Clone and install

```bash
git clone <repository-url>
cd study-help
npm install
```

### 2. Environment variables

Copy the example env and set at least the keys you need:

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | Optional | [Google AI Studio](https://aistudio.google.com/apikey) — voice-to-text and answer scoring |
| `VITE_GROQ_API_KEY`   | Optional | [Groq](https://console.groq.com/keys) — fallback for answer scoring |

If neither key is set, voice input uses the browser’s Speech Recognition API and scoring may be limited.

### 3. Firebase setup

- Create a Firebase project and enable **Authentication** and **Firestore**.
- In the project root, configure the Firebase CLI and point the app to your project (e.g. `firebase use <project-id>`).
- Ensure `src/lib/firebase.ts` (or equivalent) uses your project config.

Deploy Firestore rules and indexes (required for the category tree and queries):

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Wait for indexes to finish building (Firebase Console → Firestore → Indexes; often 2–5 minutes).

### 4. Run the app

```bash
npm run dev
```

Open **http://localhost:5173**. Sign up or log in, then:

- **Home** — entry point and link to graph view
- **Graph** (`/graph`) — explore categories and notes
- **Review** (`/review`) — practice with flashcards and optional voice input
- **Dashboard** (`/dashboard`) — progress
- **Admin** (`/admin`) — categories, notes, validation (admin users only)

---

## Project structure

```
study-help/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI (layout, graph, category tree, editor, etc.)
│   │   └── graph/          # React Flow graph components
│   ├── contexts/           # Auth, theme, subject
│   ├── data/               # Static category/note metadata (legacy/seed)
│   ├── hooks/              # useCategories, useGraphNavigation, useGeminiSpeechRecognition, etc.
│   ├── lib/                # Firebase, Gemini, Groq, admin CRUD, validation
│   ├── notes/              # Topic content (React components per note)
│   ├── pages/              # Route-level pages (Home, Graph, Review, Admin, etc.)
│   └── types/              # TypeScript types (e.g. Firestore)
├── docs/                   # In-depth documentation (see below)
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore composite indexes
├── apphosting.yaml         # Firebase App Hosting config
├── netlify.toml            # Netlify config (if used)
└── package.json
```

---

## Main routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home; link to graph and main flows | Authenticated |
| `/graph` | Graph of root categories | Authenticated |
| `/graph/:categoryId` | Graph focused on one category (children + notes) | Authenticated |
| `/note/:id` | Single note view | Authenticated |
| `/review` | Practice / flashcards (with optional voice) | Authenticated |
| `/dashboard` | Progress dashboard | Authenticated |
| `/login`, `/signup` | Auth | Public |
| `/admin/categories` | Category tree (V2) management | Admin |
| `/admin/notes` | Notes CRUD | Admin |
| `/admin/validation` | Data validation tools | Admin |

---

## Documentation (docs folder)

Detailed guides live in the **`docs/`** directory:

| Document | Purpose |
|----------|--------|
| **START_HERE.md** | First-time setup, create first category tree, test graph and validation |
| **README_V2_SYSTEM.md** | V2 category system overview, features, architecture |
| **QUICK_START.md** | Quick start for V2 categories and code usage examples |
| **QUICK_START_VOICE.md** | Gemini voice-to-text setup and usage in practice mode |
| **ROUTES_REFERENCE.md** | All routes, Firestore collections, and component imports |
| **DEPLOYMENT_GUIDE.md** | Build, deploy (Firebase/Netlify), verification, rollback |
| **TESTING_CHECKLIST.md** | Manual test suites (admin, graph, validation, security, performance) |
| **MODELS_REFERENCE.md** | Gemini models for audio/transcription (e.g. 2.5-flash, 2.0-flash) |
| **GEMINI_AUDIO_README.md** | Full Gemini audio integration and optional Live API backend |
| **FRONTEND_TOPICS_README.md** | Front-end topic coverage (JS, TS, CSS, React, Tailwind) |

---

## Configuration

- **Firebase:** Project and config in `src/lib/firebase.ts`; rules in `firestore.rules`, indexes in `firestore.indexes.json`.
- **Admin users:** Typically controlled via a Firestore collection (e.g. `admins`); see Firebase rules and `ProtectedRoute` / admin checks in the app.
- **Voice:** Set `VITE_GEMINI_API_KEY` for Gemini transcription; otherwise the app uses the browser’s Speech Recognition API where available.

---

## Scripts

| Command | Description |
|--------|--------------|
| `npm run dev` | Start Vite dev server (default http://localhost:5173) |
| `npm run build` | TypeScript compile + production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

1. **Build:** `npm run build` (output in `dist/`).
2. **Firebase:** Deploy rules and indexes first; then e.g. `firebase deploy --only hosting` (or use `apphosting.yaml` if using App Hosting).
3. **Netlify:** Use `netlify.toml` and connect the repo; set env vars in the Netlify dashboard.
4. **Post-deploy:** Confirm auth, graph, admin categories, and validation as in **docs/DEPLOYMENT_GUIDE.md**.

---

## Testing

- **Manual:** Follow **docs/TESTING_CHECKLIST.md** (admin tree, graph navigation, validation, security, edge cases, performance).
- **Automated:** No test suite is described in the docs; adding unit/integration tests is recommended (see checklist for ideas).

---

## Troubleshooting

| Issue | What to try |
|-------|--------------|
| “Missing or insufficient permissions” | Deploy Firestore rules and wait for indexes to build; confirm user is signed in and (for admin) in admins list. |
| “Index not found” | Deploy indexes: `firebase deploy --only firestore:indexes`; wait 5–10 minutes in Firebase Console. |
| Graph not loading / blank | Check console for errors; ensure categories exist and `@xyflow/react` is installed. |
| No “Gemini AI” badge / voice not using Gemini | Add `VITE_GEMINI_API_KEY` to `.env` and restart `npm run dev`. |
| Transcription fails | Verify Gemini key and quota at [Google AI Studio](https://aistudio.google.com/). |

---

## License and attribution

This project uses the React + TypeScript + Vite template and various open-source libraries; see `package.json` and respective licenses. For full implementation details and design decisions, see the **`docs/`** directory.

---

**For step-by-step setup and first run, start with [docs/START_HERE.md](docs/START_HERE.md).**
