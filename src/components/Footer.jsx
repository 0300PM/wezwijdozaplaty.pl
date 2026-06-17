import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-title">Wezwij do Zapłaty</div>
            <p>
              Darmowy generator wezwań do zapłaty. Twórz profesjonalne dokumenty przedsądowe w formacie PDF i DOCX bez rejestracji.
            </p>
          </div>
          <div>
            <div className="footer-title">Aplikacja</div>
            <Link to="/generator">Generator</Link>
            <Link to="/o-nas">O nas</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div>
            <div className="footer-title">Informacje</div>
            <Link to="/regulamin">Regulamin</Link>
            <Link to="/polityka-prywatnosci">Polityka prywatności</Link>
            <Link to="/rodo">RODO</Link>
            <Link to="/reklamy-i-prywatnosc">Reklamy i prywatność</Link>
          </div>
          <div>
            <div className="footer-title">Kontakt</div>
            <a href="mailto:kontakt@wezwijdozaplaty.pl">kontakt@wezwijdozaplaty.pl</a>
            <p style={{ marginTop: '1rem' }}>© {new Date().getFullYear()} Wezwij do Zapłaty</p>
          </div>
        </div>
        <div className="footer-bottom">
          Treści serwisu mają charakter informacyjny i nie stanowią porady prawnej. Korzystanie z generatora jest całkowicie darmowe.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
