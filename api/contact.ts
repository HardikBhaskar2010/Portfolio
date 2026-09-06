import { Resend } from 'resend';

export const config = {
  runtime: 'edge',
};

/* ────────────────────────────────────────────────────────────
   Gmail-safe email template
   Rules: inline CSS only, table-based layout, no web fonts,
          HTTPS images only, no CSS variables
   ────────────────────────────────────────────────────────── */
function buildEmailHtml(name: string, email: string, message: string) {
  const safeMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  const firstName = name.split(' ')[0];
  const sentAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Portfolio Message from ${name}</title>
</head>
<body style="margin:0;padding:0;background-color:#05050a;font-family:Arial,Helvetica,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#05050a;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="560" cellpadding="0" cellspacing="0" border="0"
          style="max-width:560px;width:100%;background-color:#0d0d1a;border-radius:16px;
                 border:1px solid #1c1c2e;overflow:hidden;">

          <!-- ── Header ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#00102a 0%,#0d0d1a 60%,#1a0a2e 100%);
                        padding:32px 36px;border-bottom:1px solid #1c1c2e;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <!-- Logo -->
                    <img
                      src="https://hardikbhaskar.vercel.app/images/logo.png"
                      alt="Hardik Bhaskar"
                      width="40"
                      height="40"
                      style="border-radius:8px;display:block;"
                    >
                  </td>
                  <td style="vertical-align:middle;padding-left:12px;">
                    <p style="margin:0;font-size:16px;font-weight:700;color:#f0f0f8;
                               letter-spacing:-0.01em;">Hardik Bhaskar</p>
                    <p style="margin:2px 0 0;font-size:11px;color:#5c5c7a;
                               letter-spacing:0.12em;text-transform:uppercase;">Portfolio</p>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <!-- Live badge -->
                    <span style="display:inline-block;background-color:#00e5ff18;
                                 color:#00e5ff;border:1px solid #00e5ff30;border-radius:99px;
                                 padding:4px 12px;font-size:10px;letter-spacing:0.14em;
                                 text-transform:uppercase;font-weight:600;">
                      ● New Message
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Hero Banner ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#00e5ff12 0%,#7c3aed0a 100%);
                        padding:28px 36px 20px;border-bottom:1px solid #1c1c2e;">
              <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#f0f0f8;
                         font-style:italic;letter-spacing:-0.02em;">
                Someone reached out! ✦
              </p>
              <p style="margin:0;font-size:13px;color:#5c5c7a;">
                ${sentAt} &nbsp;·&nbsp; hardikbhaskar.vercel.app
              </p>
            </td>
          </tr>

          <!-- ── Body ── -->
          <tr>
            <td style="padding:32px 36px;">

              <!-- Sender info row -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#0a0a18;border:1px solid #1c1c2e;
                       border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table cellpadding="0" cellspacing="0" border="0">

                      <!-- Name -->
                      <tr>
                        <td style="padding-bottom:14px;">
                          <p style="margin:0 0 4px;font-size:10px;color:#3a3a52;
                                     letter-spacing:0.18em;text-transform:uppercase;">Name</p>
                          <p style="margin:0;font-size:16px;font-weight:700;color:#f0f0f8;">
                            ${firstName}
                            <span style="font-weight:400;color:#c4c4d4;">${name.includes(' ') ? '&nbsp;' + name.split(' ').slice(1).join(' ') : ''}</span>
                          </p>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="border-top:1px solid #1c1c2e;padding-top:14px;">
                          <p style="margin:0 0 4px;font-size:10px;color:#3a3a52;
                                     letter-spacing:0.18em;text-transform:uppercase;">Email</p>
                          <a href="mailto:${email}"
                            style="margin:0;font-size:14px;color:#00e5ff;
                                   text-decoration:none;font-weight:500;">
                            ${email}
                          </a>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message label -->
              <p style="margin:0 0 10px;font-size:10px;color:#3a3a52;
                         letter-spacing:0.18em;text-transform:uppercase;">Message</p>

              <!-- Message box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#07070f;border:1px solid #1c1c2e;
                       border-left:3px solid #00e5ff;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 22px;font-size:14px;color:#c4c4d4;
                              line-height:1.8;">
                    ${safeMessage}
                  </td>
                </tr>
              </table>

              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re: Your message to Hardik Bhaskar"
                      style="display:inline-block;background-color:#ffffff;color:#05050a;
                             font-size:13px;font-weight:700;letter-spacing:0.04em;
                             text-decoration:none;padding:14px 36px;border-radius:99px;">
                      Reply to ${firstName} →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #1c1c2e;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;color:#2a2a3e;">
                This email was sent via your portfolio contact form at
                <a href="https://hardikbhaskar.vercel.app"
                  style="color:#3a3a52;text-decoration:none;">
                  hardikbhaskar.vercel.app
                </a>
              </p>
              <p style="margin:0;font-size:10px;color:#1e1e30;">
                © ${new Date().getFullYear()} Hardik Bhaskar &nbsp;·&nbsp; All rights reserved
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /* ── Parse ── */
  let name = '', email = '', message = '';
  try {
    const body = await req.json();
    name    = String(body.name    ?? '').trim();
    email   = String(body.email   ?? '').trim();
    message = String(body.message ?? '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /* ── Send via Resend (key from env — never hardcoded) ── */
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from:    'onboarding@resend.dev',
    to:      ['hardik.bhaskar2010@gmail.com'],
    replyTo: email,
    subject: `✦ ${name} sent you a message — Portfolio`,
    html:    buildEmailHtml(name, email, message),
  });

  if (error) {
    console.error('[Resend]', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
