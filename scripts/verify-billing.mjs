export const VERIFY_REQUEST_ALLOWANCE = 30;

export function assertCheckoutResponse(response) {
  const location = response.headers.get('location');
  const retryAfter = response.headers.get('retry-after');
  if (response.status !== 303) {
  throw new Error(`Expected Sociobot checkout to return 303, received ${response.status}.`);
  }
  if (!location) throw new Error('Sociobot checkout returned no Location header.');
  const destination = new URL(location);
  if (destination.protocol !== 'https:' || destination.hostname !== 'checkout.dodopayments.com' || !destination.pathname.startsWith('/session/')) {
  throw new Error('Sociobot checkout did not redirect to a hosted Dodo checkout session.');
  }
  if (retryAfter) {
  throw new Error(`A successful 303 checkout redirect must not be rate-limited (Retry-After: ${retryAfter}).`);
  }
}

export function assertVerificationAllowanceResponse(response, requestNumber) {
  if (requestNumber <= VERIFY_REQUEST_ALLOWANCE) {
    if (response.status !== 200) {
      throw new Error(`Expected verification request ${requestNumber} of ${VERIFY_REQUEST_ALLOWANCE} to return 200, received ${response.status}.`);
    }
    return;
  }

  if (response.status !== 429) {
    throw new Error(`Expected verification request ${requestNumber}, beyond the ${VERIFY_REQUEST_ALLOWANCE}-request allowance, to return 429, received ${response.status}.`);
  }
  const retryAfter = response.headers.get('retry-after');
  if (!retryAfter) {
    throw new Error('A rate-limited verification response must include Retry-After.');
  }
  retryAfterMilliseconds(retryAfter);
}

export function retryAfterMilliseconds(retryAfter) {
  const seconds = Number(retryAfter);
  const retryDate = Date.parse(retryAfter);
  const milliseconds = Number.isFinite(seconds) && seconds >= 0
    ? Math.ceil(seconds * 1000)
    : retryDate > Date.now() ? retryDate - Date.now() : NaN;
  if (!Number.isFinite(milliseconds)) {
    throw new Error(`Verification Retry-After must be a non-negative delay or future HTTP date, received ${retryAfter}.`);
  }
  return milliseconds;
}

export async function verifyVerificationAllowance(fetchImplementation = fetch) {
  const verify = 'https://api.sociobot.in/api/v1/products/legacy-app-rescue/verify';
  const probe = `qa-rate-limit-${crypto.randomUUID()}`;
  let retryAfter = '';
  for (let requestNumber = 1; requestNumber <= VERIFY_REQUEST_ALLOWANCE + 1; requestNumber += 1) {
    const response = await fetchImplementation(`${verify}?license=${encodeURIComponent(`${probe}-${requestNumber}`)}`, { redirect: 'manual' });
    assertVerificationAllowanceResponse(response, requestNumber);
    if (requestNumber > VERIFY_REQUEST_ALLOWANCE) retryAfter = response.headers.get('retry-after') || '';
  }
  return retryAfter;
}

if (process.argv[1]?.endsWith('/verify-billing.mjs')) {
  const checkout = 'https://api.sociobot.in/api/v1/products/legacy-app-rescue/checkout';
  const response = await fetch(checkout, { redirect: 'manual' });
  assertCheckoutResponse(response);
  console.log('Billing checkout verified: 303 to a hosted Dodo session; no Retry-After on the successful redirect.');
  const retryAfter = await verifyVerificationAllowance();
  console.log(`License verification rate limit verified: ${VERIFY_REQUEST_ALLOWANCE} requests are allowed; request ${VERIFY_REQUEST_ALLOWANCE + 1} returned 429 with Retry-After: ${retryAfter}.`);
}
