"use client";

export async function generatePdfBlob(element: HTMLElement): Promise<Blob> {
  if (!element) {
    throw new Error("Nie znaleziono podglądu dokumentu.");
  }
  if (typeof window === "undefined") {
    throw new Error("PDF działa tylko w przeglądarce.");
  }

  const html2pdfModule = await import("html2pdf.js");
  const html2pdf = (html2pdfModule as any).default ?? (html2pdfModule as any);

  const worker = html2pdf()
    .set({
      margin: 10,
      filename: "wezwanie-do-zaplaty.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] }
    })
    .from(element)
    .toPdf();

  return worker.outputPdf("blob");
}