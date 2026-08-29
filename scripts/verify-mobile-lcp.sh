#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
RESULTS=$(mktemp -d)
SERVER_LOG="$RESULTS/preview.log"
SERVER_PID=''

cleanup() {
  if [ -n "$SERVER_PID" ]; then kill "$SERVER_PID" 2>/dev/null || true; fi
  rm -rf "$RESULTS"
}
trap cleanup EXIT INT TERM

cd "$ROOT"
npm run build:site
"$ROOT/node_modules/.bin/vite" preview --host 127.0.0.1 --port 4173 >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!

ready=0
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS http://127.0.0.1:4173/ >/dev/null; then ready=1; break; fi
  sleep 1
done
if [ "$ready" -ne 1 ]; then cat "$SERVER_LOG"; exit 1; fi

if [ -z "${CHROME_PATH:-}" ]; then
  CHROME_PATH=$(find "${PLAYWRIGHT_BROWSERS_PATH:?Set PLAYWRIGHT_BROWSERS_PATH}" -type f -name chrome -perm -111 | head -1)
  export CHROME_PATH
fi

for run in 1 2 3 4; do
  npx --yes lighthouse@13.0.1 http://127.0.0.1:4173 \
    --quiet \
    --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' \
    --only-categories=performance \
    --form-factor=mobile \
    --throttling-method=simulate \
    --output=json \
    --output-path="$RESULTS/lighthouse-$run.json"
done

node - "$RESULTS" <<'NODE'
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const directory = process.argv[2];
const rows = [1, 2, 3, 4].map(run => {
  const report = JSON.parse(readFileSync(join(directory, `lighthouse-${run}.json`), 'utf8'));
  return {
    run,
    performance: Math.round(report.categories.performance.score * 100),
    lcp: Math.round(report.audits['largest-contentful-paint'].numericValue),
    tbt: Math.round(report.audits['total-blocking-time'].numericValue),
    cls: report.audits['cumulative-layout-shift'].numericValue
  };
});
const sorted = rows.map(row => row.lcp).sort((left, right) => left - right);
const median = (sorted[1] + sorted[2]) / 2;
console.table(rows);
console.log(`Median mobile LCP: ${median} ms`);
if (median >= 2500 || rows.some(row => row.lcp >= 2500)) {
  throw new Error('Mobile LCP must stay below 2500 ms in every run and at the median.');
}
NODE
