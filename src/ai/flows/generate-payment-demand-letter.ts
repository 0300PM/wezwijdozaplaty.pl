'use server';
/**
 * @fileOverview A Genkit flow for generating the content of a Polish payment demand letter in HTML format.
 *
 * - generatePaymentDemandLetterContent - A function that orchestrates the generation of the letter content.
 * - PaymentDemandLetterInput - The input type for the generatePaymentDemandLetterContent function.
 * - PaymentDemandLetterOutput - The return type for the generatePaymentDemandLetterContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// 1. Define Input Schema
const PaymentDemandLetterInputSchema = z.object({
  creditorName: z.string().describe('Full name or company name of the creditor.'),
  creditorAddress: z.string().describe('Full address of the creditor.'),
  debtorName: z.string().describe('Full name or company name of the debtor.'),
  debtorAddress: z.string().describe('Full address of the debtor.'),
  invoiceNumber: z.string().describe('The invoice number or other document identifier (e.g., contract number).'),
  invoiceIssueDate: z.string().describe('The document issue date in YYYY-MM-DD format.'),
  invoiceDueDate: z.string().describe('The payment due date in YYYY-MM-DD format.'),
  amount: z.number().describe('The amount due in PLN.'),
  bankAccountNumber: z.string().describe('The bank account number for payment.'),
  city: z.string().describe('The city where the letter is issued.'),
  
  // New fields
  obligationType: z.string().describe('The legal basis of the debt, e.g., "Niezapłacona faktura VAT".'),
  otherObligationType: z.string().optional().describe('Description if obligationType is "Inne".'),
  isPreCourtDemand: z.boolean().describe('If true, this is a final pre-court demand.'),
  includeInterest: z.boolean().describe('If true, include a clause about statutory interest for delay.'),
  includeDebtorRegistryWarning: z.boolean().describe('If true, include a warning about being listed in a debtors registry.'),
  includeCollectionCosts: z.boolean().describe('If true, include a clause about claiming collection costs.'),
  capitalizeInterest: z.boolean().describe('If true, include a clause about interest capitalization (anatocism).'),
  jointLiability: z.boolean().describe('If true, this is a joint liability demand to multiple debtors.'),
});
export type PaymentDemandLetterInput = z.infer<typeof PaymentDemandLetterInputSchema>;

// 2. Define Output Schema
const PaymentDemandLetterOutputSchema = z.object({
  htmlContent: z.string().describe('The full payment demand letter content in HTML format.'),
});
export type PaymentDemandLetterOutput = z.infer<typeof PaymentDemandLetterOutputSchema>;

// Internal schema for the prompt, including calculated/formatted fields
const PromptInternalInputSchema = PaymentDemandLetterInputSchema.extend({
  currentDate: z.string().describe('The current date in long Polish format, e.g., "17 lipca 2023 r."'),
  invoiceIssueDate: z.string().describe('The invoice issue date in long Polish format, e.g., "15 maja 2023 r."'),
  invoiceDueDate: z.string().describe('The invoice due date in long Polish format, e.g., "16 czerwca 2023 r."'),
  amount: z.string().describe('The amount due in PLN, formatted with a comma, e.g., "1 234,56".'),
});


// 3. Define the Prompt
const paymentDemandLetterPrompt = ai.definePrompt({
  name: 'generatePaymentDemandLetterPrompt',
  input: { schema: PromptInternalInputSchema },
  output: { schema: PaymentDemandLetterOutputSchema },
  prompt: `You are an expert Polish legal assistant. Your task is to generate a formal payment demand letter ("Wezwanie do zapłaty") in Polish, structured as a single block of HTML with inline CSS. The output must be typographically correct, legally sound, and suitable for official correspondence in Poland. It must strictly adhere to the structure of official legal documents.

Follow these strict instructions:

1.  **Overall Style**: The entire document must be a single \`<div>\` block.
    *   Font: Use a professional serif font. Set \`font-family: 'Literata', 'Times New Roman', serif;\`.
    *   Font Size: Base font size must be \`12pt\`.
    *   Line Height: Use \`line-height: 1.5;\`.
    *   Color: Black (\`color: #000;\`).

2.  **Document Structure (Polish Legal Standard)**:
    *   **Top Right (Date)**: Place the city and date aligned to the right: \`<p style="text-align: right; margin-bottom: 40px;">{{{city}}}, dnia {{{currentDate}}}</p>\`.
    *   **Creditor Block**: Labeled "<strong>Wierzyciel:</strong>" followed by a \`div\` containing the creditor's details. \`<div style="margin-bottom: 20px;"><strong>Wierzyciel:</strong><div style="margin-left: 20px;">{{{creditorName}}}<br>{{{creditorAddress}}}</div></div>\`.
    *   **Debtor Block**: Labeled based on joint liability. \`<div style="margin-bottom: 40px;"><strong>{{#if jointLiability}}Dłużnicy solidarni:{{else}}Dłużnik:{{/if}}</strong><div style="margin-left: 20px;">{{{debtorName}}}<br>{{{debtorAddress}}}</div></div>\`.
    *   **Main Title**: Centered, bold, 14pt font size, all caps, with top and bottom margin.
        *   Example: \`<h1 style="text-align: center; font-size: 14pt; font-weight: bold; margin-top: 40px; margin-bottom: 40px; text-transform: uppercase;">...\`.
        *   If 'isPreCourtDemand' is true, the title MUST be "OSTATECZNE PRZEDSĄDOWE WEZWANIE DO ZAPŁATY".
        *   Otherwise, the title MUST be "WEZWANIE DO ZAPŁATY".
    *   **Body Paragraphs**: Use \`<p>\` tags with \`text-align: justify; margin-bottom: 1.5em;\`.
    *   **Signature Section**: At the end, aligned to the left. Use "Z poważaniem," followed by \`<br><br><br><br>\` for signature space, and end with the creditor's name (\`{{{creditorName}}}\`).

3.  **Content and Dynamic Legal Wording**:
    *   **Paragraph 1 (Introduction & Basis)**: Start with "Działając w imieniu Wierzyciela, niniejszym wzywam {{#if jointLiability}}Państwa do solidarnego i{{else}}do{{/if}} niezwłocznego uregulowania zadłużenia...". State the amount: \`w kwocie <strong>{{{amount}}} PLN</strong>\`. State the basis of the debt dynamically:
        *   If \`obligationType\` is "Niezapłacona faktura VAT", say: "wynikającego z niezapłaconej faktury VAT nr <strong>{{{invoiceNumber}}}</strong> z dnia {{{invoiceIssueDate}}}".
        *   If \`obligationType\` is "Czynsz najmu", say: "z tytułu niezapłaconego czynszu najmu na podstawie umowy najmu nr <strong>{{{invoiceNumber}}}</strong> z dnia {{{invoiceIssueDate}}}".
        *   If \`obligationType\` is "Umowa o dzieło", say: "z tytułu wynagrodzenia za wykonanie dzieła na podstawie umowy o dzieło nr <strong>{{{invoiceNumber}}}</strong> z dnia {{{invoiceIssueDate}}}".
        *   If \`obligationType\` is "Pożyczka prywatna", say: "z tytułu niespłaconej pożyczki na podstawie umowy pożyczki nr <strong>{{{invoiceNumber}}}</strong> z dnia {{{invoiceIssueDate}}}".
        *   Adapt phrasing similarly for all \`obligationType\` options. If \`obligationType\` is "Inne", use the content of \`{{{otherObligationType}}}\` as the basis, for example: "z tytułu {{{otherObligationType}}} na podstawie dokumentu nr <strong>{{{invoiceNumber}}}</strong> z dnia {{{invoiceIssueDate}}}".
        *   Always mention that the original payment deadline was "{{{invoiceDueDate}}}".
    *   **Paragraph 2 (New Deadline & Payment Info)**: Set a new 7-day deadline: "w nieprzekraczalnym terminie <strong>7 (siedmiu) dni</strong> od daty doręczenia niniejszego pisma". State the payment method: "na rachunek bankowy o numerze: <strong>{{{bankAccountNumber}}}</strong>".
    {{#if includeInterest}}
    *   **Paragraph 3 (Interest Clause)**: Include this paragraph only if \`includeInterest\` is true. "W przypadku braku zapłaty w wyżej wymienionym terminie, zostaną naliczone odsetki ustawowe za opóźnienie w transakcjach handlowych, zgodnie z art. 481 Kodeksu cywilnego, liczone od dnia następującego po pierwotnym terminie płatności do dnia całkowitej zapłaty.".
    {{/if}}
    {{#if capitalizeInterest}}
    *   **Paragraph 4 (Interest Capitalization Clause)**: Include this paragraph only if \`capitalizeInterest\` is true. "Zgodnie z art. 482 § 1 Kodeksu cywilnego, Wierzyciel zastrzega sobie prawo do żądania odsetek za opóźnienie od zaległych odsetek (anatocyzm) od chwili wytoczenia o nie powództwa.".
    {{/if}}
    *   **Paragraph 5 (Legal Action Warning)**: Clearly warn about legal consequences: "Jednocześnie informuję, iż brak wpłaty w wyznaczonym terminie spowoduje skierowanie sprawy na drogę postępowania sądowego bez dalszych wezwań. Krok ten narazi Państwa na dodatkowe koszty, w tym koszty sądowe, koszty zastępstwa procesowego oraz dalsze odsetki.".
    {{#if includeCollectionCosts}}
    *   **Paragraph 6 (Collection Costs)**: Include if \`includeCollectionCosts\` is true. "Informuję również o możliwości dochodzenia zwrotu kosztów odzyskiwania należności, zgodnie z ustawą o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych.".
    {{/if}}
    {{#if includeDebtorRegistryWarning}}
    *   **Paragraph 7 (Debtor Registry Warning)**: Include if \`includeDebtorRegistryWarning\` is true. "Uprzedzam, iż w przypadku braku zapłaty, dane {{#if jointLiability}}Państwa jako dłużników solidarnych{{else}}dłużnika{{/if}} mogą zostać ujawnione w rejestrach dłużników niewypłacalnych, co może utrudnić Państwu w przyszłości zawieranie umów handlowych oraz uzyskiwanie kredytów.".
    {{/if}}
    *   **Final Paragraph**: "Niniejsze pismo stanowi próbę polubownego rozwiązania sporu.".

4.  **Formatting Details**:
    *   The entire output MUST be a single HTML block. Do NOT include \`<html>\`, \`<head>\`, or \`<body>\` tags.
    *   Use bold (\`<strong>\`) only for labels ("Wierzyciel:", "Dłużnik:"), the main title, amounts, document numbers, bank account numbers, and the 7-day deadline text.

Generate the HTML content for the letter based on the provided details.
`,
});


// 4. Define the Flow
const generatePaymentDemandLetterFlow = ai.defineFlow(
  {
    name: 'generatePaymentDemandLetterFlow',
    inputSchema: PaymentDemandLetterInputSchema,
    outputSchema: PaymentDemandLetterOutputSchema,
  },
  async (input) => {
    const formatDate = (dateString: string) => {
      // The date comes in as yyyy-MM-dd, but new Date() needs to not be affected by timezone.
      // Appending T00:00:00 makes it a local time in any timezone.
      return new Date(`${dateString}T00:00:00`).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const currentDateObj = new Date();
    const currentDate =
      currentDateObj.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    // Combine input with calculated and formatted values for the prompt
    const promptInput: z.infer<typeof PromptInternalInputSchema> = {
      ...input,
      currentDate: currentDate,
      invoiceIssueDate: formatDate(input.invoiceIssueDate),
      invoiceDueDate: formatDate(input.invoiceDueDate),
      amount: input.amount.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };

    const { output } = await paymentDemandLetterPrompt(promptInput);
    if (!output) {
      throw new Error('Failed to generate payment demand letter content.');
    }
    return output;
  }
);

// 5. Export the wrapper function
export async function generatePaymentDemandLetterContent(
  input: PaymentDemandLetterInput
): Promise<PaymentDemandLetterOutput> {
  return generatePaymentDemandLetterFlow(input);
}
