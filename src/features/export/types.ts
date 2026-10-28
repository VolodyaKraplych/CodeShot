export interface ExportOptions {
  scale: 1 | 2 | 3;
  filename: string;
}

export type ExportStatus = 'idle' | 'rendering' | 'downloading' | 'copying';
