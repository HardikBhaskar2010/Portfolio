import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  runtime: 'edge', // Vercel Edge Runtime — fastest cold starts
};

export default async function handler(req: Request) {
  /* ── Only allow POST ── */
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /* ── Parse body ── */
  let name = '', email = '', message = '';
  try {
    const body = await req.json();
    name    = String(body.name    ?? '').trim();
    email   = String(body.email   ?? '').trim();
    message = String(body.message ?? '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /* ── Basic validation ── */
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /* ── Send via Resend ── */
  try {
    const { error } = await resend.emails.send({
      from:    'Portfolio Contact <onboarding@resend.dev>', // ← swap to your domain once verified
      to:      ['hardik.bhaskar2010@gmail.com'],
      replyTo: email,
      subject: `✦ New message from ${name} — Portfolio`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>
            body { background: #05050A; color: #c4c4d4; font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
            .wrapper { max-width: 560px; margin: 40px auto; border: 1px solid #1C1C2E; border-radius: 16px; overflow: hidden; }
            .header  { background: linear-gradient(135deg, #00E5FF15, #7C3AED15); padding: 32px 36px; border-bottom: 1px solid #1C1C2E; }
            .header h1 { margin: 0; font-size: 22px; color: #f0f0f8; font-style: italic; }
            .header p  { margin: 4px 0 0; font-size: 12px; color: #5c5c7a; letter-spacing: 0.12em; text-transform: uppercase; }
            .body    { padding: 32px 36px; }
            .field   { margin-bottom: 22px; }
            .label   { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #5c5c7a; margin-bottom: 6px; }
            .value   { font-size: 14px; color: #e0e0f0; line-height: 1.7; }
            .message-box { background: #0d0d1a; border: 1px solid #1C1C2E; border-radius: 10px; padding: 16px 20px; }
            .footer  { padding: 20px 36px; border-top: 1px solid #1C1C2E; font-size: 11px; color: #3a3a52; text-align: center; }
            .badge   { display: inline-block; background: #00E5FF18; color: #00E5FF; border: 1px solid #00E5FF30; border-radius: 99px; padding: 3px 10px; font-size: 10px; letter-spacing: 0.12em; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>New Portfolio Message</h1>
              <p>lunakitsune.vercel.app</p>
            </div>
            <div class="body">
              <div class="field">
                <div class="label">From</div>
                <div class="value">${name} &nbsp;<span class="badge">${email}</span></div>
              </div>
              <div class="field">
                <div class="label">Message</div>
                <div class="value message-box">${message.replace(/\n/g, '<br/>')}</div>
              </div>
            </div>
            <div class="footer">
              Reply directly to this email — it goes to ${email}
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('[Resend error]', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[Contact handler error]', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
