import Link from "next/link";
import {
  getPublishedBlogPosts,
  type PublicBlogLanguage,
} from "@/lib/blog";

export default async function BlogIndex({
  language,
}: {
  language: PublicBlogLanguage;
}) {
  const posts = await getPublishedBlogPosts(language);

  const english = language === "EN";
  const homeHref = english ? "/en" : "/";
  const blogHref = english ? "/en/blog" : "/blog";
  const locale = english ? "en-GB" : "nl-NL";

  return (
    <main className="public-blog-page">
      <header className="public-blog-header">
        <div className="public-blog-header-inner">
          <Link href={homeHref} className="public-blog-brand">
            Buywiz
          </Link>

          <nav className="public-blog-nav">
            <Link href={homeHref}>Home</Link>

            <Link className="active" href={blogHref}>
              {english ? "Insights" : "Kennisbank"}
            </Link>

            <Link href={english ? "/blog" : "/en/blog"}>
              {english ? "NL" : "EN"}
            </Link>
          </nav>
        </div>
      </header>

      <section className="public-blog-hero">
        <div className="public-blog-shell">
          <span className="public-blog-eyebrow">
            {english ? "Buywiz Insights" : "Buywiz Kennisbank"}
          </span>

          <h1>
            {english
              ? "Practical insights on product compliance"
              : "Praktische kennis over product compliance"}
          </h1>

          <p>
            {english
              ? "Guides and practical explanations for importers, distributors and product teams navigating EU product compliance."
              : "Praktische uitleg voor importeurs, distributeurs en productteams die werken aan EU-productcompliance."}
          </p>
        </div>
      </section>

      <section className="public-blog-list-section">
        <div className="public-blog-shell">
          {posts.length === 0 ? (
            <div className="public-blog-empty">
              <h2>
                {english
                  ? "No published articles yet"
                  : "Nog geen gepubliceerde artikelen"}
              </h2>

              <p>
                {english
                  ? "New Buywiz insights will appear here."
                  : "Nieuwe Buywiz-artikelen verschijnen hier."}
              </p>
            </div>
          ) : (
            <div className="public-blog-grid">
              {posts.map((post) => {
                const href = english
                  ? `/en/blog/${post.slug}`
                  : `/blog/${post.slug}`;

                const date =
                  post.publishedAt ?? post.createdAt;

                return (
                  <article
                    className="public-blog-card"
                    key={post.id}
                  >
                    {post.coverImage ? (
                      <div className="public-blog-card-image">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImage}
                          alt={post.title}
                        />
                      </div>
                    ) : null}

                    <div className="public-blog-card-body">
                      <div className="public-blog-card-meta">
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

                      <h2>
                        <Link href={href}>
                          {post.title}
                        </Link>
                      </h2>

                      <p>{post.summary}</p>

                      <Link
                        className="public-blog-read"
                        href={href}
                      >
                        {english
                          ? "Read article →"
                          : "Lees artikel →"}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
