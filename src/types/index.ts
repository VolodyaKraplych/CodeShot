import type { Locale } from '../lib/i18n/translations';

export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'rust'
  | 'cpp'
  | 'html'
  | 'css'
  | 'json'
  | 'bash'
  | 'yaml';

export type WindowControlsStyle = 'mac' | 'windows' | 'minimal' | 'none';

export type ShadowPreset = 'none' | 'subtle' | 'medium' | 'deep' | 'glow';

export type BackgroundType = 'preset' | 'custom-solid' | 'custom-gradient' | 'transparent';

export interface BackgroundPreset {
  id: string;
  name: string;
  type: 'gradient' | 'solid';
  value: string;
  dark: boolean;
}

export interface SnippetHistoryItem {
  id: string;
  timestamp: number;
  language: SupportedLanguage;
  code: string;
  summary: string;
}

export interface CodeShotSettings {
  language: SupportedLanguage;
  theme: string;
  background: string;
  bgType: BackgroundType;
  transparentBg: boolean;
  customBgColor: string;
  customGradientStart: string;
  customGradientEnd: string;
  customGradientAngle: number;
  padding: number;
  borderRadius: number;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  showLineNumbers: boolean;
  showWindowControls: boolean;
  windowControlsStyle: WindowControlsStyle;
  showFilename: boolean;
  filename: string;
  shadowPreset: ShadowPreset;
  exportScale: 1 | 2 | 3;
  autoWidth: boolean;
  locale: Locale;
  debugMode: boolean;
}

export interface LanguageDefinition {
  id: SupportedLanguage;
  name: string;
  extension: string;
  defaultFilename: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  type: 'dark' | 'light';
  previewBg: string;
}
