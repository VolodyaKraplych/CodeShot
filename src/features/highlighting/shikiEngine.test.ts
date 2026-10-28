import { describe, it, expect } from 'vitest';
import { highlightCode, getThemeBackgroundColor } from './shikiEngine';

describe('Shiki Highlighting Engine', () => {
  it('highlights TypeScript code into HTML spans', async () => {
    const code = 'const greeting: string = "hello";';
    const html = await highlightCode(code, 'typescript', 'one-dark-pro');

    expect(html).toContain('greeting');
    expect(html).toContain('style="color:');
    expect(html).toMatch(/<span class="[^"]*line/);
  });

  it('highlights Rust code with matching syntax tokens', async () => {
    const code = 'fn main() { println!("CodeShot"); }';
    const html = await highlightCode(code, 'rust', 'dracula');

    expect(html).toContain('println');
    expect(html).toContain('CodeShot');
  });

  it('safely escapes HTML tags in code snippets', async () => {
    const malicious = '<script>alert("xss")</script>';
    const html = await highlightCode(malicious, 'html', 'nord');

    expect(html).not.toContain('<script>alert');
    expect(html).toMatch(/(&#x3C;|&lt;)script/);
  });

  it('handles empty code string gracefully', async () => {
    const html = await highlightCode('', 'javascript', 'one-dark-pro');
    expect(html).toBeDefined();
    expect(html).toMatch(/<span class="[^"]*line/);
  });

  it('provides the background color for a given theme', async () => {
    const bg = await getThemeBackgroundColor('one-dark-pro');
    expect(bg.toLowerCase()).toBe('#282c34');
  });
});
