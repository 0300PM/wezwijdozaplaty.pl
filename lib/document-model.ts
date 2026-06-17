import type { LetterPayload } from "@/types/document";

export const obligationTypes = [
  "Niezapłacona faktura VAT",
  "Czynsz najmu",
  "Opłaty eksploatacyjne",
  "Wynagrodzenie za wykonane zlecenie",
  "Umowa o dzieło",
  "Sprzedaż towaru",
  "Dostawa usług",
  "Pożyczka prywatna",
  "Umowa najmu lokalu",
  "Szkoda majątkowa",
  "Kara umowna",
  "Zaliczka / zadatek",
  "Inne"
] as const;

export const initialLetterState: LetterPayload = {
  creditorName: "",
  creditorAddress: "",
  debtorName: "",
  debtorAddress: "",
  obligationType: "Niezapłacona faktura VAT",
  documentNumber: "",
  amount: "",
  documentDate: "",
  dueDate: "",
  bankAccount: "",
  city: "",
  isFinal: false,
  interest: false,
  capitalization: false,
  collectionCosts: false,
  registryWarning: false,
  joint: false
};

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}

export function formatCurrency(amount: string): string {
  const n = Number(amount);
  if (Number.isNaN(n)) return amount;
  return n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
