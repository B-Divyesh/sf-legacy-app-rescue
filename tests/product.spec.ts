import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
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
  expect(manifest.device.installed_user_packages).toEqual(['in.sociobot.orchardnotes']);
});

test('@claim:compatibility-verdict checks SDK and CPU needs', async () => {
  const manifest = demoManifest();
  expect(manifest.device.sdk).toBe(33);
  expect(manifest.device.abis).toContain('arm64-v8a');
  expect(manifest.compatibility[0]).toMatchObject({ verdict: 'compatible' });
  expect(manifest.compatibility[0].reasons[0]).toContain('requirements match');
});

test('@claim:demo-sandbox opens sample data without real storage', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Legacy App Rescue');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Orchard Notes 1.7.0' })).toBeVisible();
  await expect(page.getByText('in.sociobot.orchardnotes')).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toEqual(['demo:legacy-app-rescue:opened']);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Orchard Notes 1.7.0')).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual([]);
  expect(new URL(page.url()).search).toBe('');
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

test('@claim:field-kit rejects arbitrary tokens and keeps permitted exports private', async () => {
  const root = mkdtempSync(join(tmpdir(), 'rescue-field-kit-'));
  const manifestPath = join(root, 'demo-manifest.json');
  execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--output', manifestPath], { cwd: repo });
  const apk = join(root, 'orchard-notes-1.7.apk');
  const output = join(root, 'preservation-manifest.json');
  execFileSync('cargo', ['build', '--release', '--locked'], { cwd: repo });
  const bypass = spawnSync(join(repo, 'target/release/rescue'), ['scan', apk, apk, '--output', output], {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, LEGACY_RESCUE_LICENSE: 'not-a-real-license' }
  });
  expect(bypass.status).toBe(1);
  expect(bypass.stderr).toContain('batch scans and app-data export need the $19 Field Kit');
  expect(existsSync(output)).toBe(false);
  const privateExport = spawnSync('cargo', ['test', 'app_data_export_is_private_and_cleans_up_on_refusal'], { cwd: repo, encoding: 'utf8' });
  expect(privateExport.status, privateExport.stderr).toBe(0);
});

test('@claim:platform-builds defines releases for three operating systems and current package-manager paths', async () => {
  const workflow = readFileSync(join(repo, '.github/workflows/release.yml'), 'utf8');
  expect(workflow).toContain('ubuntu-latest');
  expect(workflow).toContain('windows-latest');
  expect(workflow).toContain('macos-latest');
  expect(workflow).toContain('SHA256SUMS');
  expect(workflow).toContain('latest.json');
  expect(workflow).toContain('Publish package manifests in the product repository');
  expect(workflow).toContain("dnf --installroot=\"$RPM_ROOT\"");
  expect(workflow).toContain("upgrade -y \"$PWD/package/rescue-linux-x86_64.rpm\"");
  expect(workflow).toContain('releases/download/v0.1.1/rescue-linux-x86_64.rpm');
  expect(workflow).toContain('= "0.1.0-1"');
  expect(workflow).toContain("rpm -qp package/rescue-linux-x86_64.rpm");
  expect(workflow).toContain('dpkg-deb -f package/rescue-linux-x86_64.deb Version');
  expect(workflow).toContain('pkgutil --expand');
  expect(readFileSync(join(repo, 'site/public/install.sh'), 'utf8')).toContain('Checksum did not match');
  const packageRoot = mkdtempSync(join(tmpdir(), 'rescue-package-manifests-'));
  const releaseRoot = join(packageRoot, 'release');
  mkdirSync(releaseRoot);
  for (const filename of [
    'rescue-linux-x86_64.tar.gz',
    'rescue-macos-arm64.tar.gz',
    'rescue-macos-x86_64.tar.gz',
    'rescue-windows-x86_64.zip'
  ]) writeFileSync(join(releaseRoot, filename), filename);
  execFileSync('node', ['scripts/release-manifest.mjs', releaseRoot, 'v0.1.2', 'B-Divyesh/sf-legacy-app-rescue'], { cwd: repo });
  mkdirSync(join(packageRoot, 'Formula'));
  mkdirSync(join(packageRoot, 'bucket'));
  mkdirSync(join(packageRoot, 'scoop-bucket'));
  mkdirSync(join(packageRoot, 'winget'));
  writeFileSync(join(packageRoot, 'Formula/legacy-app-rescue.rb'), readFileSync(join(releaseRoot, 'legacy-app-rescue.rb')));
  writeFileSync(join(packageRoot, 'bucket/legacy-app-rescue.json'), readFileSync(join(releaseRoot, 'legacy-app-rescue-scoop.json')));
  writeFileSync(join(packageRoot, 'scoop-bucket/legacy-app-rescue.json'), readFileSync(join(releaseRoot, 'legacy-app-rescue-scoop.json')));
  writeFileSync(join(packageRoot, 'winget/B-Divyesh.LegacyAppRescue.yaml'), readFileSync(join(releaseRoot, 'B-Divyesh.LegacyAppRescue.yaml')));
  const { verifyRepositoryPackageManifests } = await import('../scripts/verify-package-managers.mjs');
  expect(verifyRepositoryPackageManifests({
    version: '0.1.2',
    hashes: Object.fromEntries([
      'rescue-linux-x86_64.tar.gz',
      'rescue-macos-arm64.tar.gz',
      'rescue-macos-x86_64.tar.gz',
      'rescue-windows-x86_64.zip'
    ].map(filename => [filename, createHash('sha256').update(filename).digest('hex')])),
    directory: packageRoot
  })).toBe('0.1.2');
});

