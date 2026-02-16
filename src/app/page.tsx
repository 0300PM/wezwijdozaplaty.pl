import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye, Download } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <section className="text-center py-16">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          Twoje Profesjonalne Wezwanie do Zapłaty w 3 Minuty
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
          ZapłaćTeraz to najszybszy sposób na wygenerowanie oficjalnego, zgodnego z prawem wezwania do zapłaty. Oszczędź czas i pieniądze na prawnikach.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
            <Link href="/generate">Generuj wezwanie teraz</Link>
          </Button>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">Jak to działa?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Proces jest prosty i intuicyjny. Wystarczą 3 kroki.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-primary">1. Wypełnij formularz</h3>
            <p className="mt-2 text-base text-muted-foreground">
              Podaj dane wierzyciela, dłużnika oraz informacje o fakturze, aby wygenerować podgląd.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-primary">2. Dokonaj płatności</h3>
            <p className="mt-2 text-base text-muted-foreground">
              Zobaczysz zabezpieczony podgląd dokumentu. Dokonaj bezpiecznej płatności, aby go odblokować.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-primary">3. Pobierz PDF</h3>
            <p className="mt-2 text-base text-muted-foreground">
              Natychmiast po opłaceniu otrzymasz gotowe do wysłania wezwanie w formacie PDF.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16">
        <div className="flex justify-center">
          <Card className="w-full max-w-sm text-center shadow-lg border-2 border-primary">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary">Jednorazowa opłata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="my-4">
                <span className="text-5xl font-bold">39</span>
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
    </div>
  );
}
