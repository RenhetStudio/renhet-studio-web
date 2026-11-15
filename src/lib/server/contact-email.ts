import type { ContactMessage } from "../contact/validation";

const SITE_URL = "https://www.renhetstudio.com";
export const CONTACT_EMAIL = "hello@renhetstudio.com";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

function layout(title: string, preheader: string, content: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f6f1e8;color:#4f5f70;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f1e8;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;">
        <tr><td style="padding:28px 28px 24px;background:#4f5f70;">
          <a href="${SITE_URL}"><img src="${SITE_URL}/renhet-logo-white.png" width="156" height="79" alt="Renhet Studio" style="display:block;border:0;max-width:100%;height:auto;"></a>
        </td></tr>
        <tr><td style="padding:12px 28px;background:#8fb8d8;color:#344253;font-size:12px;font-weight:bold;letter-spacing:1px;">A little message from Renhet Studio</td></tr>
        <tr><td style="padding:36px 28px 40px;">
          <h1 style="margin:0 0 24px;color:#344253;font-size:34px;line-height:1.1;font-weight:900;letter-spacing:-1px;">${escapeHtml(title)}</h1>
          ${content}
        </td></tr>
        <tr><td style="padding:28px;background:#4f5f70;color:#fffdf3;font-size:13px;line-height:1.8;">
          <strong style="font-size:23px;line-height:1.2;">Meant to be felt.</strong><br><br>
          Renhet Studio<br><a href="mailto:${CONTACT_EMAIL}" style="color:#fffdf3;">${CONTACT_EMAIL}</a><br>
          <a href="${SITE_URL}" style="color:#b8d4f0;">renhetstudio.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function createOwnerEmail({ name, email, message }: ContactMessage) {
  const title = "A new hello.";
  return {
    subject: `Contact from ${name} | Renhet Studio`,
    text: `New message for Renhet Studio\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
    html: layout(title, `${name} has written to Renhet Studio.`, `
      <p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:1px;">FROM</p>
      <p style="margin:0 0 28px;font-size:17px;line-height:1.7;overflow-wrap:anywhere;">${escapeHtml(name)}<br><a href="mailto:${escapeHtml(email)}" style="color:#344253;">${escapeHtml(email)}</a></p>
      <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1px;">MESSAGE</p>
      <div style="padding:20px 0;border-top:2px solid #8fb8d8;font-size:16px;line-height:1.8;overflow-wrap:anywhere;">${escapeHtml(message).replace(/\r\n?|\n/g, "<br>")}</div>
      <p style="margin:24px 0 0;font-size:14px;line-height:1.7;">To contact the sender, write to <a href="mailto:${escapeHtml(email)}" style="color:#344253;">${escapeHtml(email)}</a>.</p>`),
  };
}

export function createConfirmationEmail({ name }: Pick<ContactMessage, "name">) {
  const title = "We're glad you wrote.";
  const intro = "A few words really can go a long way! Thanks for sharing yours with us. We've received your message, and we'll get back to you as soon as we can.";
  const text = `A little message from Renhet Studio\n\n${title}\n\nHi ${name},\n\n${intro}\n\nPlease do not reply to this automated email.\nTo get in touch or add anything else, write to ${CONTACT_EMAIL}.\n\nTalk soon,\nthe Renhet Studio team\n\nMeant to be felt.\n\nRenhet Studio\n${CONTACT_EMAIL}\nrenhetstudio.com`;
  return {
    subject: "We have your message | Renhet Studio",
    text,
    html: layout(title, intro, `
      <p style="margin:0 0 18px;font-size:17px;line-height:1.8;overflow-wrap:anywhere;">Hi ${escapeHtml(name)},</p>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.8;">${escapeHtml(intro)}</p>
      <p style="margin:0 0 28px;padding:18px 0;border-top:2px solid #8fb8d8;border-bottom:1px solid #d6d5ca;font-size:15px;line-height:1.8;"><strong>Please do not reply to this automated email.</strong><br>To get in touch or add anything else, write to <a href="mailto:${CONTACT_EMAIL}" style="color:#344253;font-weight:bold;">${CONTACT_EMAIL}</a>.</p>
      <p style="margin:0;font-size:16px;line-height:1.8;">Talk soon,<br><strong>the Renhet Studio team</strong></p>`),
  };
}
