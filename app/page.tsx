import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border bg-surface py-12 md:py-20">
        <div className="mx-auto grid w-full max-w-app grid-cols-1 items-start gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h1 className="mb-5 text-4xl font-semibold leading-tight tracking-tight text-primary md:text-5xl">
              Darmowy generator wezwań do zapłaty
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-textMuted">
              Stwórz profesjonalne, przedsądowe wezwanie do zapłaty w formacie PDF i DOCX w kilka minut. Bez rejestracji, bez bazy danych, bez żadnych ukrytych opłat.
            </p>
            <div className="mb-8 flex flex-wrap gap-3">
              {["100% darmowe", "PDF + DOCX", "Zgodne z polskim prawem"].map((badge) => (
                <span key={badge} className="inline-flex items-center rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium text-textMuted">
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/generator" className="btn">Przejdź do generatora</Link>
              <Link href="/o-nas" className="btn btn-secondary">Dowiedz się więcej</Link>
            </div>
          </div>
          <div className="rounded border border-border bg-bg p-7">
            <h3 className="mb-4 text-base font-semibold text-primary">Dlaczego warto?</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-textMuted">
              <li>Intuicyjny formularz z podglądem na żywo</li>
              <li>Wiele rodzajów zobowiązań do wyboru</li>
              <li>Klauzule o odsetkach, kosztach windykacji i BIG</li>
              <li>Wezwania solidarne i ostateczne przedsądowe</li>
              <li>Bezpieczeństwo danych — nic nie przechowujemy</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto w-full max-w-app px-6">
          <h2 className="section-title">Jak to działa?</h2>
          <p className="section-subtitle">Trzy proste kroki dzielą Cię od gotowego wezwania do zapłaty, które możesz wysłać dłużnikowi.</p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="card"><div className="card-title">Wypełnij dane</div><p className="card-text">Podaj dane wierzyciela, dłużnika, kwotę, termin płatności oraz numer konta bankowego. Wybierz rodzaj zobowiązania.</p></div>
            <div className="card"><div className="card-title">Dostosuj klauzule</div><p className="card-text">Zaznacz dodatkowe opcje: odsetki ustawowe, koszty windykacji, ostrzeżenie o BIG, wezwanie solidarne lub ostateczne przedsądowe.</p></div>
            <div className="card"><div className="card-title">Pobierz dokument</div><p className="card-text">Wybierz format PDF lub DOCX, wygeneruj dokument i natychmiast pobierz gotowe wezwanie do zapłaty na swój komputer.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
