import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import PdfPrinter from 'pdfmake';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

const require = createRequire(import.meta.url);
const vfsFonts = require('pdfmake/build/vfs_fonts.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { error: 'Zbyt wiele żądań. Spróbuj ponownie za chwilę.' }
});
app.use('/api/', limiter);

const fonts = {
    Roboto: {
        normal: Buffer.from(vfsFonts['Roboto-Regular.ttf'], 'base64'),
        bold: Buffer.from(vfsFonts['Roboto-Medium.ttf'], 'base64'),
        italics: Buffer.from(vfsFonts['Roboto-Italic.ttf'], 'base64'),
        bolditalics: Buffer.from(vfsFonts['Roboto-MediumItalic.ttf'], 'base64')
    }
};
const printer = new PdfPrinter(fonts);

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
};

const formatCurrency = (amount) => {
    const n = Number(amount);
    if (isNaN(n)) return amount;
    return n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const buildDocumentContent = (data) => {
    const creditorName = data.creditorName || '';
    const creditorAddress = data.creditorAddress || '';
    const debtorName = data.debtorName || '';
    const debtorAddress = data.debtorAddress || '';
    const obligationType = data.obligationType || 'Inne';
    const docNumber = data.documentNumber || '';
    const amount = formatCurrency(data.amount);
    const docDate = formatDate(data.documentDate);
    const dueDate = formatDate(data.dueDate);
    const bankAccount = data.bankAccount || '';
    const city = data.city || '';
    const currentDate = new Date().toLocaleDateString('pl-PL');

    const title = data.isFinal
        ? 'OSTATECZNE PRZEDSĄDOWE WEZWANIE DO ZAPŁATY'
        : 'WEZWANIE DO ZAPŁATY';

    const paragraphs = [
        { text: `${city}, ${currentDate}`, alignment: 'right', margin: [0, 0, 0, 20] },
        { text: title, style: 'header', margin: [0, 0, 0, 10] },
        { text: 'Wierzyciel:', style: 'label', margin: [0, 10, 0, 0] },
        { text: creditorName, style: 'value' },
        { text: creditorAddress, style: 'value', margin: [0, 0, 0, 10] },
        { text: 'Dłużnik:', style: 'label' },
        { text: debtorName, style: 'value' },
        { text: debtorAddress, style: 'value', margin: [0, 0, 0, 10] },
        { text: 'Przedmiot zobowiązania:', style: 'label' },
        {
            text: `W związku z zaległym zobowiązaniem wynikającym z rodzaju: ${obligationType}${docNumber ? `, dokument nr ${docNumber}` : ''}${docDate ? ` z dnia ${docDate}` : ''}, dłużnik zobowiązany jest do zapłaty na rzecz wierzyciela kwoty ${amount} PLN.`,
            style: 'value', margin: [0, 0, 0, 10]
        },
        { text: 'Szczegóły płatności:', style: 'label' },
        {
            text: `Termin płatności upłynął ${dueDate}. Kwotę należną w wysokości ${amount} PLN należy uiścić na rachunek bankowy: ${bankAccount}.`,
            style: 'value', margin: [0, 0, 0, 10]
        }
    ];

    if (data.interest) {
        paragraphs.push({
            text: 'Odsetki ustawowe za opóźnienie',
            style: 'label'
        });
        paragraphs.push({
            text: 'W przypadku braku zapłaty w terminie, zastrzegamy sobie prawo do naliczenia odsetek ustawowych za opóźnienie w spłacie zgodnie z obowiązującymi przepisami prawa.',
            style: 'value', margin: [0, 0, 0, 10]
        });
    }

    if (data.capitalization) {
        paragraphs.push({
            text: 'Kapitalizacja odsetek',
            style: 'label'
        });
        paragraphs.push({
            text: 'Zastrzegamy sobie prawo do żądania kapitalizacji odsetek, tj. naliczania odsetek od zaległych odsetek w przypadku dalszego zwlekania z zapłatą.',
            style: 'value', margin: [0, 0, 0, 10]
        });
    }

    if (data.collectionCosts) {
        paragraphs.push({
            text: 'Koszty windykacji',
            style: 'label'
        });
        paragraphs.push({
            text: 'W przypadku konieczności podjęcia działań windykacyjnych, wierzyciel będzie uprawniony do dochodzenia od dłużnika zwrotu uzasadnionych kosztów windykacji.',
            style: 'value', margin: [0, 0, 0, 10]
        });
    }

    if (data.registryWarning) {
        paragraphs.push({
            text: 'Ostrzeżenie o wpisie do rejestru dłużników',
            style: 'label'
        });
        paragraphs.push({
            text: 'W przypadku braku zapłaty w wyznaczonym terminie, wierzyciel rozważy zgłoszenie dłużnika do narodowych i międzynarodowych rejestrów dłużników (BIG, KRD, ERIF), co może wpłynąć na zdolność kredytową i wizerunek dłużnika.',
            style: 'value', margin: [0, 0, 0, 10]
        });
    }

    if (data.joint) {
        paragraphs.push({
            text: 'Wezwanie solidarne',
            style: 'label'
        });
        paragraphs.push({
            text: 'Niniejsze wezwanie skierowane jest do dłużników solidarnych, zaś zapłata całości lub części zobowiązania przez jednego z dłużników zwalnia pozostałych w zakresie spełnienia świadczenia.',
            style: 'value', margin: [0, 0, 0, 10]
        });
    }

    paragraphs.push({
        text: 'Wezwanie i termin zapłaty',
        style: 'label'
    });
    paragraphs.push({
        text: 'Zwracam się z wezwaniem do zapłaty powyższej kwoty w terminie 7 dni od dnia otrzymania niniejszego pisma. Po bezskutecznym upływie tego terminu zastrzegam sobie prawo do skierowania sprawy na drogę sądową lub do profesjonalnej windykacji, bez konieczności wydawania dodatkowych wezwań.',
        style: 'value', margin: [0, 0, 0, 10]
    });

    paragraphs.push({
        text: 'Z poważaniem,',
        style: 'value', margin: [0, 20, 0, 0]
    });
    paragraphs.push({
        text: creditorName,
        style: 'value'
    });

    return paragraphs;
};

app.post('/api/generate/pdf', async (req, res) => {
    try {
        const data = req.body;
        if (!data.creditorName || !data.debtorName || !data.amount) {
            return res.status(400).json({ error: 'Brakuje wymaganych danych: wierzyciel, dłużnik, kwota.' });
        }

        const docDefinition = {
            content: buildDocumentContent(data),
            defaultStyle: {
                font: 'Roboto',
                fontSize: 11,
                lineHeight: 1.3
            },
            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                label: {
                    bold: true,
                    fontSize: 12,
                    margin: [0, 8, 0, 2]
                },
                value: {
                    fontSize: 11,
                    margin: [0, 0, 0, 4]
                }
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks = [];
        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="wezwanie-do-zaplaty.pdf"');
            res.send(pdfBuffer);
        });
        pdfDoc.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd generowania PDF.' });
    }
});

