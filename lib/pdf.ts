import PDFDocument from "pdfkit";
import fs from "fs";

export async function generatePDF(orderId: string) {
    const doc = new PDFDocument();
    const path = `./tmp/${orderId}.pdf`;

    doc.pipe(fs.createWriteStream(path));

    doc.fontSize(18).text("WEZWANIE DO ZAPŁATY");
    doc.moveDown();
    doc.text("Kwota: 39 zł");

    doc.end();

    return path;
}