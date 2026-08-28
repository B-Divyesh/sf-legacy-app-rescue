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

if (process.argv[1]?.endsWith('/verify-billing.mjs')) {
  const checkout = 'https://api.sociobot.in/api/v1/products/legacy-app-rescue/checkout';
  const response = await fetch(checkout, { redirect: 'manual' });
  assertCheckoutResponse(response);
  console.log('Billing checkout verified: 303 to a hosted Dodo session; no Retry-After on the successful redirect.');
}
