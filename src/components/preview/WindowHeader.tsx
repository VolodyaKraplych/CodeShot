import React from 'react';
import { WindowControlsStyle } from '../../types';

interface WindowHeaderProps {
  showControls: boolean;
  controlsStyle: WindowControlsStyle;
  showFilename: boolean;
  filename: string;
  onFilenameChange: (name: string) => void;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  showControls,
  controlsStyle,
  showFilename,
  filename,
  onFilenameChange,
}) => {
  if (!showControls && !showFilename) {
    return null;
  }

  const isWindows = showControls && controlsStyle === 'windows';
  const isMac = showControls && controlsStyle === 'mac';
  const isMinimal = showControls && controlsStyle === 'minimal';

  return (
    <div className="window-header" aria-label="Window Title Bar">
      {/* Left controls container (macOS and Minimal) */}
      <div className="window-controls-container">
        {isMac && (
          <>
            <span className="mac-dot mac-dot-close" title="Close" />
            <span className="mac-dot mac-dot-minimize" title="Minimize" />
            <span className="mac-dot mac-dot-maximize" title="Maximize" />
          </>
        )}

        {isMinimal && (
          <>
            <span className="minimal-dot" />
            <span className="minimal-dot" />
            <span className="minimal-dot" />
          </>
        )}

        {/* If Windows controls are active, add a left spacer to balance title centering */}
        {isWindows && <div style={{ width: '46px' }} />}
      </div>

      {/* Center Filename */}
      {showFilename ? (
        <input
          type="text"
          className="window-filename-input"
          value={filename}
          onChange={(e) => onFilenameChange(e.target.value)}
          placeholder="Untitled"
          aria-label="Code File Title"
          spellCheck={false}
        />
      ) : (
        <div style={{ flex: 1 }} />
      )}

      {/* Right container: Windows buttons on right, or right spacer for macOS/Minimal */}
      <div className="window-header-right" style={{ minWidth: '52px', display: 'flex', justifyContent: 'flex-end' }}>
        {isWindows ? (
          <div className="windows-controls-group" title="Windows Controls" aria-label="Windows Window Controls">
            {/* Minimize */}
            <span className="win-btn win-btn-minimize" title="Minimize">
              <svg width="10" height="1" viewBox="0 0 10 1" fill="none">
                <line x1="0" y1="0.5" x2="10" y2="0.5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </span>

            {/* Maximize / Restore */}
            <span className="win-btn win-btn-maximize" title="Maximize">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <rect x="0.5" y="0.5" width="8" height="8" stroke="currentColor" strokeWidth="1" />
              </svg>
            </span>

            {/* Close */}
            <span className="win-btn win-btn-close" title="Close">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M0.5 0.5L8.5 8.5M8.5 0.5L0.5 8.5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </span>
          </div>
        ) : (
          <div className="window-header-spacer" />
        )}
      </div>
    </div>
  );
};
