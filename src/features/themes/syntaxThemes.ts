import { ThemeDefinition } from '../../types';

export const SYNTAX_THEMES: ThemeDefinition[] = [
  { id: 'one-dark-pro', name: 'One Dark Pro', type: 'dark', previewBg: '#282c34' },
  { id: 'github-dark', name: 'GitHub Dark', type: 'dark', previewBg: '#0d1117' },
  { id: 'dracula', name: 'Dracula', type: 'dark', previewBg: '#282a36' },
  { id: 'nord', name: 'Nord', type: 'dark', previewBg: '#2e3440' },
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha', type: 'dark', previewBg: '#1e1e2e' },
  { id: 'vitesse-dark', name: 'Vitesse Dark', type: 'dark', previewBg: '#121212' },
  { id: 'tokyo-night', name: 'Tokyo Night', type: 'dark', previewBg: '#1a1b26' },
  { id: 'rose-pine', name: 'Rosé Pine', type: 'dark', previewBg: '#191724' },
  { id: 'github-light', name: 'GitHub Light', type: 'light', previewBg: '#ffffff' },
];

export const DEFAULT_THEME = 'one-dark-pro';
