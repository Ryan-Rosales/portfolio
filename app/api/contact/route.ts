import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactTo = (process.env.CONTACT_TO_EMAIL || "").trim();
  const from = process.env.FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  if (!resendApiKey) {
    return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);

  try {
    const { name, email, message, to } = await req.json();
    const recipient = (to || contactTo).trim();
    if (!recipient) {
      return NextResponse.json({ error: "Missing recipient email" }, { status: 400 });
    }

    const subject = `Contact from ${name || "your website"}`;
    const text = `Name: ${name || ""}\nEmail: ${email || ""}\n\nMessage:\n${message || ""}`;

    const result = await resend.emails.send({
      from,
      to: recipient,
      replyTo: email || undefined,
      subject,
      text,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (e) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
