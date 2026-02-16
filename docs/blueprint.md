# **App Name**: ZapłaćTeraz

## Core Features:

- Landing Page & Explainer: Present the application's purpose, a simple three-step explanation of its use, and clear pricing information for a one-time payment. Includes a 'Generuj wezwanie' call to action.
- Payment Demand Form: A comprehensive form for collecting all necessary data, including creditor/debtor details, invoice specifics (number, dates, amount), bank account number, and an optional 'Przedsądowe wezwanie do zapłaty' checkbox.
- Stripe Checkout Integration: Facilitate a secure one-time payment via Stripe. Upon form submission, create a Stripe Checkout Session and redirect the user for payment processing.
- Stripe Webhook for Payment Validation: Implement a webhook endpoint to receive and validate successful Stripe payments, triggering the subsequent letter and PDF generation process.
- AI Letter Content Generation Tool: Utilize generative AI to create the formal Polish payment demand letter's textual content, ensuring a professional legal tone, accurate dating, inclusion of payment deadline (7 days from current date), and a warning about legal action if unpaid.
- PDF Document Creation & Download: Generate a professional PDF of the payment demand letter from the AI-generated HTML content using Puppeteer, making it available for direct download after a successful payment.

## Style Guidelines:

- Primary color: A deep, professional blue-grey (#2E4B7A) to convey trust and seriousness. Chosen for its calm authority, suitable for a formal application.
- Background color: A very light, subtle grey-blue (#ECF1F7), harmonizing with the primary color while maintaining a clean, highly readable base for content, mimicking traditional document aesthetics.
- Accent color: A crisp, professional blue-green (#409FBF) used sparingly for interactive elements like CTA buttons and key highlights to provide clear guidance and emphasis.
- Headline font: 'Literata' (transitional serif) for a formal, authoritative, and intellectual feel that enhances the legal document's seriousness.
- Body font: 'Inter' (grotesque-style sans-serif) for clean, modern readability across forms and document text, ensuring clarity and ease of understanding for crucial information.
- Use minimalist, outline-style icons that relate to legal documents, payment, and sequential steps to visually support navigation and explanations without distracting from the serious content.
- Implement a clean, spacious layout with ample whitespace to enhance readability for forms and the final PDF letter, emphasizing a structured and professional appearance.
- Subtle animations and transitions for form submissions and payment processing feedback, providing a smooth and reassuring user experience without drawing excessive attention.