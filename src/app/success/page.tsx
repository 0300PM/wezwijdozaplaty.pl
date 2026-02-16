import { stripe } from '@/lib/stripe';
import { generatePaymentDemandLetterContent } from '@/ai/flows/generate-payment-demand-letter';
import SuccessDisplay from './success-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sessionId = searchParams['session_id'] as string;

  if (!sessionId) {
    return <ErrorState title="Brak ID sesji" message="Nie znaleziono identyfikatora sesji płatności. Spróbuj ponownie." />;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return <ErrorState title="Płatność nie została zakończona" message="Status Twojej płatności to wciąż nieopłacony. Jeśli problem będzie się powtarzał, skontaktuj się z nami." />;
    }

    const letterDataString = session.metadata?.letterData;
    if (!letterDataString) {
        throw new Error('Nie znaleziono danych do wygenerowania listu w sesji Stripe.');
    }
    
    const letterData = JSON.parse(letterDataString);
    
    const { htmlContent } = await generatePaymentDemandLetterContent(letterData);

    if (!htmlContent) {
        throw new Error('Nie udało się wygenerować treści dokumentu po opłaceniu.');
    }

    return <SuccessDisplay htmlContent={htmlContent} />;

  } catch (error) {
    console.error(`[Success Page Error]`, error);
    const message = error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas weryfikacji płatności."
    return <ErrorState title="Błąd weryfikacji płatności" message={message} />;
  }
}

function ErrorState({ title, message }: { title: string, message: string }) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
            <Button asChild>
                <Link href="/generate">Wróć do generatora</Link>
            </Button>
        </div>
      </div>
    );
}
