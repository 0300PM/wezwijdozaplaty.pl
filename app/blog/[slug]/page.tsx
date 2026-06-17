import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <div className="section">
      <div className="mx-auto w-full max-w-app px-6">
        <div className="blog-article">
          <Link href="/blog" className="btn btn-outline mb-6">Wróć do bloga</Link>
          <div className="mb-8 text-xs uppercase tracking-wider text-textSubtle">{post.category} • {post.date}</div>
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="mt-8"><Link href="/generator" className="btn">Wygeneruj wezwanie do zapłaty</Link></div>
        </div>
      </div>
    </div>
  );
}
