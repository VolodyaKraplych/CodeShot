import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  loadLanguageCode,
  saveLanguageCode,
  addHistorySnapshot,
  loadHistory,
  saveLocale,
  loadSavedLocale,
} from './storage';

describe('Settings Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default settings when localStorage is empty', () => {
    const settings = loadSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
    expect(settings.language).toBe('typescript');
    expect(settings.theme).toBe('one-dark-pro');
    expect(settings.exportScale).toBe(2);
    expect(settings.locale).toBe('en');
    expect(settings.transparentBg).toBe(false);
  });

  it('persists and loads valid updated settings with ukrainian locale and yaml', () => {
    const updated = {
      ...DEFAULT_SETTINGS,
      language: 'yaml' as const,
      fontSize: 16,
      padding: 48,
      locale: 'uk' as const,
      transparentBg: true,
    };
    saveSettings(updated);

    const loaded = loadSettings();
    expect(loaded.language).toBe('yaml');
    expect(loaded.fontSize).toBe(16);
    expect(loaded.padding).toBe(48);
    expect(loaded.locale).toBe('uk');
    expect(loaded.transparentBg).toBe(true);
  });

  it('falls back to default settings when localStorage has corrupted JSON', () => {
    localStorage.setItem('codeshot_settings_v1', '{ invalid json ...');
    const settings = loadSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it('fills in missing fields if stored settings are incomplete', () => {
    localStorage.setItem(
      'codeshot_settings_v1',
      JSON.stringify({
        fontSize: 18,
      })
    );
    const settings = loadSettings();
    expect(settings.fontSize).toBe(18);
    expect(settings.language).toBe(DEFAULT_SETTINGS.language);
    expect(settings.padding).toBe(DEFAULT_SETTINGS.padding);
    expect(settings.locale).toBe('en');
  });

  it('permanently saves and loads user locale', () => {
    expect(loadSavedLocale()).toBe('en');
    saveLocale('uk');
    expect(loadSavedLocale()).toBe('uk');
    saveLocale('en');
    expect(loadSavedLocale()).toBe('en');
  });

  it('caches and restores code per programming language including yaml', () => {
    saveLanguageCode('yaml', 'version: "3.9"\nservices:\n  app:\n    image: test');
    saveLanguageCode('rust', 'fn main() { println!("Hello"); }');

    expect(loadLanguageCode('yaml', '')).toContain('version: "3.9"');
    expect(loadLanguageCode('rust', '')).toBe('fn main() { println!("Hello"); }');
    expect(loadLanguageCode('typescript', 'default ts')).toBe('default ts');
  });

  it('stores and loads recent snippet history', () => {
    addHistorySnapshot('typescript', 'const a = 1;');
    addHistorySnapshot('yaml', 'services:\n  web:\n    image: alpine');

    const history = loadHistory();
    expect(history.length).toBe(2);
    expect(history[0].language).toBe('yaml');
    expect(history[0].code).toContain('services');
    expect(history[1].language).toBe('typescript');
  });
});
