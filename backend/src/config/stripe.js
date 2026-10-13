import Stripe from 'stripe';
import { logger } from './logger.js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripeInstance = null;

if (stripeSecretKey && !stripeSecretKey.includes('placeholder')) {
  try {
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
    logger.info('Stripe SDK initialized with live/test key');
  } catch (err) {
    logger.error(`Failed to initialize Stripe: ${err.message}`);
  }
} else {
  logger.warn('STRIPE_SECRET_KEY not configured or is placeholder. Using smart simulation mode for payments.');
}

export const getStripe = () => stripeInstance;

export const createPaymentIntent = async ({ amount, currency = 'usd', metadata = {} }) => {
  const stripe = getStripe();
  const amountInCents = Math.round(amount * 100);

  if (stripe) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      isSimulated: false,
    };
  }

  // Simulated Payment Intent for development / sandbox testing
  const mockId = `pi_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  return {
    clientSecret: `${mockId}_secret_${Math.random().toString(36).substring(7)}`,
    paymentIntentId: mockId,
    isSimulated: true,
  };
};
