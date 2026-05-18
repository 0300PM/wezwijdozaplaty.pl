### 1. dot. płatności została usunięta ze względu na to że serwis przechodzi w system bez transakcyjny poniżej znajduje się souce code który został usunięty
```text
<Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>§3 Płatności</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-7">
                        <p>
                            Dostęp do pobrania dokumentu PDF może wymagać dokonania jednorazowej płatności.
                        </p>

                        <p>
                            Płatności realizowane są przez zewnętrznego operatora płatności.
                        </p>

                        <p>
                            Po poprawnym zaksięgowaniu płatności użytkownik otrzymuje możliwość pobrania dokumentu.
                        </p>
                    </CardContent>
                </Card>
```
### karta o jednorazowej opłacie 
````
 <section id="pricing" className="py-16">
        <div className="flex justify-center">
          <Card className="w-full max-w-sm text-center shadow-lg border-2 border-primary">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary">Jednorazowa opłata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="my-4">
                <span className="text-5xl font-bold">9.99</span>
                <span className="text-xl font-medium text-muted-foreground"> PLN</span>
              </div>
              <p className="text-muted-foreground mb-6">
                Pełny dostęp, bez abonamentu i ukrytych kosztów. Płacisz raz, generujesz dokument.
              </p>
              <Button asChild className="w-full bg-accent hover:bg-accent/90" size="lg">
                <Link href="/generate">Rozpocznij</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
````


## letter preview

usunięta cała warstwa api by bramka była wygaszona 
kod przed zmianami 
```text
import { useState, type MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Lock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentDemandLetterInput } from '@/ai/flows/generate-payment-demand-letter';
import { useToast } from '@/hooks/use-toast';

type LetterPreviewProps = {
    htmlContent: string;
    letterData: PaymentDemandLetterInput;
    onReset: () => void;
};

export default function LetterPreview({ htmlContent, letterData, onReset }: LetterPreviewProps) {
    const [isPaying, setIsPaying] = useState(false);
    const { toast } = useToast();

    const showError = (message: string) => {
        toast({
            variant: 'destructive',
            title: 'Błąd płatności',
            description: message,
        });
        setIsPaying(false);
    };

    const getErrorMessage = async (response: Response) => {
        const fallback = `Błąd serwera (${response.status})`;
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            const errorData = await response.json().catch(() => null);

            if (
                errorData &&
                typeof errorData === 'object' &&
                'error' in errorData &&
                typeof errorData.error === 'string' &&
                errorData.error.trim() !== ''
            ) {
                return errorData.error;
            }

            return fallback;
        }

        const text = await response.text().catch(() => '');
        return text.trim() || fallback;
    };

    const handleUnlock = async () => {
        setIsPaying(true);

        let response: Response;
        try {
            response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ letterData }),
            });
        } catch {
            showError('Nie udało się połączyć z serwerem.');
            return;
        }

        if (!response.ok) {
            const msg = await getErrorMessage(response);
            showError(msg);
            return;
        }

        const data = await response.json().catch(() => null);

        if (!data || typeof data !== 'object') {
            showError('Nieprawidłowa odpowiedź serwera.');
            return;
        }

        if ('error' in data && typeof data.error === 'string' && data.error.trim() !== '') {
            showError(data.error);
            return;
        }

        if (!('url' in data) || typeof data.url !== 'string' || data.url.trim() === '') {
            showError('Nie udało się utworzyć sesji płatności.');
            return;
        }

        window.location.assign(data.url);
        setTimeout(() => setIsPaying(false), 5000);
    };

    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="shadow-lg">
                <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <CardTitle className="font-headline">Podgląd dokumentu</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Dokument jest zabezpieczony. Dokonaj płatności, aby odblokować.
                        </p>
                    </div>
                    <div className="flex w-full gap-2 md:w-auto">
                        <Button onClick={onReset} variant="outline" size="sm" className="w-1/2 md:w-auto">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Popraw dane
                        </Button>
                        <Button
                            onClick={handleUnlock}
                            size="sm"
                            className="w-1/2 bg-green-600 text-white hover:bg-green-700 md:w-auto"
                            disabled={isPaying}
                        >
                            {isPaying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Przekierowanie...
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Odblokuj PDF (9.99 PLN)
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div
                        onContextMenu={handleContextMenu}
                        className={cn(
                            'relative aspect-[210/297] w-full max-w-2xl mx-auto border bg-white p-8 shadow-inner sm:p-12',
                            'select-none'
                        )}
                    >
                        <div
                            className="letter-content select-none"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                            <div className="rounded-lg p-4 text-center">
                <span
                    className="inline-block -rotate-12 font-sans text-4xl font-bold text-gray-400 opacity-50 sm:text-5xl"
                    style={{
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                        pointerEvents: 'none',
                    }}
                    aria-hidden="true"
                >
                  Wersja podglądowa
                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
```
