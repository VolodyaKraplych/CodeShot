import { describe, it, expect } from 'vitest';
import { highlightCode } from './shikiEngine';
import { copyToClipboard } from '../export/imageExporter';

describe('Edge Cases and Review Focus Items', () => {
  it('handles empty code input without crashing or returning empty string', async () => {
    const html = await highlightCode('', 'typescript', 'one-dark-pro');
    expect(html).toBeDefined();
    expect(html.length).toBeGreaterThan(0);
    expect(html).toMatch(/class="[^"]*line/);
  });

  it('handles whitespace-only code input gracefully', async () => {
    const html = await highlightCode('   \n\n   ', 'python', 'github-dark');
    expect(html).toBeDefined();
    expect(html).toMatch(/class="[^"]*line/);
  });

  it('handles massive code snippet without crashing', async () => {
    const lines = Array.from({ length: 500 }, (_, i) => `const variable_${i} = ${i} * 2;`);
    const massiveCode = lines.join('\n');
    const html = await highlightCode(massiveCode, 'javascript', 'nord');

    expect(html).toBeDefined();
    expect(html).toContain('variable_499');
  });

  it('handles wide lines without breaking syntax tokenization', async () => {
    const wideLine = 'const longString = "' + 'a'.repeat(800) + '";';
    const html = await highlightCode(wideLine, 'typescript', 'dracula');

    expect(html).toBeDefined();
    expect(html).toContain('longString');
  });

  it('returns "unsupported" when clipboard API is unavailable', async () => {
    const dummyElement = document.createElement('div');
    dummyElement.textContent = 'dummy';

    // In jsdom environment, window.ClipboardItem is undefined by default
    const result = await copyToClipboard(dummyElement, { scale: 1, filename: 'test.ts' });
    expect(result).toBe('unsupported');
  });
});
