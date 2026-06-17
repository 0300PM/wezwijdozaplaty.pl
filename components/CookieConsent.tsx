"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
    try {
      if (window.adsbygoogle) window.adsbygoogle.push({});
    } catch {
      // ignore
    }
  };

  const decline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] border-t border-border bg-surface py-4 shadow-mdsoft">
      <div className="mx-auto flex w-full max-w-app flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left">
        <p className="m-0 text-sm leading-relaxed text-textMuted">
          <strong>Ta strona używa plików cookies.</strong> Korzystamy z nich w celu zapewnienia prawidłowego działania serwisu, anonimowego zbierania statystyk oraz wyświetlania spersonalizowanych reklam. Szczegóły znajdziesz w{" "}
          <Link href="/polityka-prywatnosci">Polityce prywatności</Link>.
        </p>
        <div className="flex w-full flex-wrap justify-center gap-3 md:w-auto">
          <button className="btn" onClick={accept}>Akceptuję</button>
          <button className="btn btn-outline" onClick={decline}>Odrzucam niezbędne</button>
        </div>
      </div>
    </div>
  );
}
