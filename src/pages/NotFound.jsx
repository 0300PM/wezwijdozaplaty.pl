import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="section" style={{ textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ fontSize: '6rem', color: 'var(--primary)', marginBottom: 0 }}>404</h1>
        <h2 style={{ marginBottom: '1rem' }}>Nie znaleziono strony</h2>
        <p className="section-subtitle">
          Przepraszamy, strona, której szukasz, nie istnieje lub została przeniesiona.
        </p>
        <Link to="/public" className="btn">Wróć na stronę główną</Link>
      </div>
    </div>
  );
}

export default NotFound;
