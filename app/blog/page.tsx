import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

export default function BlogPage() {
  return (
    <div className="section">
      <div className="mx-auto w-full max-w-app px-6">
        <h1 className="section-title">Blog o windykacji i wezwaniach do zapłaty</h1>
        <p className="section-subtitle">
          Praktyczne porady, wzory i wskazówki dotyczące skutecznego dochodzenia należności.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.slug} className="flex flex-col overflow-hidden rounded border border-border bg-surface transition hover:border-borderStrong hover:shadow-mdsoft">
              <div className="flex h-[140px] items-center justify-center bg-accentSoft text-sm font-semibold uppercase tracking-wider text-accent">
                {post.category}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 text-xs uppercase tracking-wider text-textSubtle">{post.category} • {post.date}</div>
                <h2 className="mb-3 text-base font-semibold leading-snug text-primary">{post.title}</h2>
                <p className="flex-1 text-sm leading-relaxed text-textMuted">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="mt-4 text-sm font-medium">
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
