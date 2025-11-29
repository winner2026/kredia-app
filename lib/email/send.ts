import { resend, isEmailEnabled } from './client';
import {
  emailVerificationTemplate,
  passwordResetTemplate,
  welcomeEmailTemplate,
} from './templates';

const FROM_EMAIL = process.env.EMAIL_FROM || 'Kredia <onboarding@kredia.app>';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  // En desarrollo, si no hay API key solo logueamos el mensaje
  if (!isEmailEnabled()) {
    console.warn('\n[Email Disabled] Email not sent:');
    console.warn(`To: ${to}`);
    console.warn(`Subject: ${subject}`);
    console.warn('Set RESEND_API_KEY to enable email sending\n');
    return false;
  }

  try {
    await resend!.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('[Email Error] Error sending email:', error);
    return false;
  }
}

/**
 * Enviar email de verificación
 */
export async function sendVerificationEmail(
  email: string,
  verificationUrl: string,
  name?: string
): Promise<boolean> {
  const html = emailVerificationTemplate({
    name: name || '',
    verificationUrl,
  });

  return sendEmail({
    to: email,
    subject: 'Verifica tu email - Kredia',
    html,
  });
}

/**
 * Enviar email de recuperación de contraseña
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  name?: string
): Promise<boolean> {
  const html = passwordResetTemplate({
    name: name || '',
    resetUrl,
  });

  return sendEmail({
    to: email,
    subject: 'Recupera tu contraseña - Kredia',
    html,
  });
}

/**
 * Enviar email de bienvenida después de verificar
 */
export async function sendWelcomeEmail(
  email: string,
  name?: string
): Promise<boolean> {
  const html = welcomeEmailTemplate({
    name: name || '',
  });

  return sendEmail({
    to: email,
    subject: '¡Bienvenido a Kredia!',
    html,
  });
}
