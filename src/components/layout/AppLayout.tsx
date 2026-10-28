import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Code2, Eye, Sliders } from 'lucide-react';
import { useCodeShotState } from '../../hooks/useCodeShotState';
import { useShikiHighlighter } from '../../hooks/useShikiHighlighter';
import { TopNavbar } from './TopNavbar';
import { CodeEditor } from '../editor/CodeEditor';
import { PreviewCanvas } from '../preview/PreviewCanvas';
import { SettingsPanel } from '../settings/SettingsPanel';
import { ToastContainer, ToastItem } from '../ui/Toast';
import { exportToPng, copyToClipboard } from '../../features/export/imageExporter';
import { translations } from '../../lib/i18n/translations';
import '../../styles/layout.css';

type MobileTab = 'editor' | 'preview' | 'settings';

export const AppLayout: React.FC = () => {
  const {
    settings,
    code,
    setCode,
    history,
    updateSettings,
    changeLanguage,
    resetSettings,
    loadExampleSnippet,
    restoreHistoryItem,
    toggleLocale,
    toggleDebugMode,
  } = useCodeShotState();

  const { html, themeBg, isLoading, latencyMs } = useShikiHighlighter(
    code,
    settings.language,
    settings.theme
  );

  const tToasts = translations[settings.locale].toasts;
  const tEditor = translations[settings.locale].editor;
  const tPreview = translations[settings.locale].preview;
  const tSettings = translations[settings.locale].settings;

  const [editorWidth, setEditorWidth] = useState<number>(380);
  const [settingsWidth, setSettingsWidth] = useState<number>(320);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(true);

  const [mobileTab, setMobileTab] = useState<MobileTab>('preview');

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const exportRef = useRef<HTMLDivElement | null>(null);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleExport = useCallback(async () => {
    if (!exportRef.current) return;
    try {
      setIsExporting(true);
      await exportToPng(exportRef.current, {
        scale: settings.exportScale,
        filename: settings.filename,
      });
      addToast(tToasts.exportSuccess, 'success');
    } catch (err) {
      console.error('Export error:', err);
      addToast(tToasts.exportError, 'error');
    } finally {
      setIsExporting(false);
    }
  }, [settings.exportScale, settings.filename, addToast, tToasts]);

  const handleCopyImage = useCallback(async () => {
    if (!exportRef.current) return;
    try {
      setIsCopying(true);
      const result = await copyToClipboard(exportRef.current, {
        scale: settings.exportScale,
        filename: settings.filename,
      });

      if (result === 'copied') {
        setCopySuccess(true);
        addToast(tToasts.copySuccess, 'success');
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        await exportToPng(exportRef.current, {
          scale: settings.exportScale,
          filename: settings.filename,
        });
        addToast(tToasts.copyUnsupported, 'info');
      }
    } catch (err) {
      console.error('Copy error:', err);
      addToast(tToasts.copyError, 'error');
    } finally {
      setIsCopying(false);
    }
  }, [settings.exportScale, settings.filename, addToast, tToasts]);

  const handleLeftResizerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = editorWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = Math.max(260, Math.min(600, startWidth + delta));
      setEditorWidth(nextWidth);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleRightResizerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = settingsWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX;
      const nextWidth = Math.max(260, Math.min(480, startWidth + delta));
      setSettingsWidth(nextWidth);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        toggleDebugMode();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleExport();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExport, toggleDebugMode]);

  return (
    <div className="app-layout">
      <TopNavbar
        language={settings.language}
        onLanguageChange={changeLanguage}
        locale={settings.locale}
        onToggleLocale={toggleLocale}
        isEditorOpen={isEditorOpen}
        onToggleEditor={() => setIsEditorOpen((prev) => !prev)}
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
        onExport={handleExport}
        onCopyImage={handleCopyImage}
        isExporting={isExporting}
        isCopying={isCopying}
        copySuccess={copySuccess}
      />

      <div className="workspace-panels">
        <div
          className={`panel-left-container ${mobileTab !== 'editor' ? 'mobile-hidden' : ''}`}
          style={{ width: isEditorOpen ? `${editorWidth}px` : '0px' }}
        >
          {isEditorOpen && (
            <CodeEditor
              code={code}
              onChange={setCode}
              language={settings.language}
              onLoadExample={loadExampleSnippet}
              history={history}
              onRestoreHistory={(item) => {
                restoreHistoryItem(item);
                addToast(tToasts.snippetRestored, 'info');
              }}
              locale={settings.locale}
            />
          )}
        </div>

        {isEditorOpen && (
          <div
            className="panel-resizer"
            onMouseDown={handleLeftResizerMouseDown}
            title="Drag to resize editor panel"
            aria-hidden="true"
          />
        )}

        <div
          style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex' }}
          className={mobileTab !== 'preview' ? 'mobile-hidden' : ''}
        >
          <PreviewCanvas
            highlightedHtml={html}
            themeBg={themeBg}
            isLoading={isLoading}
            settings={settings}
            exportRef={exportRef}
            onFilenameChange={(name) => updateSettings({ filename: name })}
            lineCount={code.split('\n').length}
            charCount={code.length}
            highlightLatencyMs={latencyMs}
            onCopyDiagnosticsSuccess={() => addToast(tToasts.diagnosticsCopied, 'success')}
          />
        </div>

        {isSettingsOpen && (
          <div
            className="panel-resizer"
            onMouseDown={handleRightResizerMouseDown}
            title="Drag to resize settings panel"
            aria-hidden="true"
          />
        )}

        <div
          className={`panel-right-container ${mobileTab !== 'settings' ? 'mobile-hidden' : ''}`}
          style={{ width: isSettingsOpen ? `${settingsWidth}px` : '0px' }}
        >
          {isSettingsOpen && (
            <SettingsPanel
              settings={settings}
              onUpdate={updateSettings}
              onReset={resetSettings}
            />
          )}
        </div>
      </div>

      <nav className="mobile-view-tabs" aria-label="Mobile Navigation Tabs">
        <button
          type="button"
          className={`mobile-tab-btn ${mobileTab === 'editor' ? 'active' : ''}`}
          onClick={() => setMobileTab('editor')}
        >
          <Code2 size={15} />
          <span>{tEditor.title}</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${mobileTab === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          <Eye size={15} />
          <span>{tPreview.livePreview}</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${mobileTab === 'settings' ? 'active' : ''}`}
          onClick={() => setMobileTab('settings')}
        >
          <Sliders size={15} />
          <span>{tSettings.title}</span>
        </button>
      </nav>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
