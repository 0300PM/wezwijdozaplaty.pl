import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary px-0 pb-6 pt-14 text-sm text-[#323232]">
      <div className="mx-auto w-full max-w-app px-6">
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <div className="mb-4 text-sm font-semibold text-white">Wezwij do Zapłaty</div>
            <p>
              Darmowy generator wezwań do zapłaty. Twórz profesjonalne dokumenty przedsądowe w formacie PDF i DOCX bez rejestracji.
            </p>
          </div>
          <div>
            <div className="mb-4 text-sm font-semibold text-white">Aplikacja</div>
            <Link href="/generator" className="footer-link">Generator</Link>
            <Link href="/o-nas" className="footer-link">O nas</Link>
            <Link href="/blog" className="footer-link">Blog</Link>
            <Link href="/faq" className="footer-link">FAQ</Link>
          </div>
          <div>
            <div className="mb-4 text-sm font-semibold text-white">Informacje</div>
            <Link href="/regulamin" className="footer-link">Regulamin</Link>
            <Link href="/polityka-prywatnosci" className="footer-link">Polityka prywatności</Link>
            <Link href="/rodo" className="footer-link">RODO</Link>
            <Link href="/reklamy-i-prywatnosc" className="footer-link">Reklamy i prywatność</Link>
          </div>
          <div>
            <div className="mb-4 text-sm font-semibold text-white">Kontakt</div>
            <a className="footer-link" href="mailto:kontakt@wezwijdozaplaty.pl">kontakt@wezwijdozaplaty.pl</a>
            <p className="mt-4">© {new Date().getFullYear()} Wezwij do Zapłaty</p>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 text-center text-xs text-neutral-500">
          Treści serwisu mają charakter informacyjny i nie stanowią porady prawnej. Korzystanie z generatora jest całkowicie darmowe.
        </div>
      </div>
    </footer>
  );
}
