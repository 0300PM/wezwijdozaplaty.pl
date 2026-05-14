// app/polityka-prywatnosci/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <section className="text-center py-12">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                    Polityka Prywatności
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Informacje dotyczące przetwarzania danych osobowych.
                </p>
            </section>

            <div className="mx-auto max-w-4xl space-y-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>§1 Administrator danych</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-7">
                        <p>
                            Administratorem danych jest właściciel serwisu wezwijdozaplaty.pl.
                        </p>

                        <p>
                            Kontakt możliwy jest pod adresem:
                        </p>

                        <p className="font-medium text-primary">
                            dropmaze.binzes@gmail.com
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>§2 Zakres przetwarzanych danych</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-7">
                        <p>
                            Serwis może przetwarzać dane podane przez użytkownika w formularzu generatora dokumentów.
                        </p>

                        <p>
                            Dane wykorzystywane są wyłącznie w celu wygenerowania dokumentu oraz realizacji usługi.
                        </p>

                        <p>
                            Serwis może przetwarzać dane techniczne, takie jak adres IP lub dane przeglądarki.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>§3 Cookies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-7">
                        <p>
                            Serwis może wykorzystywać pliki cookies w celu poprawnego działania strony oraz analityki ruchu.
                        </p>

                        <p>
                            Użytkownik może zarządzać plikami cookies poprzez ustawienia swojej przeglądarki.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>§4 Udostępnianie danych</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-7">
                        <p>
                            Dane użytkowników nie są sprzedawane podmiotom trzecim.
                        </p>

                        <p>
                            Dane mogą być przekazywane wyłącznie operatorom niezbędnym do działania serwisu, np. operatorom płatności lub hostingu.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>§5 Prawa użytkownika</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-7">
                        <p>
                            Użytkownik ma prawo do:
                        </p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>dostępu do swoich danych,</li>
                            <li>ich poprawiania,</li>
                            <li>żądania usunięcia danych,</li>
                            <li>ograniczenia przetwarzania danych.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}