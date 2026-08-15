import { redirect } from "next/navigation";
import { isBlogAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import RequestStatusSelect from "./request-status-select";

export const dynamic = "force-dynamic";

type RequestRow = {
  id: string;
  type: "DEMO" | "CONTACT";
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  preferredContact: string | null;
  language: string;
  status: string;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(date);
}

export default async function AdminRequestsPage() {
  if (!(await isBlogAdmin())) {
    redirect("/admin/login");
  }

  const [demoRequests, contactRequests] = await Promise.all([
    prisma.demoRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.contactRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const requests: RequestRow[] = [
    ...demoRequests.map((request) => ({
      id: request.id,
      type: "DEMO" as const,
      name: request.name,
      company: request.company,
      email: request.email,
      phone: request.phone,
      subject: null,
      message: request.message,
      preferredContact: request.preferredContact,
      language: request.language,
      status: request.status,
      createdAt: request.createdAt,
    })),
    ...contactRequests.map((request) => ({
      id: request.id,
      type: "CONTACT" as const,
      name: request.name,
      company: request.company,
      email: request.email,
      phone: null,
      subject: request.subject,
      message: request.message,
      preferredContact: null,
      language: request.language,
      status: request.status,
      createdAt: request.createdAt,
    })),
  ].sort(
    (a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "60px 24px 100px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 24,
          marginBottom: 32,
        }}
      >
        <div>
          <a
            href="/admin/blog"
            style={{
              color: "#526076",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            ← Terug naar artikelen
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
              fontSize: 42,
              lineHeight: 1.1,
            }}
          >
            Klantaanvragen
          </h1>

          <p
            style={{
              margin: 0,
              color: "#65728a",
              fontSize: 16,
            }}
          >
            Demo- en contactaanvragen via de Buywiz website.
          </p>
        </div>

        <div
          style={{
            padding: "14px 18px",
            border: "1px solid #dce3ed",
            borderRadius: 12,
            background: "#fff",
            fontWeight: 700,
          }}
        >
          {requests.length} aanvragen
        </div>
      </div>

      {requests.length === 0 ? (
        <div
          style={{
            padding: 32,
            border: "1px solid #dce3ed",
            borderRadius: 16,
            background: "#fff",
          }}
        >
          Nog geen aanvragen ontvangen.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {requests.map((request) => (
            <article
              key={`${request.type}-${request.id}`}
              style={{
                padding: 24,
                border: "1px solid #dce3ed",
                borderRadius: 16,
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  flexWrap: "wrap",
                  marginBottom: 18,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        padding: "5px 9px",
                        borderRadius: 999,
                        background:
                          request.type === "DEMO"
                            ? "#eaf2ff"
                            : "#eef8f1",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {request.type === "DEMO"
                        ? "Demo"
                        : "Contact"}
                    </span>

                    <RequestStatusSelect
                      type={request.type}
                      id={request.id}
                      status={request.status}
                    />

                    <span
                      style={{
                        color: "#65728a",
                        fontSize: 13,
                      }}
                    >
                      {request.language}
                    </span>
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      fontSize: 22,
                    }}
                  >
                    {request.name}
                  </h2>

                  {request.company && (
                    <div
                      style={{
                        marginTop: 4,
                        color: "#65728a",
                      }}
                    >
                      {request.company}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    color: "#65728a",
                    fontSize: 13,
                  }}
                >
                  {formatDate(request.createdAt)}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  marginBottom: 18,
                }}
              >
                <div>
                  <strong>E-mail</strong>
                  <br />
                  <a href={`mailto:${request.email}`}>
                    {request.email}
                  </a>
                </div>

                {request.phone && (
                  <div>
                    <strong>Telefoon</strong>
                    <br />
                    <a href={`tel:${request.phone}`}>
                      {request.phone}
                    </a>
                  </div>
                )}

                {request.preferredContact && (
                  <div>
                    <strong>Voorkeur contact</strong>
                    <br />
                    {request.preferredContact === "PHONE"
                      ? "Telefoon"
                      : "E-mail"}
                  </div>
                )}

                {request.subject && (
                  <div>
                    <strong>Onderwerp</strong>
                    <br />
                    {request.subject}
                  </div>
                )}
              </div>

              {request.message && (
                <div
                  style={{
                    paddingTop: 18,
                    borderTop: "1px solid #edf0f5",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  <strong>Bericht</strong>
                  <div style={{ marginTop: 8 }}>
                    {request.message}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
