import './styles.css';

const PRODUCT = 'legacy-app-rescue';
const REPO = 'B-Divyesh/sf-legacy-app-rescue';
const RELEASES = `https://github.com/${REPO}/releases`;
const API = 'https://api.sociobot.in/api/v1';
const DEMO_PREFIX = `demo:${PRODUCT}:`;
const LICENSE_CACHE_MS = 86_400_000;
const app = document.querySelector<HTMLDivElement>('#app')!;
const announcer = document.querySelector<HTMLDivElement>('.route-announcer')!;

type CastLine = [number, 'o', string];
type ReleaseAsset = { name: string; browser_download_url: string };
type Release = { tag_name: string; html_url: string; assets: ReleaseAsset[] };

const fernMark = `<svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M12 55C27 42 34 27 47 8M22 45c-7 0-11-3-13-8 8-1 13 1 16 4M28 36c-7-1-10-5-11-10 7 0 12 2 14 6M35 27c-6-2-8-6-8-11 7 1 10 4 12 7M24 44c1 6 4 9 9 11 2-6 1-11-3-14M31 35c2 5 6 8 11 8 0-6-2-10-7-13M38 26c3 5 7 6 12 5-2-5-4-8-9-10"/></svg>`;

function header(demo = false) {
  return `<header class="site-header">
    <div class="header-inner">
      <a class="wordmark" href="/" data-route aria-label="Legacy App Rescue home">${fernMark}<span>Legacy App Rescue</span></a>
      <nav aria-label="Primary navigation">
        <a href="/?demo=1" data-route>Demo</a>
        <a href="/#install" data-route>Install</a>
        <a href="/privacy" data-route>Privacy</a>
      </nav>
    </div>
    ${demo ? `<div class="demo-banner" role="status"><span><strong>Demo</strong> — sample data, nothing is saved</span><span class="demo-actions"><button type="button" data-reset-demo>Reset demo</button><a href="/" data-start-real>Start for real</a></span></div>` : ''}
  </header>`;
}

function footer() {
  return `<footer class="site-footer"><div>
    <p><strong>Legacy App Rescue</strong> records Android app evidence on your computer.</p>
    <nav aria-label="Footer navigation"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://sociobot.in">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
    <p class="build">Version 0.1.3 · build 2026.08</p>
  </div></footer>`;
}

function terminal(id = 'terminal') {
  return `<section class="terminal-specimen" aria-labelledby="${id}-title">
    <div class="terminal-label"><span id="${id}-title">Sample preservation record</span><span>Orchard Notes · sample</span></div>
    <div class="terminal" role="region" aria-label="Recorded command output" tabindex="0">
      <div class="terminal-bar"><span class="terminal-dots" aria-hidden="true">● ● ●</span><code>rescue demo</code><button type="button" data-terminal-toggle>Pause</button></div>
      <pre aria-live="polite"><code data-terminal-output><span class="cursor">▋</span></code></pre>
    </div>
    <p class="terminal-caption">This recording comes from a bundled sample Android app file (APK). Run the same scan with <code>rescue demo</code>.</p>
  </section>`;
}

