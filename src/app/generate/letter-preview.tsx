"use client";

import { useRef, useState, type MouseEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const letterRef = useRef<HTMLDivElement>(null);
  const [isPaying, setIsPaying] = useState(false);
  const { toast } = useToast();

  const handleUnlock = async () => {
    setIsPaying(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ letterData }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.assign(url);
      } else {
        throw new Error('Nie udało się utworzyć sesji płatności. Spróbuj ponownie.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Wystąpił nieznany błąd.';
      toast({
        variant: 'destructive',
        title: 'Błąd płatności',
        description: message,
      });
      setIsPaying(false);
    }
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
            <p className="mt-1 text-sm text-muted-foreground">Dokument jest zabezpieczony. Dokonaj płatności, aby odblokować.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <Button onClick={onReset} variant="outline" size="sm" className='w-1/2 md:w-auto'>
              <RotateCcw className="mr-2 h-4 w-4" />
              Popraw dane
            </Button>
            <Button onClick={handleUnlock} size="sm" className="bg-green-600 hover:bg-green-700 text-white w-1/2 md:w-auto" disabled={isPaying}>
               {isPaying ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Przekierowanie...
                 </>
               ) : (
                 <>
                   <Lock className="mr-2 h-4 w-4" />
                   Odblokuj PDF (39 PLN)
                 </>
               )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            onContextMenu={handleContextMenu}
            className={cn(
                "relative aspect-[210/297] w-full max-w-2xl mx-auto bg-white p-8 sm:p-12 shadow-inner border",
                "select-none"
            )}
          >
             <div ref={letterRef} className="letter-content select-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="text-center p-4 rounded-lg">
                      <span 
                        className="text-4xl sm:text-5xl font-bold text-gray-400 opacity-50 transform -rotate-15 font-sans"
                        style={{
                          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                          pointerEvents: 'none'
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
