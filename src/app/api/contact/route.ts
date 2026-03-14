import { NextResponse } from "next/server";

type ContactPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
  body?: string;
  city?: string;
  address?: string;
  squareMeters?: string;
  floor?: string;
  constructionYear?: string;
  works?: unknown;
  plants?: unknown;
  description?: string;
  website?: string;
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function buildSubject(payload: ContactPayload): string {
  if (
    payload.squareMeters ||
    payload.floor ||
    payload.works ||
    payload.plants
  ) {
    return "Nuova richiesta preventivo dal sito";
  }
  return "Nuova richiesta contatto/offerta dal sito";
}

function buildText(payload: ContactPayload): string {
  const lines = [
    `Nome: ${safeString(payload.fullName) || "Non indicato"}`,
    `Email: ${safeString(payload.email) || "Non indicata"}`,
    `Telefono: ${safeString(payload.phone) || "Non indicato"}`,
    safeString(payload.city) ? `Città: ${safeString(payload.city)}` : "",
    safeString(payload.address)
      ? `Indirizzo: ${safeString(payload.address)}`
      : "",
    safeString(payload.squareMeters)
      ? `Metri quadri: ${safeString(payload.squareMeters)}`
      : "",
    safeString(payload.floor) ? `Piano: ${safeString(payload.floor)}` : "",
    safeString(payload.constructionYear)
      ? `Anno costruzione: ${safeString(payload.constructionYear)}`
      : "",
    "",
    "Messaggio:",
    safeString(payload.body) ||
      safeString(payload.message) ||
      "Nessun messaggio",
  ].filter(Boolean);

  return lines.join("\n");
}

function buildHtml(payload: ContactPayload): string {
  const message =
    safeString(payload.body) ||
    safeString(payload.message) ||
    "Nessun messaggio";

  const rows: Array<[string, string]> = [
    ["Nome", safeString(payload.fullName) || "Non indicato"],
    ["Email", safeString(payload.email) || "Non indicata"],
    ["Telefono", safeString(payload.phone) || "Non indicato"],
  ];

  if (safeString(payload.city)) rows.push(["Città", safeString(payload.city)]);
  if (safeString(payload.address)) {
    rows.push(["Indirizzo", safeString(payload.address)]);
  }
  if (safeString(payload.squareMeters)) {
    rows.push(["Metri quadri", safeString(payload.squareMeters)]);
  }
  if (safeString(payload.floor))
    rows.push(["Piano", safeString(payload.floor)]);
  if (safeString(payload.constructionYear)) {
    rows.push(["Anno costruzione", safeString(payload.constructionYear)]);
  }

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1e2a22">
      <h2 style="margin:0 0 12px">Nuova richiesta dal sito MarBel</h2>
      <table style="border-collapse:collapse;width:100%;max-width:700px">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700;width:180px">${escapeHtml(label)}</td>
                  <td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(value)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>

      <h3 style="margin:20px 0 8px">Messaggio</h3>
      <p style="white-space:pre-wrap;border:1px solid #e5e7eb;padding:12px;background:#fff">${escapeHtml(
        message,
      )}</p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;

    if (safeString(payload.website)) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const fullName = safeString(payload.fullName);
    const email = safeString(payload.email);
    const phone = safeString(payload.phone);
    const message = safeString(payload.body) || safeString(payload.message);

    if (!fullName || !message || (!email && !phone)) {
      return NextResponse.json(
        {
          error:
            "Dati mancanti. Inserisci nome, messaggio e almeno email o telefono.",
        },
        { status: 400 },
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO ?? "info@marbel.it";
    const from = process.env.CONTACT_FROM ?? "MarBel <onboarding@resend.dev>";

    if (!resendApiKey) {
      return NextResponse.json(
        {
          error:
            "Servizio email non configurato. Imposta RESEND_API_KEY nelle variabili ambiente.",
        },
        { status: 503 },
      );
    }

    const subject = buildSubject(payload);
    const text = buildText(payload);
    const html = buildHtml(payload);

    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
        reply_to: email ? [email] : undefined,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error("Resend error:", errorBody);
      return NextResponse.json(
        { error: "Invio email non riuscito. Riprova tra poco." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("/api/contact error:", error);
    return NextResponse.json(
      { error: "Errore server durante l'invio della richiesta." },
      { status: 500 },
    );
  }
}
