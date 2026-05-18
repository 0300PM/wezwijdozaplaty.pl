"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export default function Multiplex() {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch {}
    }, []);

    return (
        <ins className="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-6800391309176998"
             data-ad-slot="8229545667"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
    );
}