test('regression: release versions come from Cargo and RPM upgrades are enforced', async () => {
  const cargo = readFileSync(join(repo, 'Cargo.toml'), 'utf8');
  const cargoVersion = cargo.match(/^version = "([^"]+)"$/m)?.[1];
  const npmVersion = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8')).version;
  const nfpm = readFileSync(join(repo, 'packaging/nfpm.yaml'), 'utf8');
  const workflow = readFileSync(join(repo, '.github/workflows/release.yml'), 'utf8');
  expect(cargoVersion).toBe('0.1.3');
  expect(npmVersion).toBe(cargoVersion);
  expect(nfpm).toContain('version: ${PACKAGE_VERSION}');
  expect(workflow).toContain(`default: v${cargoVersion}`);
  expect(workflow).toContain('test "$RELEASE_TAG" = "v$PACKAGE_VERSION"');
  expect(workflow).toContain('PACKAGE_VERSION="$PACKAGE_VERSION" nfpm package');
  expect(readFileSync(join(repo, 'CHANGELOG.md'), 'utf8')).toContain(`## ${cargoVersion} —`);
  expect(readFileSync(join(repo, 'scripts/release-manifest.mjs'), 'utf8')).not.toContain("inputTag || 'v0.1.0'");
});

test('regression: the landing job and responsive art render before JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.75 });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Record your Android app before it disappears' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  const hero = page.locator('.hero-plate');
  await expect(hero).toHaveAttribute('srcset', /field-guide-hero-800\.webp 800w/);
  expect(await hero.evaluate((image: HTMLImageElement) => new URL(image.currentSrc).pathname)).toBe('/assets/field-guide-hero-800.webp');
  await context.close();
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
  expect(assets).toContain('field-guide-hero-800.webp');
});

