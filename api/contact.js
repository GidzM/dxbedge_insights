import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

function sanitizeText(value, maxLength = 500) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

function sanitizeOptionalArray(value, maxItems = 20, itemMaxLength = 120) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => sanitizeText(item, itemMaxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function displayValue(value) {
  return value || 'N/A';
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const fullName = sanitizeText(req.body?.fullName, 120);
    const emailAddress = sanitizeText(req.body?.emailAddress, 200).toLowerCase();
    const phoneNumber = sanitizeText(req.body?.phoneNumber, 50);
    const investmentBudget = sanitizeText(req.body?.investmentBudget, 80);
    const currency = sanitizeText(req.body?.currency, 12);
    const selectedServices = sanitizeOptionalArray(req.body?.selectedServices);
    const serviceLabel = sanitizeText(req.body?.serviceLabel, 120);
    const captchaToken = sanitizeText(req.body?.captchaToken, 4000);
    const utmSource = sanitizeText(req.body?.utmSource, 120);
    const utmMedium = sanitizeText(req.body?.utmMedium, 120);
    const utmCampaign = sanitizeText(req.body?.utmCampaign, 180);
    const utmTerm = sanitizeText(req.body?.utmTerm, 180);
    const utmContent = sanitizeText(req.body?.utmContent, 180);
    const referralCode = sanitizeText(req.body?.referralCode, 120);
    const referrer = sanitizeText(req.body?.referrer, 500);
    const landingPath = sanitizeText(req.body?.landingPath, 300);

    if (!fullName || !emailAddress || !phoneNumber || !investmentBudget || !currency || !serviceLabel) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    if (!isValidEmail(emailAddress)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    if (!captchaToken) {
      return res.status(400).json({ error: 'Missing CAPTCHA token.' });
    }

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

    const message = [
      '*New DXB Edge Lead*',
      '',
      `Service: ${serviceLabel}`,
      `Name: ${displayValue(fullName)}`,
      `Email: ${displayValue(emailAddress)}`,
      `Phone: ${displayValue(phoneNumber)}`,
      `Investment Budget: ${displayValue(investmentBudget)} ${displayValue(currency)}`,
      `Additional Services: ${selectedServices.length ? selectedServices.join(', ') : 'N/A'}`,
      '',
      '*Referral Information*',
      `Landing Path: ${displayValue(landingPath)}`,
      `Referrer URL: ${displayValue(referrer)}`,
      `Source: ${displayValue(utmSource)}`,
      `Medium: ${displayValue(utmMedium)}`,
      `Campaign: ${displayValue(utmCampaign)}`,
      `Term: ${displayValue(utmTerm)}`,
      `Content: ${displayValue(utmContent)}`,
      `Referral Code: ${displayValue(referralCode)}`,
      '',
      `Timestamp: ${new Date().toISOString()}`,
    ].join('\n');

    let leadId = null;
    let leadStored = false;

    // 2. Persist lead in Supabase (best-effort, non-fatal)
    if (supabase) {
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert({
          name: fullName,
          email: emailAddress,
          message,
        })
        .select('id')
        .single();

      if (leadError) {
        console.error('Lead insert error:', leadError);
      } else {
        leadId = lead?.id || null;
        leadStored = true;

        // 3. Persist referral metadata (non-fatal)
        const { error: referralError } = await supabase
          .from('referrals')
          .insert({
            lead_id: leadId,
            utm_source: utmSource || null,
            utm_medium: utmMedium || null,
            utm_campaign: utmCampaign || null,
            utm_term: utmTerm || null,
            utm_content: utmContent || null,
            ref_code: referralCode || null,
          });

        if (referralError) {
          console.error('Referral insert error:', referralError);
        }
      }
    } else {
      console.warn('Supabase lead storage skipped due to missing configuration.');
    }

    // 4. Send email to contacts@dxbedge.com (best-effort, non-fatal)
    let emailSent = false;
    try {
      await resend.emails.send({
        from: "DXB Edge <contacts@dxbedge.com>",
        to: "contacts@dxbedge.com",
        subject: `DxB Edge Insight enquiry - ${serviceLabel}`,
        html: message.replace(/\n/g, "<br>")
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Resend email failed:', emailError);
    }

    // 5. Always attempt a secondary WhatsApp lead notification (independent of user contact preference).
    let whatsappSent = false;
    let whatsappResponsePayload = null;
    let whatsappStatus = 'skipped';
    const hasWhatsAppConfig = Boolean(
      process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_RECIPIENT_NUMBER
    );

    if (hasWhatsAppConfig) {
      try {
        const whatsappRes = await fetch(
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

        if (whatsappRes.ok) {
          whatsappSent = true;
          whatsappStatus = 'success';
          whatsappResponsePayload = await whatsappRes.json().catch(() => null);
        } else {
          whatsappStatus = 'failed';
          whatsappResponsePayload = await whatsappRes.json().catch(async () => ({
            raw: await whatsappRes.text(),
          }));
          console.error('WhatsApp API Error:', whatsappResponsePayload);
        }
      } catch (whatsappError) {
        whatsappStatus = 'failed';
        whatsappResponsePayload = {
          error: whatsappError instanceof Error ? whatsappError.message : String(whatsappError),
        };
        console.error('WhatsApp notification failed:', whatsappError);
      }
    } else {
      whatsappResponsePayload = { reason: 'missing_whatsapp_configuration' };
      console.warn('WhatsApp notification skipped due to missing configuration.');
    }

    // 6. Persist WhatsApp delivery attempt (non-fatal)
    if (supabase && leadId) {
      const { error: whatsappLogError } = await supabase
        .from('whatsapp_logs')
        .insert({
          lead_id: leadId,
          status: whatsappStatus,
          response: whatsappResponsePayload,
        });

      if (whatsappLogError) {
        console.error('WhatsApp log insert error:', whatsappLogError);
      }
    }

    return res.status(200).json({
      ok: true,
      leadId,
      leadStored,
      emailSent,
      whatsappSent,
    });

  } catch (err) {
    console.error("Contact API Error:", err);
    return res.status(500).json({ error: "Failed to submit contact form" });
  }
}
