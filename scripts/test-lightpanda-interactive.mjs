import puppeteer from 'puppeteer-core';

async function run() {
  console.log('Connecting to Lightpanda CDP...');
  const browser = await puppeteer.connect({
    browserWSEndpoint: 'ws://127.0.0.1:9222/',
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.shiki-line-number');

  console.log('1. Testing Language Switch to Rust...');
  // Select Rust in top navbar
  await page.select('.top-navbar select', 'rust');
  // Click Example snippet button in editor
  await page.evaluate(() => {
    const btn = document.querySelector('button[title="Example"]') || document.querySelector('button[aria-label="Example"]');
    btn?.click();
  });

  // Wait for highlighter to update with Rust code
  await page.waitForFunction(() => {
    const text = document.querySelector('.shiki-container')?.textContent || '';
    return text.includes('ColorPalette');
  });

  const rustLineNumbers = await page.$$eval('.shiki-line-number', (nodes) =>
    nodes.map((n) => n.textContent?.trim() || '')
  );
  console.log('Rust preview line count:', rustLineNumbers.length);
  console.log('Rust first 5 line numbers:', rustLineNumbers.slice(0, 5));
  if (rustLineNumbers[0] !== '1' || rustLineNumbers[1] !== '2') {
    throw new Error('Rust line numbers sequence invalid');
  }

  // Check Rust code lines for indentation
  const rustLines = await page.$$eval('.line', (nodes) =>
    nodes.map((n) => n.textContent || '')
  );
  const rustHasIndent = rustLines.some((l) => l.includes('    name: String'));
  console.log('Rust indentation ("    name: String") preserved:', rustHasIndent);
  if (!rustHasIndent) {
    throw new Error('Rust indentation missing in preview!');
  }

  console.log('2. Testing Transparent Canvas Background...');
  // Click "None" tab in Background section
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.bg-tabs button');
    tabs[3].click();
  });

  const isTransparent = await page.evaluate(() => {
    const frame = document.querySelector('.preview-export-frame');
    const viewport = document.querySelector('.preview-viewport');
    return (
      frame.style.background === 'transparent' &&
      viewport.classList.contains('is-transparent-bg')
    );
  });
  console.log('Canvas background set to transparent with viewport checkerboard:', isTransparent);
  if (!isTransparent) {
    throw new Error('Transparent background failed to apply!');
  }

  console.log('3. Testing 0px Padding...');
  await page.evaluate(() => {
    const paddingInput = document.getElementById('frame-padding-slider');
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(paddingInput, '0');
    paddingInput.dispatchEvent(new Event('input', { bubbles: true }));
    paddingInput.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const framePadding = await page.evaluate(() => {
    return document.querySelector('.preview-export-frame').style.padding;
  });
  console.log('Frame padding set to 0px:', framePadding === '0px');
  if (framePadding !== '0px') {
    throw new Error(`Expected 0px padding, got ${framePadding}`);
  }

  console.log('4. Testing Line Numbers Toggle...');
  // Toggle line numbers off
  await page.evaluate(() => {
    const toggle = document.getElementById('toggle-line-numbers');
    toggle.click();
  });

  const hasShowLineNumbersClass = await page.evaluate(() => {
    return document.querySelector('.code-window').classList.contains('show-line-numbers');
  });
  console.log('Code window toggled line numbers off:', !hasShowLineNumbersClass);
  if (hasShowLineNumbersClass) {
    throw new Error('Line numbers failed to toggle off!');
  }

  console.log('5. Testing Ukrainian Localization Switch...');
  // Click UA switch
  await page.evaluate(() => {
    const localeBtn = Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('EN') || b.textContent.includes('UA'));
    localeBtn?.click();
  });

  const ukrainianText = await page.evaluate(() => {
    return {
      editorTitle: document.querySelector('.editor-title span')?.textContent,
      previewBadge: document.querySelector('.preview-badge')?.textContent,
      exportBtnText: document.querySelector('.top-navbar .btn-primary span')?.textContent,
    };
  });
  console.log('Ukrainian text verification:', ukrainianText);
  if (ukrainianText.editorTitle !== 'Редактор' || ukrainianText.previewBadge !== 'Попередній перегляд') {
    throw new Error(`Ukrainian localization failed: ${JSON.stringify(ukrainianText)}`);
  }

  console.log('6. Testing Touchpad Pinch-to-Zoom & Pan...');
  // Dispatch a pinch-to-zoom wheel event (ctrlKey: true)
  await page.evaluate(() => {
    const viewport = document.querySelector('.preview-viewport');
    viewport.dispatchEvent(new WheelEvent('wheel', {
      ctrlKey: true,
      deltaY: -50,
      bubbles: true,
      cancelable: true,
    }));
  });

  const zoomText = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.preview-toolbar-right span')).find((s) =>
      s.textContent?.includes('%')
    )?.textContent;
  });
  console.log('Pinch-to-zoom updated zoom level:', zoomText);
  if (!zoomText || zoomText === '100%') {
    throw new Error(`Expected zoom level to change from 100%, got ${zoomText}`);
  }

  console.log('ALL LIGHTPANDA INTERACTIVE TESTS PASSED!');
  await page.close();
  await browser.disconnect();
}

run().catch((err) => {
  console.error('Interactive test failed:', err);
  process.exit(1);
});
