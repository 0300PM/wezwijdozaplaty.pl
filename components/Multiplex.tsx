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
        <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-format="autorelaxed"
            data-ad-client="ca-pub-6800391309176998"
            data-ad-slot="MULTIPLEX_SLOT_ID"
        />
    );
}