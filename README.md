# ⚡ CodeLens — AI Senior Code Reviewer

<p align="center">
  <strong>An intelligent, real-time AI code reviewer powered by Google Gemini and React.</strong>
  <br />
  Transforming your code with senior-level architectural insights, security auditing, and automated refactoring.
</p>

---

## 📖 Overview

**CodeLens** is a modern full-stack web application designed to simulate an expert code review by a senior software engineer (7+ years of experience). Developers can write or paste code in multiple programming languages, submit it with one click or a keyboard shortcut, and instantly receive actionable feedback covering:

- 🐞 **Error & Bug Detection:** Identifies uncaught promises, race conditions, memory leaks, null pointers, and logical flaws.
- ⚡ **Performance & Optimization:** Pinpoints costly computations, redundant iterations, and algorithm bottlenecks.
- 🛡️ **Security Auditing:** Flags common security vulnerabilities (XSS, SQL injection, insecure dependencies, sensitive data leaks).
- 🧼 **Clean Code & Architecture:** Enforces DRY, SOLID, separation of concerns, and modern language idioms.
- 💡 **Actionable Refactoring:** Delivers drop-in replacement code with clear before/after comparisons and rationale.

---

## ✨ Features

- **Split-Screen Studio:** Side-by-side interactive code editor and rendered markdown review pane.
- **Multi-Language Syntax Highlighting:** Built-in PrismJS support for JavaScript, TypeScript, Python, JSON, and CSS.
- **Google Gemini Integration:** Configurable for fast, high-accuracy models including `gemini-2.5-flash`, `gemini-1.5-flash`, and `gemini-2.0-flash`.
- **Keyboard Productivity:** Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (or <kbd>Cmd</kbd> + <kbd>Enter</kbd>) to instantly review without touching your mouse.
- **One-Click Markdown Copy:** Easily copy the structured AI feedback to your clipboard for pull requests or documentation.
- **Built-in Diagnostics:** Graceful error handling for missing API keys, network issues, and invalid inputs.
- **Responsive Dark Theme:** Developer-focused dark palette engineered for comfort during long coding sessions.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** & **Vite 8**
- **react-simple-code-editor** & **PrismJS** for syntax-highlighted code editing
- **react-markdown** & **rehype-highlight** for Markdown rendering with GitHub dark styling
- **Axios** for API requests

### Backend
- **Node.js** & **Express 5**
- **@google/generative-ai** (Google Gemini SDK)
- **cors** for cross-origin resource sharing
- **dotenv** for environment configuration

---

## 📂 Project Structure

```text
CodeLens/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── ai.controller.js      # Request validation & response handler
│   │   ├── routes/
│   │   │   └── ai.routes.js          # API route definitions (/ai/get-review)
│   │   ├── services/
│   │   │   └── ai.service.js         # Gemini prompt engineering & AI service
│   │   └── app.js                    # Express app configuration & middleware
│   ├── .env.example                  # Environment variable template
│   ├── package.json                  # Backend dependencies & scripts
│   └── server.js                     # Server entrypoint (port 3000)
├── frontend/
│   ├── public/                       # Favicon and static SVGs
│   ├── src/
│   │   ├── assets/                   # Project assets
│   │   ├── App.jsx                   # Main React studio component
│   │   ├── App.css                   # Layout, editor & markdown styling
│   │   ├── index.css                 # Base resets and typography
│   │   └── main.jsx                  # React application root
│   ├── index.html                    # HTML entry point with Fira Code fonts
│   ├── package.json                  # Frontend dependencies & scripts
│   └── vite.config.js                # Vite configuration with API proxy
├── .gitignore
├── package.json                      # Root convenience scripts
└── README.md                         # Documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A **Google Gemini API Key** (obtainable free of charge from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/CodeLens.git
cd CodeLens
```

---

### Step 2: Install Dependencies

You can install all dependencies from the root directory:
```bash
npm run install:all
```

*Or install them individually in their respective directories:*
```bash
# In backend/
cd backend
npm install

# In frontend/
cd ../frontend
npm install
```

---

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend/` directory by copying the example:

```bash
# On Windows PowerShell:
Copy-Item backend\.env.example backend\.env

