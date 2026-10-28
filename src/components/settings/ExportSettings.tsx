import React from 'react';
import { CodeShotSettings } from '../../types';
import { translations } from '../../lib/i18n/translations';

interface ExportSettingsProps {
  settings: CodeShotSettings;
  onUpdate: (partial: Partial<CodeShotSettings>) => void;
}

export const ExportSettings: React.FC<ExportSettingsProps> = ({ settings, onUpdate }) => {
  const scaleOptions: (1 | 2 | 3)[] = [1, 2, 3];
  const t = translations[settings.locale].settings;

  return (
    <>
      <div className="settings-section">
        <span className="section-label">{t.exportResolution}</span>

        <div className="setting-row">
          <label className="setting-label">{t.imageScale}</label>
          <div className="segmented-control" role="group" aria-label="Export resolution scale">
            {scaleOptions.map((scale) => (
              <button
                key={scale}
                type="button"
                className={`segmented-btn ${settings.exportScale === scale ? 'active' : ''}`}
                onClick={() => onUpdate({ exportScale: scale })}
                title={`${scale}x Resolution`}
              >
                {scale}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <span className="section-label">{t.developerSection}</span>

        <div className="setting-row-inline">
          <div>
            <label htmlFor="toggle-debug-mode" className="setting-label" style={{ display: 'block' }}>
              {t.debugMode}
            </label>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ctrl+Shift+D</span>
          </div>
          <label className="switch-control">
            <input
              id="toggle-debug-mode"
              type="checkbox"
              checked={settings.debugMode}
              onChange={(e) => onUpdate({ debugMode: e.target.checked })}
              aria-label="Toggle Debug HUD Overlay"
            />
            <span className="switch-slider" />
          </label>
        </div>
      </div>
    </>
  );
};