const buildDocx = (data) => {
    const currentDate = new Date().toLocaleDateString('pl-PL');
    const title = data.isFinal
        ? 'OSTATECZNE PRZEDSĄDOWE WEZWANIE DO ZAPŁATY'
        : 'WEZWANIE DO ZAPŁATY';

    const children = [
        new Paragraph({ text: `${data.city || ''}, ${currentDate}`, alignment: AlignmentType.RIGHT, spacing: { after: 240 } }),
        new Paragraph({ text: title, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
        new Paragraph({ children: [new TextRun({ text: 'Wierzyciel:', bold: true })], spacing: { after: 60 } }),
        new Paragraph({ text: data.creditorName || '', spacing: { after: 60 } }),
        new Paragraph({ text: data.creditorAddress || '', spacing: { after: 240 } }),
        new Paragraph({ children: [new TextRun({ text: 'Dłużnik:', bold: true })], spacing: { after: 60 } }),
        new Paragraph({ text: data.debtorName || '', spacing: { after: 60 } }),
        new Paragraph({ text: data.debtorAddress || '', spacing: { after: 240 } }),
        new Paragraph({ children: [new TextRun({ text: 'Przedmiot zobowiązania:', bold: true })], spacing: { after: 60 } }),
        new Paragraph({
            text: `W związku z zaległym zobowiązaniem wynikającym z rodzaju: ${data.obligationType || 'Inne'}${data.documentNumber ? `, dokument nr ${data.documentNumber}` : ''}${data.documentDate ? ` z dnia ${formatDate(data.documentDate)}` : ''}, dłużnik zobowiązany jest do zapłaty na rzecz wierzyciela kwoty ${formatCurrency(data.amount)} PLN.`,
            spacing: { after: 240 }
        }),
        new Paragraph({ children: [new TextRun({ text: 'Szczegóły płatności:', bold: true })], spacing: { after: 60 } }),
        new Paragraph({
            text: `Termin płatności upłynął ${formatDate(data.dueDate)}. Kwotę należną w wysokości ${formatCurrency(data.amount)} PLN należy uiścić na rachunek bankowy: ${data.bankAccount || ''}.`,
            spacing: { after: 240 }
        })
    ];

    if (data.interest) {
        children.push(
            new Paragraph({ children: [new TextRun({ text: 'Odsetki ustawowe za opóźnienie', bold: true })], spacing: { after: 60 } }),
            new Paragraph({ text: 'W przypadku braku zapłaty w terminie, zastrzegamy sobie prawo do naliczenia odsetek ustawowych za opóźnienie w spłacie zgodnie z obowiązującymi przepisami prawa.', spacing: { after: 240 } })
        );
    }
    if (data.capitalization) {
        children.push(
            new Paragraph({ children: [new TextRun({ text: 'Kapitalizacja odsetek', bold: true })], spacing: { after: 60 } }),
            new Paragraph({ text: 'Zastrzegamy sobie prawo do żądania kapitalizacji odsetek, tj. naliczania odsetek od zaległych odsetek w przypadku dalszego zwlekania z zapłatą.', spacing: { after: 240 } })
        );
    }
    if (data.collectionCosts) {
        children.push(
            new Paragraph({ children: [new TextRun({ text: 'Koszty windykacji', bold: true })], spacing: { after: 60 } }),
            new Paragraph({ text: 'W przypadku konieczności podjęcia działań windykacyjnych, wierzyciel będzie uprawniony do dochodzenia od dłużnika zwrotu uzasadnionych kosztów windykacji.', spacing: { after: 240 } })
        );
    }
    if (data.registryWarning) {
        children.push(
            new Paragraph({ children: [new TextRun({ text: 'Ostrzeżenie o wpisie do rejestru dłużników', bold: true })], spacing: { after: 60 } }),
            new Paragraph({ text: 'W przypadku braku zapłaty w wyznaczonym terminie, wierzyciel rozważy zgłoszenie dłużnika do narodowych i międzynarodowych rejestrów dłużników (BIG, KRD, ERIF), co może wpłynąć na zdolność kredytową i wizerunek dłużnika.', spacing: { after: 240 } })
        );
    }
    if (data.joint) {
        children.push(
            new Paragraph({ children: [new TextRun({ text: 'Wezwanie solidarne', bold: true })], spacing: { after: 60 } }),
            new Paragraph({ text: 'Niniejsze wezwanie skierowane jest do dłużników solidarnych, zaś zapłata całości lub części zobowiązania przez jednego z dłużników zwalnia pozostałych w zakresie spełnienia świadczenia.', spacing: { after: 240 } })
        );
    }

    children.push(
        new Paragraph({ children: [new TextRun({ text: 'Wezwanie i termin zapłaty', bold: true })], spacing: { after: 60 } }),
        new Paragraph({ text: 'Zwracam się z wezwaniem do zapłaty powyższej kwoty w terminie 7 dni od dnia otrzymania niniejszego pisma. Po bezskutecznym upływie tego terminu zastrzegam sobie prawo do skierowania sprawy na drogę sądową lub do profesjonalnej windykacji, bez konieczności wydawania dodatkowych wezwań.', spacing: { after: 240 } }),
        new Paragraph({ text: 'Z poważaniem,', spacing: { before: 240 } }),
        new Paragraph({ text: data.creditorName || '' })
    );

    return new Document({ sections: [{ properties: {}, children }] });
};

app.post('/api/generate/docx', async (req, res) => {
    try {
        const data = req.body;
        if (!data.creditorName || !data.debtorName || !data.amount) {
            return res.status(400).json({ error: 'Brakuje wymaganych danych: wierzyciel, dłużnik, kwota.' });
        }

        const doc = buildDocx(data);
        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename="wezwanie-do-zaplaty.docx"');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd generowania DOCX.' });
    }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

if (process.env.NODE_ENV === 'production') {
    const staticPath = new URL('../frontend/dist', import.meta.url).pathname;
    app.use(express.static(staticPath));
    app.get('*', (req, res) => {
        res.sendFile(new URL('../frontend/dist/index.html', import.meta.url).pathname);
    });
} else {
    app.use((req, res) => res.status(404).json({ error: 'Nie znaleziono zasobu.' }));
}

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera.' });
});

const currentFilePath = fileURLToPath(import.meta.url);
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === currentFilePath;

if (isDirectRun) {
    app.listen(PORT, () => {
        console.log(`Backend działa na porcie ${PORT}`);
    });
}

export default app;
