import React, { useMemo } from 'react';
import { CodeShotSettings, ShadowPreset } from '../../types';
import { WindowHeader } from './WindowHeader';

interface CodeWindowProps {
  highlightedHtml: string;
  themeBg: string;
  settings: CodeShotSettings;
  onFilenameChange: (name: string) => void;
}

export function getShadowStyle(preset: ShadowPreset): string {
  switch (preset) {
    case 'none':
      return 'none';
    case 'subtle':
      return '0 6px 20px rgba(0, 0, 0, 0.28)';
    case 'medium':
      return '0 14px 42px rgba(0, 0, 0, 0.48), 0 2px 6px rgba(0, 0, 0, 0.2)';
    case 'deep':
      return '0 24px 72px rgba(0, 0, 0, 0.68), 0 4px 12px rgba(0, 0, 0, 0.3)';
    case 'glow':
      return '0 0 32px rgba(59, 130, 246, 0.28), 0 16px 48px rgba(0, 0, 0, 0.55)';
    default:
      return '0 14px 42px rgba(0, 0, 0, 0.48)';
  }
}

export const CodeWindow: React.FC<CodeWindowProps> = ({
  highlightedHtml,
  themeBg,
  settings,
  onFilenameChange,
}) => {
  const shadow = useMemo(() => getShadowStyle(settings.shadowPreset), [settings.shadowPreset]);

  return (
    <article
      className={`code-window ${settings.showLineNumbers ? 'show-line-numbers' : ''}`}
      style={{
        borderRadius: `${settings.borderRadius}px`,
        boxShadow: shadow,
        backgroundColor: themeBg,
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <WindowHeader
        showControls={settings.showWindowControls}
        controlsStyle={settings.windowControlsStyle}
        showFilename={settings.showFilename}
        filename={settings.filename}
        onFilenameChange={onFilenameChange}
      />

      <div
        className="code-content-wrapper"
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineHeight,
          fontFamily: settings.fontFamily,
        }}
      >
        <div
          className="shiki-container"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
    </article>
  );
};
