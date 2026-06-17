import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../utils/blogData';
import NotFound from './NotFound';

function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="section">
      <div className="container">
        <div className="blog-article">
          <Link to="/blog" className="btn btn-outline" style={{ marginBottom: '1.5rem' }}>
            Wróć do bloga
          </Link>
          <div className="meta">
            {post.category} • {post.date}
          </div>
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <div style={{ marginTop: '2rem' }}>
            <Link to="/generator" className="btn">
              Wygeneruj wezwanie do zapłaty
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
