import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactRequestForm } from "@/components/contact-request-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met Buywiz over product compliance software.",
};

export default function ContactPage() {
  return (
    <main className="demo-page">
      <header className="demo-header">
        <Link href="/" aria-label="Buywiz home">
          <Image
            src="/buywiz-logo.jpeg"
            alt="Buywiz Software Solutions"
            width={118}
            height={70}
            className="site-logo"
          />
        </Link>
        <Link href="/">← Terug naar Buywiz</Link>
      </header>

      <div className="demo-shell">
        <section className="demo-copy">
          <div className="eyebrow">Contact</div>
          <h1>Neem contact op met Buywiz.</h1>
          <p>
            Heeft u een vraag over Buywiz, product compliance of onze
            werkwijze? Stuur ons een bericht.
          </p>

          <p>
            E-mail: <strong>info@buywiz.eu</strong>
          </p>

          <p>
            Wilt u het platform bekijken?{" "}
            <Link href="/demo">Plan een productdemo →</Link>
          </p>
        </section>

        <section className="demo-card">
          <h2>Stuur een bericht</h2>
          <ContactRequestForm language="NL" />
        </section>
      </div>
    </main>
  );
}
