import { useState, useEffect } from 'react';

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // ignore
    }
  };

  const decline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite">
      <div className="cookie-content">
        <p>
          <strong>Ta strona używa plików cookies.</strong> Korzystamy z nich w celu zapewnienia prawidłowego 
          działania serwisu, anonimowego zbierania statystyk oraz wyświetlania spersonalizowanych reklam. 
          Szczegóły znajdziesz w <a href="/polityka-prywatnosci">Polityce prywatności</a>.
        </p>
        <div className="cookie-buttons">
          <button className="btn" onClick={accept}>Akceptuję</button>
          <button className="btn btn-outline" onClick={decline}>Odrzucam niezbędne</button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
