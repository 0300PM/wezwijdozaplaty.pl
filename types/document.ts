export type LetterPayload = {
  creditorName: string;
  creditorAddress: string;
  debtorName: string;
  debtorAddress: string;
  obligationType: string;
  documentNumber: string;
  amount: string;
  documentDate: string;
  dueDate: string;
  bankAccount: string;
  city: string;
  isFinal: boolean;
  interest: boolean;
  capitalization: boolean;
  collectionCosts: boolean;
  registryWarning: boolean;
  joint: boolean;
};
