# CodeShot

> Desktop-First Code Screenshot Editor

CodeShot is a fast, minimal, local-first, and privacy-friendly web application for creating beautiful screenshots of source code. Designed with a dark desktop tool aesthetic inspired by Zed and Linear, running entirely in the browser with zero server dependencies.

---

## Features

- **Code Editor with Syntax Highlighting:** Powered by CodeMirror 6 with syntax highlighting, matching brackets, active line highlights, line counter, and character counter.
- **9 Supported Languages:** TypeScript, JavaScript, Python, Rust, C++, HTML, CSS, JSON, and Bash.
- **Accurate Syntax Highlighting:** Powered by Shiki with lazy-loading grammars and themes (One Dark Pro, GitHub Dark, Dracula, Nord, Catppuccin Mocha, Vitesse Dark, Tokyo Night, Rosé Pine, GitHub Light).
- **Exact Line-by-Line Alignment:** Embedded table-row line numbers that never desync across any font size, line height, or snippet length.
- **Custom Canvas Backgrounds:** 12 gradient and solid presets, custom solid hex picker, custom 2-color gradient with 0°–360° angle slider, and a clean **None (Transparent)** mode.
- **Transparent Export Mode:** Save code windows with an alpha channel and support for `0px` padding for tight, borderless captures.
- **Window Controls:** macOS traffic lights, native Windows controls (Minimize, Maximize, Close on top right), Minimal dots, or None.
- **Full Ukrainian & English Localization (`EN / UA`):** Complete UI translations with native Cyrillic typography support.
- **Per-Language Code Cache:** Switching languages automatically preserves and restores your custom code for each language.
- **Snippet History:** Built-in history drawer in the editor toolbar to inspect and restore previous code versions.
- **Developer Debug Mode (`Ctrl+Shift+D`):** Live HUD overlay showing canvas dimensions, calculated export dimensions at 1x/2x/3x, syntax highlight latency in milliseconds, and one-click diagnostics export.
- **High-Resolution PNG Export:** 1x (Standard), 2x (High Res Retina), and 3x (Ultra) PNG export via `html-to-image`.
- **Clipboard Copy:** One-click image copy to clipboard with automatic download fallback on unsupported environments.
- **100% Client-Side:** No telemetry, no external APIs, no server dependencies.

---

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl+S` / `Cmd+S` | Export screenshot as PNG |
| `Ctrl+Shift+D` / `Cmd+Shift+D` | Toggle Developer Debug HUD |

---

## Tech Stack

- **React 19**
- **TypeScript 7.0+** (Strict mode)
- **Vite 8.3+**
- **CodeMirror 6** (with `@codemirror/theme-one-dark` and language extensions)
- **Shiki 4.5+**
- **html-to-image**
- **Lucide React**
- **Vitest** for testing
- **Lightpanda** for headless browser automation & verification

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9

### Install Dependencies

```bash
pnpm install
```

### Run Local Development Server

```bash
pnpm run dev
```

### Run Tests

```bash
pnpm test
```

### Run Lightpanda E2E Test

```bash
# Start the preview server and Lightpanda CDP server, then run:
pnpm run test:e2e
```

### Build for Production

```bash
pnpm run build
```

Static output will be generated in `dist/`, ready for static deployment on Cloudflare Pages or any static host.

---

## License

This project is licensed under the GNU General Public License v3.0 or later.
See the [LICENSE](./LICENSE) file for details.

Copyright (C) 2026 Volodymyr Kraplych