function landing() {
  return `${header()}<main id="main" tabindex="-1">
    <section class="hero" aria-labelledby="page-title">
      <img class="hero-plate" src="/assets/field-guide-hero.webp" srcset="/assets/field-guide-hero-800.webp 800w, /assets/field-guide-hero.webp 1200w" sizes="(max-width: 760px) 100vw, 1200px" width="1200" height="800" alt="A field-guide plate shows a fern sheltering an archive box and device cable." fetchpriority="high" />
      <div class="hero-copy">
        <h1 id="page-title">Record your Android app before it disappears</h1>
        <p class="lede">For people preserving an old app they own, it records the Android app file (APK) and checks another device.</p>
        <div class="hero-action"><a class="button primary" href="/?demo=1" data-route>Try it with sample data</a><span>Open a finished record in separate demo storage.</span></div>
        <ul class="plain-facts" aria-label="Product facts">
          <li>Runs on macOS, Windows, and Linux.</li>
          <li>APK scans stay on your computer.</li>
          <li>One APK is free. Field Kit costs $19 once.</li>
        </ul>
      </div>
    </section>

    <section class="preview-band" aria-labelledby="preview-title">
      <div class="section-intro"><p class="eyebrow">The product</p><h2 id="preview-title">See what the preservation record contains</h2><p>The record includes its package name, unique file fingerprint, signer evidence, Android version needs, and device match.</p></div>
      ${terminal('landing-terminal')}
      <dl class="specimen-facts">
        <div><dt>Package</dt><dd>in.sociobot.orchardnotes</dd></div>
        <div><dt>SHA-256</dt><dd>eb4bf97b…65863ed2</dd></div>
        <div><dt>SDK range</dt><dd>API 21 → 28</dd></div>
        <div><dt>Device match</dt><dd><span class="stamp compatible">✓ Compatible</span></dd></div>
      </dl>
    </section>

    <section class="how" aria-labelledby="how-title">
      <div class="section-intro"><p class="eyebrow">Three steps</p><h2 id="how-title">Create a preservation record (manifest)</h2></div>
      <ol class="ledger-steps">
        <li><span class="step-number">01</span><div><h3>Point to your Android app file</h3><p>Give the desktop command-line tool (CLI) an Android app file you already own. It reads the file in place.</p><code>rescue scan old-game.apk</code></div></li>
        <li><span class="step-number">02</span><div><h3>Connect the target device</h3><p>Add <code>--device</code> to record the Android version, device types, and installed app list.</p><code>rescue scan old-game.apk --device</code></div></li>
        <li><span class="step-number">03</span><div><h3>Keep the record beside the app file</h3><p>The record lists app version, needed Android version, device types, signing evidence, and device match reasons.</p><code>preservation-manifest.json</code></div></li>
      </ol>
    </section>

    <section class="boundaries" aria-labelledby="boundaries-title">
      <div><p class="eyebrow">Clear boundaries</p><h2 id="boundaries-title">What the tool does not change</h2><p>Legacy App Rescue does not download, crack, patch, or re-sign APKs. It cannot bypass Android data controls.</p></div>
      <ul class="checked-list"><li>Reads only paths you pass.</li><li>Keeps a shortened fingerprint of the device serial.</li><li>Labels compatibility as evidence, not a guarantee.</li><li>Exports app data only after Android grants the app's data-access permission (<code>run-as</code>).</li></ul>
    </section>

    <section class="install" id="install" aria-labelledby="install-title">
      <div class="section-intro"><p class="eyebrow">Install</p><h2 id="install-title">Install Legacy App Rescue</h2><p data-platform-message>Checking the right download for this computer…</p></div>
      <div class="download-panel">
        <div data-download-action class="download-state" aria-live="polite"><span class="loader" aria-hidden="true"></span> Checking published files…</div>
        <div class="command-row"><code data-install-command>curl -fsSL https://legacy-app-rescue.sociobot.in/install.sh | sh</code><button type="button" data-copy-command>Copy command</button></div>
        <p class="signing-note" data-signing-note>Release checksums are verified before installation.</p>
      </div>
      <details><summary>Other install choices</summary><div class="install-grid"><p><strong>Homebrew</strong><code>brew install B-Divyesh/legacy-app-rescue/legacy-app-rescue</code></p><p><strong>Scoop</strong><code>scoop bucket add legacy-app-rescue https://github.com/B-Divyesh/sf-legacy-app-rescue<br>scoop install legacy-app-rescue</code></p><p><strong>Cargo</strong><code>cargo install --path .</code></p></div></details>
    </section>

    <section class="paid" id="field-kit" aria-labelledby="paid-title">
      <div class="price-stamp"><span>FIELD KIT</span><strong>$19</strong><small>one time</small></div>
      <div><p class="eyebrow">For more than one app</p><h2 id="paid-title">Scan more app files at once</h2><p>The free command scans one app file and checks one device. Field Kit adds batch scans and permitted app-data export.</p><div class="paid-actions"><a class="button oxide" href="${API}/products/${PRODUCT}/checkout">Buy Field Kit for $19</a><a class="restore-link" href="#restore">Restore a license</a></div><p class="fine-print">Sociobot handles checkout. A refunded license stops Field Kit.</p></div>
      <form class="license-form" id="restore"><label for="license-token">Paste a license from your receipt</label><div><input id="license-token" name="license" type="password" autocomplete="off" required aria-describedby="license-status" /><button type="submit">Verify license</button></div><div class="license-storage-actions"><button type="button" data-remove-license>Remove stored license</button><p id="license-status" data-license-status aria-live="polite">Stored only in this browser. Remove it here at any time.</p></div></form>
    </section>
  </main>${footer()}`;
}

