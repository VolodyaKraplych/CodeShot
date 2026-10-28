import { toPng, toBlob } from 'html-to-image';
import { ExportOptions } from './types';

export function generateExportFilename(codeFilename: string): string {
  if (!codeFilename || !codeFilename.trim()) {
    return 'codeshot.png';
  }

  const nameWithoutExt = codeFilename.replace(/\.[^/.]+$/, '').trim();
  if (!nameWithoutExt) {
    return 'codeshot.png';
  }

  const sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '');

  return `codeshot-${sanitized}.png`;
}

export function formatScaleLabel(scale: 1 | 2 | 3): string {
  switch (scale) {
    case 1:
      return '1x (Standard)';
    case 2:
      return '2x (High Res)';
    case 3:
      return '3x (Ultra)';
    default:
      return `${scale}x`;
  }
}

export async function waitForFonts(): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore
    }
  }
}

export async function exportToPng(
  element: HTMLElement,
  options: ExportOptions
): Promise<void> {
  await waitForFonts();

  const dataUrl = await toPng(element, {
    pixelRatio: options.scale,
    cacheBust: true,
    filter: (node: Node) => {
      if (node instanceof HTMLElement && node.classList.contains('preview-loading-overlay')) {
        return false;
      }
      return true;
    },
  });

  const downloadFilename = generateExportFilename(options.filename);
  const link = document.createElement('a');
  link.download = downloadFilename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function copyToClipboard(
  element: HTMLElement,
  options: ExportOptions
): Promise<'copied' | 'unsupported'> {
  await waitForFonts();

  if (
    typeof navigator === 'undefined' ||
    !navigator.clipboard ||
    typeof window.ClipboardItem === 'undefined'
  ) {
    return 'unsupported';
  }

  const blob = await toBlob(element, {
    pixelRatio: options.scale,
    cacheBust: true,
    filter: (node: Node) => {
      if (node instanceof HTMLElement && node.classList.contains('preview-loading-overlay')) {
        return false;
      }
      return true;
    },
  });

  if (!blob) {
    throw new Error('Failed to create image blob');
  }

  try {
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return 'copied';
  } catch (err) {
    console.warn('Clipboard write failed:', err);
    return 'unsupported';
  }
}
