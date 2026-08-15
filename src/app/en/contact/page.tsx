import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactRequestForm } from "@/components/contact-request-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Buywiz about product compliance software.",
};

export default function ContactPage() {
  return (
    <main className="demo-page">
      <header className="demo-header">
        <Link href="/en" aria-label="Buywiz home">
          <Image
            src="/buywiz-logo.jpeg"
            alt="Buywiz Software Solutions"
            width={118}
            height={70}
            className="site-logo"
          />
        </Link>
        <Link href="/en">← Back to Buywiz</Link>
      </header>

      <div className="demo-shell">
        <section className="demo-copy">
          <div className="eyebrow">Contact</div>
          <h1>Contact Buywiz.</h1>
          <p>
            Have a question about Buywiz, product compliance or our
            approach? Send us a message.
          </p>

          <p>
            Email: <strong>info@buywiz.eu</strong>
          </p>

          <p>
            Want to see the platform?{" "}
            <Link href="/en/demo">Book a product demo →</Link>
          </p>
        </section>

        <section className="demo-card">
          <h2>Send a message</h2>
          <ContactRequestForm language="EN" />
        </section>
      </div>
    </main>
  );
}
