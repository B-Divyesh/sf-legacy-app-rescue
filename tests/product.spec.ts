import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repo = process.cwd();

function demoManifest() {
  const output = execFileSync('cargo', ['run', '--quiet', '--', '--json', 'demo'], { cwd: repo, encoding: 'utf8' });
  return JSON.parse(output);
}

test('@claim:manifest-record records the complete APK evidence', async () => {
  const manifest = demoManifest();
  const apk = manifest.apks[0];
  expect(apk.package).toBe('in.sociobot.orchardnotes');
  expect(apk.sha256).toMatch(/^[a-f0-9]{64}$/);
  expect(apk.signers).toHaveLength(1);
  expect(apk.min_sdk).toBe(21);
  expect(apk.target_sdk).toBe(28);
  expect(apk.native_abis).toEqual(['arm64-v8a']);
});

test('@claim:compatibility-verdict checks SDK and CPU needs', async () => {
  const manifest = demoManifest();
  expect(manifest.device.sdk).toBe(33);
  expect(manifest.device.abis).toContain('arm64-v8a');
  expect(manifest.compatibility[0]).toMatchObject({ verdict: 'compatible' });
  expect(manifest.compatibility[0].reasons[0]).toContain('requirements match');
});

test('@claim:demo-sandbox opens sample data without real storage', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Orchard Notes 1.7.0' })).toBeVisible();
  await expect(page.getByText('in.sociobot.orchardnotes')).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toEqual(['demo:legacy-app-rescue:opened']);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Orchard Notes 1.7.0')).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual([]);
});

test('@claim:local-private demo scan and web sandbox make no external request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/demo');
  await expect(page.getByText('Orchard Notes 1.7.0')).toBeVisible();
  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  const result = spawnSync('cargo', ['run', '--quiet', '--', '--json', 'demo'], {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, HTTP_PROXY: 'http://127.0.0.1:1', HTTPS_PROXY: 'http://127.0.0.1:1' }
  });
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout).apks).toHaveLength(1);
});

test('@claim:field-kit batch scan and permitted data export work', async () => {
  const root = mkdtempSync(join(tmpdir(), 'rescue-field-kit-'));
  const manifestPath = join(root, 'demo-manifest.json');
  execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--output', manifestPath], { cwd: repo });
  const apk = join(root, 'orchard-notes-1.7.apk');
  const fakeBin = join(root, 'bin');
  execFileSync('mkdir', ['-p', fakeBin]);
  const adb = join(fakeBin, 'adb');
  writeFileSync(adb, `#!/bin/sh
if [ "$1" = "version" ]; then echo "Android Debug Bridge 1.0"; exit 0; fi
if [ "$1" = "devices" ]; then printf "List of devices attached\\nFIELD123\\tdevice\\n"; exit 0; fi
if [ "$1" = "-s" ]; then shift 2; fi
if [ "$1 $2 $3" = "shell getprop ro.product.manufacturer" ]; then echo "Sample"; exit 0; fi
if [ "$1 $2 $3" = "shell getprop ro.product.model" ]; then echo "Archive Phone"; exit 0; fi
if [ "$1 $2 $3" = "shell getprop ro.build.version.release" ]; then echo "13"; exit 0; fi
if [ "$1 $2 $3" = "shell getprop ro.build.version.sdk" ]; then echo "33"; exit 0; fi
if [ "$1 $2 $3" = "shell getprop ro.product.cpu.abilist" ]; then echo "arm64-v8a,armeabi-v7a"; exit 0; fi
if [ "$1 $2 $3 $4" = "shell pm list packages" ]; then echo "package:in.sociobot.orchardnotes"; exit 0; fi
if [ "$1 $2 $3" = "exec-out run-as in.sociobot.orchardnotes" ]; then printf "sample-private-app-data"; exit 0; fi
echo "unexpected adb call: $*" >&2; exit 1
`);
  chmodSync(adb, 0o755);
  const output = join(root, 'preservation-manifest.json');
  execFileSync('cargo', ['run', '--quiet', '--', 'scan', apk, apk, '--device', '--export-data', 'in.sociobot.orchardnotes', '--output', output], {
    cwd: repo,
    env: { ...process.env, PATH: `${fakeBin}:${process.env.PATH}`, LEGACY_RESCUE_LICENSE: 'sandbox-license' }
  });
  const result = JSON.parse(readFileSync(output, 'utf8'));
  expect(result.apks).toHaveLength(2);
  expect(result.compatibility.every((item: { verdict: string }) => item.verdict === 'compatible')).toBe(true);
  expect(result.data_exports).toHaveLength(1);
  expect(result.data_exports[0].method).toBe('adb run-as + tar');
  expect(existsSync(result.data_exports[0].path)).toBe(true);
});

test('@claim:platform-builds defines releases for three operating systems', async () => {
  const workflow = readFileSync(join(repo, '.github/workflows/release.yml'), 'utf8');
  expect(workflow).toContain('ubuntu-latest');
  expect(workflow).toContain('windows-latest');
  expect(workflow).toContain('macos-latest');
  expect(workflow).toContain('SHA256SUMS');
  expect(workflow).toContain('latest.json');
  expect(readFileSync(join(repo, 'site/public/install.sh'), 'utf8')).toContain('Checksum did not match');
});

test('regression: deployed asset route has a one-year immutable cache policy', async () => {
  const config = JSON.parse(readFileSync(join(repo, 'dist/site/staticwebapp.config.json'), 'utf8')) as {
    routes?: Array<{ route: string; headers?: Record<string, string> }>;
  };
  const assetRoute = config.routes?.find(route => route.route === '/assets/*');
  expect(assetRoute?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');

  const assets = readdirSync(join(repo, 'dist/site/assets'));
  expect(assets.some(name => /^app-[A-Za-z0-9_-]+\.js$/.test(name))).toBe(true);
  expect(assets.some(name => /^index-[A-Za-z0-9_-]+\.css$/.test(name))).toBe(true);
  expect(assets).toContain('field-guide-hero.webp');
});

test('@claim:binary-manifest reads Android binary XML', async () => {
  const result = spawnSync('cargo', ['test', 'parses_binary_manifest'], { cwd: repo, encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout).toContain('1 passed');
});

test('@claim:paid-license sends the license only to Sociobot', async ({ page }) => {
  let verifyUrl = '';
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, body: '{}' }));
  await page.route('https://api.sociobot.in/**', route => {
    verifyUrl = route.request().url();
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true,"reason":"ok"}' });
  });
  await page.goto('/?license=sample-token');
  await expect.poll(() => verifyUrl).toContain('/products/legacy-app-rescue/verify?license=sample-token');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:legacy-app-rescue'))).toBe('sample-token');
  expect(page.url()).not.toContain('license=');
  await expect(page.getByRole('link', { name: 'Buy Field Kit for $19' })).toHaveAttribute('href', /api\.sociobot\.in\/api\/v1\/products\/legacy-app-rescue\/checkout/);
});

for (const path of ['/', '/demo', '/privacy', '/terms']) {
  test(`accessibility smoke ${path}`, async ({ page }) => {
    if (path === '/') await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, body: '{}' }));
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  });
}

test('mobile layout and keyboard path', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('unknown routes show a real way home', async ({ page }) => {
  await page.goto('/missing-specimen');
  await expect(page).toHaveTitle('Page not found — Legacy App Rescue');
  await expect(page.getByRole('heading', { name: 'This specimen is missing' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to the field guide' })).toHaveAttribute('href', '/');
});
