import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DemoRequestForm } from "@/components/demo-request-form";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Request a Buywiz product demo and see how product compliance, supplier documentation and evidence can be managed in one workflow.",
};

export default function DemoPage() {
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
          <div className="eyebrow">Product demo</div>
          <h1>See how Buywiz fits your compliance process.</h1>
          <p>
            Discuss your current product workflow, supplier documentation,
            product requirements and compliance challenges with us.
          </p>

          <ul>
            <li>Discuss your current compliance process</li>
            <li>See the Buywiz workflow</li>
            <li>Explore your specific use case</li>
          </ul>
        </section>

        <section className="demo-card">
          <h2>Request a demo</h2>
          <DemoRequestForm language="EN" />
        </section>
      </div>
    </main>
  );
}
