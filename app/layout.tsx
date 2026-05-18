import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import Script from "next/script";
//import  Adsense  from '../components/adsense'
//import Multiplex from '../components/Multiplex'

const VERCEL_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Wezwij do zapłaty - Generator Wezwań do Zapłaty',
  description: 'Szybko i łatwo wygeneruj profesjonalne, zgodne z prawem wezwanie do zapłaty. Oszczędź czas i pieniądze na prawnikach.',
  metadataBase: new URL(VERCEL_URL),
  openGraph: {
    title: 'Wezwij do zapłaty - Generator Wezwań do Zapłaty',
    description: 'Najszybszy sposób na wygenerowanie oficjalnego wezwania do zapłaty online.',
    url: VERCEL_URL,
    siteName: 'wezwijdozaplaty',
    locale: 'pl_PL',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: '...',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ZapłaćTeraz',
  url: VERCEL_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  description: 'Szybko i łatwo wygeneruj profesjonalne, zgodne z prawem wezwanie do zapłaty.',
  offers: {
    '@type': 'Offer',
    price: 'free',
    priceCurrency: 'PLN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // @ts-ignore
    return (
    <html lang="pl" suppressHydrationWarning>
    <meta name="google-site-verification" content="WpI8KO8KMHsNGUBiuLWFPUf6mGbVJpEUdHZzgeCv7uw" />

    <meta property="og:title" content="Wezwij do zapłaty - Generator Wezwań do Zapłaty" />
    <meta property="og:description" content="Szybko i łatwo wygeneruj profesjonalne wezwanie do zapłaty" />
    <meta property="og:image" content="https://wezwijdozaplaty.com/baner.pn1g" />
    <meta property="og:url" content="https://wezwijdozaplaty.com/" />
    <meta property="og:type" content="website" />
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
        />
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Literata:opsz,wght@7..72,400;700&display=swap"
            rel="stylesheet"
        />

        <script async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6800391309176998"
                crossOrigin="anonymous"></script>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>

        <script async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6800391309176998"
                crossOrigin="anonymous"></script>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>


        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />
        <script async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6800391309176998"
                crossOrigin="anonymous"></script>
    </head>
    <body
        className={cn(
            'min-h-screen bg-background font-body text-foreground antialiased'
        )}
    >
    <a href="#main-content"
       className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground">
        Przejdź do głównej treści
    </a>
    <div className="relative flex min-h-dvh flex-1 flex-col">
        { /* <Adsense/> */}
        <SiteHeader/>
        <main id="main-content" className="flex-1">
              {children}
          </main>
          <SiteFooter />
        {/* <Multiplex >/ */}
        </div>

        <Toaster />
      </body>
    </html>
  );
}
