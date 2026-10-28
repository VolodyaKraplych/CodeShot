import puppeteer from 'puppeteer-core';

async function run() {
  console.log('Connecting to Lightpanda CDP...');
  const browser = await puppeteer.connect({
    browserWSEndpoint: 'ws://127.0.0.1:9222/',
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.cm-content');

  console.log('1. Verifying Editor Toolbar Buttons (No Overflow)...');
  const actionButtons = await page.$$eval('.editor-actions button', (btns) =>
    btns.map((b) => ({
      title: b.getAttribute('title') || b.getAttribute('aria-label') || '',
      width: b.offsetWidth,
      height: b.offsetHeight,
      classes: b.className,
    }))
  );
  console.log(`Found ${actionButtons.length} action buttons:`, actionButtons.map((b) => b.title));
  if (actionButtons.length < 5) {
    throw new Error('Missing action buttons in editor header!');
  }

  console.log('2. Verifying YAML Language & Autocomplete Support...');
  // Select YAML in Top Navbar
  await page.select('.top-navbar select', 'yaml');
  // Click Example snippet
  await page.evaluate(() => {
    const btn = document.querySelector('button[title="Example"]') || document.querySelector('button[title="Приклад"]');
    btn?.click();
  });

  await page.waitForFunction(() => {
    const text = document.querySelector('.cm-content')?.textContent || '';
    return text.includes('services:') || text.includes('version:');
  });

  const editorText = await page.evaluate(() => document.querySelector('.cm-content')?.textContent);
  console.log('Editor loaded YAML snippet:', editorText.includes('services:'));
  if (!editorText.includes('services:')) {
    throw new Error('YAML example snippet failed to load!');
  }

  console.log('3. Verifying Shiki Preview for YAML...');
  await page.waitForFunction(() => {
    const text = document.querySelector('.shiki-container')?.textContent || '';
    return text.includes('services:');
  });

  const yamlLines = await page.$$eval('.shiki-line-number', (nodes) => nodes.length);
  console.log('YAML Shiki lines rendered:', yamlLines);
  if (yamlLines === 0) {
    throw new Error('YAML Shiki preview failed to render lines!');
  }

  console.log('4. Verifying History Dropdown Placement (No left clipping)...');
  // Click History button
  await page.evaluate(() => {
    const historyBtn = document.querySelector('button[title*="History"]') || document.querySelector('button[title*="Історія"]');
    historyBtn?.click();
  });

  await page.waitForSelector('.history-dropdown-menu');
  const dropdownLeft = await page.evaluate(() => {
    const menu = document.querySelector('.history-dropdown-menu');
    const rect = menu?.getBoundingClientRect();
    return {
      left: rect?.left,
      width: rect?.width,
      right: rect?.right,
    };
  });
  console.log('History dropdown rect:', dropdownLeft);
  if (dropdownLeft.left < 0) {
    throw new Error(`History dropdown is clipped on the left! left: ${dropdownLeft.left}`);
  }

  console.log('5. Verifying Dedicated User Locale Persistence in localStorage...');
  // Click locale toggle in navbar
  await page.evaluate(() => {
    const localeBtn = Array.from(document.querySelectorAll('header button')).find(
      (b) => b.textContent?.includes('EN') || b.textContent?.includes('UA')
    );
    localeBtn?.click();
  });

  const storedLocale = await page.evaluate(() => {
    return localStorage.getItem('codeshot_locale_v1');
  });
  console.log('Stored locale in localStorage after toggle:', storedLocale);
  if (storedLocale !== 'uk') {
    throw new Error(`Expected locale 'uk' in localStorage, got ${storedLocale}`);
  }

  console.log('ALL EDITOR POLISH TESTS PASSED SUCCESSFULLY!');
  await page.close();
  await browser.disconnect();
}

run().catch((err) => {
  console.error('Editor polish test failed:', err);
  process.exit(1);
});
