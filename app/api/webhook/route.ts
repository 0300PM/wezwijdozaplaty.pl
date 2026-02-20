import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '../../../lib/prisma';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;
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
        console.log(` Error message: ${message}`);
        return new Response(`Webhook Error: ${message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log(' Payment was successful for session ID:', session.id);
        console.log(' Customer email:', session.customer_details?.email);

        await prisma.order.update({
            where: {
                stripeSessionId: session.id,
            },
            data: {
                status: 'paid',
                stripePaymentIntentId: session.payment_intent as string,
            },
        });
    } else {
        console.warn(` Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}