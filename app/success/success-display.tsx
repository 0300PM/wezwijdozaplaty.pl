'use client';

import { Button } from '@/components/ui/button';
import { Download, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// ✅ Typ props pasujący do tego co wysyła page.tsx
interface SuccessDisplayProps {
    letterData: Record<string, unknown>;
}

export default function SuccessDisplay({ letterData }: SuccessDisplayProps) {
    const handleDownloadJSON = () => {
        const blob = new Blob([JSON.stringify(letterData, null, 2)], {
            type: 'application/json;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'wezwanie-do-zaplaty.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Nagłówek sukcesu */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-green-700">
                    Płatność zakończona pomyślnie!
                </h1>
                <p className="text-gray-600 mt-2">
                    Twoje wezwanie do zapłaty zostało wygenerowane.
                </p>
            </div>

            {/* Przyciski akcji */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button onClick={handlePrint} className="gap-2">
                    <Download className="h-4 w-4" />
                    Drukuj / Zapisz PDF
                </Button>
                <Button onClick={handleDownloadJSON} variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Pobierz dane
                </Button>
                <Button asChild variant="ghost" className="gap-2">
                    <Link href="/generate">
                        <ArrowLeft className="h-4 w-4" />
                        Wróć do generatora
                    </Link>
                </Button>
            </div>

            {/* Podgląd danych dokumentu */}
            <div className="border rounded-lg shadow-lg bg-white">
                <div className="bg-gray-50 border-b px-6 py-3 rounded-t-lg">
                    <h2 className="text-sm font-medium text-gray-500">
                        Podgląd dokumentu
                    </h2>
                </div>
                <div className="p-8 sm:p-12">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">
            {JSON.stringify(letterData, null, 2)}
          </pre>
                </div>
            </div>
        </div>
    );
}