# On macOS / Linux:
cp backend/.env.example backend/.env
```

Open `backend/.env` in your text editor and add your Google Gemini API key:

```env
PORT=3000
GOOGLE_GEMINI_KEY=AIzaSyYourActualApiKeyHere
GEMINI_MODEL=gemini-2.5-flash
```

> **Note:** Both `GOOGLE_GEMINI_KEY` and `GEMINI_API_KEY` are supported. If no key is set, the backend will return a clear troubleshooting message.

---

### Step 4: Run the Application

You need both the backend server and frontend dev server running.

#### Option A: Using Root Scripts (Two Terminals)

**Terminal 1 — Backend:**
```bash
npm run backend:dev
```
*Backend will start on `http://localhost:3000`*

**Terminal 2 — Frontend:**
```bash
npm run frontend
```
*Frontend will start on `http://localhost:5173`*

---

#### Option B: Manual Directory Execution

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **`http://localhost:5173`** in your browser to start reviewing code!

---

## ⚙️ Environment Variables Reference

| Variable | Scope | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `PORT` | Backend | Optional | `3000` | Port for the Express backend server |
| `GOOGLE_GEMINI_KEY` | Backend | **Yes** | — | Google Gemini API key from AI Studio |
| `GEMINI_API_KEY` | Backend | Optional | — | Alternative alias for the Gemini API key |
| `GEMINI_MODEL` | Backend | Optional | `gemini-2.5-flash` | Gemini model (`gemini-2.5-flash`, `gemini-1.5-flash`, `gemini-2.0-flash`) |
| `VITE_API_URL` | Frontend | Optional | `http://localhost:3000` | Base URL for backend API requests |

---

## 🔌 API Documentation

### 1. Health Check
- **Endpoint:** `GET /`
- **Response:**
  ```text
  Hello World
  ```

---

### 2. Code Review Endpoint
- **Endpoint:** `POST /ai/get-review`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "code": "async function fetchData() {\n  let res = fetch('/api');\n  return res.json();\n}"
  }
  ```
- **Success Response (200 OK):**
  ```markdown
  ❌ Bad Code:
  ...
  🔍 Issues:
  - Missing await on fetch() and .json()
  - Missing try/catch error handling
  
  ✅ Recommended Fix:
  ...
  💡 Improvements:
  ...
  ```
- **Error Responses:**
  - `400 Bad Request`: When `code` is missing or empty (`"Code is required to generate a review."`)
  - `500 Internal Server Error`: When Gemini API key is missing or model invocation fails.

---

## 🐛 Resolved Issues & Improvements

During testing, several issues in the original setup were diagnosed and resolved:

1. **Missing Dependency in Lockfile (`raw-body`):**
   - *Problem:* `backend/package-lock.json` was missing the `raw-body` dependency required by Express `body-parser`, throwing `MODULE_NOT_FOUND: Cannot find module 'raw-body'` and crashing the backend immediately.
   - *Fix:* Re-generated dependencies cleanly and verified full Express 5 runtime compatibility.
2. **Missing Scripts in `backend/package.json`:**
   - *Problem:* `npm start` failed because no start script was defined.
   - *Fix:* Added `"start": "node server.js"` and `"dev": "node --watch server.js"`.
3. **Invalid Model Identifier (`gemini-3.6-flash`):**
   - *Problem:* The code requested `gemini-3.6-flash`, a non-existent model in Google Generative AI, causing 404 API failures.
   - *Fix:* Updated to modern supported model `gemini-2.5-flash` with dynamic fallback and `GEMINI_MODEL` environment variable support.
4. **Resilient API Key Handling:**
   - *Problem:* Missing keys caused unhandled exceptions and server instability.
   - *Fix:* Added validation with clear, actionable error messages guiding the user to configure `.env`.
5. **UI & Responsive Layout Overhaul:**
   - *Problem:* Default Vite centering styles broke 100% viewport filling; code editor lacked overflow controls and clashed with bright borders.
   - *Fix:* Modernized the entire layout with a clean header, language selector, stats bar, keyboard shortcuts (<kbd>Ctrl</kbd> + <kbd>Enter</kbd>), one-click copy, and responsive mobile/tablet breakpoints.

---

## 📝 Available Scripts

| Command | Location | Description |
| :--- | :--- | :--- |
| `npm run install:all` | Root | Installs dependencies for both backend and frontend |
| `npm run backend` | Root | Runs backend server with `node server.js` |
| `npm run backend:dev` | Root | Runs backend server in watch mode (`node --watch`) |
| `npm run frontend` | Root | Launches Vite development server on port 5173 |
| `npm run frontend:build` | Root | Compiles production assets in `frontend/dist/` |
| `npm run frontend:lint` | Root | Runs ESLint on frontend code |

---

## 📄 License

This project is licensed under the ISC License.

