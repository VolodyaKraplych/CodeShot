import { describe, it, expect } from 'vitest';
import { generateExportFilename, formatScaleLabel } from './imageExporter';

describe('Image Exporter Utilities', () => {
  it('generates a clean sanitized PNG filename from the code filename', () => {
    expect(generateExportFilename('counter.ts')).toBe('codeshot-counter.png');
    expect(generateExportFilename('my test app.js')).toBe('codeshot-my-test-app.png');
    expect(generateExportFilename('pipeline.v2.py')).toBe('codeshot-pipeline.v2.png');
    expect(generateExportFilename('')).toBe('codeshot.png');
  });

  it('formats scale labels with descriptive quality tags', () => {
    expect(formatScaleLabel(1)).toBe('1x (Standard)');
    expect(formatScaleLabel(2)).toBe('2x (High Res)');
    expect(formatScaleLabel(3)).toBe('3x (Ultra)');
  });
});
