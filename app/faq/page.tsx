"use client";

import { useState } from "react";

const faqData = [
  { question: "Czy korzystanie z generatora jest naprawdę darmowe?", answer: "Tak, generator wezwań do zapłaty jest w 100% darmowy. Nie wymagamy rejestracji, nie pobieramy opłat i nie ograniczamy liczby generowanych dokumentów." },
  { question: "Czy muszę się rejestrować, aby wygenerować wezwanie?", answer: "Nie. Aplikacja działa bez rejestracji i logowania. Wystarczy wypełnić formularz, wygenerować dokument i go pobrać." },
  { question: "Jakie rodzaje zobowiązań obsługuje generator?", answer: "Obsługujemy m.in. niezapłacone faktury VAT, czynsz najmu, opłaty eksploatacyjne, umowę o dzieło, sprzedaż towaru, dostawę usług i pożyczkę prywatną." },
  { question: "Czy wygenerowane wezwanie jest zgodne z polskim prawem?", answer: "Wezwanie zawiera standardowe klauzule przedsądowe zgodne z polskim porządkiem prawnym. Treści mają jednak charakter informacyjny i nie stanowią porady prawnej." },
  { question: "Czy mogę dodać odsetki ustawowe za opóźnienie?", answer: "Tak, w formularzu znajduje się odpowiednia opcja i klauzula zostanie dodana do dokumentu." },
  { question: "Co oznacza ostateczne przedsądowe wezwanie do zapłaty?", answer: "To ostatnia formalna próba polubownego dochodzenia roszczenia przed skierowaniem sprawy do sądu." },
  { question: "Jakie formaty plików są dostępne?", answer: "Możesz pobrać wezwanie w formacie PDF lub DOCX." },
  { question: "Czy moje dane są bezpieczne?", answer: "Tak. Dane są wykorzystywane tylko do wygenerowania dokumentu w bieżącej sesji." }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="section">
      <div className="mx-auto w-full max-w-app px-6">
        <h1 className="section-title">Najczęściej zadawane pytania</h1>
        <p className="section-subtitle">Znajdź odpowiedzi na najważniejsze pytania dotyczące generatora.</p>
        {faqData.map((item, index) => (
          <div className="mb-3 overflow-hidden rounded border border-border bg-surface" key={item.question}>
            <button
              className="flex w-full items-center justify-between px-5 py-4 text-left text-[0.9375rem] font-medium text-text hover:bg-bg"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              {item.question}
              <span className="text-xs text-textSubtle">{openIndex === index ? "Zamknij" : "Otwórz"}</span>
            </button>
            {openIndex === index && <div className="px-5 pb-5 text-[0.9375rem] leading-relaxed text-textMuted">{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
