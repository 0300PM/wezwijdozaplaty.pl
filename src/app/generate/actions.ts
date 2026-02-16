"use server";

import { z } from "zod";
import {
  generatePaymentDemandLetterContent,
  type PaymentDemandLetterInput,
} from "@/ai/flows/generate-payment-demand-letter";
import { format } from "date-fns";

const actionSchema = z.object({
  creditorName: z.string().min(1, "Imię i nazwisko lub nazwa firmy wierzyciela jest wymagana."),
  creditorAddress: z.string().min(1, "Adres wierzyciela jest wymagany."),
  debtorName: z.string().min(1, "Imię i nazwisko lub nazwa firmy dłużnika jest wymagana."),
  debtorAddress: z.string().min(1, "Adres dłużnika jest wymagany."),
  invoiceNumber: z.string().min(1, "Numer faktury/umowy jest wymagany."),
  invoiceIssueDate: z.string().min(1, "Data wystawienia dokumentu (np. faktury, umowy) jest wymagana."),
  invoiceDueDate: z.string().min(1, "Termin płatności jest wymagany."),
  amount: z.coerce.number().positive("Kwota musi być liczbą dodatnią."),
  bankAccountNumber: z.string().min(1, "Numer konta bankowego jest wymagany.").regex(/^(?:\d{26}|\d{2}(?:\s\d{4}){6})$/, "Niepoprawny format numeru konta (26 cyfr lub w formacie IBAN z przerwami)."),
  city: z.string().min(1, "Miasto jest wymagane."),
  
  obligationType: z.string().min(1, "Rodzaj zobowiązania jest wymagany."),
  otherObligationType: z.string().optional(),
  isPreCourtDemand: z.boolean().default(false),
  includeInterest: z.boolean().default(true),
  includeDebtorRegistryWarning: z.boolean().default(false),
  includeCollectionCosts: z.boolean().default(false),
  capitalizeInterest: z.boolean().default(false),
  jointLiability: z.boolean().default(false),
}).refine(data => {
    if (data.obligationType === 'Inne') {
        return !!data.otherObligationType && data.otherObligationType.length > 0;
    }
    return true;
}, {
    message: 'Proszę opisać rodzaj zobowiązania.',
    path: ['otherObligationType'],
});

export type LetterGenerationState = {
  success: boolean;
  htmlContent?: string;
  letterData?: PaymentDemandLetterInput;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function generateLetterAction(
  prevState: LetterGenerationState,
  formData: FormData
): Promise<LetterGenerationState> {
  const validatedFields = actionSchema.safeParse({
    creditorName: formData.get("creditorName"),
    creditorAddress: formData.get("creditorAddress"),
    debtorName: formData.get("debtorName"),
    debtorAddress: formData.get("debtorAddress"),
    invoiceNumber: formData.get("invoiceNumber"),
    invoiceIssueDate: formData.get("invoiceIssueDate"),
    invoiceDueDate: formData.get("invoiceDueDate"),
    amount: formData.get("amount"),
    bankAccountNumber: formData.get("bankAccountNumber"),
    city: formData.get("city"),
    
    obligationType: formData.get("obligationType"),
    otherObligationType: formData.get("otherObligationType"),
    isPreCourtDemand: formData.get("isPreCourtDemand") === "on",
    includeInterest: formData.get("includeInterest") === "on",
    includeDebtorRegistryWarning: formData.get("includeDebtorRegistryWarning") === "on",
    includeCollectionCosts: formData.get("includeCollectionCosts") === "on",
    capitalizeInterest: formData.get("capitalizeInterest") === "on",
    jointLiability: formData.get("jointLiability") === "on",
  });
  

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Proszę poprawić błędy w formularzu.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const inputForAI: PaymentDemandLetterInput = {
      ...validatedFields.data,
      bankAccountNumber: validatedFields.data.bankAccountNumber.replace(/\s/g, ''),
      invoiceIssueDate: format(new Date(validatedFields.data.invoiceIssueDate), "yyyy-MM-dd"),
      invoiceDueDate: format(new Date(validatedFields.data.invoiceDueDate), "yyyy-MM-dd"),
    };

    const result = await generatePaymentDemandLetterContent(inputForAI);

    if (!result.htmlContent) {
      return { success: false, message: "Wystąpił błąd podczas generowania listu. Proszę spróbować ponownie." };
    }

    return { success: true, htmlContent: result.htmlContent, letterData: inputForAI };
  } catch (error) {
    console.error("Error generating letter:", error);
    return { success: false, message: "Wystąpił nieoczekiwany błąd serwera. Proszę spróbować później." };
  }
}
