import type { PaymentDemandLetterInput } from '@/ai/flows/generate-payment-demand-letter';

type StoredLetter = {
    id: string;
    data: PaymentDemandLetterInput;
    createdAt: number;
};

const store = new Map<string, StoredLetter>();

export function saveLetter(data: PaymentDemandLetterInput) {
    const id = crypto.randomUUID();

    store.set(id, {
        id,
        data,
        createdAt: Date.now(),
    });

    return id;
}

export function getLetter(id: string) {
    return store.get(id);
}
