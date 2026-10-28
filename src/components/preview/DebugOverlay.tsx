import React, { useState, useEffect } from 'react';
import { Bug, Copy, Check } from 'lucide-react';
import { CodeShotSettings } from '../../types';
import { translations } from '../../lib/i18n/translations';

interface DebugOverlayProps {
  settings: CodeShotSettings;
  frameRef: React.RefObject<HTMLDivElement | null>;
  lineCount: number;
  charCount: number;
  highlightLatencyMs: number;
  onCopyDiagnosticsSuccess?: () => void;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  settings,
  frameRef,
  lineCount,
  charCount,
  highlightLatencyMs,
  onCopyDiagnosticsSuccess,
}) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [copied, setCopied] = useState(false);

  const t = translations[settings.locale].debug;

  useEffect(() => {
    const updateSize = () => {
      if (frameRef.current) {
        setDimensions({
          width: frameRef.current.offsetWidth,
          height: frameRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateSize);
      if (frameRef.current) {
        observer.observe(frameRef.current);
      }
      return () => observer.disconnect();
    }
  }, [frameRef]);

  if (!settings.debugMode) return null;

  const exportW = dimensions.width * settings.exportScale;
  const exportH = dimensions.height * settings.exportScale;

  const handleCopyDiagnostics = async () => {
    const diagnostics = {
      app: 'CodeShot',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      viewport: {
        renderWidth: dimensions.width,
        renderHeight: dimensions.height,
        exportWidth: exportW,
        exportHeight: exportH,
        scale: settings.exportScale,
      },
      codeStats: {
        language: settings.language,
        lines: lineCount,
        chars: charCount,
        highlightTimeMs: highlightLatencyMs,
      },
      settings: {
        theme: settings.theme,
        padding: settings.padding,
        borderRadius: settings.borderRadius,
        transparentBg: settings.transparentBg,
        bgType: settings.bgType,
        showLineNumbers: settings.showLineNumbers,
        showControls: settings.showWindowControls,
        controlsStyle: settings.windowControlsStyle,
        locale: settings.locale,
      },
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2));
      setCopied(true);
      onCopyDiagnosticsSuccess?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Diagnostics copy error:', err);
    }
  };

  return (
    <div
      className="debug-hud-overlay"
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 50,
        background: 'rgba(11, 13, 17, 0.92)',
        border: '1px solid #3b82f6',
        borderRadius: '6px',
        padding: '10px 14px',
        color: '#f1f4f9',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        maxWidth: '340px',
        pointerEvents: 'auto',
      }}
      aria-label="Debug Mode HUD"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontWeight: 600 }}>
          <Bug size={13} aria-hidden="true" />
          <span>{t.title}</span>
        </div>
        <button
          type="button"
          onClick={handleCopyDiagnostics}
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#93c5fd',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          title={t.copyDiagnostics}
        >
          {copied ? <Check size={11} color="#34d399" /> : <Copy size={11} />}
          <span>{copied ? 'Copied' : 'JSON'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 12px', color: '#9aa5b5' }}>
        <span>{t.canvasSize}:</span>
        <strong style={{ color: '#f1f4f9' }}>{dimensions.width} &times; {dimensions.height} px</strong>

        <span>{t.exportSize} ({settings.exportScale}x):</span>
        <strong style={{ color: '#34d399' }}>{exportW} &times; {exportH} px</strong>

        <span>{t.renderTime}:</span>
        <span style={{ color: highlightLatencyMs > 50 ? '#fbbf24' : '#38bdf8' }}>
          {highlightLatencyMs} ms
        </span>

        <span>{t.linesCount}:</span>
        <span style={{ color: '#f1f4f9' }}>{lineCount}</span>
      </div>
    </div>
  );
};
