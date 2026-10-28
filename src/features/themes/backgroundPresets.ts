import { BackgroundPreset } from '../../types';

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'transparent',
    name: 'Transparent (No Canvas)',
    type: 'solid',
    value: 'transparent',
    dark: true,
  },
  {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    dark: true,
  },
  {
    id: 'deep-charcoal',
    name: 'Deep Charcoal',
    type: 'solid',
    value: '#11141a',
    dark: true,
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    type: 'solid',
    value: '#090a0d',
    dark: true,
  },
  {
    id: 'steel-dusk',
    name: 'Steel Dusk',
    type: 'gradient',
    value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    dark: true,
  },
  {
    id: 'cyber-dusk',
    name: 'Cyber Dusk',
    type: 'gradient',
    value: 'linear-gradient(135deg, #1e1e38 0%, #3b284c 100%)',
    dark: true,
  },
  {
    id: 'ocean-trench',
    name: 'Ocean Trench',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)',
    dark: true,
  },
  {
    id: 'aurora-borealis',
    name: 'Northern Pine',
    type: 'gradient',
    value: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
    dark: true,
  },
  {
    id: 'velvet-night',
    name: 'Velvet Night',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2e1065 0%, #172554 100%)',
    dark: true,
  },
  {
    id: 'warm-amber',
    name: 'Warm Ember',
    type: 'gradient',
    value: 'linear-gradient(135deg, #451a03 0%, #1c1917 100%)',
    dark: true,
  },
  {
    id: 'clean-slate',
    name: 'Clean Slate',
    type: 'solid',
    value: '#1e293b',
    dark: true,
  },
  {
    id: 'graphite',
    name: 'Graphite',
    type: 'solid',
    value: '#27272a',
    dark: true,
  },
  {
    id: 'chalk-white',
    name: 'Chalk Light',
    type: 'solid',
    value: '#f1f5f9',
    dark: false,
  },
];

export const DEFAULT_BACKGROUND = BACKGROUND_PRESETS[0].value;
