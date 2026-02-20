"use client";

import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    creditorName: z.string().min(1),
    creditorAddress: z.string().min(1),
    debtorName: z.string().min(1),
    debtorAddress: z.string().min(1),

    obligationType: z.string().min(1),
    otherObligationType: z.string().optional(),

    invoiceNumber: z.string().min(1),
    invoiceIssueDate: z.string().min(1).refine(d => new Date(d) <= new Date(), { message: "Data nie może być z przyszłości" }),
    invoiceDueDate: z.string().min(1),
    amount: z.coerce.number().positive(),
    bankAccountNumber: z.string().min(1).regex(/^(?:\d{26}|\d{2}(?:\s\d{4}){6})$/),
    city: z.string().min(1),

    isPreCourtDemand: z.boolean().default(false),
    includeInterest: z.boolean().default(true),
    includeDebtorRegistryWarning: z.boolean().default(false),
    includeCollectionCosts: z.boolean().default(false),
    capitalizeInterest: z.boolean().default(false),
    jointLiability: z.boolean().default(false),
});

const formSchema = formObjectSchema.refine(data => {
    if (data.obligationType === 'Inne') return !!data.otherObligationType && data.otherObligationType.length > 0;
    return true;
}, { message: "Proszę opisać rodzaj zobowiązania", path: ["otherObligationType"] });

type FormData = z.infer<typeof formSchema>;
const FORM_STORAGE_KEY = "payment-form-data";

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
            ) : "Wygeneruj podgląd"}
        </Button>
    );
}

export default function PaymentForm() {
    const { toast } = useToast();
    const [state, setState] = useState<LetterGenerationState>({ success: false });
    const [isPending, startTransition] = useTransition();
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
    const currentStep = state.success && state.htmlContent ? 2 : 1;

    const processForm: SubmitHandler<FormData> = async (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            const typedKey = key as keyof FormData;
            if (value != null) {
                if (typeof value === "boolean") formData.append(typedKey, value ? "true" : "false");
                else formData.append(typedKey, String(value));
            }
        });

        startTransition(async () => {
            try {
                const result = await generateLetterAction(state, formData);
                setState(result);
            } catch (err: any) {
                setState({ success: false, message: err?.message || "Błąd serwera" });
            }
        });
    };

    useEffect(() => {
        const saved = localStorage.getItem(FORM_STORAGE_KEY);
        if (saved) form.reset(JSON.parse(saved));
    }, [form]);

    useEffect(() => {
        const sub = form.watch((value) => {
            try { localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value)); }
            catch {}
        });
        return () => sub.unsubscribe();
    }, [form.watch]);

    useEffect(() => {
        if (!state.success && state.message && !state.errors) {
            toast({ variant: "destructive", title: "Błąd", description: state.message });
        }
        if (state.errors) {
            Object.entries(state.errors).forEach(([key, errorMessages]) => {
                const field = key as keyof FormData;
                if (!form.getFieldState(field).isTouched) form.setError(field, { type: "server", message: errorMessages?.[0] });
            });
        }
    }, [state, form, toast]);

    const handleReset = () => {
        form.reset();
        localStorage.removeItem(FORM_STORAGE_KEY);
        setFormKey(prev => prev + 1);
        setState({ success: false }); // reset preview
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-center"><Stepper steps={steps} currentStep={currentStep} /></div>
            {currentStep < 2 && (
                <div className="text-center">
                    <h1 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">Generator Wezwania do Zapłaty</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Wypełnij formularz, aby wygenerować bezpieczny podgląd dokumentu.</p>
                </div>
            )}

            {state.success && state.htmlContent && state.letterData ? (
                <LetterPreview htmlContent={state.htmlContent} letterData={state.letterData} onReset={handleReset} />
            ) : (
                <Form {...form}>
                    <form key={formKey} onSubmit={form.handleSubmit(processForm)} className="space-y-8">
                        {/* Wierzyciel i Dłużnik */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <fieldset className="space-y-4">
                                <h2 className="font-headline text-xl font-semibold text-primary border-b pb-2">Dane Wierzyciela</h2>
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

                        {/* Szczegóły zobowiązania */}
                        <fieldset className="space-y-4">
                            <h2 className="font-headline text-xl font-semibold text-primary border-b pb-2">Szczegóły Zobowiązania</h2>
                            <FormField control={form.control} name="obligationType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rodzaj zobowiązania</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ''}>
                                        <SelectTrigger><SelectValue placeholder="Wybierz rodzaj zobowiązania" /></SelectTrigger>
                                        <SelectContent>{obligationTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            {watchedObligationType === "Inne" && (
                                <FormField control={form.control} name="otherObligationType" render={({ field }) => (
                                    <FormItem><FormLabel>Opisz rodzaj zobowiązania</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            )}
                        </fieldset>

                        {/* Kwota i daty */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <FormField control={form.control} name="invoiceNumber" render={({ field }) => (
                                <FormItem><FormLabel>Numer dokumentu</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem><FormLabel>Kwota (PLN)</FormLabel><FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <FormField control={form.control} name="invoiceIssueDate" render={({ field }) => (
                                <FormItem><FormLabel>Data dokumentu</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="invoiceDueDate" render={({ field }) => (
                                <FormItem><FormLabel>Termin płatności</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        {/* Opcje i checkboxy */}
                        <fieldset className="space-y-4">
                            <h2 className="font-headline text-xl font-semibold text-primary border-b pb-2">Dane do płatności i opcje</h2>
                            <FormField control={form.control} name="bankAccountNumber" render={({ field }) => (
                                <FormItem><FormLabel>Numer konta bankowego</FormLabel><FormControl><Input {...field} placeholder="XX XXXX XXXX XXXX XXXX XXXX XXXX" /></FormControl><FormMessage /><FormDescription>Na który dłużnik ma dokonać wpłaty</FormDescription></FormItem>
                            )} />
                            <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem><FormLabel>Miasto wystawienia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />

                            <div className="space-y-2 pt-2">
                                {[
                                    { name: "isPreCourtDemand", label: "Ostateczne przedsądowe wezwanie do zapłaty", description: "Zwiększa formalną wagę dokumentu." },
                                    { name: "includeInterest", label: "Nalicz odsetki ustawowe za opóźnienie", description: "Klauzula o odsetkach ustawowych." },
                                    { name: "capitalizeInterest", label: "Kapitalizacja odsetek", description: "Odsetki od zaległych odsetek." },
                                    { name: "includeCollectionCosts", label: "Dołącz informację o kosztach windykacji", description: "Możliwość dochodzenia kosztów." },
                                    { name: "includeDebtorRegistryWarning", label: "Dodaj ostrzeżenie o wpisie do rejestru dłużników", description: "Uprzedź o wpisie do BIG." },
                                    { name: "jointLiability", label: "Wezwanie solidarne", description: "Dla wielu dłużników solidarnych." }
                                ].map(opt => (
                                    <FormField key={opt.name} control={form.control} name={opt.name as keyof FormData} render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox checked={!!field.value} onCheckedChange={v => field.onChange(v === true)} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>{opt.label}</FormLabel>
                                                <FormDescription>{opt.description}</FormDescription>
                                            </div>
                                        </FormItem>
                                    )} />
                                ))}
                            </div>
                        </fieldset>

                        <SubmitButton pending={isPending} />
                    </form>
                </Form>
            )}
        </div>
    );
}