function demoPage() {
  return `${header(true)}<main id="main" class="demo-page" tabindex="-1">
    <section class="demo-heading"><p class="eyebrow">Sample data</p><h1 id="page-title">Inspect a finished preservation record</h1><p>The sample is a fictional orchard notebook Android app file (APK) matched with an Android 13 phone.</p></section>
    ${terminal('demo-terminal')}
    <section class="manifest-sheet" aria-labelledby="manifest-title">
      <div class="sheet-heading"><div><p class="eyebrow">Preservation record (manifest)</p><h2 id="manifest-title">Orchard Notes 1.7.0</h2></div><span class="stamp compatible">✓ Compatible</span></div>
      <dl class="manifest-grid">
        <div><dt>Package</dt><dd>in.sociobot.orchardnotes</dd></div><div><dt>APK size</dt><dd>690 bytes · fixture</dd></div>
        <div><dt>Minimum Android</dt><dd>API 21</dd></div><div><dt>Target Android</dt><dd>API 28</dd></div>
        <div><dt>Native CPU</dt><dd>arm64-v8a</dd></div><div><dt>Signer evidence</dt><dd>1 v1 block</dd></div>
        <div class="wide"><dt>SHA-256</dt><dd><code>eb4bf97bb9af37dfaae2b7b8d86ef7984db164201fa31ddf066c6cdb65863ed2</code></dd></div>
        <div class="wide"><dt>Why it matches</dt><dd>SDK level and native CPU requirements match this device.</dd></div>
      </dl>
      <div class="demo-command"><p>Run this sandbox on your computer:</p><code>rescue demo</code></div>
    </section>
  </main>${footer()}`;
}

function privacyPage() {
  return `${header()}<main id="main" class="prose-page" tabindex="-1"><p class="eyebrow">Privacy policy · 29 August 2026</p><h1 id="page-title">Keep preservation records on your computer</h1>
    <h2>Android app-file and device scans</h2><p>The desktop command-line tool (CLI) reads only Android app-file (APK) paths and the device you choose. It does not upload files or records.</p><p>The device serial becomes a 16-character SHA-256 fingerprint. The preservation record may contain installed app names.</p>
    <h2>App-data export</h2><p>Field Kit asks Android for the app's own data-access permission (<code>run-as</code>). If Android refuses, the tool stops. It does not use root or a bypass.</p>
    <h2>Website storage</h2><p>The demo uses keys beginning with <code>demo:legacy-app-rescue:</code>. Leaving the demo removes them.</p><p>A license is stored under <code>sb_license:legacy-app-rescue</code>. Release details may be cached for one hour.</p>
    <h2>Network requests</h2><p>The demo loads only this site's files. The download section asks the GitHub API for published releases.</p><p>License verification sends the pasted token to Sociobot. If the service is busy, the site asks you to try again shortly. The checkout opens Sociobot's hosted payment page.</p>
    <h2>Remove stored data</h2><p>Use “Start for real” to clear demo data. Use <a href="/#restore" data-route>Remove stored license</a> to clear the license and its check status.</p>
    <h2>Contact</h2><p>Questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>
  </main>${footer()}`;
}

function termsPage() {
  return `${header()}<main id="main" class="prose-page" tabindex="-1"><p class="eyebrow">Terms · 28 August 2026</p><h1 id="page-title">Use the tool for apps you may preserve</h1>
    <h2>Your responsibility</h2><p>Use Legacy App Rescue only with software and data you may lawfully access. Follow copyright, license, and device rules.</p>
    <h2>What the tool does</h2><p>The desktop command-line tool (CLI) records app details and a device match opinion. A compatible result does not promise installation or correct behavior.</p>
    <h2>What the tool does not do</h2><p>The tool does not provide Android app files (APKs), remove DRM, crack software, or re-sign third-party apps.</p>
    <h2>Field Kit purchase</h2><p>Field Kit costs $19 once. It adds batch scans and permitted app-data export for version 0.x.</p><p>Sociobot is the merchant of record. Refunds are handled there and revoke the license.</p>
    <h2>No warranty</h2><p>The software is provided under the MIT License without warranty. Keep more than one copy of important files.</p>
    <h2>Contact</h2><p>Questions can be sent to <a href="mailto:hello@sociobot.in">hello@sociobot.in</a>.</p>
  </main>${footer()}`;
}

