import { Logo } from "./logo";

export default function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between md:py-6">

                {/* Lewa strona */}
                <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
                    <Logo />
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} ZapłaćTeraz. Wszelkie prawa zastrzeżone.
                    </p>
                </div>

                {/* Prawa strona (opcjonalna) */}
                <div className="flex items-center justify-center gap-4 md:justify-end">
                    <a href="/regulamin" className="text-sm text-muted-foreground hover:text-foreground">
                        Regulamin
                    </a>
                    <a href="/polityka-prywatnosci" className="text-sm text-muted-foreground hover:text-foreground">
                        Polityka prywatności
                    </a>
                </div>

            </div>
        </footer>
    );
}