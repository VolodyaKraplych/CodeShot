import React from 'react';
import { CodeShotSettings } from '../../types';
import { SYNTAX_THEMES } from '../../features/themes/syntaxThemes';
import { translations } from '../../lib/i18n/translations';

interface TypographySettingsProps {
  settings: CodeShotSettings;
  onUpdate: (partial: Partial<CodeShotSettings>) => void;
}

export const TypographySettings: React.FC<TypographySettingsProps> = ({
  settings,
  onUpdate,
}) => {
  const t = translations[settings.locale].settings;

  const fontFamilies = [
    { id: "'JetBrains Mono', monospace", label: 'JetBrains Mono' },
    { id: "'Fira Code', monospace", label: 'Fira Code' },
    { id: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", label: 'System Monospace' },
    { id: "'Courier New', Courier, monospace", label: 'Courier' },
  ];

  return (
    <div className="settings-section">
      <span className="section-label">{t.typographyAndCode}</span>

      {/* Syntax Theme */}
      <div className="setting-row">
        <label htmlFor="syntax-theme-select" className="setting-label">{t.syntaxTheme}</label>
        <select
          id="syntax-theme-select"
          className="select-input"
          value={settings.theme}
          onChange={(e) => onUpdate({ theme: e.target.value })}
        >
          {SYNTAX_THEMES.map((th) => (
            <option key={th.id} value={th.id} style={{ background: '#181c24', color: '#f1f4f9' }}>
              {th.name} ({th.type})
            </option>
          ))}
        </select>
      </div>

      {/* Font Family */}
      <div className="setting-row">
        <label htmlFor="font-family-select" className="setting-label">{t.fontFamily}</label>
        <select
          id="font-family-select"
          className="select-input"
          value={settings.fontFamily}
          onChange={(e) => onUpdate({ fontFamily: e.target.value })}
        >
          {fontFamilies.map((f) => (
            <option key={f.id} value={f.id} style={{ background: '#181c24', color: '#f1f4f9' }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="setting-row">
        <div className="setting-row-inline">
          <label htmlFor="font-size-slider" className="setting-label">{t.fontSize}</label>
          <span className="setting-value-badge">{settings.fontSize}px</span>
        </div>
        <input
          id="font-size-slider"
          type="range"
          className="slider-input"
          min={12}
          max={22}
          step={1}
          value={settings.fontSize}
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          aria-label="Font size in pixels"
        />
      </div>

      {/* Line Height */}
      <div className="setting-row">
        <div className="setting-row-inline">
          <label htmlFor="line-height-slider" className="setting-label">{t.lineHeight}</label>
          <span className="setting-value-badge">{settings.lineHeight.toFixed(1)}</span>
        </div>
        <input
          id="line-height-slider"
          type="range"
          className="slider-input"
          min={1.2}
          max={2.2}
          step={0.1}
          value={settings.lineHeight}
          onChange={(e) => onUpdate({ lineHeight: Number(e.target.value) })}
          aria-label="Line height ratio"
        />
      </div>

      {/* Line Numbers Toggle */}
      <div className="setting-row-inline">
        <label htmlFor="toggle-line-numbers" className="setting-label">{t.lineNumbers}</label>
        <label className="switch-control">
          <input
            id="toggle-line-numbers"
            type="checkbox"
            checked={settings.showLineNumbers}
            onChange={(e) => onUpdate({ showLineNumbers: e.target.checked })}
          />
          <span className="switch-slider" />
        </label>
      </div>
    </div>
  );
};
