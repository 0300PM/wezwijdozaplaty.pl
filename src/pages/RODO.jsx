function RODO() {
  return (
    <div className="section">
      <div className="container legal-page">
        <h1>RODO — Informacje o przetwarzaniu danych osobowych</h1>
        <p>
          Zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. 
          w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego 
          przepływu takich danych (RODO), poniżej przedstawiamy podstawowe informacje o przetwarzaniu danych 
          w serwisie Wezwij do Zapłaty.
        </p>
        <h2>Administrator danych</h2>
        <p>
          Administratorem danych osobowych przekazywanych za pośrednictwem serwisu jest operator serwisu 
          Wezwij do Zapłaty. Wszelkie sprawy związane z ochroną danych można zgłaszać na adres e-mail: 
          kontakt@wezwijdozaplaty.pl.
        </p>
        <h2>Cel i zakres przetwarzania</h2>
        <p>
          Dane wprowadzane do formularza generatora (np. dane wierzyciela, dłużnika, kwota, numer konta) są 
          wykorzystywane wyłącznie w celu wygenerowania dokumentu wezwania do zapłaty w danej sesji użytkownika. 
          Dane te nie są zapisywane, profilowane ani udostępniane podmiotom trzecim.
        </p>
        <h2>Podstawa prawna</h2>
        <p>
          Podstawą prawną przetwarzania danych jest zgoda użytkownika (art. 6 ust. 1 lit. a RODO) wyrażona 
          przez dobrowolne wypełnienie formularza oraz konieczność wykonania usługi na żądanie użytkownika 
          (art. 6 ust. 1 lit. b RODO).
        </p>
        <h2>Okres przechowywania</h2>
        <p>
          Dane osobowe nie są przechowywane po stronie serwera. Generator przetwarza je wyłącznie w trakcie 
          generowania dokumentu, po czym są one usuwane z pamięci operacyjnej. Brak bazy danych oznacza, że 
          nie zachowujemy historii wypełnianych formularzy ani wygenerowanych dokumentów.
        </p>
        <h2>Prawa osób, których dane dotyczą</h2>
        <p>Każda osoba, której dane dotyczą, ma prawo do:</p>
        <ul>
          <li>dostępu do swoich danych,</li>
          <li>sprostowania nieprawidłowych danych,</li>
          <li>usunięcia danych,</li>
          <li>ograniczenia przetwarzania,</li>
          <li>przenoszenia danych,</li>
          <li>wniesienia sprzeciwu wobec przetwarzania,</li>
          <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
        </ul>
        <h2>Pliki cookies i reklamy</h2>
        <p>
          Serwis wykorzystuje pliki cookies w celu zapewnienia prawidłowego działania aplikacji, anonimowego 
          zbierania statystyk oraz wyświetlania reklam dostosowanych do zainteresowań użytkowników. W tym celu 
          współpracujemy z sieciami reklamowymi, w tym Google AdSense.
        </p>
        <p>
          Użytkownik może w każdej chwili zarządzać ustawieniami cookies za pomocą banneru dostępnego w serwisie 
          lub bezpośrednio w ustawieniach przeglądarki. Odmowa zgody na niektóre cookies może ograniczyć 
          wyświetlanie spersonalizowanych reklam, ale nie uniemożliwi korzystania z podstawowych funkcji serwisu.
        </p>
        <h2>Zmiany informacji</h2>
        <p>
          Administrator zastrzega sobie prawo do aktualizacji niniejszych informacji w miarę zmian przepisów 
          lub funkcjonalności serwisu. O wszelkich istotnych zmianach użytkownicy będą informowani na stronie 
          internetowej.
        </p>
      </div>
    </div>
  );
}

export default RODO;
