import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailOptions) => {
  const info = await transport.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });

  return info;
};
