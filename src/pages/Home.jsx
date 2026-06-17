import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1 className="hero-title">
              Darmowy generator wezwań do zapłaty
            </h1>
            <p className="hero-text">
              Stwórz profesjonalne, przedsądowe wezwanie do zapłaty w formacie PDF i DOCX w kilka minut. 
              Bez rejestracji, bez bazy danych, bez żadnych ukrytych opłat. Wypełnij formularz, 
              podejrzyj dokument i pobierz gotowy plik.
            </p>
            <div className="hero-badges">
              <span className="badge">100% darmowe</span>
              <span className="badge">PDF + DOCX</span>
              <span className="badge">Zgodne z polskim prawem</span>
            </div>
            <div className="btn-group">
              <Link to="/generator" className="btn">Przejdź do generatora</Link>
              <Link to="/o-nas" className="btn btn-secondary">Dowiedz się więcej</Link>
            </div>
          </div>
          <div className="hero-card">
            <h3>Dlaczego warto?</h3>
            <ul>
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
        <div className="container">
          <h2 className="section-title">Jak to działa?</h2>
          <p className="section-subtitle">
            Trzy proste kroki dzielą Cię od gotowego wezwania do zapłaty, które możesz wysłać dłużnikowi.
          </p>
          <div className="grid-3">
            <div className="card">
              <div className="card-title">Wypełnij dane</div>
              <p className="card-text">
                Podaj dane wierzyciela, dłużnika, kwotę, termin płatności oraz numer konta bankowego. 
                Wybierz rodzaj zobowiązania.
              </p>
            </div>
            <div className="card">
              <div className="card-title">Dostosuj klauzule</div>
              <p className="card-text">
                Zaznacz dodatkowe opcje: odsetki ustawowe, koszty windykacji, ostrzeżenie o BIG, 
                wezwanie solidarne lub ostateczne przedsądowe.
              </p>
            </div>
            <div className="card">
              <div className="card-title">Pobierz dokument</div>
              <p className="card-text">
                Wybierz format PDF lub DOCX, wygeneruj dokument i natychmiast pobierz gotowe wezwanie 
                do zapłaty na swój komputer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <h2 className="section-title">Co możesz wygenerować?</h2>
          <p className="section-subtitle">
            Generator obsługuje najpopularniejsze rodzaje zobowiązań występujące w praktyce gospodarczej i prywatnej.
          </p>
          <div className="grid-3">
            {[
              'Niezapłacona faktura VAT',
              'Czynsz najmu',
              'Opłaty eksploatacyjne',
              'Wynagrodzenie za zlecenie',
              'Umowa o dzieło',
              'Sprzedaż towaru',
              'Dostawa usług',
              'Pożyczka prywatna',
              'Szkoda majątkowa'
            ].map((item) => (
              <div className="card" key={item}>
                <div className="card-title">{item}</div>
                <p className="card-text">Wygeneruj profesjonalne wezwanie do zapłaty dla tej kategorii.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Gotowy, by odzyskać należność?</h2>
          <p className="section-subtitle">
            Nie trać czasu na ręczne pisanie pism. Skorzystaj z darmowego generatora i wyślij 
            profesjonalne wezwanie do zapłaty jeszcze dziś.
          </p>
          <Link to="/generator" className="btn" style={{ fontSize: '1rem', padding: '0.875rem 1.75rem' }}>
            Wygeneruj wezwanie do zapłaty
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