test('@claim:binary-manifest reads Android binary XML', async () => {
  const result = spawnSync('cargo', ['test', 'parses_binary_manifest'], { cwd: repo, encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout).toContain('1 passed');
});

test('regression: JSON mode covers successful license status and removal', async () => {
  const configHome = mkdtempSync(join(tmpdir(), 'rescue-license-json-'));
  const env = { ...process.env, XDG_CONFIG_HOME: configHome };
  const status = execFileSync('cargo', ['run', '--quiet', '--', '--json', 'license', 'status'], { cwd: repo, encoding: 'utf8', env });
  expect(JSON.parse(status)).toEqual({ license: 'not active' });
  const remove = execFileSync('cargo', ['run', '--quiet', '--', '--json', 'license', 'remove'], { cwd: repo, encoding: 'utf8', env });
  expect(JSON.parse(remove)).toEqual({ license: 'removed' });
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

test('regression: checkout rejects the reported 404 and accepts only a Dodo 303 without Retry-After', async () => {
  const { assertCheckoutResponse } = await import('../scripts/verify-billing.mjs');
  expect(() => assertCheckoutResponse(new Response(null, { status: 404 }))).toThrow('Expected Sociobot checkout to return 303, received 404.');
  expect(() => assertCheckoutResponse(new Response(null, {
    status: 303,
    headers: { location: 'https://checkout.dodopayments.com/session/verified-session' }
  }))).not.toThrow();
  expect(() => assertCheckoutResponse(new Response(null, {
    status: 303,
    headers: {
      location: 'https://checkout.dodopayments.com/session/verified-session',
      'Retry-After': '90'
    }
  }))).toThrow('A successful 303 checkout redirect must not be rate-limited');
});

test('regression: verification allows exactly 30 requests, then requires 429 and Retry-After', async () => {
  const { VERIFY_REQUEST_ALLOWANCE, verifyVerificationAllowance } = await import('../scripts/verify-billing.mjs');
  const requests: string[] = [];
  const rateLimitedFetch = async (url: string) => {
    requests.push(url);
    return new Response(requests.length <= VERIFY_REQUEST_ALLOWANCE ? '{"valid":false,"reason":"invalid"}' : 'Too Many Requests!', {
      status: requests.length <= VERIFY_REQUEST_ALLOWANCE ? 200 : 429,
      headers: requests.length <= VERIFY_REQUEST_ALLOWANCE ? {} : { 'Retry-After': '5' }
    });
  };
  await expect(verifyVerificationAllowance(rateLimitedFetch)).resolves.toBe('5');
  expect(requests).toHaveLength(31);
  expect(requests[29]).toContain('qa-rate-limit-');

  await expect(verifyVerificationAllowance(async () => new Response(null, { status: 200 }))).rejects.toThrow('beyond the 30-request allowance');
  let missingHeaderRequest = 0;
  await expect(verifyVerificationAllowance(async () => {
    missingHeaderRequest += 1;
    return new Response(null, { status: missingHeaderRequest <= VERIFY_REQUEST_ALLOWANCE ? 200 : 429 });
  })).rejects.toThrow('must include Retry-After');

});

test('regression: license rate limits show an exposed Retry-After wait time when the service provides one', async ({ page }) => {
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, body: '{}' }));
  await page.route('https://api.sociobot.in/api/v1/products/legacy-app-rescue/verify**', route => route.fulfill({
    status: 429,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Retry-After',
      'Retry-After': '90'
    },
    contentType: 'application/json',
    body: '{"detail":"slow down"}'
  }));
  await page.goto('/');
  await page.getByLabel('Paste a license from your receipt').fill('rate-limited-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('License checks are busy. Try again in 90 seconds.')).toBeVisible();
});

test('@claim:browser-license-cache verifies a stored browser license at most once a day', async ({ page }) => {
  let checks = 0;
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, body: '{}' }));
  await page.route('https://api.sociobot.in/api/v1/products/legacy-app-rescue/verify**', route => {
    checks += 1;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true,"reason":"ok"}' });
  });
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('sb_license:legacy-app-rescue', 'cached-token');
    localStorage.setItem('sb_license_status:legacy-app-rescue', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.reload();
  await expect(page.getByText('A license is active in this browser. Sociobot checks it again at most once a day.')).toBeVisible();
  expect(checks).toBe(0);
});

test('@claim:browser-license-removal removes the token and cached verdict with the keyboard-accessible control', async ({ page }) => {
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, body: '{}' }));
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('sb_license:legacy-app-rescue', 'remove-me');
    localStorage.setItem('sb_license_status:legacy-app-rescue', JSON.stringify({ valid: false, checkedAt: Date.now() }));
  });
  await page.reload();
  const remove = page.getByRole('button', { name: 'Remove stored license' });
  await remove.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Stored license removed from this browser.')).toBeVisible();
  expect(await page.evaluate(() => ({
    token: localStorage.getItem('sb_license:legacy-app-rescue'),
    status: localStorage.getItem('sb_license_status:legacy-app-rescue')
  }))).toEqual({ token: null, status: null });
});

