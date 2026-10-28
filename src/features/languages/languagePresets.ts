import { LanguageDefinition, SupportedLanguage } from '../../types';

export const SUPPORTED_LANGUAGES: LanguageDefinition[] = [
  { id: 'typescript', name: 'TypeScript', extension: 'ts', defaultFilename: 'counter.ts' },
  { id: 'javascript', name: 'JavaScript', extension: 'js', defaultFilename: 'app.js' },
  { id: 'python', name: 'Python', extension: 'py', defaultFilename: 'pipeline.py' },
  { id: 'rust', name: 'Rust', extension: 'rs', defaultFilename: 'main.rs' },
  { id: 'cpp', name: 'C++', extension: 'cpp', defaultFilename: 'matrix.cpp' },
  { id: 'html', name: 'HTML', extension: 'html', defaultFilename: 'index.html' },
  { id: 'css', name: 'CSS', extension: 'css', defaultFilename: 'styles.css' },
  { id: 'json', name: 'JSON', extension: 'json', defaultFilename: 'config.json' },
  { id: 'bash', name: 'Bash', extension: 'sh', defaultFilename: 'deploy.sh' },
  { id: 'yaml', name: 'YAML', extension: 'yaml', defaultFilename: 'docker-compose.yaml' },
];

export const DEFAULT_SNIPPETS: Record<SupportedLanguage, string> = {
  typescript: `interface ScreenshotOptions {
  padding: number;
  scale: 1 | 2 | 3;
  theme: string;
  transparentBg?: boolean;
}

export async function captureSnippet(
  source: string,
  options: ScreenshotOptions
): Promise<Blob> {
  const rendered = await renderToCanvas(source, options);
  return new Promise((resolve, reject) => {
    rendered.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to capture canvas'));
    }, 'image/png');
  });
}`,

  javascript: `// Debounce helper with cancel method
function debounce(fn, wait = 250) {
  let timer = null;

  const debounced = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, wait);
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
  };

  return debounced;
}`,

  python: `from dataclasses import dataclass
from typing import Optional, List

@dataclass
class CodeFrame:
    title: str
    language: str
    tokens: List[str]
    padding: int = 32

    def render(self) -> dict:
        return {
            "title": self.title,
            "lang": self.language,
            "length": len(self.tokens),
            "safe": True
        }

frame = CodeFrame(title="main.py", language="python", tokens=["def", "run"])
print(frame.render())`,

  rust: `use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct ColorPalette {
    name: String,
    colors: HashMap<String, String>,
}

impl ColorPalette {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            colors: HashMap::new(),
        }
    }

    pub fn insert(&mut self, key: &str, hex: &str) {
        self.colors.insert(key.to_string(), hex.to_string());
    }
}`,

  cpp: `#include <iostream>
#include <vector>
#include <string>

template <typename T>
class BufferQueue {
private:
    std::vector<T> items;
public:
    void push(const T& item) {
        items.push_back(item);
    }
    size_t size() const {
        return items.size();
    }
};

int main() {
    BufferQueue<std::string> queue;
    queue.push("CodeShot ready");
    std::cout << "Items: " << queue.size() << "\\n";
    return 0;
}`,

  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>CodeShot Window</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <main class="frame-container">
      <div class="window-dot red"></div>
      <div class="window-dot yellow"></div>
      <div class="window-dot green"></div>
    </main>
  </body>
</html>`,

  css: `.code-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  overflow: hidden;
  transition: transform 0.2s ease;
}`,

  json: `{
  "name": "codeshot",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "react": "^19.0.0",
    "shiki": "^4.0.0",
    "html-to-image": "^1.11.0"
  },
  "settings": {
    "padding": 48,
    "scale": 2,
    "theme": "one-dark-pro"
  }
}`,

  bash: `#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="dist"
OUTPUT_TAR="codeshot-release.tar.gz"

echo "Building static release..."
pnpm run build

echo "Compressing build bundle..."
tar -czf "\${OUTPUT_TAR}" -C "\${DIST_DIR}" .
echo "Deployment bundle ready: \${OUTPUT_TAR}"`,

  yaml: `version: "3.9"

services:
  app:
    image: node:22-alpine
    container_name: codeshot-web
    restart: unless-stopped
    ports:
      - "4173:4173"
    environment:
      NODE_ENV: production
      PORT: 4173
    volumes:
      - ./dist:/usr/share/nginx/html:ro
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:4173"]
      interval: 30s
      timeout: 10s
      retries: 3`,
};
