import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DemoRequestForm } from "@/components/demo-request-form";

export const metadata: Metadata = {
  title: "Demo boeken | Buywiz",
  description:
    "Plan een Buywiz productdemo en ontdek hoe u product compliance, leveranciersdocumentatie en bewijs in één workflow beheert.",
};

export default function DemoPage() {
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
          <div className="eyebrow">Productdemo</div>
          <h1>Bekijk hoe Buywiz in uw complianceproces past.</h1>
          <p>
            Bespreek uw huidige productworkflow, leveranciersdocumentatie,
            productvereisten en compliance-uitdagingen met ons.
          </p>

          <ul>
            <li>Uw huidige complianceproces bespreken</li>
            <li>De Buywiz workflow bekijken</li>
            <li>Vragen over uw use case bespreken</li>
          </ul>
        </section>

        <section className="demo-card">
          <h2>Demo aanvragen</h2>
          <DemoRequestForm language="NL" />
        </section>
      </div>
    </main>
  );
}