test('@claim:export-refusal-cleanup removes a refused app-data archive without root', async () => {
  const result = spawnSync('cargo', ['test', 'app_data_export_is_private_and_cleans_up_on_refusal'], { cwd: repo, encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
});

test('@claim:safety-boundaries leaves the APK unchanged and stops when Android refuses access', async () => {
  const root = mkdtempSync(join(tmpdir(), 'rescue-safety-'));
  const sampleManifest = join(root, 'sample.json');
  execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--output', sampleManifest], { cwd: repo });
  const apk = join(root, 'orchard-notes-1.7.apk');
  const before = createHash('sha256').update(readFileSync(apk)).digest('hex');
  const output = join(root, 'record.json');
  execFileSync('cargo', ['run', '--quiet', '--', '--json', 'scan', apk, '--output', output], { cwd: repo });
  expect(createHash('sha256').update(readFileSync(apk)).digest('hex')).toBe(before);
  expect(JSON.parse(readFileSync(output, 'utf8')).apks).toHaveLength(1);
  const refusal = spawnSync('cargo', ['test', 'app_data_export_is_private_and_cleans_up_on_refusal'], { cwd: repo, encoding: 'utf8' });
  expect(refusal.status, refusal.stderr).toBe(0);
});

test('@claim:input-scope scans only the file path passed to the command', async () => {
  const root = mkdtempSync(join(tmpdir(), 'rescue-input-scope-'));
  execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--output', join(root, 'sample.json')], { cwd: repo });
  const selected = join(root, 'orchard-notes-1.7.apk');
  const sentinel = join(root, 'do-not-read.apk');
  writeFileSync(sentinel, 'private sentinel outside the selected path');
  const sentinelBefore = createHash('sha256').update(readFileSync(sentinel)).digest('hex');
  const output = join(root, 'selected.json');
  execFileSync('cargo', ['run', '--quiet', '--', '--json', 'scan', selected, '--output', output], { cwd: repo });
  const record = JSON.parse(readFileSync(output, 'utf8'));
  expect(record.apks).toHaveLength(1);
  expect(record.apks[0].path).toBe(selected);
  expect(JSON.stringify(record)).not.toContain('do-not-read.apk');
  expect(createHash('sha256').update(readFileSync(sentinel)).digest('hex')).toBe(sentinelBefore);
});

test('@claim:device-serial-hash stores a 16-character hash instead of the device serial', async () => {
  const root = mkdtempSync(join(tmpdir(), 'rescue-device-hash-'));
  const bin = join(root, 'bin');
  mkdirSync(bin);
  const adb = join(bin, 'adb');
  writeFileSync(adb, `#!/bin/sh
if [ "$1" = "version" ]; then exit 0; fi
if [ "$1" = "-s" ]; then shift 2; fi
if [ "$1" = "shell" ] && [ "$2" = "getprop" ]; then
  case "$3" in
    ro.product.manufacturer) echo Sample ;;
    ro.product.model) echo ArchivePhone ;;
    ro.build.version.release) echo 13 ;;
    ro.build.version.sdk) echo 33 ;;
    ro.product.cpu.abilist) echo arm64-v8a,armeabi-v7a ;;
  esac
  exit 0
fi
if [ "$1" = "shell" ] && [ "$2" = "pm" ]; then echo package:in.sociobot.orchardnotes; exit 0; fi
exit 1
`);
  chmodSync(adb, 0o755);
  const serial = 'FIELD-DEVICE-123';
  const raw = execFileSync('cargo', ['run', '--quiet', '--', '--json', 'device', '--serial', serial], {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}` }
  });
  const device = JSON.parse(raw);
  expect(device.serial_hash).toBe(createHash('sha256').update(serial).digest('hex').slice(0, 16));
  expect(device.serial_hash).toMatch(/^[a-f0-9]{16}$/);
  expect(raw).not.toContain(serial);
});

test('@claim:compatibility-limit records reasons and says the verdict is not an install guarantee', async ({ page }) => {
  const manifest = demoManifest();
  expect(manifest.compatibility[0].reasons).toEqual(['SDK level and native CPU requirements match this device.']);
  expect(manifest.notes).toContain('This manifest records preservation evidence. It does not guarantee that an APK will install or run.');
  await page.goto('/terms');
  await expect(page.getByText('A compatible result does not promise installation, activation, or correct behavior.')).toBeVisible();
});

test('@claim:merchant-and-refund routes checkout through Sociobot and rejects a revoked license', async ({ page }) => {
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, body: '{}' }));
  await page.route('https://api.sociobot.in/api/v1/products/legacy-app-rescue/verify**', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: '{"valid":false,"reason":"revoked"}'
  }));
  await page.goto('/?license=refunded-fixture');
  await expect(page.getByText('Sociobot handles checkout. A refunded license stops Field Kit.')).toBeVisible();
  await expect(page.getByText('License no longer active. Check the token or buy Field Kit.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy Field Kit for $19' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/legacy-app-rescue/checkout');
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem('sb_license_status:legacy-app-rescue'))) || '{}').valid).toBe(false);
});

test('@claim:browser-license-storage keeps a token in named browser storage and sends it only to Sociobot', async ({ page, context }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, body: '{}' }));
  await page.route('https://api.sociobot.in/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true,"reason":"ok"}' }));
  await page.goto('/?license=browser-only-token');
  await expect(page.getByText('License active. Run rescue license activate TOKEN on each computer.')).toBeVisible();
  const storage = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  expect(storage['sb_license:legacy-app-rescue']).toBe('browser-only-token');
  expect(Object.keys(storage).sort()).toEqual(['sb_license:legacy-app-rescue', 'sb_license_status:legacy-app-rescue']);
  expect(page.url()).not.toContain('browser-only-token');
  expect(await context.cookies()).toEqual([]);
  const tokenRequests = requests.filter(url => url.includes('browser-only-token') && new URL(url).origin !== 'http://127.0.0.1:4173');
  expect(tokenRequests).toHaveLength(1);
  expect(new URL(tokenRequests[0]).origin).toBe('https://api.sociobot.in');
});

test('@claim:release-metadata-privacy contacts GitHub only and reuses release details for one hour', async ({ page }) => {
  const external: string[] = [];
  let githubRequests = 0;
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.route('https://api.github.com/**', route => {
    githubRequests += 1;
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        tag_name: 'v0.1.2',
        html_url: 'https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/tag/v0.1.2',
        assets: [{ name: 'rescue-linux-x86_64.tar.gz', browser_download_url: 'https://github.com/example/download' }]
      })
    });
  });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Download for Linux' })).toBeVisible();
  const cachedAt = await page.evaluate(() => JSON.parse(localStorage.getItem('release:legacy-app-rescue') || '{}').at);
  expect(Math.abs(Date.now() - cachedAt)).toBeLessThan(5_000);
  await page.reload();
  await expect(page.getByRole('link', { name: 'Download for Linux' })).toBeVisible();
  expect(githubRequests).toBe(1);
  expect(external).toEqual(['https://api.github.com/repos/B-Divyesh/sf-legacy-app-rescue/releases/latest']);
});

test('@claim:apk-transfer-boundary scans without HTTP and never changes the supplied APK', async () => {
  const root = mkdtempSync(join(tmpdir(), 'rescue-transfer-boundary-'));
  execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--output', join(root, 'sample.json')], { cwd: repo });
  const apk = join(root, 'orchard-notes-1.7.apk');
  const before = readFileSync(apk);
  const result = spawnSync('cargo', ['run', '--quiet', '--', '--json', 'scan', apk, '--output', join(root, 'record.json')], {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, HTTP_PROXY: 'http://127.0.0.1:1', HTTPS_PROXY: 'http://127.0.0.1:1', ALL_PROXY: 'http://127.0.0.1:1' }
  });
  expect(result.status, result.stderr).toBe(0);
  expect(readFileSync(apk)).toEqual(before);
  expect(JSON.parse(result.stdout).apks[0].path).toBe(apk);
});

test('@claim:sample-is-noninstallable builds a fixture without executable DEX files', async () => {
  const root = mkdtempSync(join(tmpdir(), 'rescue-sample-shape-'));
  execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--output', join(root, 'sample.json')], { cwd: repo });
  const listing = execFileSync('unzip', ['-Z1', join(root, 'orchard-notes-1.7.apk')], { encoding: 'utf8' }).trim().split('\n');
  expect(listing).toContain('AndroidManifest.xml');
  expect(listing.some(name => /(^|\/)classes\d*\.dex$/i.test(name))).toBe(false);
  expect(readdirSync(join(repo, 'examples/sample-apk')).sort()).toEqual(['AndroidManifest.xml', 'README.md']);
});

test('@claim:unsigned-builds packages unsigned macOS and Windows release artifacts', async () => {
  const workflow = readFileSync(join(repo, '.github/workflows/release.yml'), 'utf8');
  const macSection = workflow.slice(workflow.indexOf('- name: Package macOS'), workflow.indexOf('- name: Verify macOS'));
  const windowsSection = workflow.slice(workflow.indexOf('- name: Package Windows'), workflow.indexOf('- name: Verify Windows'));
  expect(macSection).toContain('pkgbuild --root');
  expect(macSection).not.toMatch(/--sign|productsign|codesign/);
  expect(windowsSection).toContain('Compress-Archive');
  expect(windowsSection).not.toMatch(/signtool|certificate|pfx/i);
  expect(workflow).not.toContain('WINDOWS_CERT_PFX');
  expect(workflow).not.toContain('APPLE_CERTIFICATE');
});

test('@claim:no-cli-telemetry runs scan and demo with all network proxies unavailable', async () => {
  const root = mkdtempSync(join(tmpdir(), 'rescue-no-telemetry-'));
  const blocked = { ...process.env, HTTP_PROXY: 'http://127.0.0.1:1', HTTPS_PROXY: 'http://127.0.0.1:1', ALL_PROXY: 'http://127.0.0.1:1' };
  const demo = spawnSync('cargo', ['run', '--quiet', '--', '--json', 'demo'], { cwd: repo, encoding: 'utf8', env: blocked });
  expect(demo.status, demo.stderr).toBe(0);
  execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--output', join(root, 'sample.json')], { cwd: repo, env: blocked });
  const scan = spawnSync('cargo', ['run', '--quiet', '--', '--json', 'scan', join(root, 'orchard-notes-1.7.apk'), '--output', join(root, 'record.json')], { cwd: repo, encoding: 'utf8', env: blocked });
  expect(scan.status, scan.stderr).toBe(0);
});

test('@claim:license-busy-recovery gives a specific retry step after a 429 response', async ({ page }) => {
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, body: '{}' }));
  await page.route('https://api.sociobot.in/api/v1/products/legacy-app-rescue/verify**', route => route.fulfill({
    status: 429,
    headers: { 'Access-Control-Expose-Headers': 'Retry-After', 'Retry-After': '45' },
    body: 'busy'
  }));
  await page.goto('/');
  await page.getByLabel('Paste a license from your receipt').fill('retry-fixture');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('License checks are busy. Try again in 45 seconds.')).toBeVisible();
});

test('@claim:winget-submission-manifest validates current release fields before submission', async () => {
  const manifest = readFileSync(join(repo, 'winget/B-Divyesh.LegacyAppRescue.yaml'), 'utf8');
  expect(manifest).toContain('PackageIdentifier: B-Divyesh.LegacyAppRescue');
  expect(manifest).toContain('PackageVersion: 0.1.2');
  expect(manifest).toContain('Architecture: x64');
  expect(manifest).toContain('InstallerType: zip');
  expect(manifest).toContain('NestedInstallerType: portable');
  expect(manifest).toContain('PortableCommandAlias: rescue');
  expect(manifest).toContain('/releases/download/v0.1.2/rescue-windows-x86_64.zip');
  expect(manifest.match(/InstallerSha256: ([A-F0-9]{64})/)?.[1]).toHaveLength(64);
  expect(manifest).toContain('ManifestVersion: 1.9.0');
});

test('@claim:ci-output removes decorative output while retaining the result', async () => {
  const normal = execFileSync('cargo', ['run', '--quiet', '--', 'demo'], { cwd: repo, encoding: 'utf8' });
  const ci = execFileSync('cargo', ['run', '--quiet', '--', '--ci', 'demo'], { cwd: repo, encoding: 'utf8' });
  expect(normal).toContain('✓');
  expect(normal).toContain('LEGACY APP RESCUE');
  expect(ci).not.toContain('✓');
  expect(ci).not.toContain('LEGACY APP RESCUE');
  expect(ci).toContain('Package: in.sociobot.orchardnotes');
  expect(ci).toContain('Manifest:');
});

test('claims registry has one observable test for every declared claim', async () => {
  const claims = JSON.parse(readFileSync(join(repo, '.factory/claims.json'), 'utf8')) as Array<{ id: string; test: string }>;
  const source = readFileSync(join(repo, 'tests/product.spec.ts'), 'utf8');
  const ids = claims.map(claim => claim.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const claim of claims) {
    expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
    expect(source.match(new RegExp(`@claim:${claim.id}(?![a-z0-9-])`, 'g'))).toHaveLength(1);
  }
  const declaredTags = [...source.matchAll(/@claim:([a-z0-9-]+)/g)].map(match => match[1]).sort();
  expect(declaredTags).toEqual([...ids].sort());
});

test('@claim:installer-verified verifies a Linux archive before placing the binary on PATH', async () => {
  const root = mkdtempSync(join(tmpdir(), 'rescue-installer-'));
  const stage = join(root, 'stage');
  const archive = join(root, 'rescue-linux-x86_64.tar.gz');
  const sums = join(root, 'SHA256SUMS');
  const bin = join(root, 'bin');
  const installDir = join(root, 'installed');
  execFileSync('mkdir', ['-p', stage, bin]);
  const rescue = join(stage, 'rescue');
  writeFileSync(rescue, '#!/bin/sh\necho rescue\n');
  chmodSync(rescue, 0o755);
  execFileSync('tar', ['-C', stage, '-czf', archive, 'rescue']);
  const hash = createHash('sha256').update(readFileSync(archive)).digest('hex');
  writeFileSync(sums, `${hash}  rescue-linux-x86_64.tar.gz\n`);
  const curl = join(bin, 'curl');
  writeFileSync(curl, `#!/bin/sh
out=""
previous=""
for value in "$@"; do [ "$previous" = "-o" ] && out="$value"; previous="$value"; done
case "$out" in *SHA256SUMS) cp "$TEST_SUMS" "$out" ;; *) cp "$TEST_ARCHIVE" "$out" ;; esac
`);
  chmodSync(curl, 0o755);
  execFileSync('sh', ['site/public/install.sh'], {
    cwd: repo,
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, TEST_SUMS: sums, TEST_ARCHIVE: archive, LEGACY_RESCUE_INSTALL_DIR: installDir }
  });
  const installed = join(installDir, 'rescue');
  expect(existsSync(installed)).toBe(true);
  expect(statSync(installed).mode & 0o111).not.toBe(0);
});

test('download selection gives mobile visitors desktop guidance and macOS visitors both architectures', async ({ page }) => {
  const assets = [
    { name: 'rescue-macos-arm64.pkg', browser_download_url: 'https://downloads.example/arm.pkg' },
    { name: 'rescue-macos-x86_64.pkg', browser_download_url: 'https://downloads.example/intel.pkg' },
    { name: 'rescue-linux-x86_64.tar.gz', browser_download_url: 'https://downloads.example/linux.tar.gz' }
  ];
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ tag_name: 'v0.1.0', html_url: 'https://example.test/release', assets }) }));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'Mozilla/5.0 (Linux; Android 14; Pixel 7)' });
    Object.defineProperty(navigator, 'platform', { configurable: true, value: 'Linux armv8l' });
  });
  await page.goto('/');
  await expect(page.locator('[data-platform-message]')).toHaveText('Legacy App Rescue is a desktop CLI. Use macOS, Windows, or Linux to install it.');
  await expect(page.getByRole('link', { name: 'Open desktop downloads' })).toBeVisible();

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)' });
    Object.defineProperty(navigator, 'platform', { configurable: true, value: 'MacIntel' });
  });
  await page.goto('/?mac');
  await expect(page.getByRole('link', { name: 'Apple silicon' })).toHaveAttribute('href', 'https://downloads.example/arm.pkg');
  await expect(page.getByRole('link', { name: 'Intel Mac' })).toHaveAttribute('href', 'https://downloads.example/intel.pkg');
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
  const tooSmall = await page.locator('a, button, input, summary').evaluateAll(elements => elements
    .filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    })
    .map(element => `${element.tagName}:${(element.textContent || (element as HTMLInputElement).value).trim()}`));
  expect(tooSmall).toEqual([]);
});

test('unknown routes show a real 404 configuration and a way home', async ({ page }) => {
  await page.goto('/missing-specimen');
  await expect(page).toHaveTitle('Page not found — Legacy App Rescue');
  await expect(page.getByRole('heading', { name: 'This page is missing' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to the home page' })).toHaveAttribute('href', '/');
  const config = JSON.parse(readFileSync(join(repo, 'dist/site/staticwebapp.config.json'), 'utf8')) as { routes: Array<{ route: string; statusCode?: number }> };
  expect(config.routes).toContainEqual({ route: '/*', statusCode: 404 });
});

test('real routes update title, metadata, focus, and browser history', async ({ page }) => {
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, body: '{}' }));
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveURL('/privacy');
  await expect(page).toHaveTitle('Privacy — Legacy App Rescue');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://legacy-app-rescue.sociobot.in/privacy');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy — Legacy App Rescue');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://legacy-app-rescue.sociobot.in/privacy');
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Privacy — Legacy App Rescue');
  await page.goBack();
  await expect(page).toHaveTitle('Legacy App Rescue — record an Android app');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/?demo=1');
  await expect(page).toHaveTitle('Demo — Legacy App Rescue');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://legacy-app-rescue.sociobot.in/demo');
});
