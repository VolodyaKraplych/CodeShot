import { useState, useEffect, useRef } from 'react';
import { SupportedLanguage } from '../types';
import { highlightCode, getThemeBackgroundColor } from '../features/highlighting/shikiEngine';

interface UseShikiHighlighterResult {
  html: string;
  themeBg: string;
  isLoading: boolean;
  error: string | null;
  latencyMs: number;
}

export function useShikiHighlighter(
  code: string,
  lang: SupportedLanguage,
  theme: string
): UseShikiHighlighterResult {
  const [html, setHtml] = useState<string>('');
  const [themeBg, setThemeBg] = useState<string>('#282c34');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const activeRequestRef = useRef(0);

  useEffect(() => {
    const requestId = ++activeRequestRef.current;
    const startTime = performance.now();
    setIsLoading(true);
    setError(null);

    let isSubscribed = true;

    Promise.all([
      highlightCode(code, lang, theme),
      getThemeBackgroundColor(theme),
    ])
      .then(([highlightedHtml, bg]) => {
        if (!isSubscribed || requestId !== activeRequestRef.current) return;
        setHtml(highlightedHtml);
        setThemeBg(bg);
        setLatencyMs(Math.round(performance.now() - startTime));
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isSubscribed || requestId !== activeRequestRef.current) return;
        setError(err instanceof Error ? err.message : 'Highlighting failed');
        setLatencyMs(Math.round(performance.now() - startTime));
        setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [code, lang, theme]);

  return { html, themeBg, isLoading, error, latencyMs };
}
