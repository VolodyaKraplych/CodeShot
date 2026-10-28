import { CodeShotSettings, SupportedLanguage, SnippetHistoryItem } from '../types';
import { DEFAULT_THEME } from '../features/themes/syntaxThemes';
import { DEFAULT_BACKGROUND } from '../features/themes/backgroundPresets';
import type { Locale } from './i18n/translations';

export const STORAGE_KEY_SETTINGS = 'codeshot_settings_v1';
export const STORAGE_KEY_CODE = 'codeshot_saved_code_v1';
export const STORAGE_KEY_LANG_CACHE = 'codeshot_lang_cache_v1';
export const STORAGE_KEY_HISTORY = 'codeshot_history_v1';
export const STORAGE_KEY_LOCALE = 'codeshot_locale_v1';

export function loadSavedLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LOCALE);
    if (saved === 'uk' || saved === 'en') {
      return saved;
    }
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('uk')) {
      return 'uk';
    }
    return 'en';
  } catch {
    return 'en';
  }
}

export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOCALE, locale);
  } catch {
    // Ignore
  }
}

export const DEFAULT_SETTINGS: CodeShotSettings = {
  language: 'typescript',
  theme: DEFAULT_THEME,
  background: DEFAULT_BACKGROUND,
  bgType: 'preset',
  transparentBg: false,
  customBgColor: '#0f172a',
  customGradientStart: '#1e293b',
  customGradientEnd: '#0f172a',
  customGradientAngle: 135,
  padding: 48,
  borderRadius: 12,
  fontSize: 14,
  lineHeight: 1.6,
  fontFamily: 'JetBrains Mono',
  showLineNumbers: true,
  showWindowControls: true,
  windowControlsStyle: 'mac',
  showFilename: true,
  filename: 'counter.ts',
  shadowPreset: 'medium',
  exportScale: 2,
  autoWidth: true,
  locale: loadSavedLocale(),
  debugMode: false,
};

const VALID_LANGUAGES: SupportedLanguage[] = [
  'javascript',
  'typescript',
  'python',
  'rust',
  'cpp',
  'html',
  'css',
  'json',
  'bash',
  'yaml',
];

