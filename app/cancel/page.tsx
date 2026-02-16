import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="mt-4 font-headline text-2xl">Płatność anulowana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Twoja transakcja została anulowana lub nie powiodła się. Nie pobrano żadnych środków z Twojego konta.
          </p>
          <Button asChild>
            <Link href="/generate">Wróć do generatora</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
