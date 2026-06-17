import type { Metadata } from "next";
import Script from "next/script";
import AdBanner from "@/components/AdBanner";
import CookieConsent from "@/components/CookieConsent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wezwij do Zapłaty",
  description: "Darmowa aplikacja webowa do generowania wezwań do zapłaty w PDF i DOCX."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <Script
          id="adsense-script"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000"
          crossOrigin="anonymous"
        />
        <div>
          <Header />
          <div className="mx-auto w-full max-w-app px-6">
            <AdBanner slot="1111111111" format="horizontal" />
          </div>
          <main>{children}</main>
          <div className="mx-auto w-full max-w-app px-6">
            <AdBanner slot="2222222222" format="horizontal" />
          </div>
          <Footer />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
