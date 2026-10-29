// Vercel Serverless Function — POST /api/contact
// Recibe el formulario "Trabaja conmigo" y te lo envía por email con Resend.
// Variables de entorno en Vercel:
//   RESEND_API_KEY  → tu clave de resend.com
//   CONTACT_EMAIL   → dónde quieres recibir los mensajes (el mismo email con el que creas la cuenta de Resend)

const LIMITS = { name: 80, agency: 80, email: 120, project: 600 };

const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const esc = (t) => t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  // Campo trampa: los humanos no lo ven; si viene relleno es un bot. Fingimos éxito.
  if (body.web) return res.status(200).json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const agency = clean(body.agency, LIMITS.agency);
  const email = clean(body.email, LIMITS.email);
  const project = clean(body.project, LIMITS.project);

  if (!name || !agency || !project) return res.status(400).json({ error: "Faltan campos" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Email no válido" });

  const { RESEND_API_KEY, CONTACT_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_EMAIL) return res.status(500).json({ error: "Falta configurar el envío" });

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">
      <h2 style="margin:0 0 12px">Nueva propuesta desde cucu/links</h2>
      <p><b>Nombre:</b> ${esc(name)}<br>
         <b>Agencia o marca:</b> ${esc(agency)}<br>
         <b>Email:</b> ${esc(email)}</p>
      <p><b>Proyecto:</b><br>${esc(project).replace(/\n/g, "<br>")}</p>
      <p style="color:#777;font-size:13px">Pulsa "Responder" para contestarle directamente.</p>
    </div>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Cucu Web <onboarding@resend.dev>",
      to: [CONTACT_EMAIL],
      reply_to: email,
      subject: `Trabaja conmigo: ${agency} (${name})`,
      html,
      text: `Nombre: ${name}\nAgencia o marca: ${agency}\nEmail: ${email}\n\nProyecto:\n${project}`,
    }),
  });

  if (!r.ok) return res.status(502).json({ error: "No se pudo enviar" });
  return res.status(200).json({ ok: true });
}
