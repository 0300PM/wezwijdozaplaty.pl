import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Generator from './pages/Generator';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import RODO from './pages/RODO';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Regulamin from './pages/Regulamin';
import AdsPolicy from './pages/AdsPolicy';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="app">
      <Header />
      <AdBanner slot="1111111111" format="horizontal" />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/o-nas" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/rodo" element={<RODO />} />
          <Route path="/polityka-prywatnosci" element={<Privacy />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/regulamin" element={<Regulamin />} />
          <Route path="/reklamy-i-prywatnosc" element={<AdsPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <AdBanner slot="2222222222" format="horizontal" />
      <Footer />
      <CookieConsent />
    </div>
  );
}

export default App;
