import React, { useMemo, useState, useEffect, useRef, RefObject } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Loader2 } from 'lucide-react';
import { CodeShotSettings } from '../../types';
import { CodeWindow } from './CodeWindow';
import { DebugOverlay } from './DebugOverlay';
import { translations } from '../../lib/i18n/translations';
import './previewStyles.css';

interface PreviewCanvasProps {
  highlightedHtml: string;
  themeBg: string;
  isLoading: boolean;
  settings: CodeShotSettings;
  exportRef: RefObject<HTMLDivElement | null>;
  onFilenameChange: (name: string) => void;
  lineCount?: number;
  charCount?: number;
  highlightLatencyMs?: number;
  onCopyDiagnosticsSuccess?: () => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  highlightedHtml,
  themeBg,
  isLoading,
  settings,
  exportRef,
  onFilenameChange,
  lineCount = 1,
  charCount = 0,
  highlightLatencyMs = 0,
  onCopyDiagnosticsSuccess,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const startPanRef = useRef<{
    startX: number;
    startY: number;
    initialPanX: number;
    initialPanY: number;
  } | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const t = translations[settings.locale].preview;

  const isTransparent =
    settings.transparentBg ||
    settings.bgType === 'transparent' ||
    settings.background === 'transparent';

  const backgroundValue = useMemo(() => {
    if (isTransparent) {
      return 'transparent';
    }
    if (settings.bgType === 'custom-solid') {
      return settings.customBgColor;
    }
    if (settings.bgType === 'custom-gradient') {
      return `linear-gradient(${settings.customGradientAngle}deg, ${settings.customGradientStart} 0%, ${settings.customGradientEnd} 100%)`;
    }
    return settings.background;
  }, [
    isTransparent,
    settings.bgType,
    settings.background,
    settings.customBgColor,
    settings.customGradientAngle,
    settings.customGradientStart,
    settings.customGradientEnd,
  ]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY * 0.8;
        setZoomLevel((prev) => Math.min(300, Math.max(25, Math.round(prev + delta))));
      } else if (e.shiftKey) {
        e.preventDefault();
        setPan((prev) => ({ x: prev.x - e.deltaY, y: prev.y }));
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const isBackground =
      e.target === viewportRef.current ||
      (e.target as HTMLElement).classList.contains('preview-viewport');
    const isMiddleClick = e.button === 1;

    if (isBackground || isMiddleClick) {
      e.preventDefault();
      setIsPanning(true);
      startPanRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !startPanRef.current) return;
    const dx = e.clientX - startPanRef.current.startX;
    const dy = e.clientY - startPanRef.current.startY;
    setPan({
      x: startPanRef.current.initialPanX + dx,
      y: startPanRef.current.initialPanY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    startPanRef.current = null;
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const isBackground =
      e.target === viewportRef.current ||
      (e.target as HTMLElement).classList.contains('preview-viewport');
    if (isBackground) {
      setZoomLevel(100);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(300, prev + 15));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(25, prev - 15));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
    setPan({ x: 0, y: 0 });
  };

  return (
    <main className="preview-panel" aria-label="Screenshot Preview Canvas">
      <header className="preview-toolbar">
        <div className="preview-toolbar-left">
          <span className="preview-badge">{t.livePreview}</span>
          {isLoading && (
            <div className="preview-loading-overlay" aria-live="polite">
              <Loader2 size={12} className="animate-spin" aria-hidden="true" />
              <span>{t.highlighting}</span>
            </div>
          )}
        </div>

        <div className="preview-toolbar-right">
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={handleZoomOut}
            title={t.zoomOut}
            aria-label={t.zoomOut}
          >
            <ZoomOut size={15} aria-hidden="true" />
          </button>

          <span
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              minWidth: '42px',
              textAlign: 'center',
            }}
          >
            {zoomLevel}%
          </span>

          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={handleZoomIn}
            title={t.zoomIn}
            aria-label={t.zoomIn}
          >
            <ZoomIn size={15} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={handleResetZoom}
            title={t.resetZoom}
            aria-label={t.resetZoom}
          >
            <Maximize2 size={14} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        ref={viewportRef}
        className={`preview-viewport ${isTransparent ? 'is-transparent-bg' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        style={{
          cursor: isPanning ? 'grabbing' : 'grab',
          userSelect: isPanning ? 'none' : 'auto',
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel / 100})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.08s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            ref={exportRef}
            className="preview-export-frame"
            style={{
              background: backgroundValue,
              padding: `${settings.padding}px`,
            }}
            data-testid="preview-export-frame"
          >
            <CodeWindow
              highlightedHtml={highlightedHtml}
              themeBg={themeBg}
              settings={settings}
              onFilenameChange={onFilenameChange}
            />
          </div>
        </div>

        <DebugOverlay
          settings={settings}
          frameRef={exportRef}
          lineCount={lineCount}
          charCount={charCount}
          highlightLatencyMs={highlightLatencyMs}
          onCopyDiagnosticsSuccess={onCopyDiagnosticsSuccess}
        />
      </div>
    </main>
  );
};
