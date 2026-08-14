import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isBlogAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import RichTextEditor from "@/components/admin/rich-text-editor";
import DeletePostButton from "@/components/admin/delete-post-button";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  if (!(await isBlogAdmin())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const query = await searchParams;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="blog-editor-page">
      <header className="blog-editor-header">
        <div>
          <Link className="blog-editor-back" href="/admin/blog">
            ← Terug naar artikelen
          </Link>

          <span>Buywiz CMS</span>
          <h1>Artikel bewerken</h1>
          <p>
            Bewerk de inhoud, publicatiestatus en SEO-informatie.
          </p>
        </div>
      </header>

      {query.saved ? (
        <div className="blog-editor-success">
          Wijzigingen zijn opgeslagen.
        </div>
      ) : null}

      {query.error === "required" ? (
        <div className="blog-editor-error">
          Vul minimaal titel, samenvatting, inhoud en auteur in.
        </div>
      ) : null}

      {query.error === "slug" ? (
        <div className="blog-editor-error">
          Er bestaat al een artikel met deze URL voor deze taal.
        </div>
      ) : null}

      <form
        action={`/api/admin/blog/${post.id}`}
        method="POST"
        className="blog-editor-form"
      >
        <section className="blog-editor-main">
          <div className="blog-editor-card">
            <div className="blog-editor-card-heading">
              <h2>Artikel</h2>
              <p>De inhoud die bezoekers op Buywiz lezen.</p>
            </div>

            <label className="blog-field">
              <span>Titel *</span>
              <input
                type="text"
                name="title"
                defaultValue={post.title}
                required
              />
            </label>

            <label className="blog-field">
              <span>URL-slug *</span>
              <input
                type="text"
                name="slug"
                defaultValue={post.slug}
                required
              />
            </label>

            <label className="blog-field">
              <span>Samenvatting *</span>
              <textarea
                name="summary"
                rows={4}
                defaultValue={post.summary}
                required
              />
            </label>

            <div className="blog-field">
              <span>Inhoud *</span>

              <RichTextEditor initialContent={post.content} />

              <small>
                Voeg tekst, headings, lijsten en afbeeldingen toe.
              </small>
            </div>
          </div>

          <div className="blog-editor-card">
            <div className="blog-editor-card-heading">
              <h2>SEO</h2>
              <p>
                Informatie voor zoekmachines en het delen van het artikel.
              </p>
            </div>

            <label className="blog-field">
              <span>SEO-titel</span>
              <input
                type="text"
                name="seoTitle"
                defaultValue={post.seoTitle ?? ""}
              />
            </label>

            <label className="blog-field">
              <span>SEO-beschrijving</span>
              <textarea
                name="seoDescription"
                rows={3}
                defaultValue={post.seoDescription ?? ""}
              />
            </label>
          </div>
        </section>

        <aside className="blog-editor-sidebar">
          <div className="blog-editor-card">
            <div className="blog-editor-card-heading">
              <h2>Publicatie</h2>

              <p>
                Status:{" "}
                <strong>
                  {post.status === "PUBLISHED"
                    ? "Gepubliceerd"
                    : "Concept"}
                </strong>
              </p>
            </div>

            <label className="blog-field">
              <span>Taal *</span>
              <select
                name="language"
                defaultValue={post.language}
              >
                <option value="NL">Nederlands</option>
                <option value="EN">English</option>
              </select>
            </label>

            <label className="blog-field">
              <span>Categorie</span>
              <input
                type="text"
                name="category"
                defaultValue={post.category ?? ""}
              />
            </label>

            <label className="blog-field">
              <span>Tags</span>
              <input
                type="text"
                name="tags"
                defaultValue={post.tags.join(", ")}
              />
            </label>

            <label className="blog-field">
              <span>Cover afbeelding URL</span>
              <input
                type="text"
                name="coverImage"
                defaultValue={post.coverImage ?? ""}
              />
            </label>
          </div>

          <div className="blog-editor-card">
            <div className="blog-editor-card-heading">
              <h2>Auteur</h2>
            </div>

            <label className="blog-field">
              <span>Naam *</span>
              <input
                type="text"
                name="authorName"
                defaultValue={post.authorName}
                required
              />
            </label>

            <label className="blog-field">
              <span>Bio</span>
              <textarea
                name="authorBio"
                rows={4}
                defaultValue={post.authorBio ?? ""}
              />
            </label>

            <label className="blog-field">
              <span>Profielfoto URL</span>
              <input
                type="text"
                name="authorImage"
                defaultValue={post.authorImage ?? ""}
              />
            </label>
          </div>

          <div className="blog-editor-actions">
            <button
              className="blog-save-draft"
              type="submit"
              name="intent"
              value="save"
            >
              Wijzigingen opslaan
            </button>

            {post.status === "PUBLISHED" ? (
              <button
                className="blog-save-draft"
                type="submit"
                name="intent"
                value="unpublish"
              >
                Terugzetten naar concept
              </button>
            ) : (
              <button
                className="blog-publish"
                type="submit"
                name="intent"
                value="publish"
              >
                Publiceren
              </button>
            )}
          </div>

          <DeletePostButton
            postId={post.id}
            postTitle={post.title}
          />
        </aside>
      </form>
    </main>
  );
}
