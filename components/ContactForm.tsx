"use client";

import { useState } from "react";

type Props = {
  recipientEmail?: string;
};

export function ContactForm({ recipientEmail }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Submit handled via API; mailto fallback used only when server is unavailable
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("https://formspree.io/f/mqeqeojw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = Array.isArray(data?.errors)
          ? data.errors.map((e: any) => e.message).join(". ")
          : data?.error || "Failed to send";
        throw new Error(msg);
      }
      setStatus("Thanks! Your message was sent successfully.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      const to = (recipientEmail ?? "").trim();
      const subject = `Contact from ${name || "your website"}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      if (to) {
        // Graceful fallback: open default email app
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const msg = "Couldn’t reach Formspree — opened your email app.";
        setStatus(msg);
      } else {
        setStatus(err?.message || "Couldn’t send right now. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit} aria-label="Contact form">
      <div className="card" role="group" aria-labelledby="contact-title">
        <div className="space-y-3">
          <h3 id="contact-title" className="section-title">Send me a message</h3>
          <p className="section-desc">
            Sends via Formspree directly to my inbox; if unavailable, opens your email app. Fields marked * are required.
          </p>
        </div>

        <div className="stack" style={{ marginTop: 16 }}>
          <label className="label" htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
          />

          <label className="label" htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />

          <label className="label" htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            className="textarea"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="How can I help?"
          />

          <div>
            <button type="submit" className="button-link" aria-label="Send message" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send Message"}
            </button>
          </div>

          {status ? (
            <p className="section-desc" role="status" aria-live="polite" style={{ marginTop: 12 }}>
              {status}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
