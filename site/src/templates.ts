export const PRODUCT = 'legacy-app-rescue';
export const REPO = 'B-Divyesh/sf-legacy-app-rescue';
export const RELEASES = `https://github.com/${REPO}/releases`;
export const API = 'https://api.sociobot.in/api/v1';

const fernMark = `<svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M12 55C27 42 34 27 47 8M22 45c-7 0-11-3-13-8 8-1 13 1 16 4M28 36c-7-1-10-5-11-10 7 0 12 2 14 6M35 27c-6-2-8-6-8-11 7 1 10 4 12 7M24 44c1 6 4 9 9 11 2-6 1-11-3-14M31 35c2 5 6 8 11 8 0-6-2-10-7-13M38 26c3 5 7 6 12 5-2-5-4-8-9-10"/></svg>`;

export function header(demo = false) {
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

export function footer() {
  return `<footer class="site-footer"><div>
    <p><strong>Legacy App Rescue</strong> records Android app evidence on your computer.</p>
    <nav aria-label="Footer navigation"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://sociobot.in">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
    <p class="build">Version 0.1.3 · build 2026.08</p>
  </div></footer>`;
}

export function terminal(id = 'terminal') {
  return `<section class="terminal-specimen" aria-labelledby="${id}-title">
    <div class="terminal-label"><span id="${id}-title">Sample preservation record</span><span>Orchard Notes · sample</span></div>
    <div class="terminal" role="region" aria-label="Recorded command output" tabindex="0">
      <div class="terminal-bar"><span class="terminal-dots" aria-hidden="true">● ● ●</span><code>rescue demo</code><button type="button" data-terminal-toggle>Pause</button></div>
      <pre aria-live="polite"><code data-terminal-output><span class="cursor">▋</span></code></pre>
    </div>
    <p class="terminal-caption">This recording comes from a bundled sample Android app file (APK). Run the same scan with <code>rescue demo</code>.</p>
  </section>`;
}

export function landing() {
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
          <li>One app-file scan is free. Field Kit costs $19 once.</li>
        </ul>
      </div>
    </section>

    <section class="preview-band" aria-labelledby="preview-title">
      <div class="section-intro"><h2 id="preview-title">See what the preservation record contains</h2><p>The record includes its package name, unique file fingerprint, signer evidence, Android version needs, and device match.</p></div>
      ${terminal('landing-terminal')}
      <dl class="specimen-facts">
        <div><dt>Package</dt><dd>in.sociobot.orchardnotes</dd></div>
        <div><dt>SHA-256</dt><dd>eb4bf97b…65863ed2</dd></div>
        <div><dt>SDK range</dt><dd>API 21 → 28</dd></div>
        <div><dt>Device match</dt><dd><span class="stamp compatible">✓ Compatible</span></dd></div>
      </dl>
    </section>

    <section class="how" aria-labelledby="how-title">
      <div class="section-intro"><h2 id="how-title">Create a preservation record (manifest)</h2></div>
      <ol class="ledger-steps">
        <li><span class="step-number">01</span><div><h3>Point to your Android app file</h3><p>Give the desktop command-line tool (CLI) an Android app file you already own. It reads the file in place.</p><code>rescue scan old-game.apk</code></div></li>
        <li><span class="step-number">02</span><div><h3>Connect the target device</h3><p>Add <code>--device</code> to record the Android version, device types, and installed app list.</p><code>rescue scan old-game.apk --device</code></div></li>
        <li><span class="step-number">03</span><div><h3>Keep the record beside the app file</h3><p>The record lists app version, needed Android version, device types, signing evidence, and device match reasons.</p><code>preservation-manifest.json</code></div></li>
      </ol>
    </section>

    <section class="boundaries" aria-labelledby="boundaries-title">
      <div><h2 id="boundaries-title">What the tool does not change</h2><p>Legacy App Rescue does not download, crack, patch, or re-sign APKs. It cannot bypass Android data controls.</p></div>
      <ul class="checked-list"><li>Reads only paths you pass.</li><li>Keeps a shortened fingerprint of the device serial.</li><li>Labels compatibility as evidence, not a guarantee.</li><li>Exports app data only after Android grants the app's data-access permission (<code>run-as</code>).</li></ul>
    </section>

    <section class="install" id="install" aria-labelledby="install-title">
      <div class="section-intro"><h2 id="install-title">Install Legacy App Rescue</h2><p data-platform-message>Checking the right download for this computer…</p></div>
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
