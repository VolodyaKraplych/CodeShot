import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import {
  Copy,
  Check,
  RotateCcw,
  Trash2,
  ClipboardPaste,
  Code2,
  History,
  Clock,
  WrapText,
} from 'lucide-react';
import { SupportedLanguage, SnippetHistoryItem } from '../../types';
import {
  codeShotEditorTheme,
  codeShotHighlighting,
  codeShotAutocompletion,
  getLanguageExtension,
} from './editorTheme';
import { SUPPORTED_LANGUAGES } from '../../features/languages/languagePresets';
import type { Locale } from '../../lib/i18n/translations';
import { translations } from '../../lib/i18n/translations';
import './editorStyles.css';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  onLoadExample: (lang: SupportedLanguage) => void;
  history?: SnippetHistoryItem[];
  onRestoreHistory?: (item: SnippetHistoryItem) => void;
  locale?: Locale;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onLoadExample,
  history = [],
  onRestoreHistory,
  locale = 'en',
}) => {
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isLineWrapping, setIsLineWrapping] = useState(true);
  const historyRef = useRef<HTMLDivElement | null>(null);

  const t = translations[locale].editor;

  const extensions = useMemo(() => {
    return [
      codeShotEditorTheme,
      codeShotHighlighting,
      codeShotAutocompletion,
      keymap.of([indentWithTab]),
      ...(isLineWrapping ? [EditorView.lineWrapping] : []),
      ...getLanguageExtension(language),
    ];
  }, [language, isLineWrapping]);

  const lineCount = useMemo(() => {
    return code.split('\n').length;
  }, [code]);

  const charCount = useMemo(() => {
    return code.length;
  }, [code]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  }, [code]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
      }
    } catch {
      const userText = prompt('Paste your code here:');
      if (userText !== null) {
        onChange(userText);
      }
    }
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const handleResetSnippet = useCallback(() => {
    onLoadExample(language);
  }, [onLoadExample, language]);

  useEffect(() => {
    if (!showHistory) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showHistory]);

  return (
    <aside className="editor-panel" aria-label="Source Code Editor">
      <header className="editor-header">
        <div className="editor-title">
          <Code2 size={15} className="text-secondary" aria-hidden="true" />
          <span>{t.title}</span>
        </div>

        <div className="editor-actions">
          <div style={{ position: 'relative' }} ref={historyRef}>
            <button
              type="button"
              className={`editor-action-btn icon-only ${showHistory ? 'active' : ''}`}
              onClick={() => setShowHistory((prev) => !prev)}
              title={t.historyTitle}
              aria-label={t.historyTitle}
              aria-expanded={showHistory}
            >
              <History size={14} aria-hidden="true" />
            </button>

            {showHistory && (
              <div
                className="history-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  width: '280px',
                  maxWidth: 'calc(100vw - 32px)',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
                  zIndex: 100,
                  padding: '4px',
                }}
              >
                <div
                  style={{
                    padding: '6px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '4px',
                  }}
                >
                  {t.historyTitle}
                </div>

                {history.length === 0 ? (
                  <div style={{ padding: '12px 8px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    {t.noHistory}
                  </div>
                ) : (
                  history.map((item, idx) => {
                    const isCurrent = item.code === code;
                    const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onRestoreHistory?.(item);
                          setShowHistory(false);
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                          textAlign: 'left',
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: isCurrent ? 'var(--bg-surface-hover)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          gap: '2px',
                        }}
                        className="history-item-btn"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-text)', background: 'var(--accent-primary)', padding: '1px 4px', borderRadius: '2px', fontWeight: 600 }}>
                            {item.language}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={10} />
                            {timeStr}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.summary || `#${idx + 1}`}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className={`editor-action-btn icon-only ${isLineWrapping ? 'active' : ''}`}
            onClick={() => setIsLineWrapping((prev) => !prev)}
            title={t.wrapLines}
            aria-label={t.wrapLines}
          >
            <WrapText size={14} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="editor-action-btn icon-only"
            onClick={handlePaste}
            title={t.paste}
            aria-label={t.paste}
          >
            <ClipboardPaste size={14} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="editor-action-btn icon-only"
            onClick={handleCopy}
            title={t.copy}
            aria-label={t.copy}
          >
            {copied ? (
              <Check size={14} color="#34d399" aria-hidden="true" />
            ) : (
              <Copy size={14} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="editor-action-btn icon-only"
            onClick={handleResetSnippet}
            title={t.example}
            aria-label={t.example}
          >
            <RotateCcw size={14} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="editor-action-btn icon-only"
            onClick={handleClear}
            title={t.clear}
            aria-label={t.clear}
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="editor-body">
        <CodeMirror
          value={code}
          height="100%"
          theme="none"
          extensions={extensions}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: false,
            completionKeymap: true,
            lintKeymap: false,
          }}
          aria-label="CodeMirror Code Input"
        />
      </div>

      <footer className="editor-footer">
        <div className="editor-stats">
          <span className="editor-stat-item">
            <strong>{lineCount}</strong> {lineCount === 1 ? t.line : t.lines}
          </span>
          <span className="editor-stat-item">
            <strong>{charCount}</strong> {t.chars}
          </span>
        </div>

        <span className="editor-lang-badge">
          {SUPPORTED_LANGUAGES.find((l) => l.id === language)?.name || language}
        </span>
      </footer>
    </aside>
  );
};
