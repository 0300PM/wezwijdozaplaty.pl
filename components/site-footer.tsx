import Link from "next/link";
import { Logo } from "./logo";

export default function SiteFooter() {
    return (
        <footer className="border-t bg-background">
            <div className="container py-8 md:py-6">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-4">

                    <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
                        <Logo />

                        <p className="text-sm text-muted-foreground text-center md:text-left">
                            © {new Date().getFullYear()} ZapłaćTeraz. Wszelkie prawa zastrzeżone.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-end">

                        <Link
                            href="/regulamin"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Regulamin
                        </Link>

                        <Link
                            href="/polityka-prywatnosci"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Polityka prywatności
                        </Link>

                        <Link
                            href="/kontakt"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Kontakt
                        </Link>

                    </div>
                </div>
            </div>
        </footer>
    );
}