export function validateSettings(input: unknown): CodeShotSettings {
  if (!input || typeof input !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }

  const raw = input as Record<string, unknown>;

  const language =
    typeof raw.language === 'string' && VALID_LANGUAGES.includes(raw.language as SupportedLanguage)
      ? (raw.language as SupportedLanguage)
      : DEFAULT_SETTINGS.language;

  const theme =
    typeof raw.theme === 'string' && raw.theme.trim().length > 0
      ? raw.theme
      : DEFAULT_SETTINGS.theme;

  const background =
    typeof raw.background === 'string' && raw.background.trim().length > 0
      ? raw.background
      : DEFAULT_SETTINGS.background;

  const bgType =
    raw.bgType === 'preset' ||
    raw.bgType === 'custom-solid' ||
    raw.bgType === 'custom-gradient' ||
    raw.bgType === 'transparent'
      ? raw.bgType
      : DEFAULT_SETTINGS.bgType;

  const transparentBg =
    typeof raw.transparentBg === 'boolean'
      ? raw.transparentBg
      : DEFAULT_SETTINGS.transparentBg;

  const customBgColor =
    typeof raw.customBgColor === 'string' ? raw.customBgColor : DEFAULT_SETTINGS.customBgColor;

  const customGradientStart =
    typeof raw.customGradientStart === 'string'
      ? raw.customGradientStart
      : DEFAULT_SETTINGS.customGradientStart;

  const customGradientEnd =
    typeof raw.customGradientEnd === 'string'
      ? raw.customGradientEnd
      : DEFAULT_SETTINGS.customGradientEnd;

  const customGradientAngle =
    typeof raw.customGradientAngle === 'number' && !isNaN(raw.customGradientAngle)
      ? Math.max(0, Math.min(360, raw.customGradientAngle))
      : DEFAULT_SETTINGS.customGradientAngle;

  const padding =
    typeof raw.padding === 'number' && !isNaN(raw.padding)
      ? Math.max(0, Math.min(128, raw.padding))
      : DEFAULT_SETTINGS.padding;

  const borderRadius =
    typeof raw.borderRadius === 'number' && !isNaN(raw.borderRadius)
      ? Math.max(0, Math.min(32, raw.borderRadius))
      : DEFAULT_SETTINGS.borderRadius;

  const fontSize =
    typeof raw.fontSize === 'number' && !isNaN(raw.fontSize)
      ? Math.max(10, Math.min(32, raw.fontSize))
      : DEFAULT_SETTINGS.fontSize;

  const lineHeight =
    typeof raw.lineHeight === 'number' && !isNaN(raw.lineHeight)
      ? Math.max(1.0, Math.min(3.0, raw.lineHeight))
      : DEFAULT_SETTINGS.lineHeight;

  const fontFamily =
    typeof raw.fontFamily === 'string' && raw.fontFamily.trim().length > 0
      ? raw.fontFamily
      : DEFAULT_SETTINGS.fontFamily;

  const showLineNumbers =
    typeof raw.showLineNumbers === 'boolean'
      ? raw.showLineNumbers
      : DEFAULT_SETTINGS.showLineNumbers;

  const showWindowControls =
    typeof raw.showWindowControls === 'boolean'
      ? raw.showWindowControls
      : DEFAULT_SETTINGS.showWindowControls;

  const windowControlsStyle =
    raw.windowControlsStyle === 'mac' ||
    raw.windowControlsStyle === 'windows' ||
    raw.windowControlsStyle === 'minimal' ||
    raw.windowControlsStyle === 'none'
      ? raw.windowControlsStyle
      : DEFAULT_SETTINGS.windowControlsStyle;

  const showFilename =
    typeof raw.showFilename === 'boolean' ? raw.showFilename : DEFAULT_SETTINGS.showFilename;

  const filename =
    typeof raw.filename === 'string' && raw.filename.trim().length > 0
      ? raw.filename
      : DEFAULT_SETTINGS.filename;

  const shadowPreset =
    raw.shadowPreset === 'none' ||
    raw.shadowPreset === 'subtle' ||
    raw.shadowPreset === 'medium' ||
    raw.shadowPreset === 'deep' ||
    raw.shadowPreset === 'glow'
      ? raw.shadowPreset
      : DEFAULT_SETTINGS.shadowPreset;

  const exportScale =
    raw.exportScale === 1 || raw.exportScale === 2 || raw.exportScale === 3
      ? raw.exportScale
      : DEFAULT_SETTINGS.exportScale;

  const autoWidth =
    typeof raw.autoWidth === 'boolean' ? raw.autoWidth : DEFAULT_SETTINGS.autoWidth;

  const locale: Locale =
    raw.locale === 'uk' || raw.locale === 'en'
      ? raw.locale
      : DEFAULT_SETTINGS.locale;

  const debugMode =
    typeof raw.debugMode === 'boolean' ? raw.debugMode : DEFAULT_SETTINGS.debugMode;

  return {
    language,
    theme,
    background,
    bgType,
    transparentBg,
    customBgColor,
    customGradientStart,
    customGradientEnd,
    customGradientAngle,
    padding,
    borderRadius,
    fontSize,
    lineHeight,
    fontFamily,
    showLineNumbers,
    showWindowControls,
    windowControlsStyle,
    showFilename,
    filename,
    shadowPreset,
    exportScale,
    autoWidth,
    locale,
    debugMode,
  };
}

export function loadSettings(): CodeShotSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return validateSettings(parsed);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: CodeShotSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export function resetSettings(): CodeShotSettings {
  try {
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
  } catch {
    // Ignore
  }
  return { ...DEFAULT_SETTINGS };
}

export function loadSavedCode(defaultCode: string): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CODE);
    return saved !== null ? saved : defaultCode;
  } catch {
    return defaultCode;
  }
}

export function saveCode(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_CODE, code);
  } catch {
    // Ignore
  }
}

export function loadLanguageCode(lang: SupportedLanguage, defaultCode: string): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LANG_CACHE);
    if (!raw) return defaultCode;
    const cache = JSON.parse(raw);
    if (cache && typeof cache === 'object' && typeof cache[lang] === 'string') {
      return cache[lang];
    }
    return defaultCode;
  } catch {
    return defaultCode;
  }
}

export function saveLanguageCode(lang: SupportedLanguage, code: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LANG_CACHE);
    const cache = raw ? JSON.parse(raw) : {};
    cache[lang] = code;
    localStorage.setItem(STORAGE_KEY_LANG_CACHE, JSON.stringify(cache));
  } catch {
    // Ignore
  }
}

export function loadHistory(): SnippetHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (Array.isArray(list)) {
      return list.slice(0, 20);
    }
    return [];
  } catch {
    return [];
  }
}

export function saveHistory(items: SnippetHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(items.slice(0, 20)));
  } catch {
    // Ignore
  }
}

export function addHistorySnapshot(lang: SupportedLanguage, code: string): SnippetHistoryItem[] {
  if (!code || !code.trim()) return loadHistory();
  const history = loadHistory();

  if (history.length > 0 && history[0].code === code) {
    return history;
  }

  const firstNonEmptyLine = code.split('\n').find((l) => l.trim().length > 0) || code.slice(0, 30);
  const summary = firstNonEmptyLine.trim().slice(0, 36);

  const newItem: SnippetHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    language: lang,
    code,
    summary,
  };

  const updated = [newItem, ...history].slice(0, 20);
  saveHistory(updated);
  return updated;
}
