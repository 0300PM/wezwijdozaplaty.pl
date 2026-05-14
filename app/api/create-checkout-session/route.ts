import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type { PaymentDemandLetterInput } from '@/ai/flows/generate-payment-demand-letter';

function validateLetterData(data: unknown): data is PaymentDemandLetterInput {
    if (!data || typeof data !== 'object') return false;

    const d = data as Record<string, unknown>;

    const requiredFields = [
        'creditorName',
        'debtorName',
        'amount',
        'dueDate',
    ];

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

        if (!body?.letterData) {
            return NextResponse.json({ error: 'Letter data is required' }, { status: 400 });
        }

        if (!validateLetterData(body.letterData)) {
            return NextResponse.json({ error: 'Invalid letter data' }, { status: 400 });
        }

        if (!stripe) {
            return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
        }

        const origin =
            req.headers.get('origin') ||
            process.env.NEXT_PUBLIC_APP_URL ||
            'http://localhost:3000';

        const UNIT_AMOUNT = 3900;

        // --- 1. Create letter ---
        const letter = await prisma.letter.create({
            data: {
                data: JSON.parse(JSON.stringify(body.letterData)),
                status: 'pending',
            },
        });

        // --- 2. Create Stripe session ---
        const session = await stripe.checkout.sessions.create(
            {
                mode: 'payment',

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

                // 🔥 WAŻNE
                customer_creation: 'always',
                billing_address_collection: 'required',

                // opcjonalne, ale polecane
                allow_promotion_codes: true,
            },
            {
                // 🔥 zabezpieczenie przed duplikacją
                idempotencyKey: `checkout_${letter.id}`,
            }
        );

        if (!session.url) {
            throw new Error('No session URL');
        }

        // --- 3. Create order ---
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
        console.error(err);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}