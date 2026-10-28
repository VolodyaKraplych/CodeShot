import puppeteer from 'puppeteer-core';

async function run() {
  console.log('Connecting to Lightpanda CDP on port 9222...');
  const browser = await puppeteer.connect({
    browserWSEndpoint: 'ws://127.0.0.1:9222/',
  });

  console.log('Opening page...');
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:4173...');
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });

  // Wait for Shiki syntax highlighter
  console.log('Waiting for .shiki-line-number...');
  await page.waitForSelector('.shiki-line-number', { timeout: 10000 });

  // Verify line numbers in preview
  const lineNumbers = await page.$$eval('.shiki-line-number', (nodes) =>
    nodes.map((n) => n.textContent?.trim() || '')
  );
  console.log('Preview line numbers count:', lineNumbers.length);
  console.log('Preview first 5 line numbers:', lineNumbers.slice(0, 5));

  if (lineNumbers.length === 0) {
    throw new Error('No line numbers found in preview!');
  }
  if (lineNumbers[0] !== '1' || lineNumbers[1] !== '2') {
    throw new Error(`Line numbers sequence is wrong: ${JSON.stringify(lineNumbers.slice(0, 5))}`);
  }

  // Verify indentation in preview code
  const codeLines = await page.$$eval('.line', (nodes) =>
    nodes.map((n) => n.textContent || '')
  );
  console.log('Line 1 text:', codeLines[0]);
  console.log('Line 2 text:', codeLines[1]);

  // Check if indent spaces are present on line 2 (padding: number;)
  const hasIndent = codeLines.some((line) => line.includes('  padding'));
  console.log('Preview code preserves indentation spaces ("  padding"):', hasIndent);
  if (!hasIndent) {
    throw new Error('Indentation spaces are missing from preview lines!');
  }

  // Verify CodeMirror editor syntax highlighting
  const highlightedTokens = await page.$$eval(
    '.cm-editor .cm-line span[class]',
    (nodes) => nodes.length
  );
  console.log('CodeMirror highlighted tokens count:', highlightedTokens);
  if (highlightedTokens === 0) {
    throw new Error('CodeMirror editor has no syntax-highlighted tokens!');
  }

  // Verify no duplicate theme dropdown in top navbar
  const navbarSelects = await page.$$eval(
    '.top-navbar select',
    (nodes) => nodes.map((n) => n.getAttribute('aria-label'))
  );
  console.log('Top Navbar selects:', navbarSelects);
  if (navbarSelects.length > 1) {
    throw new Error(`Top navbar has duplicate selects: ${JSON.stringify(navbarSelects)}`);
  }

  console.log('ALL LIGHTPANDA TESTS PASSED SUCCESSFULLY!');
  await page.close();
  await browser.disconnect();
}

run().catch((err) => {
  console.error('Lightpanda test failed:', err);
  process.exit(1);
});
