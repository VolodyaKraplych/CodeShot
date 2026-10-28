import { useState, useEffect, useCallback, useRef } from 'react';
import { CodeShotSettings, SupportedLanguage, SnippetHistoryItem } from '../types';
import {
  loadSettings,
  saveSettings,
  resetSettings,
  loadSavedCode,
  saveCode,
  loadLanguageCode,
  saveLanguageCode,
  loadHistory,
  addHistorySnapshot,
  saveLocale,
} from '../lib/storage';
import { DEFAULT_SNIPPETS, SUPPORTED_LANGUAGES } from '../features/languages/languagePresets';

export function useCodeShotState() {
  const [settings, setSettings] = useState<CodeShotSettings>(() => loadSettings());
  const [code, setCode] = useState<string>(() =>
    loadSavedCode(DEFAULT_SNIPPETS[settings.language] || DEFAULT_SNIPPETS.typescript)
  );
  const [history, setHistory] = useState<SnippetHistoryItem[]>(() => loadHistory());

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveCode(code);
      saveLanguageCode(settings.language, code);
    }, 300);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [code, settings.language]);

  useEffect(() => {
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
    }
    historyTimerRef.current = setTimeout(() => {
      const updated = addHistorySnapshot(settings.language, code);
      setHistory(updated);
    }, 1500);

    return () => {
      if (historyTimerRef.current) {
        clearTimeout(historyTimerRef.current);
      }
    };
  }, [code, settings.language]);

  const updateSettings = useCallback((partial: Partial<CodeShotSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const changeLanguage = useCallback(
    (newLang: SupportedLanguage) => {
      saveLanguageCode(settings.language, code);
      const cachedCode = loadLanguageCode(newLang, DEFAULT_SNIPPETS[newLang] || '');
      setCode(cachedCode);

      const langDef = SUPPORTED_LANGUAGES.find((l) => l.id === newLang);
      const newFilename = langDef ? langDef.defaultFilename : 'code.txt';

      setSettings((prev) => ({
        ...prev,
        language: newLang,
        filename: newFilename,
      }));
    },
    [settings.language, code]
  );

  const handleResetSettings = useCallback(() => {
    const fresh = resetSettings();
    setSettings(fresh);
  }, []);

  const loadExampleSnippet = useCallback((lang: SupportedLanguage) => {
    const snippet = DEFAULT_SNIPPETS[lang] || '';
    setCode(snippet);
  }, []);

  const restoreHistoryItem = useCallback((item: SnippetHistoryItem) => {
    setCode(item.code);
    const langDef = SUPPORTED_LANGUAGES.find((l) => l.id === item.language);
    setSettings((prev) => ({
      ...prev,
      language: item.language,
      filename: langDef ? langDef.defaultFilename : prev.filename,
    }));
  }, []);

  const toggleLocale = useCallback(() => {
    setSettings((prev) => {
      const nextLocale = prev.locale === 'uk' ? 'en' : 'uk';
      saveLocale(nextLocale);
      return {
        ...prev,
        locale: nextLocale,
      };
    });
  }, []);

  const toggleDebugMode = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      debugMode: !prev.debugMode,
    }));
  }, []);

  return {
    settings,
    code,
    setCode,
    history,
    updateSettings,
    changeLanguage,
    resetSettings: handleResetSettings,
    loadExampleSnippet,
    restoreHistoryItem,
    toggleLocale,
    toggleDebugMode,
  };
}
