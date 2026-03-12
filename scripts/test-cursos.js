const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/cursos?ini=1&fin=2');
  console.log("Waiting for article...");
  try {
    await page.waitForSelector('article', { timeout: 5000 });
  } catch(e) {
    console.log("timeout waiting for article", e.message);
  }
  const html = await page.content();
  console.log("HTML snippets:", html.substring(0, 1000));
  const counts = await page.locator('article').count();
  console.log("Articles:", counts);
  await browser.close();
})();
