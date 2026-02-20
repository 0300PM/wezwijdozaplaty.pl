import { stripe } from '@/lib/stripe';
import SuccessDisplay from './success-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getLetter } from '../../lib/letter-store';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SuccessPage({
                                              searchParams,
                                          }: {
    searchParams: SearchParams;
}) {
    const resolvedSearchParams = await searchParams;
    const sessionIdParam = resolvedSearchParams['session_id'];

    if (!sessionIdParam || Array.isArray(sessionIdParam)) {
        return (
            <ErrorState
                title="Brak ID sesji"
                message="Nie znaleziono identyfikatora sesji płatności. Spróbuj ponownie."
            />
        );
    }

    const sessionId: string = sessionIdParam;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent'],
        });

        if (session.payment_status !== 'paid') {
            return (
                <ErrorState
                    title="Płatność nie została zakończona"
                    message="Status Twojej płatności to wciąż nieopłacony."
                />
            );
        }

        const letterId = session.metadata?.letterId;

        if (!letterId) {
            return (
                <ErrorState
                    title="Brak danych dokumentu"
                    message="Nie znaleziono ID dokumentu w sesji płatności."
                />
            );
        }

        const storedLetter = getLetter(letterId);

        if (!storedLetter) {
            return (
                <ErrorState
                    title="Dane dokumentu wygasły"
                    message="Dane dokumentu nie są już dostępne w pamięci serwera."
                />
            );
        }

        // ✅ Przekazujemy letterData jako serializowalny obiekt
        const letterData = JSON.parse(JSON.stringify(storedLetter.data));

        return <SuccessDisplay letterData={letterData} />;
    } catch (error: unknown) {
        console.error('[Success Page Error]', error);

        const message =
            error instanceof Error
                ? error.message
                : 'Wystąpił nieznany błąd podczas weryfikacji płatności.';

        return <ErrorState title="Błąd weryfikacji płatności" message={message} />;
    }
}

function ErrorState({
                        title,
                        message,
                    }: {
    title: string;
    message: string;
}) {
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