"use client";

import { useMemo, useRef, useState } from "react";
import { generateDocxBlob } from "@/lib/docx-builder";
import { formatCurrency, formatDate, initialLetterState, obligationTypes } from "@/lib/document-model";
import { generatePdfBlob } from "@/lib/pdf-builder";
import type { LetterPayload } from "@/types/document";

export default function GeneratorPage() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<LetterPayload>(initialLetterState);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const checked = "checked" in e.target ? e.target.checked : false;
    const type = "type" in e.target ? e.target.type : "";
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleDownload = async (format: "pdf" | "docx") => {
    setError("");
    setInfo("");
    if (!form.creditorName || !form.debtorName || !form.amount) {
      setError("Uzupełnij wymagane pola: wierzyciel, dłużnik oraz kwotę.");
      return;
    }

    const setter = format === "pdf" ? setLoadingPdf : setLoadingDocx;
    setter(true);
    try {
      const previewElement = previewRef.current;
      if (format === "pdf" && !previewElement) {
        throw new Error("Podgląd PDF nie jest gotowy.");
      }
      const blob =
        format === "pdf"
          ? await generatePdfBlob(previewElement as HTMLElement)
          : await generateDocxBlob(form);
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `wezwanie-do-zaplaty.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setInfo("Dokument został pobrany pomyślnie.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd.");
    } finally {
      setter(false);
    }
  };

  const preview = useMemo(() => {
    const title = form.isFinal ? "OSTATECZNE PRZEDSĄDOWE WEZWANIE DO ZAPŁATY" : "WEZWANIE DO ZAPŁATY";
    const currentDate = new Date().toLocaleDateString("pl-PL");
    const amount = formatCurrency(form.amount);

    return (
      <div ref={previewRef} className="min-h-[360px] rounded border border-border bg-white p-6 text-sm leading-relaxed text-black">
        <h2 className="mb-5 text-center text-base font-bold uppercase tracking-wide">{title}</h2>
        <p className="text-right">{form.city ? `${form.city}, ` : ""}{currentDate}</p>
        <div className="mb-3"><strong className="mb-1 block">Wierzyciel:</strong>{form.creditorName && <div>{form.creditorName}</div>}{form.creditorAddress && <div className="whitespace-pre-line">{form.creditorAddress}</div>}</div>
        <div className="mb-3"><strong className="mb-1 block">Dłużnik:</strong>{form.debtorName && <div>{form.debtorName}</div>}{form.debtorAddress && <div className="whitespace-pre-line">{form.debtorAddress}</div>}</div>
        <div className="mb-3"><strong className="mb-1 block">Przedmiot zobowiązania:</strong><div>W związku z zaległym zobowiązaniem wynikającym z rodzaju: {form.obligationType}{form.documentNumber ? `, dokument nr ${form.documentNumber}` : ""}{form.documentDate ? ` z dnia ${formatDate(form.documentDate)}` : ""}, dłużnik zobowiązany jest do zapłaty na rzecz wierzyciela kwoty <strong>{amount} PLN</strong>.</div></div>
        <div className="mb-3"><strong className="mb-1 block">Szczegóły płatności:</strong><div>Termin płatności upłynął {formatDate(form.dueDate)}. Kwotę należną w wysokości {amount} PLN należy uiścić na rachunek bankowy: {form.bankAccount || "(brak numeru konta)"}.</div></div>
        {form.interest && <div className="mb-3"><strong className="mb-1 block">Odsetki ustawowe za opóźnienie</strong><div>W przypadku braku zapłaty w terminie, zastrzegamy sobie prawo do naliczenia odsetek ustawowych za opóźnienie w spłacie zgodnie z obowiązującymi przepisami prawa.</div></div>}
        {form.capitalization && <div className="mb-3"><strong className="mb-1 block">Kapitalizacja odsetek</strong><div>Zastrzegamy sobie prawo do żądania kapitalizacji odsetek, tj. naliczania odsetek od zaległych odsetek w przypadku dalszego zwlekania z zapłatą.</div></div>}
        {form.collectionCosts && <div className="mb-3"><strong className="mb-1 block">Koszty windykacji</strong><div>W przypadku konieczności podjęcia działań windykacyjnych, wierzyciel będzie uprawniony do dochodzenia od dłużnika zwrotu uzasadnionych kosztów windykacji.</div></div>}
        {form.registryWarning && <div className="mb-3"><strong className="mb-1 block">Ostrzeżenie o wpisie do rejestru dłużników</strong><div>W przypadku braku zapłaty w wyznaczonym terminie, wierzyciel rozważy zgłoszenie dłużnika do narodowych i międzynarodowych rejestrów dłużników (BIG, KRD, ERIF), co może wpłynąć na zdolność kredytową i wizerunek dłużnika.</div></div>}
        {form.joint && <div className="mb-3"><strong className="mb-1 block">Wezwanie solidarne</strong><div>Niniejsze wezwanie skierowane jest do dłużników solidarnych, zaś zapłata całości lub części zobowiązania przez jednego z dłużników zwalnia pozostałych w zakresie spełnienia świadczenia.</div></div>}
      </div>
    );
  }, [form]);

  return (
    <div className="section">
      <div className="mx-auto w-full max-w-app px-6">
        <h1 className="section-title">Generator wezwania do zapłaty</h1>
        <p className="section-subtitle">Wypełnij formularz i pobierz gotowe wezwanie do zapłaty w PDF lub DOCX.</p>
        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</div>}
        {info && <div className="mb-4 rounded border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">{info}</div>}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded border border-border bg-surface p-6">
              <div className="mb-5 border-b border-border pb-3 text-sm font-semibold uppercase tracking-wider text-primary">Dane wierzyciela</div>
              <div className="grid grid-cols-1 gap-4">
                <input className="rounded border border-border px-3 py-2" type="text" name="creditorName" value={form.creditorName} onChange={handleChange} placeholder="Pełna nazwa / Imię i nazwisko *" />
                <textarea className="min-h-[72px] rounded border border-border px-3 py-2" name="creditorAddress" value={form.creditorAddress} onChange={handleChange} placeholder="Adres" />
              </div>
            </div>
            <div className="rounded border border-border bg-surface p-6">
              <div className="mb-5 border-b border-border pb-3 text-sm font-semibold uppercase tracking-wider text-primary">Dane dłużnika</div>
              <div className="grid grid-cols-1 gap-4">
                <input className="rounded border border-border px-3 py-2" type="text" name="debtorName" value={form.debtorName} onChange={handleChange} placeholder="Pełna nazwa / Imię i nazwisko *" />
                <textarea className="min-h-[72px] rounded border border-border px-3 py-2" name="debtorAddress" value={form.debtorAddress} onChange={handleChange} placeholder="Adres" />
              </div>
            </div>
            <div className="rounded border border-border bg-surface p-6">
              <div className="mb-5 border-b border-border pb-3 text-sm font-semibold uppercase tracking-wider text-primary">Szczegóły zobowiązania</div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <select className="rounded border border-border px-3 py-2 md:col-span-2" name="obligationType" value={form.obligationType} onChange={handleChange}>{obligationTypes.map((item) => <option key={item}>{item}</option>)}</select>
                <input className="rounded border border-border px-3 py-2" type="text" name="documentNumber" value={form.documentNumber} onChange={handleChange} placeholder="Numer dokumentu" />
                <input className="rounded border border-border px-3 py-2" type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Kwota (PLN) *" min="0" step="0.01" />
                <input className="rounded border border-border px-3 py-2" type="date" name="documentDate" value={form.documentDate} onChange={handleChange} />
                <input className="rounded border border-border px-3 py-2" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
              </div>
            </div>
            <div className="rounded border border-border bg-surface p-6">
              <div className="mb-5 border-b border-border pb-3 text-sm font-semibold uppercase tracking-wider text-primary">Opcje dodatkowe</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  ["isFinal", "Ostateczne przedsądowe wezwanie"],
                  ["interest", "Nalicz odsetki ustawowe za opóźnienie"],
                  ["capitalization", "Kapitalizacja odsetek"],
                  ["collectionCosts", "Koszty windykacji"],
                  ["registryWarning", "Ostrzeżenie o wpisie do rejestru dłużników"],
                  ["joint", "Wezwanie solidarne"]
                ].map(([name, label]) => (
                  <label key={name} className="flex cursor-pointer items-start gap-3 rounded border border-border bg-surface p-3 hover:border-accent hover:bg-teal-50/30">
                    <input type="checkbox" name={name} checked={Boolean(form[name as keyof LetterPayload])} onChange={handleChange} />
                    <span className="text-sm text-text">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="sticky top-[88px] rounded border border-border bg-surface p-6">
            <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Podgląd dokumentu</div>
            {preview}
            <div className="mt-6 flex flex-wrap gap-4">
              <button className="btn" onClick={() => handleDownload("pdf")} disabled={loadingPdf || loadingDocx}>{loadingPdf ? "Generowanie..." : "Pobierz PDF"}</button>
              <button className="btn btn-secondary" onClick={() => handleDownload("docx")} disabled={loadingPdf || loadingDocx}>{loadingDocx ? "Generowanie..." : "Pobierz DOCX"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
