import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          Wezwij do Zapłaty
        </Link>

        <button
          className="menu-toggle"
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'Zamknij' : 'Menu'}
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Strona główna</NavLink>
          <NavLink to="/generator" onClick={() => setMenuOpen(false)}>Generator</NavLink>
          <NavLink to="/blog" onClick={() => setMenuOpen(false)}>Blog</NavLink>
          <NavLink to="/faq" onClick={() => setMenuOpen(false)}>FAQ</NavLink>
          <Link to="/generator" className="btn" onClick={() => setMenuOpen(false)}>Wygeneruj wezwanie</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
