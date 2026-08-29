import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const origin = (process.argv[2] || 'https://legacy-app-rescue.sociobot.in').replace(/\/$/, '');
const evidence = resolve(process.argv[3] || '/work/.evidence/polish-1');
mkdirSync(evidence, { recursive: true });

const browser = await chromium.launch();
const results = [];
const routes = [
  ['/', 'Legacy App Rescue — record an Android app'],
  ['/?demo=1', 'Demo — Legacy App Rescue'],
  ['/demo', 'Demo — Legacy App Rescue'],
  ['/privacy', 'Privacy — Legacy App Rescue'],
  ['/terms', 'Terms — Legacy App Rescue']
];

for (const [path, expectedTitle] of routes) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).analyze();
  const facts = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    smallTargets: [...document.querySelectorAll('a,button,input,summary')].filter(element => {
      const box = element.getBoundingClientRect();
      return box.width < 44 || box.height < 44;
    }).map(element => (element.textContent || element.getAttribute('aria-label') || '').trim())
  }));
  const serious = axe.violations.filter(item => item.impact === 'serious' || item.impact === 'critical').map(item => item.id);
  const result = { path, status: response?.status(), ...facts, errors, serious };
  results.push(result);
  if (result.status !== 200 || result.title !== expectedTitle || result.h1 !== 1 || result.main !== 1 || result.overflow !== 0 || errors.length || serious.length || facts.smallTargets.length) {
    throw new Error(`Live route failed: ${JSON.stringify(result)}`);
  }
  if (path === '/') await page.screenshot({ path: `${evidence}/live-landing-mobile.png`, fullPage: true });
  if (path === '/?demo=1') await page.screenshot({ path: `${evidence}/live-demo-mobile.png`, fullPage: true });
  if (path === '/privacy') await page.screenshot({ path: `${evidence}/live-privacy-mobile.png`, fullPage: true });
  await context.close();
}

const demoContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const demo = await demoContext.newPage();
const demoRequests = [];
demo.on('request', request => demoRequests.push(request.url()));
await demo.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
const demoKeys = await demo.evaluate(() => Object.keys(localStorage));
await demo.getByRole('button', { name: 'Reset demo' }).click();
await demo.waitForLoadState('networkidle');
const requestsBeforeExit = [...demoRequests];
await demo.getByRole('link', { name: 'Start for real' }).click();
const keysAfterExit = await demo.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')));
if (demoKeys.join() !== 'demo:legacy-app-rescue:opened' || keysAfterExit.length || requestsBeforeExit.some(url => new URL(url).origin !== origin)) {
  throw new Error(`Live demo isolation failed: ${JSON.stringify({ demoKeys, keysAfterExit, requestsBeforeExit })}`);
}
await demoContext.close();

const missingContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const missing = await missingContext.newPage();
const missingErrors = [];
missing.on('pageerror', error => missingErrors.push(String(error)));
missing.on('console', message => {
  if (message.type() === 'error' && !/Failed to load resource: the server responded with a status of 404/.test(message.text())) missingErrors.push(message.text());
});
const missingResponse = await missing.goto(`${origin}/missing-specimen`, { waitUntil: 'networkidle' });
await missing.screenshot({ path: `${evidence}/live-404-desktop.png`, fullPage: true });
const missingAxe = await new AxeBuilder({ page: missing }).analyze();
const missingResult = {
  path: '/missing-specimen',
  status: missingResponse?.status(),
  title: await missing.title(),
  home: await missing.getByRole('link', { name: 'Return to the home page' }).getAttribute('href'),
  errors: missingErrors,
  serious: missingAxe.violations.filter(item => item.impact === 'serious' || item.impact === 'critical').map(item => item.id)
};
if (missingResult.status !== 404 || missingResult.title !== 'Page not found — Legacy App Rescue' || missingResult.home !== '/' || missingResult.errors.length || missingResult.serious.length) {
  throw new Error(`Live 404 failed: ${JSON.stringify(missingResult)}`);
}
results.push(missingResult);
await missingContext.close();

writeFileSync(`${evidence}/live-browser.json`, `${JSON.stringify({ origin, checkedAt: new Date().toISOString(), routes: results }, null, 2)}\n`);
await browser.close();
console.log(`Verified ${results.length} live routes, demo isolation, mobile targets, axe, console, and HTTP 404.`);
