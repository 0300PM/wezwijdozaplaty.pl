import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

// We need to disable the default body parser to get the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret is not set.');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.log(`❌ Error message: ${message}`);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // In a real application, you would fulfill the order here.
    // For example, you might save the purchase to a database,
    // send a confirmation email, or grant access to a service.
    // For this app, the fulfillment happens on the /success page,
    // but this webhook is here as a best practice for async fulfillment.
    console.log('✅ Payment was successful for session ID:', session.id);
    console.log('✅ Customer email:', session.customer_details?.email);
  } else {
    console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
