import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set for production');
  } else {
    // In development, it's okay to have a placeholder, but we should warn.
    console.warn('STRIPE_SECRET_KEY is not set. Stripe functionality will not work.');
  }
}

// We assert the type because we've handled the undefined case.
// The check above ensures this will be a string if in production.
export const stripe = new Stripe(stripeSecretKey!, {
  apiVersion: '2024-06-20',
  typescript: true,
});