function missingPage() {
  return `${header()}<main id="main" class="missing-page" tabindex="-1"><p class="eyebrow">Page not found</p><h1 id="page-title">This page is missing</h1><p>The page may have moved. Your files were not involved.</p><a class="button primary" href="/" data-route>Return to the home page</a></main>${footer()}`;
}

const routes: Record<string, { title: string; description: string; render: () => string }> = {
  '/': { title: 'Legacy App Rescue — record an Android app', description: 'Record an Android app file, check another device, and save a local preservation record.', render: landing },
  '/demo': { title: 'Demo — Legacy App Rescue', description: 'Inspect a complete sample Android preservation record without reading your files.', render: demoPage },
  '/privacy': { title: 'Privacy — Legacy App Rescue', description: 'How Legacy App Rescue keeps Android app files, device details, and app data on your computer.', render: privacyPage },
  '/terms': { title: 'Terms — Legacy App Rescue', description: 'Terms for lawful software preservation with Legacy App Rescue.', render: termsPage }
};

function renderRoute(focus = false, restoreScroll = 0) {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const routeKey = path === '/' && new URLSearchParams(location.search).get('demo') === '1' ? '/demo' : path;
  const route = routes[routeKey];
  document.title = route?.title ?? 'Page not found — Legacy App Rescue';
  const description = route?.description ?? 'This Legacy App Rescue page was not found.';
  const canonicalPath = routeKey === '/demo' ? '/demo' : path;
  const canonical = `https://legacy-app-rescue.sociobot.in${canonicalPath}`;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = description;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = canonical;
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = document.title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = description;
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')!.content = canonical;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = document.title;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = description;
  if (app.dataset.prerenderedRoute !== routeKey) app.innerHTML = route ? route.render() : missingPage();
  delete app.dataset.prerenderedRoute;
  if (routeKey === '/demo') localStorage.setItem(`${DEMO_PREFIX}opened`, 'true');
  bindNavigation();
  bindTerminal();
  bindDemo();
  bindLicense();
  if (routeKey === '/') bindDownloads();
  const h1 = document.querySelector<HTMLHeadingElement>('h1')!;
  announcer.textContent = document.title;
  if (focus) {
    window.scrollTo({ top: restoreScroll, behavior: 'auto' });
    h1.tabIndex = -1;
    h1.focus({ preventScroll: true });
  }
}

function bindNavigation() {
  document.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach(link => {
    link.addEventListener('click', event => {
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      history.replaceState({ ...history.state, scrollY: window.scrollY }, '');
      history.pushState({ scrollY: 0 }, '', url.pathname + url.search + url.hash);
      renderRoute(true);
      if (url.hash) requestAnimationFrame(() => document.querySelector(url.hash)?.scrollIntoView());
    });
  });
}

async function bindTerminal() {
  const output = document.querySelector<HTMLElement>('[data-terminal-output]');
  const button = document.querySelector<HTMLButtonElement>('[data-terminal-toggle]');
  if (!output || !button) return;
  let lines: CastLine[] = [];
  try {
    const response = await fetch('/demo.cast');
    if (!response.ok) throw new Error('recording unavailable');
    lines = (await response.text()).trim().split('\n').slice(1).map(line => JSON.parse(line) as CastLine);
  } catch {
    output.textContent = 'The recording could not load. Run: rescue demo';
    button.hidden = true;
    return;
  }
  let timers: number[] = [];
  let playing = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const showAll = () => { output.textContent = lines.map(line => line[2]).join(''); };
  const play = () => {
    timers.forEach(clearTimeout); timers = []; output.textContent = lines[0]?.[2] || ''; playing = true; button.textContent = 'Pause';
    if (reduced) { showAll(); playing = false; button.textContent = 'Replay'; return; }
    lines.slice(1).forEach(line => timers.push(window.setTimeout(() => {
      output.textContent += line[2];
      if (line === lines.at(-1)) { playing = false; button.textContent = 'Replay'; }
    }, line[0] * 700)));
  };
  button.addEventListener('click', () => {
    if (playing) { timers.forEach(clearTimeout); playing = false; button.textContent = 'Replay'; }
    else play();
  });
  play();
}

