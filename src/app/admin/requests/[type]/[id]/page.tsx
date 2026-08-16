import { notFound, redirect } from "next/navigation";
import { isBlogAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import RequestStatusSelect from "../../request-status-select";

export const dynamic = "force-dynamic";

type Params = Promise<{
  type: string;
  id: string;
}>;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(date);
}

export default async function RequestDetailPage({
  params,
}: {
  params: Params;
}) {
  if (!(await isBlogAdmin())) {
    redirect("/admin/login");
  }

  const { type, id } = await params;

  if (type !== "demo" && type !== "contact") {
    notFound();
  }

  const request =
    type === "demo"
      ? await prisma.demoRequest.findUnique({
          where: { id },
        })
      : await prisma.contactRequest.findUnique({
          where: { id },
        });

  if (!request) {
    notFound();
  }

  const notes = await prisma.requestNote.findMany({
    where: {
      requestType: type.toUpperCase(),
      requestId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const isDemo = type === "demo";

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "60px 24px 100px",
      }}
    >
      <a
        href="/admin/requests"
        style={{
          color: "#526076",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        ← Terug naar klantaanvragen
      </a>

      <div
        style={{
          marginTop: 28,
          color: "#1769e0",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "0.08em",
        }}
      >
        BUYWIZ CMS
      </div>

      <h1
        style={{
          margin: "8px 0 8px",
          fontSize: 40,
        }}
      >
        {request.name}
      </h1>

      <p
        style={{
          margin: 0,
          color: "#65728a",
        }}
      >
        {isDemo ? "Demoaanvraag" : "Contactaanvraag"} ·{" "}
        {formatDate(request.createdAt)}
      </p>

      <section
        style={{
          marginTop: 32,
          padding: 24,
          border: "1px solid #dce3ed",
          borderRadius: 16,
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <strong>Status</strong>

          <RequestStatusSelect
            type={isDemo ? "DEMO" : "CONTACT"}
            id={request.id}
            status={request.status}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          <div>
            <strong>E-mail</strong>
            <br />
            <a href={`mailto:${request.email}`}>
              {request.email}
            </a>
          </div>

          {"company" in request && request.company && (
            <div>
              <strong>Bedrijf</strong>
              <br />
              {request.company}
            </div>
          )}

          {isDemo && "phone" in request && request.phone && (
            <div>
              <strong>Telefoon</strong>
              <br />
              <a href={`tel:${request.phone}`}>
                {request.phone}
              </a>
            </div>
          )}

          {isDemo &&
            "preferredContact" in request && (
              <div>
                <strong>Voorkeur contact</strong>
                <br />
                {request.preferredContact === "PHONE"
                  ? "Telefoon"
                  : "E-mail"}
              </div>
            )}

          {!isDemo &&
            "subject" in request &&
            request.subject && (
              <div>
                <strong>Onderwerp</strong>
                <br />
                {request.subject}
              </div>
            )}

          <div>
            <strong>Taal</strong>
            <br />
            {request.language}
          </div>
        </div>

        {"message" in request && request.message && (
          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid #edf0f5",
            }}
          >
            <strong>Bericht</strong>
            <div
              style={{
                marginTop: 8,
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {request.message}
            </div>
          </div>
        )}
      </section>

      <section
        style={{
          marginTop: 24,
          padding: 24,
          border: "1px solid #dce3ed",
          borderRadius: 16,
          background: "#fff",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Interne notities
        </h2>

        <form
          action={`/api/admin/requests/${type}/${id}/notes`}
          method="post"
          style={{
            display: "grid",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <textarea
            name="note"
            rows={4}
            required
            maxLength={3000}
            placeholder="Voeg een interne notitie toe..."
            style={{
              padding: 12,
              border: "1px solid #dce3ed",
              borderRadius: 10,
              resize: "vertical",
              font: "inherit",
            }}
          />

          <div>
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                border: 0,
                borderRadius: 8,
                background: "#1769e0",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Notitie toevoegen
            </button>
          </div>
        </form>

        {notes.length === 0 ? (
          <p style={{ color: "#65728a" }}>
            Nog geen interne notities.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            {notes.map((note) => (
              <article
                key={note.id}
                style={{
                  padding: 16,
                  border: "1px solid #edf0f5",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {note.note}
                </div>

                <small
                  style={{
                    display: "block",
                    marginTop: 10,
                    color: "#65728a",
                  }}
                >
                  {formatDate(note.createdAt)}
                </small>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
