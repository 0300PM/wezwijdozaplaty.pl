import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import type { PaymentDemandLetterInput } from '@/ai/flows/generate-payment-demand-letter';

export async function POST(req: NextRequest) {
  try {
    const { letterData }: { letterData: PaymentDemandLetterInput } = await req.json();

    if (!letterData) {
      return NextResponse.json({ error: 'Letter data is required' }, { status: 400 });
    }
    
    const origin = req.headers.get('origin') || 'http://localhost:9002';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'p24'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Wezwanie do zapłaty - Dokument PDF',
              description: 'Profesjonalnie wygenerowany, gotowy do wysłania dokument wezwania do zapłaty.',
            },
            unit_amount: 3900, // 39.00 PLN
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        // Store the letter data in metadata to retrieve it after successful payment
        letterData: JSON.stringify(letterData),
      },
    });

    if (!session.url) {
        throw new Error('Could not create Stripe checkout session');
    }

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error('Error creating checkout session:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