function bindDemo() {
  document.querySelector('[data-reset-demo]')?.addEventListener('click', () => {
    for (const key of Object.keys(localStorage)) if (key.startsWith(DEMO_PREFIX)) localStorage.removeItem(key);
    localStorage.setItem(`${DEMO_PREFIX}opened`, 'true');
    renderRoute();
  });
  document.querySelector('[data-start-real]')?.addEventListener('click', event => {
    event.preventDefault();
    for (const key of Object.keys(localStorage)) if (key.startsWith(DEMO_PREFIX)) localStorage.removeItem(key);
    history.pushState({}, '', '/'); renderRoute(true);
  });
}

type Platform =
  | { kind: 'single'; label: string; fragment: string; command: string; note: string }
  | { kind: 'macos'; label: string; command: string; note: string }
  | { kind: 'unsupported'; label: string; note: string };

function detectedPlatform(): Platform {
  const value = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  if (/(android|iphone|ipad|ipod)/.test(value)) return { kind: 'unsupported', label: 'mobile', note: 'Install Legacy App Rescue from a Mac, Windows, or Linux computer.' };
  if (value.includes('win')) return { kind: 'single', label: 'Windows', fragment: 'windows-x86_64.zip', command: 'irm https://legacy-app-rescue.sociobot.in/install.ps1 | iex', note: 'The portable Windows ZIP is unsigned.' };
  if (value.includes('mac')) return { kind: 'macos', label: 'macOS', command: 'curl -fsSL https://legacy-app-rescue.sociobot.in/install.sh | sh', note: 'Choose the package for your Mac. The packages are unsigned; right-click, then choose Open.' };
  return { kind: 'single', label: 'Linux', fragment: 'linux-x86_64.tar.gz', command: 'curl -fsSL https://legacy-app-rescue.sociobot.in/install.sh | sh', note: 'The installer verifies SHA-256 before placing rescue on your PATH.' };
}

async function bindDownloads() {
  const platform = detectedPlatform();
  document.querySelector<HTMLElement>('[data-platform-message]')!.textContent = platform.kind === 'unsupported' ? platform.note : `Download the ${platform.label} build, or use a package manager.`;
  const command = document.querySelector<HTMLElement>('[data-install-command]')!;
  const commandRow = command.closest<HTMLElement>('.command-row')!;
  const installCommand = platform.kind === 'unsupported' ? '' : platform.command;
  command.textContent = installCommand;
  commandRow.hidden = platform.kind === 'unsupported';
  document.querySelector<HTMLElement>('[data-signing-note]')!.textContent = platform.kind === 'unsupported' ? 'Open the desktop downloads to choose an installer.' : platform.note;
  document.querySelector('[data-copy-command]')?.addEventListener('click', async event => {
    const button = event.currentTarget as HTMLButtonElement;
    try { await navigator.clipboard.writeText(installCommand); button.textContent = 'Copied'; }
    catch { button.textContent = 'Select the command to copy'; }
  });
  const mount = document.querySelector<HTMLElement>('[data-download-action]')!;
  try {
    const cacheKey = `release:${PRODUCT}`;
    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null') as { at: number; data: Release } | null;
    let release: Release;
    if (cached && Date.now() - cached.at < 3_600_000) release = cached.data;
    else {
      const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error('release unavailable');
      release = await response.json() as Release;
      localStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data: release }));
    }
    if (platform.kind === 'unsupported') {
      mount.innerHTML = `<a class="button primary" href="${RELEASES}">Open desktop downloads <span class="sr-only">(external site)</span></a>`;
      return;
    }
    if (platform.kind === 'macos') {
      const arm = release.assets.find(item => item.name.includes('macos-arm64.pkg'));
      const intel = release.assets.find(item => item.name.includes('macos-x86_64.pkg'));
      if (!arm || !intel) throw new Error('macOS files unavailable');
      mount.innerHTML = `<span>${release.tag_name} · choose your Mac chip · checksums listed in the release</span><span class="download-options"><a class="button primary" href="${arm.browser_download_url}">Apple silicon</a><a class="button primary" href="${intel.browser_download_url}">Intel Mac</a></span>`;
      return;
    }
    const asset = release.assets.find(item => item.name.includes(platform.fragment));
    if (!asset) throw new Error('platform file unavailable');
    mount.innerHTML = `<a class="button primary" href="${asset.browser_download_url}">Download for ${platform.label}</a><span>${release.tag_name} · checksum listed in the release</span>`;
  } catch {
    mount.innerHTML = `<span><strong>Downloads are being published.</strong> The release page will show each file when ready.</span><a href="${RELEASES}">Open the release page <span class="sr-only">(external site)</span></a>`;
  }
}

