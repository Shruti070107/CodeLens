import { useState, useEffect, useCallback } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-json"
import "prismjs/components/prism-css"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

const CodeEditor = (typeof Editor === 'function' || Editor?.$$typeof)
  ? Editor
  : (Editor?.default?.$$typeof || typeof Editor?.default === 'function')
    ? Editor.default
    : (Editor?.default?.default || Editor);

const SAMPLE_CODE = `// Sample function with potential issues
async function getUserProfile(userId) {
  let res = fetch('/api/users/' + userId);
  let data = res.json();
  
  // Bug: No null check and synchronous access on unresolved promise
  console.log("Fetched user: " + data.name);
  return data;
}`;

const INITIAL_REVIEW = `### Welcome to CodeLens 🚀
Paste or write your code on the left and click **Review Code** (or press \`Ctrl + Enter\`).

#### What CodeLens analyzes:
- 🐞 **Bugs & Edge Cases**: Unhandled promises, null pointers, race conditions
- ⚡ **Performance & Optimization**: Algorithmic complexity, memory management
- 🛡️ **Security Vulnerabilities**: Injection, data leaks, OWASP top 10 risks
- 🧼 **Code Quality**: Clean architecture, SOLID, DRY principles
- 💡 **Refactored Code**: Production-grade fix with detailed explanation
`;

function App() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [review, setReview] = useState(INITIAL_REVIEW);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  const getHighlightGrammar = (lang) => {
    switch (lang) {
      case "typescript":
        return prism.languages.typescript || prism.languages.javascript;
      case "python":
        return prism.languages.python || prism.languages.clike;
      case "json":
        return prism.languages.json || prism.languages.javascript;
      case "css":
        return prism.languages.css;
      case "javascript":
      default:
        return prism.languages.javascript;
    }
  };

  const reviewCode = useCallback(async () => {
    if (loading) return;
    if (!code.trim()) {
      setReview("### ⚠️ No Code Provided\nPlease paste or type some code in the editor before requesting a review.");
      return;
    }

    setLoading(true);
    setReview("Analyzing your code with senior-level expertise, please wait...\n\n_Scanning for quality, performance, bugs, and best practices..._");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${apiUrl}/ai/get-review`, { code });
      setReview(response.data);
    } catch (error) {
      let message = error.response?.data || error.message || 'Failed to connect to the review service.';
      if (typeof message === 'object') {
        message = JSON.stringify(message, null, 2);
      }
      setReview(`### ❌ Review Request Failed\n\n**Error:** ${message}\n\n**Troubleshooting Checklist:**\n1. Ensure the backend server is running (\`npm start\` in \`/backend\`).\n2. Verify that your Gemini API key is configured in \`backend/.env\` as \`GOOGLE_GEMINI_KEY\` or \`GEMINI_API_KEY\`.\n3. Check your internet connection.`);
    } finally {
      setLoading(false);
    }
  }, [code, loading]);

  // Support Ctrl+Enter / Cmd+Enter shortcut
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      reviewCode();
    }
  };

  const handleCopy = () => {
    if (!review) return;
    navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetSample = () => {
    setCode(SAMPLE_CODE);
  };

  const handleClear = () => {
    setCode("");
  };

  return (
    <div className="app-container" onKeyDown={handleKeyDown}>
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">CodeLens</span>
          <span className="brand-badge">AI Senior Reviewer</span>
        </div>

        <div className="nav-controls">
          <div className="lang-select-wrapper">
            <label htmlFor="lang-select">Language:</label>
            <select
              id="lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="json">JSON</option>
              <option value="css">CSS</option>
            </select>
          </div>

          <button
            type="button"
            className="action-btn"
            onClick={handleResetSample}
            title="Load sample code"
          >
            Sample
          </button>
          <button
            type="button"
            className="action-btn"
            onClick={handleClear}
            title="Clear editor"
          >
            Clear
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="pane left-pane">
          <div className="pane-header">
            <span className="pane-title">Source Code</span>
            <span className="shortcut-hint">Tip: Ctrl + Enter to review</span>
          </div>

          <div className="editor-wrapper">
            <CodeEditor
              value={code}
              onValueChange={setCode}
              highlight={(c) => prism.highlight(c, getHighlightGrammar(language), language)}
              padding={16}
              className="code-editor-instance"
              placeholder="// Enter or paste your code here..."
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 15,
                minHeight: '100%',
              }}
            />
          </div>

          <div className="pane-footer">
            <div className="code-stats">
              <span>{code.split('\n').length} lines</span>
              <span>•</span>
              <span>{code.length} characters</span>
            </div>

            <button
              type="button"
              onClick={reviewCode}
              disabled={loading}
              className={`review-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Reviewing...
                </>
              ) : (
                <>
                  <span>Review Code</span>
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          </div>
        </section>

        <section className="pane right-pane">
          <div className="pane-header">
            <span className="pane-title">AI Review & Insights</span>
            <div className="review-actions">
              <button
                type="button"
                onClick={handleCopy}
                className="action-btn-sm"
                title="Copy review as Markdown"
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
          </div>

          <div className="review-content">
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </Markdown>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
