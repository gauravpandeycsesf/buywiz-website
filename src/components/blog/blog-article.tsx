import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedBlogPost,
  type PublicBlogLanguage,
} from "@/lib/blog";

export default async function BlogArticle({
  language,
  slug,
}: {
  language: PublicBlogLanguage;
  slug: string;
}) {
  const post = await getPublishedBlogPost(
    slug,
    language,
  );

  if (!post) {
    notFound();
  }

  const english = language === "EN";
  const homeHref = english ? "/en" : "/";
  const blogHref = english ? "/en/blog" : "/blog";
  const locale = english ? "en-GB" : "nl-NL";

  const date =
    post.publishedAt ?? post.createdAt;

  return (
    <main className="public-article-page">
      <header className="public-blog-header">
        <div className="public-blog-header-inner">
          <Link
            href={homeHref}
            className="public-blog-brand"
          >
            Buywiz
          </Link>

          <nav className="public-blog-nav">
            <Link href={homeHref}>Home</Link>

            <Link href={blogHref}>
              {english ? "Insights" : "Kennisbank"}
            </Link>
          </nav>
        </div>
      </header>

      <article className="public-article">
        <div className="public-article-header">
          <Link
            href={blogHref}
            className="public-article-back"
          >
            ← {english ? "All articles" : "Alle artikelen"}
          </Link>

          <div className="public-article-meta">
            {post.category ? (
              <span>{post.category}</span>
            ) : null}

            <time dateTime={date.toISOString()}>
              {new Intl.DateTimeFormat(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(date)}
            </time>
          </div>

          <h1>{post.title}</h1>

          <p className="public-article-summary">
            {post.summary}
          </p>

          <div className="public-article-author-line">
            {english ? "By" : "Door"}{" "}
            <strong>{post.authorName}</strong>
          </div>
        </div>

        {post.coverImage ? (
          <div className="public-article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
            />
          </div>
        ) : null}

        <div
          className="public-blog-content"
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />

        {post.tags.length > 0 ? (
          <div className="public-article-tags">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}

        <footer className="public-article-author">
          {post.authorImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.authorImage}
              alt={post.authorName}
            />
          ) : (
            <div className="public-author-placeholder">
              {post.authorName
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div>
            <span>
              {english
                ? "Written by"
                : "Geschreven door"}
            </span>

            <strong>{post.authorName}</strong>

            {post.authorBio ? (
              <p>{post.authorBio}</p>
            ) : null}
          </div>
        </footer>
      </article>
    </main>
  );
}
