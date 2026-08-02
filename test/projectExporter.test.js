import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeProjectFiles, smokeTestProject } from "../src/background/services/projectExporter.js";

test("normalizes index.jsx imports regardless of extension or quote style", () => {
  const files = [
    { path: "App.jsx", content: 'import React from "react";\nimport "./App.css";\n\nexport default function App() { return <main>Hi</main>; }' },
    { path: "App.css", content: ".main { color: red; }" },
    { path: "index.jsx", content: "import App from './App';\nimport ReactDOM from 'react-dom/client';\nReactDOM.createRoot(document.getElementById('root')).render(<App />);" },
  ];
  const result = normalizeProjectFiles(files);
  const index = result.find((f) => f.path === "index.jsx").content;
  assert.match(index, /from "\.\/App\.jsx"/);
  assert.doesNotMatch(index, /from '\.\/App'/);
});

test("normalizes index.jsx with no space after from, lowercase, and src/ variants", () => {
  const cases = [
    'import App from"./App.jsx";',
    'import App from "./app";',
    "import App from './src/App';",
    'import App from "./App.js";',
  ];
  for (const source of cases) {
    const files = [
      { path: "App.jsx", content: 'import React from "react";\nimport "./App.css";\n\nexport default function App() { return <main>Hi</main>; }' },
      { path: "App.css", content: ".main {}" },
      { path: "index.jsx", content: `${source}\nReactDOM.createRoot(document.getElementById('root')).render(<App />);` },
    ];
    const result = normalizeProjectFiles(files);
    const index = result.find((f) => f.path === "index.jsx").content;
    assert.match(index, /from "\.\/App\.jsx"/, `failed for: ${source}`);
  }
});

test("injects an App import when index.jsx has none", () => {
  const files = [
    { path: "App.jsx", content: 'import React from "react";\nimport "./App.css";\n\nexport default function App() { return <main>Hi</main>; }' },
    { path: "App.css", content: ".main {}" },
    { path: "index.jsx", content: "import ReactDOM from 'react-dom/client';\nReactDOM.createRoot(document.getElementById('root')).render(<App />);" },
  ];
  const result = normalizeProjectFiles(files);
  const index = result.find((f) => f.path === "index.jsx").content;
  assert.match(index, /from "\.\/App\.jsx"/);
  assert.doesNotThrow(() => smokeTestProject(result));
});

test("normalizes src/index.jsx that imports src/App.jsx", () => {
  const files = [
    { path: "src/App.jsx", content: 'import "./App.css";\nexport default function App() { return <main>Hi</main>; }' },
    { path: "src/App.css", content: ".main {}" },
    { path: "src/index.jsx", content: 'import App from "./src/App.jsx";\nReactDOM.createRoot(document.getElementById("root")).render(<App />);' },
  ];
  const result = normalizeProjectFiles(files);
  const paths = result.map((f) => f.path);
  assert.ok(paths.includes("App.jsx"));
  assert.ok(paths.includes("index.jsx"));
  const index = result.find((f) => f.path === "index.jsx").content;
  assert.match(index, /from "\.\/App\.jsx"/);
});

test("throws when AI output has no App.jsx instead of shipping a placeholder", () => {
  const files = [
    { path: "index.jsx", content: "import App from './App';\n" },
  ];
  assert.throws(() => normalizeProjectFiles(files), /did not include App\.jsx/);
});

test("smokeTestProject passes a normalized, valid project", () => {
  const files = [
    { path: "App.jsx", content: 'import React from "react";\nimport "./App.css";\n\nexport default function App() { return <main>Hi</main>; }' },
    { path: "App.css", content: ".main { color: red; }" },
    { path: "index.jsx", content: 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App.jsx";\nReactDOM.createRoot(document.getElementById("root")).render(<App />);' },
  ];
  assert.doesNotThrow(() => smokeTestProject(files));
});

test("smokeTestProject rejects leftover CSS module references", () => {
  const files = [
    { path: "App.jsx", content: 'import React from "react";\nimport "./App.css";\n\nexport default function App() { return <main className={styles.card}>Hi</main>; }' },
    { path: "App.css", content: ".card {}" },
    { path: "index.jsx", content: 'import App from "./App.jsx";\nReactDOM.createRoot(document.getElementById("root")).render(<App />);' },
  ];
  assert.throws(() => smokeTestProject(files), /styles\./);
});

test("smokeTestProject rejects an index.jsx that does not mount App", () => {
  const files = [
    { path: "App.jsx", content: 'import React from "react";\nimport "./App.css";\n\nexport default function App() { return <main>Hi</main>; }' },
    { path: "App.css", content: ".main {}" },
    { path: "index.jsx", content: "import something from './Main';\n" },
  ];
  assert.throws(() => smokeTestProject(files), /index\.jsx must import "\.\/App\.jsx"/);
});
