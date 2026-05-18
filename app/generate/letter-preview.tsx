import { type MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentDemandLetterInput } from '@/ai/flows/generate-payment-demand-letter';

type LetterPreviewProps = {
    htmlContent: string;
    letterData: PaymentDemandLetterInput;
    onReset: () => void;
};

export default function LetterPreview({
                                          htmlContent,
                                          onReset,
                                      }: LetterPreviewProps) {

    const handleDownload = async () => {
        try {
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ htmlContent }),
            });

           /// if (!response.ok) {
          ///      throw new Error('Błąd generowania PDF');
           /// }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'wezwanie-do-zaplaty.pdf';
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Nie udało się pobrać PDF.');
        }
    };

    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="shadow-lg">
                <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <CardTitle className="font-headline">
                            Podgląd dokumentu
                        </CardTitle>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Dokument gotowy do pobrania.
                        </p>
                    </div>

                    <div className="flex w-full gap-2 md:w-auto">
                        <Button
                            onClick={onReset}
                            variant="outline"
                            size="sm"
                            className="w-1/2 md:w-auto"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Popraw dane
                        </Button>

                        <Button
                            onClick={handleDownload}
                            size="sm"
                            className="w-1/2 md:w-auto"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Pobierz PDF
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
                            className="letter-content"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}