"use client";

import { FormEvent, useState } from "react";

export function ContactRequestForm({
  language,
}: {
  language: "NL" | "EN";
}) {
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          website: data.get("website"),
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
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
        {english ? "Company (optional)" : "Bedrijf (optioneel)"}
        <input name="company" autoComplete="organization" />
      </label>

      <label>
        {english ? "Email" : "E-mailadres"}
        <input name="email" type="email" required autoComplete="email" />
      </label>

      <label>
        {english ? "Subject (optional)" : "Onderwerp (optioneel)"}
        <input name="subject" />
      </label>

      <label>
        {english ? "Message" : "Bericht"}
        <textarea name="message" rows={7} required />
      </label>

      <button className="button demo-submit" disabled={submitting}>
        {submitting
          ? english
            ? "Sending..."
            : "Versturen..."
          : english
            ? "Send message"
            : "Bericht versturen"}
      </button>

      {success && (
        <div className="demo-success">
          {english
            ? "Thank you. Your message has been received."
            : "Bedankt. Uw bericht is ontvangen."}
        </div>
      )}

      {error && <div className="demo-error">{error}</div>}
    </form>
  );
}
