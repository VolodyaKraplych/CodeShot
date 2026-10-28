import React from 'react';
import { BackgroundType, CodeShotSettings } from '../../types';
import { BACKGROUND_PRESETS } from '../../features/themes/backgroundPresets';
import { translations } from '../../lib/i18n/translations';

interface BackgroundPickerProps {
  settings: CodeShotSettings;
  onUpdate: (partial: Partial<CodeShotSettings>) => void;
}

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ settings, onUpdate }) => {
  const currentTab = settings.bgType;
  const isTransparent = settings.transparentBg || settings.bgType === 'transparent';
  const t = translations[settings.locale].settings;

  const handleTabChange = (type: BackgroundType) => {
    if (type === 'transparent') {
      onUpdate({ bgType: 'transparent', transparentBg: true });
    } else {
      onUpdate({ bgType: type, transparentBg: false });
    }
  };

  return (
    <div className="settings-section">
      <span className="section-label">{t.canvasBackground}</span>

      {/* Clean segmented control: Presets | Solid | Gradient | None */}
      <div className="bg-tabs" role="tablist" aria-label="Background Type Selection">
        <button
          type="button"
          role="tab"
          aria-selected={!isTransparent && currentTab === 'preset'}
          className={`bg-tab-btn ${!isTransparent && currentTab === 'preset' ? 'active' : ''}`}
          onClick={() => handleTabChange('preset')}
        >
          {t.presets}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isTransparent && currentTab === 'custom-solid'}
          className={`bg-tab-btn ${!isTransparent && currentTab === 'custom-solid' ? 'active' : ''}`}
          onClick={() => handleTabChange('custom-solid')}
        >
          {t.solid}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isTransparent && currentTab === 'custom-gradient'}
          className={`bg-tab-btn ${!isTransparent && currentTab === 'custom-gradient' ? 'active' : ''}`}
          onClick={() => handleTabChange('custom-gradient')}
        >
          {t.gradient}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isTransparent}
          className={`bg-tab-btn ${isTransparent ? 'active' : ''}`}
          onClick={() => handleTabChange('transparent')}
        >
          {t.none}
        </button>
      </div>

      {!isTransparent && currentTab === 'preset' && (
        <div className="bg-presets-grid" role="group" aria-label="Background Presets">
          {BACKGROUND_PRESETS.filter((p) => p.value !== 'transparent').map((preset) => {
            const isPresetActive =
              settings.background === preset.value && settings.bgType === 'preset';

            return (
              <button
                key={preset.id}
                type="button"
                className={`bg-preset-chip ${isPresetActive ? 'active' : ''}`}
                style={{ background: preset.value }}
                onClick={() =>
                  onUpdate({ background: preset.value, bgType: 'preset', transparentBg: false })
                }
                title={preset.name}
                aria-label={`Select ${preset.name} preset`}
              />
            );
          })}
        </div>
      )}

      {!isTransparent && currentTab === 'custom-solid' && (
        <div className="setting-row">
          <div className="custom-color-control">
            <input
              type="color"
              className="color-input-swatch"
              value={settings.customBgColor}
              onChange={(e) => onUpdate({ customBgColor: e.target.value, bgType: 'custom-solid' })}
              aria-label="Pick custom solid color"
            />
            <input
              type="text"
              className="text-input"
              value={settings.customBgColor}
              onChange={(e) => onUpdate({ customBgColor: e.target.value, bgType: 'custom-solid' })}
              style={{ width: '100px', fontFamily: 'var(--font-mono)' }}
              maxLength={7}
              aria-label="Hex color value"
            />
          </div>
        </div>
      )}

      {!isTransparent && currentTab === 'custom-gradient' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                {t.startColor}
              </label>
              <div className="custom-color-control">
                <input
                  type="color"
                  className="color-input-swatch"
                  value={settings.customGradientStart}
                  onChange={(e) =>
                    onUpdate({ customGradientStart: e.target.value, bgType: 'custom-gradient' })
                  }
                  aria-label="Gradient start color"
                />
                <input
                  type="text"
                  className="text-input"
                  value={settings.customGradientStart}
                  onChange={(e) =>
                    onUpdate({ customGradientStart: e.target.value, bgType: 'custom-gradient' })
                  }
                  style={{ width: '80px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
                  maxLength={7}
                  aria-label="Start color hex code"
                />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                {t.endColor}
              </label>
              <div className="custom-color-control">
                <input
                  type="color"
                  className="color-input-swatch"
                  value={settings.customGradientEnd}
                  onChange={(e) =>
                    onUpdate({ customGradientEnd: e.target.value, bgType: 'custom-gradient' })
                  }
                  aria-label="Gradient end color"
                />
                <input
                  type="text"
                  className="text-input"
                  value={settings.customGradientEnd}
                  onChange={(e) =>
                    onUpdate({ customGradientEnd: e.target.value, bgType: 'custom-gradient' })
                  }
                  style={{ width: '80px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
                  maxLength={7}
                  aria-label="End color hex code"
                />
              </div>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-row-inline">
              <label htmlFor="gradient-angle-slider" className="setting-label" style={{ fontSize: '12px' }}>
                {t.angle}
              </label>
              <span className="setting-value-badge">{settings.customGradientAngle}&deg;</span>
            </div>
            <input
              id="gradient-angle-slider"
              type="range"
              className="slider-input"
              min={0}
              max={360}
              step={5}
              value={settings.customGradientAngle}
              onChange={(e) =>
                onUpdate({ customGradientAngle: Number(e.target.value), bgType: 'custom-gradient' })
              }
              aria-label="Gradient angle slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};
