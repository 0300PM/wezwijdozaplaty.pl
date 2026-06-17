import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section text-center">
      <div className="mx-auto w-full max-w-app px-6">
        <h1 className="mb-0 text-8xl text-primary">404</h1>
        <h2 className="mb-4 text-2xl">Nie znaleziono strony</h2>
        <p className="section-subtitle">Przepraszamy, strona, której szukasz, nie istnieje lub została przeniesiona.</p>
        <Link href="/" className="btn">Wróć na stronę główną</Link>
      </div>
    </div>
  );
}
