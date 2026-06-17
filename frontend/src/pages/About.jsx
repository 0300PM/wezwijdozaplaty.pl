function About() {
  return (
    <div className="section">
      <div className="container legal-page">
        <h1>O nas</h1>
        <p>
          <strong>Wezwij do Zapłaty</strong> to darmowe narzędzie internetowe stworzone z myślą o osobach 
          fizycznych oraz przedsiębiorcach, które chcą szybko i profesjonalnie przygotować przedsądowe 
          wezwanie do zapłaty. Naszym celem jest uproszczenie procesu windykacji polubownej, aby każdy 
          mógł odzyskać należności bez zbędnych kosztów i formalności.
        </p>
        <h2>Dlaczego powstał ten projekt?</h2>
        <p>
          Windykacja należności często kojarzy się z drogimi kancelariami prawnymi lub skomplikowanymi 
          wzorami pism. Wierzymy, że podstawowe dokumenty przedsądowe — takie jak wezwanie do zapłaty — 
          można wygenerować automatycznie, zachowując przy tym poprawność merytoryczną i przejrzystość formy.
        </p>
        <h2>Co oferujemy?</h2>
        <ul>
          <li>Darmowy generator wezwań do zapłaty w formatach PDF i DOCX.</li>
          <li>Intuicyjny formularz z podglądem na żywo.</li>
          <li>Możliwość dopasowania klauzul: odsetki ustawowe, koszty windykacji, BIG, wezwanie solidarne.</li>
          <li>Wiele rodzajów zobowiązań: faktury VAT, czynsz, umowy, pożyczki, szkody i inne.</li>
          <li>Brak rejestracji, brak bazy danych — dane nie są przechowywane po stronie serwera.</li>
        </ul>
        <h2>Dla kogo?</h2>
        <p>
          Aplikacja jest przeznaczona dla przedsiębiorców, właścicieli mieszkań na wynajem, osób prowadzących 
          działalność gospodarczą na zlecenie, a także osób prywatnych, które udzieliły pożyczki lub doznały 
          szkody majątkowej. Wezwanie do zapłaty to pierwszy, formalny krok w procesie windykacyjnym.
        </p>
        <h2>Bezpieczeństwo i prywatność</h2>
        <p>
          Dane wprowadzone do formularza służą wyłącznie do wygenerowania dokumentu w trakcie jednej sesji. 
          Nie zapisujemy, nie przetwarzamy ani nie udostępniamy danych osobowych użytkowników podmiotom trzecim. 
          Szczegóły znajdziesz w <a href="/polityka-prywatnosci">Polityce prywatności</a> oraz w zakładce 
          <a href="/rodo"> RODO</a>.
        </p>
        <h2>Informacja prawna</h2>
        <p>
          Treści zamieszczone w serwisie mają charakter wyłącznie informacyjny i nie stanowią porady prawnej. 
          W przypadku wątpliwości lub skomplikowanych spraw zalecamy konsultację z prawnikiem. Korzystanie 
          z generatora jest całkowicie darmowe i dobrowolne.
        </p>
      </div>
    </div>
  );
}

export default About;
