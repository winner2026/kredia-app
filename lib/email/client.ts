import { Resend } from 'resend';

// Inicializar cliente de Resend
const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey
  ? new Resend(resendApiKey)
  : null;

// Helper para verificar si el servicio de email está configurado
export function isEmailEnabled(): boolean {
  return resend !== null;
}
