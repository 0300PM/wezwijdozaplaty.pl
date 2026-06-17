import { useEffect, useRef } from 'react';

/**
 * Komponent reklamy AdSense.
 * Aby działał, wymagany jest skrypt AdSense w index.html oraz własny ad-slot.
 */
function AdBanner({ slot = '0000000000', format = 'auto', style = {} }) {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="ad-banner" style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', ...style }}
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default AdBanner;
