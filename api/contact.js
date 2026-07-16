import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const {
      fullName,
      emailAddress,
      phoneNumber,
      investmentBudget,
      currency,
      selectedServices,
      serviceLabel,
      captchaToken
    } = req.body;

    // 1. Verify Turnstile CAPTCHA
    const captchaRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: captchaToken
        })
      }
    ).then(r => r.json());

    if (!captchaRes.success) {
      return res.status(400).json({ error: "CAPTCHA failed" });
    }

    // Build message
    const lines = [
      "DxB Edge Insight enquiry",
      `Service: ${serviceLabel}`,
      fullName ? `Name: ${fullName}` : "",
      emailAddress ? `Email: ${emailAddress}` : "",
      phoneNumber ? `Phone: ${phoneNumber}` : "",
      investmentBudget ? `Investment Budget: ${investmentBudget} ${currency}` : "",
      selectedServices?.length ? `Additional Services: ${selectedServices.join(", ")}` : ""
    ].filter(Boolean);

    const message = lines.join("\n");

    // 2. Send email to contacts@dxbedge.com
    await resend.emails.send({
      from: "DXB Edge <contacts@dxbedge.com>",
      to: "contacts@dxbedge.com",
      subject: `DxB Edge Insight enquiry - ${serviceLabel}`,
      html: message.replace(/\n/g, "<br>")
    });

    // 3. Send WhatsApp notification to you
    await fetch(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: process.env.WHATSAPP_RECIPIENT_NUMBER,
          type: "text",
          text: { body: message }
        })
      }
    );

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("Contact API Error:", err);
    return res.status(500).json({ error: "Failed to submit contact form" });
  }
}
