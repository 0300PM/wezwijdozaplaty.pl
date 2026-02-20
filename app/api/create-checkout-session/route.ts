import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from "../../../lib/prisma";
import type { PaymentDemandLetterInput } from '@/ai/flows/generate-payment-demand-letter';
import { saveLetter } from '../../../lib/letter-store';

export async function POST(req: NextRequest) {
    try {
        let body: { letterData?: PaymentDemandLetterInput } | null = null;

        try {
            body = await req.json();
        } catch (parseError) {
            return NextResponse.json(
                { error: 'Invalid JSON body' },
                { status: 400 }
            );
        }

        const letterData = body?.letterData;

        if (!letterData) {
            return NextResponse.json(
                { error: 'Letter data is required' },
                { status: 400 }
            );
        }

        if (!stripe) {
            console.error('Stripe not initialized. Check STRIPE_SECRET_KEY.');
            return NextResponse.json(
                { error: 'Payment system configuration error' },
                { status: 500 }
            );
        }

        const origin =
            req.headers.get('origin') ||
            process.env.NEXT_PUBLIC_APP_URL ||
            'http://localhost:3000';

        const letterId = saveLetter(letterData);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'p24'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'pln',
                        product_data: {
                            name: 'Wezwanie do zapłaty - Dokument PDF',
                            description:
                                'Profesjonalnie wygenerowany, gotowy do wysłania dokument wezwania do zapłaty.',
                        },
                        unit_amount: 3900,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel`,
            metadata: {
                letterId,
            },
        });

        if (!session?.url) {
            return NextResponse.json(
                { error: 'Stripe session created but no URL returned' },
                { status: 500 }
            );
        }

        await prisma.order.create({
            data: {
                stripeSessionId: session.id,
                amount: 39,
                status: 'pending',
                email: session.customer_email ?? '',
            },
        });

        return NextResponse.json({ url: session.url }, { status: 200 });

    } catch (err: any) {
        console.error('Stripe error details:', err?.raw || err);

        return NextResponse.json(
            {
                error: 'Failed to create checkout session',
                details: err?.message || 'Unknown error',
            },
            { status: 500 }
        );
    }
}