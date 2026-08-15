"use client";

import { FormEvent, useState } from "react";

type Props = {
  language: "NL" | "EN";
};

export function DemoRequestForm({ language }: Props) {
  const english = language === "EN";
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    setSubmitting(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          phone: data.get("phone"),
          preferredContact: data.get("preferredContact"),
          message: data.get("message"),
          website: data.get("website"),
          language,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Submission failed");
      }

      form.reset();
      setSuccess(true);
    } catch {
      setError(
        english
          ? "Something went wrong. Please try again."
          : "Er ging iets mis. Probeer het opnieuw.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="demo-form" onSubmit={submit}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label>
          Website
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      <label>
        {english ? "Name" : "Naam"}
        <input name="name" required autoComplete="name" />
      </label>

      <label>
        {english ? "Company" : "Bedrijf"}
        <input name="company" required autoComplete="organization" />
      </label>

      <label>
        {english ? "Business email" : "Zakelijk e-mailadres"}
        <input name="email" type="email" required autoComplete="email" />
      </label>

      <label>
        {english ? "Phone (optional)" : "Telefoon (optioneel)"}
        <input name="phone" type="tel" autoComplete="tel" />
      </label>

      <label>
        {english ? "Preferred contact" : "Voorkeur voor contact"}
        <select name="preferredContact" defaultValue="EMAIL">
          <option value="EMAIL">
            {english ? "Email" : "E-mail"}
          </option>
          <option value="PHONE">
            {english ? "Phone" : "Telefoon"}
          </option>
        </select>
      </label>

      <label>
        {english
          ? "What would you like to discuss?"
          : "Wat wilt u graag bespreken?"}
        <textarea name="message" rows={5} />
      </label>

      <button className="button demo-submit" disabled={submitting}>
        {submitting
          ? english
            ? "Sending..."
            : "Versturen..."
          : english
            ? "Request a demo"
            : "Demo aanvragen"}
      </button>

      {success && (
        <div className="demo-success">
          {english
            ? "Thank you. Your demo request has been received. We will contact you shortly."
            : "Bedankt. Uw demoaanvraag is ontvangen. We nemen binnenkort contact met u op."}
        </div>
      )}

      {error && <div className="demo-error">{error}</div>}
    </form>
  );
}