type CachedLicenseStatus = { valid: boolean; checkedAt: number };

function readCachedLicenseStatus() {
  try {
    const value = JSON.parse(localStorage.getItem(`sb_license_status:${PRODUCT}`) || 'null') as CachedLicenseStatus | null;
    return value && typeof value.valid === 'boolean' && typeof value.checkedAt === 'number' ? value : null;
  } catch {
    return null;
  }
}

function retryAfterMessage(value: string | null) {
  if (!value) return 'License checks are busy. Try again shortly.';
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds > 0) {
    return `License checks are busy. Try again in ${Math.ceil(seconds)} seconds.`;
  }
  const date = Date.parse(value);
  if (Number.isFinite(date)) {
    const secondsUntilRetry = Math.max(1, Math.ceil((date - Date.now()) / 1000));
    return `License checks are busy. Try again in ${secondsUntilRetry} seconds.`;
  }
  return 'License checks are busy. Try again shortly.';
}

function bindLicense() {
  const params = new URLSearchParams(location.search);
  const returned = params.get('license');
  const form = document.querySelector<HTMLFormElement>('.license-form');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-license-status]')!;
  if (returned) {
    localStorage.setItem(`sb_license:${PRODUCT}`, returned);
    params.delete('license');
    history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
    status.textContent = 'Checking the license from your receipt with Sociobot…';
    void verifyLicense(returned).then(message => { status.textContent = message; });
  } else {
    const saved = localStorage.getItem(`sb_license:${PRODUCT}`);
    const cached = readCachedLicenseStatus();
    if (saved && cached?.valid) status.textContent = 'A license is active in this browser. Sociobot checks it again at most once a day.';
    else if (saved) status.textContent = 'A license is stored in this browser. Verify it again if needed.';
    if (saved && (!cached || Date.now() - cached.checkedAt >= LICENSE_CACHE_MS)) {
      void verifyLicense(saved).then(message => { status.textContent = message; });
    }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const token = new FormData(form).get('license')?.toString().trim() || '';
    if (!token) { status.textContent = 'No license was entered. Paste the token from your receipt.'; return; }
    status.textContent = 'Checking this license with Sociobot…';
    localStorage.setItem(`sb_license:${PRODUCT}`, token);
    status.textContent = await verifyLicense(token);
  });
  form.querySelector<HTMLButtonElement>('[data-remove-license]')?.addEventListener('click', () => {
    localStorage.removeItem(`sb_license:${PRODUCT}`);
    localStorage.removeItem(`sb_license_status:${PRODUCT}`);
    form.reset();
    status.textContent = 'Stored license removed from this browser.';
  });
}

async function verifyLicense(token: string) {
  try {
    const response = await fetch(`${API}/products/${PRODUCT}/verify?license=${encodeURIComponent(token)}`);
    if (response.status === 429) return retryAfterMessage(response.headers.get('Retry-After'));
    if (!response.ok) throw new Error('service error');
    const verdict = await response.json() as { valid: boolean; reason: string };
    localStorage.setItem(`sb_license_status:${PRODUCT}`, JSON.stringify({ valid: verdict.valid, checkedAt: Date.now() }));
    return verdict.valid ? 'License active. Run rescue license activate TOKEN on each computer.' : 'License no longer active. Check the token or buy Field Kit.';
  } catch {
    return 'The license service could not be reached. Your free scan still works.';
  }
}

history.scrollRestoration = 'manual';
window.addEventListener('popstate', event => renderRoute(true, Number(event.state?.scrollY || 0)));
renderRoute();
