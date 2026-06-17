import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="section">
      <div className="mx-auto w-full max-w-app px-6">
        <div className="legal-page">
          <h1>O nas</h1>
          <p>
            <strong>Wezwij do Zapłaty</strong> to darmowe narzędzie internetowe stworzone z myślą o osobach fizycznych oraz przedsiębiorcach, które chcą szybko i profesjonalnie przygotować przedsądowe wezwanie do zapłaty.
          </p>
          <h2>Dlaczego powstał ten projekt?</h2>
          <p>Windykacja należności często kojarzy się z drogimi kancelariami prawnymi lub skomplikowanymi wzorami pism. Wierzymy, że podstawowe dokumenty przedsądowe można wygenerować automatycznie.</p>
          <h2>Co oferujemy?</h2>
          <ul>
            <li>Darmowy generator wezwań do zapłaty w formatach PDF i DOCX.</li>
            <li>Intuicyjny formularz z podglądem na żywo.</li>
            <li>Klauzule: odsetki ustawowe, koszty windykacji, BIG, wezwanie solidarne.</li>
            <li>Brak rejestracji, brak bazy danych.</li>
          </ul>
          <h2>Bezpieczeństwo i prywatność</h2>
          <p>
            Dane wprowadzone do formularza służą wyłącznie do wygenerowania dokumentu. Szczegóły znajdziesz w{" "}
            <Link href="/polityka-prywatnosci">Polityce prywatności</Link> oraz <Link href="/rodo">RODO</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
