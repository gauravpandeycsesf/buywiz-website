import Link from "next/link";
import { redirect } from "next/navigation";
import { isBlogAdmin } from "@/lib/admin-auth";
import RichTextEditor from "@/components/admin/rich-text-editor";

export default async function NewBlogPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isBlogAdmin())) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  return (
    <main className="blog-editor-page">
      <header className="blog-editor-header">
        <div>
          <Link className="blog-editor-back" href="/admin/blog">
            ← Terug naar artikelen
          </Link>

          <span>Buywiz CMS</span>
          <h1>Nieuw artikel</h1>
          <p>
            Maak een nieuw kennisartikel en bewaar het als concept of publiceer
            het direct.
          </p>
        </div>
      </header>

      {params.error === "required" ? (
        <div className="blog-editor-error">
          Vul minimaal titel, samenvatting, inhoud en auteur in.
        </div>
      ) : null}

      {params.error === "slug" ? (
        <div className="blog-editor-error">
          Er bestaat al een artikel met deze URL voor deze taal.
        </div>
      ) : null}

      <form
        action="/api/admin/blog"
        method="POST"
        className="blog-editor-form"
      >
        <section className="blog-editor-main">
          <div className="blog-editor-card">
            <div className="blog-editor-card-heading">
              <h2>Artikel</h2>
              <p>De hoofdinhoud die bezoekers op Buywiz zullen lezen.</p>
            </div>

            <label className="blog-field">
              <span>Titel *</span>
              <input
                type="text"
                name="title"
                placeholder="Bijvoorbeeld: Wat is een EU-conformiteitsverklaring?"
                required
              />
            </label>

            <label className="blog-field">
              <span>URL-slug</span>
              <input
                type="text"
                name="slug"
                placeholder="Wordt automatisch gemaakt als je dit leeg laat"
              />
              <small>
                Bijvoorbeeld: eu-conformiteitsverklaring
              </small>
            </label>

            <label className="blog-field">
              <span>Samenvatting *</span>
              <textarea
                name="summary"
                rows={4}
                placeholder="Korte introductie die op artikelkaarten en zoekresultaten kan worden gebruikt."
                required
              />
            </label>

            <div className="blog-field">
              <span>Inhoud *</span>
              <RichTextEditor />
              <small>
                Voeg tekst, headings, lijsten en afbeeldingen toe aan het
                artikel.
              </small>
            </div>
          </div>

          <div className="blog-editor-card">
            <div className="blog-editor-card-heading">
              <h2>SEO</h2>
              <p>
                Optionele informatie voor zoekmachines en het delen van het
                artikel.
              </p>
            </div>

            <label className="blog-field">
              <span>SEO-titel</span>
              <input
                type="text"
                name="seoTitle"
                placeholder="Laat leeg om de artikeltitel te gebruiken"
              />
            </label>

            <label className="blog-field">
              <span>SEO-beschrijving</span>
              <textarea
                name="seoDescription"
                rows={3}
                placeholder="Korte beschrijving voor zoekmachines"
              />
            </label>
          </div>
        </section>

        <aside className="blog-editor-sidebar">
          <div className="blog-editor-card">
            <div className="blog-editor-card-heading">
              <h2>Publicatie</h2>
            </div>

            <label className="blog-field">
              <span>Taal *</span>
              <select name="language" defaultValue="NL">
                <option value="NL">Nederlands</option>
                <option value="EN">English</option>
              </select>
            </label>

            <label className="blog-field">
              <span>Categorie</span>
              <input
                type="text"
                name="category"
                placeholder="Bijvoorbeeld: Compliance"
              />
            </label>

            <label className="blog-field">
              <span>Tags</span>
              <input
                type="text"
                name="tags"
                placeholder="CE-markering, importeur, GPSR"
              />
              <small>Scheid tags met komma&apos;s.</small>
            </label>

            <label className="blog-field">
              <span>Cover afbeelding URL</span>
              <input
                type="url"
                name="coverImage"
                placeholder="https://..."
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
                defaultValue="Buywiz"
                required
              />
            </label>

            <label className="blog-field">
              <span>Bio</span>
              <textarea
                name="authorBio"
                rows={4}
                placeholder="Korte omschrijving van de auteur"
              />
            </label>

            <label className="blog-field">
              <span>Profielfoto URL</span>
              <input
                type="url"
                name="authorImage"
                placeholder="https://..."
              />
            </label>
          </div>

          <div className="blog-editor-actions">
            <button
              className="blog-save-draft"
              type="submit"
              name="intent"
              value="draft"
            >
              Opslaan als concept
            </button>

            <button
              className="blog-publish"
              type="submit"
              name="intent"
              value="publish"
            >
              Publiceren
            </button>
          </div>
        </aside>
      </form>
    </main>
  );
}
