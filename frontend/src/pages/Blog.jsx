import { Link } from 'react-router-dom';
import { blogPosts } from '../utils/blogData';

function Blog() {
  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Blog o windykacji i wezwaniach do zapłaty</h1>
        <p className="section-subtitle">
          Praktyczne porady, wzory i wskazówki dotyczące skutecznego dochodzenia należności. 
          Dowiedz się, jak pisać wezwania do zapłaty i jak wygląda proces windykacyjny.
        </p>
        <div className="blog-list">
          {blogPosts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <div className="blog-card-image">{post.category}</div>
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  {post.category} • {post.date}
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="blog-card-link">
                  Czytaj artykuł
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;
