import { useState } from 'react';

const faqData = [
  {
    question: 'Czy korzystanie z generatora jest naprawdę darmowe?',
    answer: 'Tak, generator wezwań do zapłaty jest w 100% darmowy. Nie wymagamy rejestracji, nie pobieramy opłat i nie ograniczamy liczby generowanych dokumentów. Możesz pobrać wezwanie w formacie PDF lub DOCX bez żadnych ukrytych kosztów.'
  },
  {
    question: 'Czy muszę się rejestrować, aby wygenerować wezwanie?',
    answer: 'Nie. Aplikacja działa bez rejestracji i logowania. Wystarczy wypełnić formularz, wygenerować dokument i go pobrać. Nie przechowujemy Twoich danych osobowych.'
  },
  {
    question: 'Jakie rodzaje zobowiązań obsługuje generator?',
    answer: 'Obsługujemy m.in. niezapłacone faktury VAT, czynsz najmu, opłaty eksploatacyjne, wynagrodzenie za zlecenie, umowę o dzieło, sprzedaż towaru, dostawę usług, pożyczkę prywatną, umowę najmu lokalu, szkodę majątkową, karę umowną, zaliczkę/zadatek oraz inne zobowiązania.'
  },
  {
    question: 'Czy wygenerowane wezwanie jest zgodne z polskim prawem?',
    answer: 'Wezwanie zawiera standardowe klauzule przedsądowe zgodne z polskim porządkiem prawnym, w tym możliwość odwołania się do odsetek ustawowych, kosztów windykacji czy rejestrów dłużników. Treści mają jednak charakter informacyjny i nie stanowią indywidualnej porady prawnej.'
  },
  {
    question: 'Czy mogę dodać odsetki ustawowe za opóźnienie?',
    answer: 'Tak, w formularzu znajduje się opcja „Nalicz odsetki ustawowe za opóźnienie”. Zaznaczenie tej opcji spowoduje dodanie odpowiedniej klauzuli do treści wezwania.'
  },
  {
    question: 'Co oznacza „ostateczne przedsądowe wezwanie do zapłaty”?',
    answer: 'Jest to wezwanie, które wyraźnie komunikuje dłużnikowi, że jest to ostatnia formalna próba polubownego dochodzenia roszczenia przed skierowaniem sprawy do sądu lub windykatora. Zwiększa to wagę i powagę przekazu.'
  },
  {
    question: 'Czy mogę wygenerować wezwanie solidarne?',
    answer: 'Tak, w opcjach dodatkowych można zaznaczyć „Wezwanie solidarne”. Opcja ta jest przeznaczona dla sytuacji, gdy wobec dłużników solidarnych skierowane jest jedno wspólne wezwanie.'
  },
  {
    question: 'Jakie formaty plików są dostępne?',
    answer: 'Możesz pobrać gotowe wezwanie do zapłaty w formacie PDF (gotowe do wydruku lub wysyłki e-mail) lub DOCX (edytowalny dokument Microsoft Word i LibreOffice Writer).'
  },
  {
    question: 'Czy moje dane są bezpieczne?',
    answer: 'Tak. Dane wprowadzane do formularza są wykorzystywane wyłącznie do wygenerowania dokumentu w danej sesji. Nie zapisujemy ich w bazie danych ani nie udostępniamy podmiotom trzecim. Serwis nie przechowuje historii generowanych dokumentów.'
  },
  {
    question: 'Kiedy warto wysłać wezwanie do zapłaty?',
    answer: 'Wezwanie do zapłaty warto wysłać, gdy dłużnik nie uiścił należności w ustalonym terminie. Jest to pierwszy formalny krok windykacji polubownej, który często skutecznie mobilizuje dłużnika do zapłaty bez konieczności sądowej.'
  }
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Najczęściej zadawane pytania</h1>
        <p className="section-subtitle">
          Znajdź odpowiedzi na najważniejsze pytania dotyczące generatora wezwań do zapłaty, 
          bezpieczeństwa danych oraz procesu windykacji polubownej.
        </p>
        {faqData.map((item, index) => (
          <div className="faq-item" key={index}>
            <button
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              {item.question}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 500 }}>
                {openIndex === index ? 'Zamknij' : 'Otwórz'}
              </span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
