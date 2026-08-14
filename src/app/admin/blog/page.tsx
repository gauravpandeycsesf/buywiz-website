import Link from "next/link";
import { redirect } from "next/navigation";
import { isBlogAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  if (!(await isBlogAdmin())) {
    redirect("/admin/login");
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  const publishedCount = posts.filter(
    (post) => post.status === "PUBLISHED",
  ).length;

  const draftCount = posts.filter(
    (post) => post.status === "DRAFT",
  ).length;

  return (
    <main className="blog-admin-page">
      <header className="blog-admin-header">
        <div>
          <span>Buywiz CMS</span>
          <h1>Artikelen</h1>
          <p>
            Beheer kennisartikelen, updates en praktische
            compliance-informatie.
          </p>
        </div>

        <form action="/api/admin/logout" method="POST">
          <button className="admin-logout" type="submit">
            Uitloggen
          </button>
        </form>
      </header>

      <section className="blog-admin-toolbar">
        <div>
          <strong>
            {posts.length} {posts.length === 1 ? "artikel" : "artikelen"}
          </strong>
          <span>
            {publishedCount} gepubliceerd · {draftCount} concept
          </span>
        </div>

        <Link className="admin-new-post" href="/admin/blog/new">
          + Nieuw artikel
        </Link>
      </section>

      {posts.length === 0 ? (
        <section className="blog-admin-empty">
          <div className="empty-icon">+</div>

          <h2>Nog geen artikelen</h2>

          <p>
            Maak het eerste Buywiz-artikel aan. Je kunt het eerst als concept
            bewaren en later publiceren.
          </p>

          <Link className="admin-new-post" href="/admin/blog/new">
            Eerste artikel maken
          </Link>
        </section>
      ) : (
        <section className="blog-admin-list">
          {posts.map((post) => (
            <article className="blog-admin-row" key={post.id}>
              <div className="blog-admin-row-main">
                <div className="blog-admin-row-meta">
                  <span
                    className={
                      post.status === "PUBLISHED"
                        ? "admin-status published"
                        : "admin-status draft"
                    }
                  >
                    {post.status === "PUBLISHED"
                      ? "Gepubliceerd"
                      : "Concept"}
                  </span>

                  <span>{post.language}</span>

                  {post.category ? <span>{post.category}</span> : null}
                </div>

                <h2>{post.title}</h2>

                <p>{post.summary}</p>

                <small>
                  Bijgewerkt{" "}
                  {new Intl.DateTimeFormat("nl-NL", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(post.updatedAt)}
                </small>
              </div>

              <Link
                className="admin-edit-link"
                href={`/admin/blog/${post.id}/edit`}
              >
                Bewerken →
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
