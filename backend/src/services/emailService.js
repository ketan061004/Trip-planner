import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
}

/**
 * Send a password-reset email. If SMTP is not configured, log the link and
 * signal dev mode so the caller can surface the token for local testing.
 * @returns {Promise<{ sent: boolean, devMode: boolean }>}
 */
export async function sendResetEmail(to, resetLink) {
  const tx = getTransporter();
  if (!tx) {
    console.log("\n🔑 [DEV] Password reset link (no SMTP configured):");
    console.log(`   ${resetLink}\n`);
    return { sent: false, devMode: true };
  }

  await tx.sendMail({
    from: process.env.SMTP_FROM || "AI Trip Planner <no-reply@tripplanner.local>",
    to,
    subject: "Reset your AI Trip Planner password",
    text: `Reset your password using this link (valid for 30 minutes):\n\n${resetLink}\n\nIf you didn't request this, ignore this email.`,
    html: `<p>Reset your password using the link below (valid for 30 minutes):</p>
           <p><a href="${resetLink}">Reset my password</a></p>
           <p>If you didn't request this, you can safely ignore this email.</p>`,
  });
  return { sent: true, devMode: false };
}
