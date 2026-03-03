import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@notes-marketplace.com';

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  // Fail fast in environments where email must work
  // For local dev, these can be set to test SMTP (e.g. Mailtrap)
  // eslint-disable-next-line no-console
  console.warn('SMTP configuration is incomplete. Email sending may fail.');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  const subject = 'Your Notes Marketplace verification code';
  const text = `Your OTP code is ${otp}. It will expire in 5 minutes.`;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    text,
  });
};

export const sendPurchaseEmail = async (to: string, noteTitle: string, amount: number) => {
  const subject = 'Your Notes Marketplace purchase confirmation';
  const text = `Thank you for purchasing "${noteTitle}". Amount paid: ₹${amount.toFixed(
    2,
  )}. You can now download your note from the Orders page.`;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    text,
  });
};

