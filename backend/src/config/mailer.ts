import dns from 'node:dns';
import nodemailer, { Transporter } from 'nodemailer';

import env from '@utils/env';

let transporterPromise: Promise<Transporter> | undefined;

async function initTransporter(): Promise<Transporter> {
  let smtpHost = env.SMTP_HOST;
  try {
    const ipv4 = await dns.promises.resolve4(env.SMTP_HOST);
    if (ipv4.length) {
      smtpHost = ipv4[0];
    }
  } catch {
    smtpHost = env.SMTP_HOST;
  }

  const port = Number(env.SMTP_PORT);
  const isSecure = port === 465;

  return nodemailer.createTransport({
    host: smtpHost,
    port,
    secure: isSecure,
    requireTLS: !isSecure,
    servername: env.SMTP_HOST,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export default async function getTransporter(): Promise<Transporter> {
  if (!transporterPromise) {
    transporterPromise = initTransporter();
  }
  return transporterPromise;
}