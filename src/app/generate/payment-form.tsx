"use client";


import { useActionState, useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { generateLetterAction, type LetterGenerationState } from "./actions";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import LetterPreview from "./letter-preview";
import { useToast } from "@/hooks/use-toast";
import { Stepper } from "@/components/stepper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const formObjectSchema = z.object({
    creditorName: z.string().min(1, "Imię i nazwisko lub nazwa firmy wierzyciela jest wymagana."),
    creditorAddress: z.string().min(1, "Adres wierzyciela jest wymagany."),
    debtorName: z.string().min(1, "Imię i nazwisko lub nazwa firmy dłużnika jest wymagana."),
    debtorAddress: z.string().min(1, "Adres dłużnika jest wymagany."),

    obligationType: z.string().min(1, "Rodzaj zobowiązania jest wymagany."),
    otherObligationType: z.string().optional(),

    invoiceNumber: z.string().min(1, "Numer faktury/umowy jest wymagany."),
    invoiceIssueDate: z.string().min(1, "Data wystawienia dokumentu jest wymagana.").refine(
        (date) => new Date(date) <= new Date(),
        {
            message: "Data wystawienia nie może być z przyszłości.",
        }
    ),
    invoiceDueDate: z.string().min(1, "Termin płatności jest wymagany."),
    amount: z.coerce.number().positive("Kwota musi być liczbą dodatnią."),
    bankAccountNumber: z.string().min(1, "Numer konta bankowego jest wymagany.").regex(/^(?:\d{26}|\d{2}(?:\s\d{4}){6})$/, "Niepoprawny format numeru konta (26 cyfr lub w formacie IBAN z przerwami)."),
    city: z.string().min(1, "Miasto wystawienia dokumentu jest wymagane."),

    // Options
    isPreCourtDemand: z.boolean().default(false),
    includeInterest: z.boolean().default(true),
    includeDebtorRegistryWarning: z.boolean().default(false),
    includeCollectionCosts: z.boolean().default(false),
    capitalizeInterest: z.boolean().default(false),
    jointLiability: z.boolean().default(false),
});

const formSchema = formObjectSchema.refine(data => {
    if (data.obligationType === 'Inne') {
        return !!data.otherObligationType && data.otherObligationType.length > 0;
    }
    return true;
}, {
    message: 'Proszę opisać rodzaj zobowiązania.',
    path: ['otherObligationType'],
});

type FormData = z.infer<typeof formSchema>;

const FORM_STORAGE_KEY = 'payment-form-data';

const steps = [
    { id: 1, name: "Wypełnij formularz" },
    { id: 2, name: "Podgląd i płatność" },
    { id: 3, name: "Pobierz dokument" },
];

const obligationTypes = [
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
    "Inne",
];

function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generowanie podglądu...
                </>
            ) : (
                "Wygeneruj podgląd"
            )}
        </Button>
    );
}

