import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AdBanner from './components/AdBanner.jsx';
import CookieConsent from './components/CookieConsent.jsx';
import Home from './pages/Home.jsx';
import Generator from './pages/Generator.jsx';
import About from './pages/About.jsx';
import FAQ from './pages/FAQ.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import RODO from './pages/RODO.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Regulamin from './pages/Regulamin.jsx';
import AdsPolicy from './pages/AdsPolicy.jsx';
import NotFound from './pages/NotFound.jsx';

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
