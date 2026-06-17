"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdBannerProps = {
  slot?: string;
  format?: string;
};

export default function AdBanner({ slot = "0000000000", format = "auto" }: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className="my-5 flex min-h-[90px] items-center justify-center overflow-hidden rounded border border-dashed border-border bg-bg">
      <ins
        ref={adRef}
        className="adsbygoogle block min-h-[90px] w-full text-center"
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
