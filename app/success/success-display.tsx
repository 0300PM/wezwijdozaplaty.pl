'use client';

import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadCloud, PartyPopper } from 'lucide-react';
import Link from 'next/link';

export default function SuccessDisplay({ htmlContent }: { htmlContent: string }) {
  const letterRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow && letterRef.current) {
        const styles = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;700&display=swap');
                @page {
                    size: A4;
                    margin: 2.5cm;
                }
                body { 
                    -webkit-print-color-adjust: exact; 
                }
            </style>
        `;
      printWindow.document.write('<html><head><title>Wezwanie do zapłaty</title>');
      printWindow.document.write(styles);
      printWindow.document.write('</head><body>');
      printWindow.document.write(letterRef.current.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };
  
  return (
     <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
      <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
        <PartyPopper className="mx-auto h-12 w-12 text-green-600" />
        <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Płatność zakończona pomyślnie!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Twoje wezwanie do zapłaty zostało odblokowane i jest gotowe do pobrania.
        </p>
      </div>

       <Card className="shadow-lg">
         <CardHeader className="flex flex-row items-center justify-between">
           <CardTitle className="font-headline">Gotowy dokument</CardTitle>
           <div className="flex gap-2">
             <Button asChild variant="outline" size="sm">
               <Link href="/generate">
                 Nowe wezwanie
               </Link>
             </Button>
             <Button onClick={handlePrint} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
               <DownloadCloud className="mr-2 h-4 w-4" />
               Drukuj / Zapisz PDF
             </Button>
           </div>
         </CardHeader>
         <CardContent>
           <div
             className="aspect-[210/297] w-full max-w-2xl mx-auto bg-white p-8 sm:p-12 shadow-inner border"
           >
             <div ref={letterRef} className="letter-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
           </div>
         </CardContent>
       </Card>

       <div className="text-center text-sm text-muted-foreground">
         <p>Aby zapisać jako PDF, w oknie dialogowym drukowania wybierz opcję "Zapisz jako PDF" (Save as PDF).</p>
       </div>
     </div>
  );
}
