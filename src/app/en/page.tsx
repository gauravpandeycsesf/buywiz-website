import Link from "next/link";
import Image from "next/image";
import { getPublishedBlogPosts } from "@/lib/blog";

const steps = [
  {
    number: "01",
    title: "Identify the product",
    text: "Capture product information and determine which product category and product rules apply.",
  },
  {
    number: "02",
    title: "Determine the requirements",
    text: "Bring compliance, documentation, trade and labelling requirements together in one workflow.",
  },
  {
    number: "03",
    title: "Collect evidence",
    text: "Link supplier documentation and supporting evidence to the correct product or purchase order line.",
  },
  {
    number: "04",
    title: "Assess readiness",
    text: "See immediately what has been verified, what is missing and where additional review is needed.",
  },
];

export const dynamic = "force-dynamic";

const capabilities = [
  "Product classification",
  "Compliance requirements",
  "HS and trade information",
  "Supplier requirements",
  "Document management",
  "Document processing",
  "Artwork & labeling",
  "Compliance assessment",
  "Purchase order workflow",
];

export default async function Home() {
  const latestPosts = (await getPublishedBlogPosts("EN")).slice(0, 3);

  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/en" className="brand" aria-label="Buywiz home">
            <Image
              src="/buywiz-logo.jpeg"
              alt="Buywiz Software Solutions"
              width={120}
              height={70}
              className="site-logo"
              priority
            />
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#product">Product</a>
            <a href="#how-it-works">How it works</a>
            <a href="#insights">Insights</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="header-actions">
            <div className="language-switcher" aria-label="Language selection">
              <Link href="/">NL</Link>
              <span>/</span>
              <button className="language-active" type="button">EN</button>
            </div>

            <a
              className="login-link"
              href="https://app.buywiz.eu/login"
            >
              Log in
            </a>

            <a className="button button-small" href="/en/demo">
              Book a demo
            </a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Product compliance software</div>

            <h1>
              Product compliance,
              <span> from requirements to evidence,</span>
              in one workflow.
            </h1>

            <p className="hero-text">
              Buywiz helps importers, distributors and product teams
              identify applicable product requirements, organise supplier documentation
              and understand what is verified, missing or still requires
              review.
            </p>

            <div className="hero-actions">
              <a className="button" href="/en/demo">
                Book a demo
              </a>
              <a className="button-secondary" href="#how-it-works">
                See how it works
              </a>
            </div>

            <div className="hero-proof">
              <span>Product requirements</span>
              <span>Documentation</span>
              <span>Compliance readiness</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="workspace-card">
              <div className="workspace-topbar">
                <div>
                  <span className="workspace-kicker">Compliance Workspace</span>
                  <strong>Product readiness</strong>
                </div>
                <span className="status-pill">Under review</span>
              </div>

              <div className="workspace-product">
                <div className="product-icon">P</div>
                <div>
                  <span>Product</span>
                  <strong>Electrical consumer product</strong>
                </div>
              </div>

              <div className="readiness-grid">
                <div>
                  <span>Product rules</span>
                  <strong>12</strong>
                </div>
                <div>
                  <span>Documents</span>
                  <strong>8</strong>
                </div>
                <div>
                  <span>Verified</span>
                  <strong>6</strong>
                </div>
              </div>

              <div className="check-list">
                <div className="check-row success">
                  <span className="check-dot">✓</span>
                  <div>
                    <strong>Technical documentation</strong>
                    <span>Available and linked</span>
                  </div>
                </div>

                <div className="check-row success">
                  <span className="check-dot">✓</span>
                  <div>
                    <strong>EU Declaration of Conformity</strong>
                    <span>Document verified</span>
                  </div>
                </div>

                <div className="check-row warning">
                  <span className="check-dot">!</span>
                  <div>
                    <strong>Label information</strong>
                    <span>Additional review required</span>
                  </div>
                </div>
              </div>

              <div className="readiness-footer">
                <span>Compliance readiness</span>
                <strong>75%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="problem-section" id="product">
        <div className="container split-section">
          <div>
            <div className="eyebrow">Why Buywiz</div>
            <h2>
              Compliance information should not be scattered across email,
              spreadsheets and separate PDFs.
            </h2>
          </div>

          <div className="section-copy">
            <p>
              Product teams often work with supplier documentation, legislation and
              regulations, test results, labels, certificates and
              trade information across different places.
            </p>
            <p>
              Buywiz brings this information together around the product and
              purchase order, so teams can quickly determine what is available
              and what still needs attention.
            </p>
          </div>
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">How it works</div>
            <h2>From product information to compliance readiness.</h2>
            <p>
              One structured workflow for requirements, evidence and
              assessment.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="capabilities-section">
        <div className="container capabilities-grid">
          <div>
            <div className="eyebrow">Capabilities</div>
            <h2>Everything around product compliance in one workspace.</h2>
            <p>
              Buywiz connects product information, rules, supplier evidence and
              compliance assessments without forcing teams to spread their workflow across
              multiple systems.
            </p>
          </div>

          <div className="capability-list">
            {capabilities.map((capability) => (
              <div className="capability-item" key={capability}>
                <span>✓</span>
                {capability}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="audience-section">
        <div className="container">
          <div className="section-heading centered">
            <div className="eyebrow">Who it is for</div>
            <h2>Built for teams bringing products to the European market.</h2>
          </div>

          <div className="audience-grid">
            <article>
              <span>01</span>
              <h3>Importers</h3>
              <p>
                Stay in control of product requirements and supplier documentation before
                products are placed on the market.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Compliance & Quality</h3>
              <p>
                Work from one central place for rules, evidence,
                findings and outstanding checks.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Procurement & Product teams</h3>
              <p>
                Make clear which documentation suppliers need to provide
                and which products still require follow-up.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="insights-section" id="insights">
        <div className="container">
          <div className="insights-heading">
            <div>
              <div className="eyebrow">Insights</div>
              <h2>Product compliance insights.</h2>
            </div>

            <Link href="/en/blog">
              View all articles →
            </Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="article-grid">
              {latestPosts.map((post) => {
                const date =
                  post.publishedAt ?? post.createdAt;

                return (
                  <article
                    className="article-card"
                    key={post.id}
                  >
                    {post.category ? (
                      <span className="article-category">
                        {post.category}
                      </span>
                    ) : (
                      <span className="article-category">
                        Buywiz insight
                      </span>
                    )}

                    <span className="article-date">
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(date)}
                    </span>

                    <h3>{post.title}</h3>

                    <p>{post.summary}</p>

                    <Link href={`/en/blog/${post.slug}`}>
                      Read article →
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="blog-home-empty">
              <p>
                New product compliance insights are coming soon.
              </p>

              <Link href="/en/blog">
                Visit Insights →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="container split-section">
          <div>
            <div className="eyebrow">About Buywiz</div>
            <h2>More clarity in complex product compliance.</h2>
          </div>

          <div className="section-copy">
            <p>
              Buywiz is designed to make product compliance work
              clearer, more consistent and easier to audit.
            </p>
            <p>
              The platform helps teams structure
              product requirements and evidence. Specialist review remains
              part of the process where needed.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section" id="contact">
        <div className="container cta-card">
          <div>
            <div className="eyebrow eyebrow-light">Interested?</div>
            <h2>See how Buywiz fits your compliance process.</h2>
            <p>
              Book a short product demo and discuss your current workflow,
              supplier documentation and product requirements.
            </p>
          </div>

          <div className="cta-actions">
            <a
              className="button button-white"
              href="/en/demo"
            >
              Book a demo
            </a>
            <a
              className="cta-login"
              href="https://app.buywiz.eu/login"
            >
              Existing customer? Log in →
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Link href="/en" className="brand footer-brand">
              <Image
                src="/buywiz-logo.jpeg"
                alt="Buywiz Software Solutions"
                width={120}
                height={70}
                className="footer-logo"
              />
            </Link>
            <p>
              Product compliance, from requirements to evidence, in one workflow.
            </p>
          </div>

          <div>
            <strong>Buywiz</strong>
            <a href="#product">Product</a>
            <a href="#how-it-works">How it works</a>
            <Link href="/en/blog">Insights</Link>
          </div>

          <div>
            <strong>Company</strong>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="https://app.buywiz.eu/login">Log in</a>
          </div>

          <div>
            <strong>Language</strong>
            <Link href="/">Nederlands</Link>
            <span>English</span>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 Buywiz. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
