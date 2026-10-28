import React from 'react';
import { CodeShotSettings, ShadowPreset, WindowControlsStyle } from '../../types';
import { translations } from '../../lib/i18n/translations';

interface WindowControlsSettingsProps {
  settings: CodeShotSettings;
  onUpdate: (partial: Partial<CodeShotSettings>) => void;
}

export const WindowControlsSettings: React.FC<WindowControlsSettingsProps> = ({
  settings,
  onUpdate,
}) => {
  const t = translations[settings.locale].settings;

  const shadowOptions: { id: ShadowPreset; label: string }[] = [
    { id: 'none', label: t.shadowNone },
    { id: 'subtle', label: t.shadowSubtle },
    { id: 'medium', label: t.shadowMedium },
    { id: 'deep', label: t.shadowDeep },
    { id: 'glow', label: t.shadowGlow },
  ];

  const controlStyles: { id: WindowControlsStyle; label: string }[] = [
    { id: 'mac', label: 'macOS' },
    { id: 'windows', label: 'Windows' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'none', label: t.none },
  ];

  return (
    <div className="settings-section">
      <span className="section-label">{t.windowAndFrame}</span>

      {/* Padding */}
      <div className="setting-row">
        <div className="setting-row-inline">
          <label htmlFor="frame-padding-slider" className="setting-label">{t.padding}</label>
          <span className="setting-value-badge">{settings.padding}px</span>
        </div>
        <input
          id="frame-padding-slider"
          type="range"
          className="slider-input"
          min={0}
          max={96}
          step={4}
          value={settings.padding}
          onChange={(e) => onUpdate({ padding: Number(e.target.value) })}
          aria-label="Frame padding in pixels"
        />
      </div>

      {/* Border Radius */}
      <div className="setting-row">
        <div className="setting-row-inline">
          <label htmlFor="window-radius-slider" className="setting-label">{t.windowRadius}</label>
          <span className="setting-value-badge">{settings.borderRadius}px</span>
        </div>
        <input
          id="window-radius-slider"
          type="range"
          className="slider-input"
          min={4}
          max={24}
          step={2}
          value={settings.borderRadius}
          onChange={(e) => onUpdate({ borderRadius: Number(e.target.value) })}
          aria-label="Window corner radius in pixels"
        />
      </div>

      {/* Shadow Preset */}
      <div className="setting-row">
        <label className="setting-label">{t.elevationShadow}</label>
        <div className="segmented-control" role="group" aria-label="Window shadow options">
          {shadowOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`segmented-btn ${settings.shadowPreset === opt.id ? 'active' : ''}`}
              onClick={() => onUpdate({ shadowPreset: opt.id })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Window Controls Style */}
      <div className="setting-row">
        <label className="setting-label">{t.windowButtons}</label>
        <div className="segmented-control" role="group" aria-label="Window control buttons style">
          {controlStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              className={`segmented-btn ${
                settings.showWindowControls && settings.windowControlsStyle === style.id
                  ? 'active'
                  : ''
              }`}
              onClick={() => {
                if (style.id === 'none') {
                  onUpdate({ showWindowControls: false, windowControlsStyle: 'none' });
                } else {
                  onUpdate({ showWindowControls: true, windowControlsStyle: style.id });
                }
              }}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filename Header Toggle & Input */}
      <div className="setting-row">
        <div className="setting-row-inline">
          <label htmlFor="toggle-filename" className="setting-label">{t.showFileHeader}</label>
          <label className="switch-control">
            <input
              id="toggle-filename"
              type="checkbox"
              checked={settings.showFilename}
              onChange={(e) => onUpdate({ showFilename: e.target.checked })}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {settings.showFilename && (
          <input
            type="text"
            className="text-input"
            value={settings.filename}
            onChange={(e) => onUpdate({ filename: e.target.value })}
            placeholder="e.g. index.ts"
            aria-label="Filename"
          />
        )}
      </div>
    </div>
  );
};
