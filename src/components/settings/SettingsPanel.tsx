import React, { useState } from 'react';
import { Sliders, RotateCcw } from 'lucide-react';
import { CodeShotSettings } from '../../types';
import { BackgroundPicker } from './BackgroundPicker';
import { WindowControlsSettings } from './WindowControlsSettings';
import { TypographySettings } from './TypographySettings';
import { ExportSettings } from './ExportSettings';
import { translations } from '../../lib/i18n/translations';
import './settingsStyles.css';

interface SettingsPanelProps {
  settings: CodeShotSettings;
  onUpdate: (partial: Partial<CodeShotSettings>) => void;
  onReset: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdate,
  onReset,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const t = translations[settings.locale].settings;

  const handleResetClick = () => {
    if (showConfirmReset) {
      onReset();
      setShowConfirmReset(false);
    } else {
      setShowConfirmReset(true);
      setTimeout(() => setShowConfirmReset(false), 3000);
    }
  };

  return (
    <aside className="settings-panel" aria-label="Appearance Inspector">
      <header className="settings-header">
        <div className="settings-title">
          <Sliders size={15} aria-hidden="true" />
          <span>{t.title}</span>
        </div>
      </header>

      <div className="settings-content">
        <BackgroundPicker settings={settings} onUpdate={onUpdate} />
        <WindowControlsSettings settings={settings} onUpdate={onUpdate} />
        <TypographySettings settings={settings} onUpdate={onUpdate} />
        <ExportSettings settings={settings} onUpdate={onUpdate} />
      </div>

      <footer className="settings-footer">
        <button
          type="button"
          className="btn btn-reset"
          onClick={handleResetClick}
          aria-label={t.resetSettings}
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>{showConfirmReset ? t.confirmReset : t.resetSettings}</span>
        </button>
      </footer>
    </aside>
  );
};
