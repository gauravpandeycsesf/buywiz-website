import Link from "next/link";
import { redirect } from "next/navigation";
import { isBlogAdmin } from "@/lib/admin-auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isBlogAdmin()) {
    redirect("/admin/blog");
  }

  const params = await searchParams;

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link className="admin-brand" href="/">
          Buywiz
        </Link>

        <div className="admin-login-heading">
          <span>Beheeromgeving</span>
          <h1>Inloggen</h1>
          <p>
            Alleen geautoriseerde Buywiz-auteurs hebben toegang tot het
            artikelbeheer.
          </p>
        </div>

        {params.error ? (
          <div className="admin-error">
            E-mailadres of wachtwoord is onjuist.
          </div>
        ) : null}

        <form
          action="/api/admin/login"
          method="POST"
          className="admin-login-form"
        >
          <label>
            E-mailadres
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Wachtwoord
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit">Inloggen</button>
        </form>

        <Link className="admin-back" href="/">
          ← Terug naar Buywiz
        </Link>
      </section>
    </main>
  );
}
