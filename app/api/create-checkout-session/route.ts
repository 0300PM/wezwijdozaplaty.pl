import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type { PaymentDemandLetterInput } from '@/ai/flows/generate-payment-demand-letter';

function validateLetterData(data: unknown): data is PaymentDemandLetterInput {
    if (!data || typeof data !== 'object') return false;
    const d = data as Record<string, unknown>;
    const requiredFields = ['creditorName', 'debtorName', 'amount', 'invoiceDueDate'];
    return requiredFields.every(
        (field) =>
            d[field] !== undefined &&
            d[field] !== null &&
            !(typeof d[field] === 'string' && d[field].trim() === '')
    );
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => null);

        if (!body?.letterData || !validateLetterData(body.letterData)) {
            return NextResponse.json({ error: 'Invalid or missing letter data' }, { status: 400 });
        }

        if (!stripe) {
            return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
        }

        const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const UNIT_AMOUNT = 999;

        const letter = await prisma.letter.create({
            data: {
                data: JSON.parse(JSON.stringify(body.letterData)),
                status: 'pending',
            },
        });

        const session = await stripe.checkout.sessions.create(
            {
                mode: 'payment',
                payment_method_types: ['card', 'blik', 'p24'],
                line_items: [
                    {
                        price_data: {
                            currency: 'pln',
                            unit_amount: UNIT_AMOUNT,
                            product_data: {
                                name: 'Wezwanie do zapłaty - PDF',
                            },
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/cancel`,
                metadata: {
                    letterId: letter.id,
                },
            },
            {
                idempotencyKey: `checkout_${letter.id}`,
            }
        );

        if (!session.url) {
            return NextResponse.json({ error: 'Stripe session creation failed' }, { status: 500 });
        }

        await prisma.order.create({
            data: {
                stripeSessionId: session.id,
                amount: UNIT_AMOUNT,
                status: 'pending',
                email: '',
                letterId: letter.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('Checkout error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}