import React from 'react';
import {
  Code2,
  Download,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Loader2,
  Globe,
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../features/languages/languagePresets';
import type { Locale } from '../../lib/i18n/translations';
import { translations } from '../../lib/i18n/translations';
import './topNavbarStyles.css';

interface TopNavbarProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  locale: Locale;
  onToggleLocale: () => void;
  isEditorOpen: boolean;
  onToggleEditor: () => void;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
  onExport: () => void;
  onCopyImage: () => void;
  isExporting: boolean;
  isCopying: boolean;
  copySuccess: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  language,
  onLanguageChange,
  locale,
  onToggleLocale,
  isEditorOpen,
  onToggleEditor,
  isSettingsOpen,
  onToggleSettings,
  onExport,
  onCopyImage,
  isExporting,
  isCopying,
  copySuccess,
}) => {
  const t = translations[locale].navbar;

  return (
    <header className="top-navbar" aria-label="Main Application Toolbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          onClick={onToggleEditor}
          title={isEditorOpen ? t.hideEditor : t.showEditor}
          aria-label={isEditorOpen ? t.hideEditor : t.showEditor}
        >
          {isEditorOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>

        <div className="navbar-brand">
          <div className="brand-logo-mark" aria-hidden="true">
            <Code2 size={16} />
          </div>
          <span className="brand-text">CodeShot</span>
        </div>
      </div>

      <div className="navbar-controls">
        {/* Programming language selector */}
        <select
          className="select-input"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
          aria-label={t.languageLabel}
          style={{ height: '30px' }}
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.id} value={l.id} style={{ background: '#181c24', color: '#f1f4f9' }}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <div className="navbar-actions">
        {/* UI Locale Switcher (EN / UA) */}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onToggleLocale}
          title={t.uiLocale}
          aria-label={t.uiLocale}
          style={{ height: '30px', padding: '0 8px', fontSize: '12px', fontWeight: 600 }}
        >
          <Globe size={13} aria-hidden="true" />
          <span>{locale === 'uk' ? 'UA' : 'EN'}</span>
        </button>

        {/* Copy Image Button */}
        <button
          type="button"
          className="btn"
          onClick={onCopyImage}
          disabled={isCopying || isExporting}
          title={t.copyImage}
          aria-label={t.copyImage}
        >
          {isCopying ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : copySuccess ? (
            <Check size={14} color="#34d399" aria-hidden="true" />
          ) : (
            <Copy size={14} aria-hidden="true" />
          )}
          <span>{isCopying ? t.exporting : copySuccess ? t.copied : t.copyImage}</span>
        </button>

        {/* Export PNG Button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={onExport}
          disabled={isExporting || isCopying}
          title={t.exportPng}
          aria-label={t.exportPng}
        >
          {isExporting ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Download size={14} aria-hidden="true" />
          )}
          <span>{isExporting ? t.exporting : t.exportPng}</span>
        </button>

        <div className="navbar-divider" />

        <button
          type="button"
          className="btn btn-ghost btn-icon"
          onClick={onToggleSettings}
          title={isSettingsOpen ? t.hideSettings : t.showSettings}
          aria-label={isSettingsOpen ? t.hideSettings : t.showSettings}
        >
          {isSettingsOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        </button>
      </div>
    </header>
  );
};