export default function PaymentForm() {
    const { toast } = useToast();
    const initialState: LetterGenerationState = { success: false };
    const [state, formAction] = useActionState(generateLetterAction, initialState);
    const [isPending, startTransition] = useTransition();

    const currentStep = state.success && state.htmlContent ? 2 : 1;

    const [formKey, setFormKey] = useState(0);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            creditorName: "",
            creditorAddress: "",
            debtorName: "",
            debtorAddress: "",
            obligationType: "",
            otherObligationType: "",
            invoiceNumber: "",
            invoiceIssueDate: "",
            invoiceDueDate: "",
            amount: undefined,
            bankAccountNumber: "",
            city: "",
            isPreCourtDemand: false,
            includeInterest: true,
            includeDebtorRegistryWarning: false,
            includeCollectionCosts: false,
            capitalizeInterest: false,
            jointLiability: false,
        },
    });

    const watchedObligationType = form.watch("obligationType");

    const processForm: SubmitHandler<FormData> = (data) => {
        const formData = new FormData();
        for (const key in data) {
            const value = data[key as keyof FormData];
            if (value !== undefined && value !== null) {
                if (typeof value === 'boolean') {
                    if (value) {
                        formData.append(key, 'on');
                    }
                } else {
                    formData.append(key, String(value));
                }
            }
        }
        startTransition(() => {
            formAction(formData);
        });
    };

    useEffect(() => {
        try {
            const savedData = localStorage.getItem(FORM_STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (typeof parsedData === 'object' && parsedData !== null) {
                    form.reset(parsedData);
                }
            }
        } catch (error) {
            console.error("Failed to load or parse form data from localStorage", error);
        }
    }, [form]);

    useEffect(() => {

        const subscription = form.watch((value: Partial<FormData>) => {
            try {
                localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
            } catch (error) {
                console.error("Failed to save form data to localStorage", error);
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    useEffect(() => {
        if (!state.success && state.message && !state.errors) {
            toast({
                variant: "destructive",
                title: "Błąd",
                description: state.message,
            });
        }
        if (state.errors) {
            Object.entries(state.errors).forEach(([key, errorMessages]) => {
                const field = key as keyof FormData;

                if (!form.getFieldState(field).isTouched) {
                    form.setError(field, { type: 'server', message: errorMessages?.[0] });
                }
            });
        }
    }, [state, form, toast]);

    const handleReset = () => {
        setFormKey(prevKey => prevKey + 1);
        form.reset();
        localStorage.removeItem(FORM_STORAGE_KEY);
        window.location.reload();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-center">
                <Stepper steps={steps} currentStep={currentStep} />
            </div>
            {currentStep < 2 && (
                <div className="text-center">
                    <h1 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Generator Wezwania do Zapłaty
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Wypełnij formularz, aby wygenerować bezpieczny podgląd dokumentu.
                    </p>
                </div>
            )}

            {currentStep < 3 && state.success && state.htmlContent && state.letterData ? (
                <LetterPreview
                    htmlContent={state.htmlContent}
                    letterData={state.letterData}
                    onReset={handleReset}
                />
            ) : (
                <Form {...form}>
                    <form key={formKey} onSubmit={form.handleSubmit(processForm)} className="space-y-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <fieldset className="space-y-4">
                                <h2 className="font-headline text-xl font-semibold text-primary border-b pb-2">Dane Wierzyciela (Twoje dane)</h2>
                                <FormField control={form.control} name="creditorName" render={({ field }) => (
                                    <FormItem><FormLabel>Pełna nazwa / Imię i nazwisko</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="creditorAddress" render={({ field }) => (
                                    <FormItem><FormLabel>Adres</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </fieldset>
                            <fieldset className="space-y-4">
                                <h2 className="font-headline text-xl font-semibold text-primary border-b pb-2">Dane Dłużnika</h2>
                                <FormField control={form.control} name="debtorName" render={({ field }) => (
                                    <FormItem><FormLabel>Pełna nazwa / Imię i nazwisko</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="debtorAddress" render={({ field }) => (
                                    <FormItem><FormLabel>Adres</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </fieldset>
                        </div>

                        <fieldset className="space-y-4">
                            <h2 className="font-headline text-xl font-semibold text-primary border-b pb-2">Szczegóły Zobowiązania</h2>

                            <FormField
                                control={form.control}
                                name="obligationType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rodzaj zobowiązania</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ''}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Wybierz rodzaj zobowiązania" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {obligationTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {watchedObligationType === 'Inne' && (
                                <FormField control={form.control} name="otherObligationType" render={({ field }) => (
                                    <FormItem><FormLabel>Opisz rodzaj zobowiązania</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            )}

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <FormField control={form.control} name="invoiceNumber" render={({ field }) => (
                                    <FormItem><FormLabel>Numer dokumentu (np. faktury, umowy)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="amount" render={({ field }) => (
                                    <FormItem><FormLabel>Kwota (PLN)</FormLabel><FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <FormField control={form.control} name="invoiceIssueDate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data dokumentu (wystawienia, zawarcia)</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="invoiceDueDate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Termin płatności</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </fieldset>

                        <fieldset className="space-y-4">
                            <h2 className="font-headline text-xl font-semibold text-primary border-b pb-2">Dane do płatności i Opcje</h2>
                            <FormField control={form.control} name="bankAccountNumber" render={({ field }) => (
                                <FormItem><FormLabel>Numer konta bankowego do zapłaty</FormLabel><FormControl><Input {...field} placeholder="XX XXXX XXXX XXXX XXXX XXXX XXXX" /></FormControl><FormDescription>Wprowadź numer konta, na który dłużnik ma dokonać wpłaty.</FormDescription><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem><FormLabel>Miasto wystawienia wezwania</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />

                            <div className="space-y-2 pt-2">
                                <FormField control={form.control} name="isPreCourtDemand" render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Ostateczne przedsądowe wezwanie do zapłaty</FormLabel>
                                            <FormDescription>Zaznacz, jeśli to ostateczne wezwanie przed skierowaniem sprawy do sądu. Zwiększa formalną wagę dokumentu.</FormDescription>
                                        </div>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="includeInterest" render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Nalicz odsetki ustawowe za opóźnienie</FormLabel>
                                            <FormDescription>Dołącz klauzulę o naliczeniu odsetek ustawowych za opóźnienie w transakcjach handlowych.</FormDescription>
                                        </div>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="capitalizeInterest" render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Kapitalizacja odsetek</FormLabel>
                                            <FormDescription>Dodaj klauzulę o naliczaniu odsetek od zaległych odsetek (anatocyzm, zgodnie z art. 482 KC).</FormDescription>
                                        </div>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="includeCollectionCosts" render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Dołącz informację o kosztach windykacji</FormLabel>
                                            <FormDescription>Poinformuj o możliwości dochodzenia zwrotu kosztów odzyskiwania należności.</FormDescription>
                                        </div>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="includeDebtorRegistryWarning" render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Dodaj ostrzeżenie o wpisie do rejestru dłużników</FormLabel>
                                            <FormDescription>Uprzedź o możliwości wpisu do BIG (Biuro Informacji Gospodarczej).</FormDescription>
                                        </div>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="jointLiability" render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Wezwanie solidarne (wielu dłużników)</FormLabel>
                                            <FormDescription>Zaznacz, jeśli wezwanie jest kierowane do więcej niż jednego dłużnika, którzy odpowiadają solidarnie.</FormDescription>
                                        </div>
                                    </FormItem>
                                )} />
                            </div>
                        </fieldset>

                        <SubmitButton pending={isPending} />
                    </form>
                </Form>
            )}
        </div>
    );
}