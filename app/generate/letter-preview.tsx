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

    const handleUnlock = async () => {
        setIsPaying(true);

        console.log('Sending letterData:', JSON.stringify(letterData, null, 2));

        const payload = { letterData };

        let response: Response;
        try {
            response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } catch {
            showError('Nie udało się połączyć z serwerem.');
            return;
        }

        if (!response.ok) {
            let msg = `Błąd serwera (${response.status})`;
            try {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                if (errorData?.error) msg = errorData.error;
            } catch {
                const text = await response.text().catch(() => '');
                console.error('Server error (non-JSON):', text);
            }
            showError(msg);
            return;
        }

        let data;
        try {
            data = await response.json();
        } catch {
            showError('Nieprawidłowa odpowiedź serwera.');
            return;
        }

        if (data?.error) {
            showError(data.error);
            return;
        }

        if (!data?.url) {
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
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="font-headline">Podgląd dokumentu</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Dokument jest zabezpieczony. Dokonaj płatności, aby odblokować.
                        </p>
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <Button onClick={onReset} variant="outline" size="sm" className="w-1/2 md:w-auto">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Popraw dane
                        </Button>
                        <Button
                            onClick={handleUnlock}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white w-1/2 md:w-auto"
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
                            'relative aspect-[210/297] w-full max-w-2xl mx-auto bg-white p-8 sm:p-12 shadow-inner border',
                            'select-none'
                        )}
                    >
                        <div
                            className="letter-content select-none"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                            <div className="text-center p-4 rounded-lg">
                <span
                    className="inline-block text-4xl sm:text-5xl font-bold text-gray-400 opacity-50 -rotate-12 font-sans"
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