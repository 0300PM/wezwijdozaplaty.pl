"use client";

import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { LetterPayload } from "@/types/document";
import { formatCurrency, formatDate } from "@/lib/document-model";

export async function generateDocxBlob(data: LetterPayload): Promise<Blob> {
  const currentDate = new Date().toLocaleDateString("pl-PL");
  const title = data.isFinal
    ? "OSTATECZNE PRZEDSĄDOWE WEZWANIE DO ZAPŁATY"
    : "WEZWANIE DO ZAPŁATY";

  const children: Paragraph[] = [
    new Paragraph({
      text: `${data.city || ""}, ${currentDate}`,
      alignment: AlignmentType.RIGHT,
      spacing: { after: 240 }
    }),
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "Wierzyciel:", bold: true })],
      spacing: { after: 60 }
    }),
    new Paragraph({ text: data.creditorName || "", spacing: { after: 60 } }),
    new Paragraph({ text: data.creditorAddress || "", spacing: { after: 240 } }),
    new Paragraph({
      children: [new TextRun({ text: "Dłużnik:", bold: true })],
      spacing: { after: 60 }
    }),
    new Paragraph({ text: data.debtorName || "", spacing: { after: 60 } }),
    new Paragraph({ text: data.debtorAddress || "", spacing: { after: 240 } }),
    new Paragraph({
      children: [new TextRun({ text: "Przedmiot zobowiązania:", bold: true })],
      spacing: { after: 60 }
    }),
    new Paragraph({
      text: `W związku z zaległym zobowiązaniem wynikającym z rodzaju: ${data.obligationType || "Inne"}${data.documentNumber ? `, dokument nr ${data.documentNumber}` : ""}${data.documentDate ? ` z dnia ${formatDate(data.documentDate)}` : ""}, dłużnik zobowiązany jest do zapłaty na rzecz wierzyciela kwoty ${formatCurrency(data.amount)} PLN.`,
      spacing: { after: 240 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "Szczegóły płatności:", bold: true })],
      spacing: { after: 60 }
    }),
    new Paragraph({
      text: `Termin płatności upłynął ${formatDate(data.dueDate)}. Kwotę należną w wysokości ${formatCurrency(data.amount)} PLN należy uiścić na rachunek bankowy: ${data.bankAccount || ""}.`,
      spacing: { after: 240 }
    })
  ];

  if (data.interest) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Odsetki ustawowe za opóźnienie", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        text: "W przypadku braku zapłaty w terminie, zastrzegamy sobie prawo do naliczenia odsetek ustawowych za opóźnienie w spłacie zgodnie z obowiązującymi przepisami prawa.",
        spacing: { after: 240 }
      })
    );
  }
  if (data.capitalization) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Kapitalizacja odsetek", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        text: "Zastrzegamy sobie prawo do żądania kapitalizacji odsetek, tj. naliczania odsetek od zaległych odsetek w przypadku dalszego zwlekania z zapłatą.",
        spacing: { after: 240 }
      })
    );
  }
  if (data.collectionCosts) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Koszty windykacji", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        text: "W przypadku konieczności podjęcia działań windykacyjnych, wierzyciel będzie uprawniony do dochodzenia od dłużnika zwrotu uzasadnionych kosztów windykacji.",
        spacing: { after: 240 }
      })
    );
  }
  if (data.registryWarning) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Ostrzeżenie o wpisie do rejestru dłużników", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        text: "W przypadku braku zapłaty w wyznaczonym terminie, wierzyciel rozważy zgłoszenie dłużnika do narodowych i międzynarodowych rejestrów dłużników (BIG, KRD, ERIF), co może wpłynąć na zdolność kredytową i wizerunek dłużnika.",
        spacing: { after: 240 }
      })
    );
  }
  if (data.joint) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Wezwanie solidarne", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        text: "Niniejsze wezwanie skierowane jest do dłużników solidarnych, zaś zapłata całości lub części zobowiązania przez jednego z dłużników zwalnia pozostałych w zakresie spełnienia świadczenia.",
        spacing: { after: 240 }
      })
    );
  }

  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Wezwanie i termin zapłaty", bold: true })],
      spacing: { after: 60 }
    }),
    new Paragraph({
      text: "Zwracam się z wezwaniem do zapłaty powyższej kwoty w terminie 7 dni od dnia otrzymania niniejszego pisma. Po bezskutecznym upływie tego terminu zastrzegam sobie prawo do skierowania sprawy na drogę sądową lub do profesjonalnej windykacji, bez konieczności wydawania dodatkowych wezwań.",
      spacing: { after: 240 }
    }),
    new Paragraph({ text: "Z poważaniem,", spacing: { before: 240 } }),
    new Paragraph({ text: data.creditorName || "" })
  );

  const doc = new Document({ sections: [{ properties: {}, children }] });
  return Packer.toBlob(doc);
}
