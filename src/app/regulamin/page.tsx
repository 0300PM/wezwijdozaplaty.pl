import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <section className="text-center py-12">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                    Regulamin Serwisu
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Regulamin korzystania z serwisu ZapłaćTeraz / wezwijdozaplaty.pl
                </p>
            </section>

            <div className="mx-auto max-w-4xl space-y-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>§1 Postanowienia ogólne</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-7">
                        <p>
                            Serwis umożliwia generowanie dokumentów wezwania do zapłaty na podstawie danych wprowadzonych przez użytkownika.
                        </p>

                        <p>
                            Właścicielem serwisu jest osoba fizyczna prowadząca działalność nierejestrowaną.
                        </p>

                        <p>
                            Korzystanie z serwisu oznacza akceptację niniejszego regulaminu.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>§2 Zakres usług</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-7">
                        <p>
                            Serwis umożliwia wygenerowanie dokumentu wezwania do zapłaty w formacie PDF.
                        </p>

                        <p>
                            Dokument tworzony jest automatycznie na podstawie danych podanych przez użytkownika.
                        </p>

                        <p>
                            Serwis nie świadczy usług prawnych ani doradztwa prawnego.
                        </p>

                        <p>
                            Użytkownik ponosi pełną odpowiedzialność za poprawność wprowadzonych danych.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>§3 Odpowiedzialność</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-7">
                        <p>
                            Serwis działa w modelu „as is” i nie gwarantuje skuteczności wygenerowanych dokumentów.
                        </p>

                        <p>
                            Właściciel serwisu nie odpowiada za skutki wykorzystania wygenerowanych dokumentów.
                        </p>

                        <p>
                            Użytkownik powinien zweryfikować dokument przed jego użyciem.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>§4 Kontakt</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-7">
                        <p>
                            Kontakt z administratorem możliwy jest poprzez adres e-mail:
                        </p>

                        <p className="font-medium text-primary">
                           dropmaze.biznes@gmail.com
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}