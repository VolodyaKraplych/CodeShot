export type Locale = 'en' | 'uk';

export interface Translations {
  navbar: {
    hideEditor: string;
    showEditor: string;
    hideSettings: string;
    showSettings: string;
    copyImage: string;
    copied: string;
    exportPng: string;
    exporting: string;
    languageLabel: string;
    uiLocale: string;
  };
  editor: {
    title: string;
    paste: string;
    copy: string;
    example: string;
    clear: string;
    history: string;
    line: string;
    lines: string;
    chars: string;
    wrapLines: string;
    historyTitle: string;
    restoreSnippet: string;
    noHistory: string;
    current: string;
  };
  preview: {
    livePreview: string;
    highlighting: string;
    zoomIn: string;
    zoomOut: string;
    resetZoom: string;
    filePlaceholder: string;
  };
  settings: {
    title: string;
    canvasBackground: string;
    presets: string;
    solid: string;
    gradient: string;
    none: string;
    startColor: string;
    endColor: string;
    angle: string;
    windowAndFrame: string;
    padding: string;
    windowRadius: string;
    elevationShadow: string;
    shadowNone: string;
    shadowSubtle: string;
    shadowMedium: string;
    shadowDeep: string;
    shadowGlow: string;
    windowButtons: string;
    showFileHeader: string;
    typographyAndCode: string;
    syntaxTheme: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    lineNumbers: string;
    exportResolution: string;
    imageScale: string;
    developerSection: string;
    debugMode: string;
    resetSettings: string;
    confirmReset: string;
  };
  toasts: {
    exportSuccess: string;
    copySuccess: string;
    copyUnsupported: string;
    exportError: string;
    copyError: string;
    snippetRestored: string;
    diagnosticsCopied: string;
  };
  debug: {
    title: string;
    canvasSize: string;
    exportSize: string;
    renderTime: string;
    linesCount: string;
    copyDiagnostics: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    navbar: {
      hideEditor: 'Hide code editor',
      showEditor: 'Show code editor',
      hideSettings: 'Hide appearance settings',
      showSettings: 'Show appearance settings',
      copyImage: 'Copy Image',
      copied: 'Copied!',
      exportPng: 'Export PNG',
      exporting: 'Exporting...',
      languageLabel: 'Current programming language',
      uiLocale: 'Switch to Ukrainian',
    },
    editor: {
      title: 'Editor',
      paste: 'Paste',
      copy: 'Copy',
      example: 'Example',
      clear: 'Clear',
      history: 'History',
      line: 'line',
      lines: 'lines',
      chars: 'chars',
      wrapLines: 'Toggle line wrapping',
      historyTitle: 'Recent Snippets History',
      restoreSnippet: 'Restore',
      noHistory: 'No saved snippets yet',
      current: 'Active',
    },
    preview: {
      livePreview: 'Live Preview',
      highlighting: 'Highlighting...',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      resetZoom: 'Reset zoom to 100%',
      filePlaceholder: 'Untitled',
    },
    settings: {
      title: 'Appearance',
      canvasBackground: 'Canvas Background',
      presets: 'Presets',
      solid: 'Solid',
      gradient: 'Gradient',
      none: 'None',
      startColor: 'Start Color',
      endColor: 'End Color',
      angle: 'Angle',
      windowAndFrame: 'Window & Frame',
      padding: 'Padding',
      windowRadius: 'Window Radius',
      elevationShadow: 'Elevation Shadow',
      shadowNone: 'None',
      shadowSubtle: 'Subtle',
      shadowMedium: 'Medium',
      shadowDeep: 'Deep',
      shadowGlow: 'Glow',
      windowButtons: 'Window Buttons',
      showFileHeader: 'Show File Header',
      typographyAndCode: 'Typography & Code',
      syntaxTheme: 'Syntax Theme',
      fontFamily: 'Font Family',
      fontSize: 'Font Size',
      lineHeight: 'Line Height',
      lineNumbers: 'Line Numbers',
      exportResolution: 'Export Resolution',
      imageScale: 'Image Scale Multiplier',
      developerSection: 'Developer & Debugging',
      debugMode: 'Debug HUD Overlay',
      resetSettings: 'Reset to Defaults',
      confirmReset: 'Confirm Reset Settings?',
    },
    toasts: {
      exportSuccess: 'Screenshot downloaded successfully',
      copySuccess: 'Image copied to clipboard',
      copyUnsupported: 'Clipboard write unsupported: downloaded PNG instead',
      exportError: 'Failed to export screenshot',
      copyError: 'Failed to copy image',
      snippetRestored: 'Snippet restored from history',
      diagnosticsCopied: 'Diagnostics copied to clipboard',
    },
    debug: {
      title: 'Debug Inspector',
      canvasSize: 'Canvas Render',
      exportSize: 'Export Size',
      renderTime: 'Highlight Time',
      linesCount: 'Total Lines',
      copyDiagnostics: 'Copy Diagnostics',
    },
  },
  uk: {
    navbar: {
      hideEditor: 'Приховати редактор',
      showEditor: 'Показати редактор',
      hideSettings: 'Приховати налаштування',
      showSettings: 'Показати налаштування',
      copyImage: 'Скопіювати',
      copied: 'Скопійовано!',
      exportPng: 'Експорт PNG',
      exporting: 'Експортування...',
      languageLabel: 'Мова програмування',
      uiLocale: 'Перемкнути на англійську',
    },
    editor: {
      title: 'Редактор',
      paste: 'Вставити',
      copy: 'Копіювати',
      example: 'Приклад',
      clear: 'Очистити',
      history: 'Історія',
      line: 'рядок',
      lines: 'рядків',
      chars: 'символів',
      wrapLines: 'Перенесення рядків',
      historyTitle: 'Історія останніх фрагментів',
      restoreSnippet: 'Відновити',
      noHistory: 'Немає збережених фрагментів',
      current: 'Поточний',
    },
    preview: {
      livePreview: 'Попередній перегляд',
      highlighting: 'Підсвічування...',
      zoomIn: 'Збільшити',
      zoomOut: 'Зменшити',
      resetZoom: 'Скинути масштаб до 100%',
      filePlaceholder: 'Без назви',
    },
    settings: {
      title: 'Зовнішній вигляд',
      canvasBackground: 'Фон полотна',
      presets: 'Пресети',
      solid: 'Суцільний',
      gradient: 'Градієнт',
      none: 'Без фону',
      startColor: 'Початковий колір',
      endColor: 'Кінцевий колір',
      angle: 'Кут',
      windowAndFrame: 'Вікно та рамка',
      padding: 'Відступ',
      windowRadius: 'Радіус вікна',
      elevationShadow: 'Тінь вікна',
      shadowNone: 'Немає',
      shadowSubtle: 'Легка',
      shadowMedium: 'Середня',
      shadowDeep: 'Глибока',
      shadowGlow: 'Сяйво',
      windowButtons: 'Кнопки вікна',
      showFileHeader: 'Заголовок файлу',
      typographyAndCode: 'Типографіка та код',
      syntaxTheme: 'Тема підсвічування',
      fontFamily: 'Шрифт',
      fontSize: 'Розмір шрифту',
      lineHeight: 'Висота рядка',
      lineNumbers: 'Номери рядків',
      exportResolution: 'Роздільна здатність',
      imageScale: 'Масштаб зображення',
      developerSection: 'Розробка та налагодження',
      debugMode: 'Панель налагодження',
      resetSettings: 'Скинути налаштування',
      confirmReset: 'Підтвердити скидання?',
    },
    toasts: {
      exportSuccess: 'Знімок екрана успішно завантажено',
      copySuccess: 'Зображення скопійовано в буфер обміну',
      copyUnsupported: 'Буфер обміну не підтримується: завантажено файл PNG',
      exportError: 'Не вдалося експортувати знімок',
      copyError: 'Не вдалося скопіювати зображення',
      snippetRestored: 'Фрагмент відновлено з історії',
      diagnosticsCopied: 'Діагностику скопійовано в буфер',
    },
    debug: {
      title: 'Інспектор налагодження',
      canvasSize: 'Розмір полотна',
      exportSize: 'Розмір експорту',
      renderTime: 'Час підсвічування',
      linesCount: 'Всього рядків',
      copyDiagnostics: 'Скопіювати дані',
    },
  },
};
