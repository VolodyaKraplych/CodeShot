import { createHighlighter, type Highlighter, type BundledLanguage, type BundledTheme } from 'shiki';
import { SupportedLanguage } from '../../types';

let highlighterPromise: Promise<Highlighter> | null = null;
const loadedLanguages = new Set<string>();
const loadedThemes = new Set<string>();

const INITIAL_LANGUAGES: BundledLanguage[] = ['typescript', 'javascript'];
const INITIAL_THEMES: BundledTheme[] = ['one-dark-pro', 'github-dark'];

const THEME_BG_FALLBACKS: Record<string, string> = {
  'one-dark-pro': '#282c34',
  'github-dark': '#0d1117',
  'dracula': '#282a36',
  'nord': '#2e3440',
  'catppuccin-mocha': '#1e1e2e',
  'vitesse-dark': '#121212',
  'tokyo-night': '#1a1b26',
  'rose-pine': '#191724',
  'github-light': '#ffffff',
};

export async function getHighlighterInstance(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      langs: INITIAL_LANGUAGES,
      themes: INITIAL_THEMES,
    }).then((h) => {
      INITIAL_LANGUAGES.forEach((l) => loadedLanguages.add(l));
      INITIAL_THEMES.forEach((t) => loadedThemes.add(t));
      return h;
    });
  }
  return highlighterPromise;
}

export async function ensureLanguageAndThemeLoaded(
  lang: SupportedLanguage,
  theme: string
): Promise<Highlighter> {
  const highlighter = await getHighlighterInstance();

  const loadTasks: Promise<void>[] = [];

  if (!loadedLanguages.has(lang)) {
    loadTasks.push(
      highlighter
        .loadLanguage(lang as BundledLanguage)
        .then(() => {
          loadedLanguages.add(lang);
        })
        .catch((err) => {
          console.warn(`Failed to lazy-load language ${lang}:`, err);
        })
    );
  }

  if (!loadedThemes.has(theme)) {
    loadTasks.push(
      highlighter
        .loadTheme(theme as BundledTheme)
        .then(() => {
          loadedThemes.add(theme);
        })
        .catch((err) => {
          console.warn(`Failed to lazy-load theme ${theme}:`, err);
        })
    );
  }

  if (loadTasks.length > 0) {
    await Promise.all(loadTasks);
  }

  return highlighter;
}

export async function highlightCode(
  code: string,
  lang: SupportedLanguage,
  theme: string
): Promise<string> {
  try {
    const highlighter = await ensureLanguageAndThemeLoaded(lang, theme);
    const validLang = loadedLanguages.has(lang) ? lang : 'text';
    const validTheme = loadedThemes.has(theme) ? theme : 'one-dark-pro';

    const sourceCode = code.length === 0 ? ' ' : code;

    const rawHtml = highlighter.codeToHtml(sourceCode, {
      lang: validLang,
      theme: validTheme,
      transformers: [
        {
          line(node, line) {
            node.properties['className'] = ['line', 'shiki-line'];
            node.children.unshift({
              type: 'element',
              tagName: 'span',
              properties: { className: ['shiki-line-number'] },
              children: [{ type: 'text', value: String(line) }],
            });
          },
        },
      ],
    });

    return rawHtml.replace(/<\/span>\n(?=<span class=)/g, '</span>');
  } catch (err) {
    console.error('Highlighting error:', err);
    const escaped = escapeHtml(code || ' ');
    return `<pre class="shiki fallback" style="background-color: #1e1e2e; color: #cdd6f4;"><code><span class="line">${escaped}</span></code></pre>`;
  }
}

export async function getThemeBackgroundColor(theme: string): Promise<string> {
  try {
    const highlighter = await getHighlighterInstance();
    if (!loadedThemes.has(theme)) {
      await highlighter.loadTheme(theme as BundledTheme);
      loadedThemes.add(theme);
    }
    const loadedTheme = highlighter.getTheme(theme);
    return loadedTheme.bg || THEME_BG_FALLBACKS[theme] || '#1e1e2e';
  } catch {
    return THEME_BG_FALLBACKS[theme] || '#1e1e2e';
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
