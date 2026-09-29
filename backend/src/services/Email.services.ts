import getTransporter from '@config/mailer';

import env from '@utils/env';

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<void> {
  const resetLink = `${env.ORIGIN_SERVER}/auth/reset-password?token=${resetToken}`;

  const transporter = await getTransporter();

  await transporter.sendMail({
    from: `Sistema SAI <${env.SMTP_FROM}>`,
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Haz clic en este enlace para restablecer tu contraseña: ${resetLink}`,
    html: `
      <p>Hola,</p>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p><a href="${resetLink}">Haz clic aquí para restablecerla</a></p>
      <p>Si no la solicitaste, ignora este correo.</p>
    `,
  });
}