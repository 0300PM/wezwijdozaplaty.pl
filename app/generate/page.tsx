import PaymentForm from "./payment-form";

export default function GeneratePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mt-8">
        <PaymentForm />
      </div>
    </div>
  );
}
