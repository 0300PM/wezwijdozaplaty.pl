"use client";

import pdfMakeImport from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import type { LetterPayload } from "@/types/document";
import { formatCurrency, formatDate } from "@/lib/document-model";

const buildDocumentContent = (data: LetterPayload) => {
  const creditorName = data.creditorName || "";
  const creditorAddress = data.creditorAddress || "";
  const debtorName = data.debtorName || "";
  const debtorAddress = data.debtorAddress || "";
  const obligationType = data.obligationType || "Inne";
  const docNumber = data.documentNumber || "";
  const amount = formatCurrency(data.amount);
  const docDate = formatDate(data.documentDate);
  const dueDate = formatDate(data.dueDate);
  const bankAccount = data.bankAccount || "";
  const city = data.city || "";
  const currentDate = new Date().toLocaleDateString("pl-PL");

  const title = data.isFinal
    ? "OSTATECZNE PRZEDSĄDOWE WEZWANIE DO ZAPŁATY"
    : "WEZWANIE DO ZAPŁATY";

  const paragraphs: any[] = [
    { text: `${city}, ${currentDate}`, alignment: "right", margin: [0, 0, 0, 20] },
    { text: title, style: "header", margin: [0, 0, 0, 10] },
    { text: "Wierzyciel:", style: "label", margin: [0, 10, 0, 0] },
    { text: creditorName, style: "value" },
    { text: creditorAddress, style: "value", margin: [0, 0, 0, 10] },
    { text: "Dłużnik:", style: "label" },
    { text: debtorName, style: "value" },
    { text: debtorAddress, style: "value", margin: [0, 0, 0, 10] },
    { text: "Przedmiot zobowiązania:", style: "label" },
    {
      text: `W związku z zaległym zobowiązaniem wynikającym z rodzaju: ${obligationType}${docNumber ? `, dokument nr ${docNumber}` : ""}${docDate ? ` z dnia ${docDate}` : ""}, dłużnik zobowiązany jest do zapłaty na rzecz wierzyciela kwoty ${amount} PLN.`,
      style: "value",
      margin: [0, 0, 0, 10]
    },
    { text: "Szczegóły płatności:", style: "label" },
    {
      text: `Termin płatności upłynął ${dueDate}. Kwotę należną w wysokości ${amount} PLN należy uiścić na rachunek bankowy: ${bankAccount}.`,
      style: "value",
      margin: [0, 0, 0, 10]
    }
  ];

  if (data.interest) {
    paragraphs.push({ text: "Odsetki ustawowe za opóźnienie", style: "label" });
    paragraphs.push({
      text: "W przypadku braku zapłaty w terminie, zastrzegamy sobie prawo do naliczenia odsetek ustawowych za opóźnienie w spłacie zgodnie z obowiązującymi przepisami prawa.",
      style: "value",
      margin: [0, 0, 0, 10]
    });
  }

  if (data.capitalization) {
    paragraphs.push({ text: "Kapitalizacja odsetek", style: "label" });
    paragraphs.push({
      text: "Zastrzegamy sobie prawo do żądania kapitalizacji odsetek, tj. naliczania odsetek od zaległych odsetek w przypadku dalszego zwlekania z zapłatą.",
      style: "value",
      margin: [0, 0, 0, 10]
    });
  }

  if (data.collectionCosts) {
    paragraphs.push({ text: "Koszty windykacji", style: "label" });
    paragraphs.push({
      text: "W przypadku konieczności podjęcia działań windykacyjnych, wierzyciel będzie uprawniony do dochodzenia od dłużnika zwrotu uzasadnionych kosztów windykacji.",
      style: "value",
      margin: [0, 0, 0, 10]
    });
  }

  if (data.registryWarning) {
    paragraphs.push({ text: "Ostrzeżenie o wpisie do rejestru dłużników", style: "label" });
    paragraphs.push({
      text: "W przypadku braku zapłaty w wyznaczonym terminie, wierzyciel rozważy zgłoszenie dłużnika do narodowych i międzynarodowych rejestrów dłużników (BIG, KRD, ERIF), co może wpłynąć na zdolność kredytową i wizerunek dłużnika.",
      style: "value",
      margin: [0, 0, 0, 10]
    });
  }

  if (data.joint) {
    paragraphs.push({ text: "Wezwanie solidarne", style: "label" });
    paragraphs.push({
      text: "Niniejsze wezwanie skierowane jest do dłużników solidarnych, zaś zapłata całości lub części zobowiązania przez jednego z dłużników zwalnia pozostałych w zakresie spełnienia świadczenia.",
      style: "value",
      margin: [0, 0, 0, 10]
    });
  }

  paragraphs.push({ text: "Wezwanie i termin zapłaty", style: "label" });
  paragraphs.push({
    text: "Zwracam się z wezwaniem do zapłaty powyższej kwoty w terminie 7 dni od dnia otrzymania niniejszego pisma. Po bezskutecznym upływie tego terminu zastrzegam sobie prawo do skierowania sprawy na drogę sądową lub do profesjonalnej windykacji, bez konieczności wydawania dodatkowych wezwań.",
    style: "value",
    margin: [0, 0, 0, 10]
  });
  paragraphs.push({ text: "Z poważaniem,", style: "value", margin: [0, 20, 0, 0] });
  paragraphs.push({ text: creditorName, style: "value" });

  return paragraphs;
};

export async function generatePdfBlob(data: LetterPayload): Promise<Blob> {
  const pdfMake = (pdfMakeImport as any).default ?? (pdfMakeImport as any);
  const vfs = pdfMake?.vfs ?? (globalThis as any)?.pdfMake?.vfs;

  if (!vfs) {
    throw new Error("Nie udało się załadować fontów PDF.");
  }

  pdfMake.vfs = vfs;

  const docDefinition = {
    content: buildDocumentContent(data),
    defaultStyle: { font: "Roboto", fontSize: 11, lineHeight: 1.3 },
    styles: {
      header: { fontSize: 16, bold: true, alignment: "center", margin: [0, 0, 0, 20] },
      label: { bold: true, fontSize: 12, margin: [0, 8, 0, 2] },
      value: { fontSize: 11, margin: [0, 0, 0, 4] }
    }
  };

  return new Promise((resolve, reject) => {
    pdfMake.createPdf(docDefinition as any).getBlob((blob: Blob) => {
      if (!blob) reject(new Error("Nie udało się wygenerować PDF."));
      else resolve(blob);
    });
  });
}
