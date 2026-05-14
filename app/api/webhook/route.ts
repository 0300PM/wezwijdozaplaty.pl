// app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// 🔥 WAŻNE - Stripe NIE działa na edge
export const runtime = 'nodejs';

export async function POST(req: Request) {
    if (!stripe) {
        return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
    }

    // 🔥 KLUCZOWE
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('❌ Stripe signature error:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 🔥 opcjonalne (ale bardzo polecane)
    if (process.env.NODE_ENV === 'production' && !event.livemode) {
        console.warn('⚠️ Ignoring test event in production');
        return NextResponse.json({ received: true });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event);
                break;

            case 'checkout.session.expired':
                await handleCheckoutSessionExpired(event);
                break;

            default:
                console.log(`Unhandled event: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error('❌ Webhook handler error:', err);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentIntentId =
        typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

    const email = session.customer_details?.email ?? '';

    const order = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
    });

    if (!order) {
        console.error('❌ Order not found:', session.id);
        return;
    }

    // 🔥 idempotencja
    if (order.status === 'paid') {
        console.log('⚠️ Already paid:', order.id);
        return;
    }

    await prisma.$transaction([
        prisma.order.update({
            where: { stripeSessionId: session.id },
            data: {
                status: 'paid',
                email,
                ...(paymentIntentId && {
                    stripePaymentIntentId: paymentIntentId,
                }),
            },
        }),

        ...(order.letterId
            ? [
                prisma.letter.update({
                    where: { id: order.letterId },
                    data: { status: 'paid' },
                }),
            ]
            : []),
    ]);

    console.log('✅ Payment completed:', order.id);
}

async function handleCheckoutSessionExpired(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;

    const order = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
    });

    if (!order) return;

    if (order.status !== 'pending') return;

    await prisma.$transaction([
        prisma.order.update({
            where: { stripeSessionId: session.id },
            data: { status: 'expired' },
        }),

        ...(order.letterId
            ? [
                prisma.letter.update({
                    where: { id: order.letterId },
                    data: { status: 'expired' },
                }),
            ]
            : []),
    ]);

    console.log('⌛ Session expired:', order.id);
}