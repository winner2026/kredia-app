/**
 * Email Templates para Kredia
 * Plantillas HTML profesionales para emails transaccionales
 */

const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #334155;
`;

const buttonStyle = `
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #06b6d4 0%, #f59e0b 50%, #ec4899 100%);
  color: #0f172a;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin: 20px 0;
`;

interface EmailVerificationParams {
  name: string;
  verificationUrl: string;
}

export function emailVerificationTemplate({
  name,
  verificationUrl,
}: EmailVerificationParams): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyle} background-color: #f1f5f9; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #22d3ee; margin: 0; font-size: 32px;">Kredia</h1>
            <p style="color: #94a3b8; margin: 10px 0 0 0;">Tu libertad financiera empieza aquí</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #0f172a; margin-top: 0;">¡Hola${name ? ' ' + name : ''}! 👋</h2>

            <p style="font-size: 16px; margin: 20px 0;">
              Gracias por registrarte en Kredia. Estamos emocionados de ayudarte a tomar control de tus finanzas.
            </p>

            <p style="font-size: 16px; margin: 20px 0;">
              Para completar tu registro y empezar a usar todas las funcionalidades, por favor verifica tu dirección de email:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="${buttonStyle}">
                Verificar mi email
              </a>
            </div>

            <p style="font-size: 14px; color: #64748b; margin: 20px 0;">
              Si no creaste esta cuenta, puedes ignorar este email de forma segura.
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="font-size: 12px; color: #94a3b8;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
              <a href="${verificationUrl}" style="color: #06b6d4; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #64748b; margin: 0;">
              © ${new Date().getFullYear()} Kredia. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

interface PasswordResetParams {
  name: string;
  resetUrl: string;
}

export function passwordResetTemplate({
  name,
  resetUrl,
}: PasswordResetParams): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyle} background-color: #f1f5f9; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #22d3ee; margin: 0; font-size: 32px;">Kredia</h1>
            <p style="color: #94a3b8; margin: 10px 0 0 0;">Recuperación de contraseña</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #0f172a; margin-top: 0;">¡Hola${name ? ' ' + name : ''}! 🔐</h2>

            <p style="font-size: 16px; margin: 20px 0;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en Kredia.
            </p>

            <p style="font-size: 16px; margin: 20px 0;">
              Haz clic en el botón de abajo para crear una nueva contraseña:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="${buttonStyle}">
                Restablecer contraseña
              </a>
            </div>

            <p style="font-size: 14px; color: #dc2626; background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              ⚠️ <strong>Importante:</strong> Este enlace expirará en 1 hora por razones de seguridad.
            </p>

            <p style="font-size: 14px; color: #64748b; margin: 20px 0;">
              Si no solicitaste restablecer tu contraseña, puedes ignorar este email de forma segura. Tu contraseña no será cambiada.
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="font-size: 12px; color: #94a3b8;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
              <a href="${resetUrl}" style="color: #06b6d4; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #64748b; margin: 0;">
              © ${new Date().getFullYear()} Kredia. Todos los derechos reservados.
            </p>
            <p style="font-size: 11px; color: #94a3b8; margin: 10px 0 0 0;">
              Por tu seguridad, nunca compartas este email con nadie.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

interface WelcomeEmailParams {
  name: string;
}

export function welcomeEmailTemplate({
  name,
}: WelcomeEmailParams): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyle} background-color: #f1f5f9; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #22d3ee; margin: 0; font-size: 32px;">¡Bienvenido a Kredia! 🎉</h1>
          </div>

          <!-- Body -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #0f172a; margin-top: 0;">¡Hola${name ? ' ' + name : ''}!</h2>

            <p style="font-size: 16px; margin: 20px 0;">
              Tu email ha sido verificado exitosamente. ¡Estás listo para comenzar tu viaje hacia la libertad financiera! 🚀
            </p>

            <h3 style="color: #0f172a; margin-top: 30px;">¿Qué puedes hacer ahora?</h3>

            <ul style="font-size: 16px; line-height: 1.8;">
              <li>📊 <strong>Agregar tus tarjetas de crédito</strong> para comenzar a trackear tus gastos</li>
              <li>💳 <strong>Registrar tus compras</strong> y ver proyecciones de pago</li>
              <li>🎯 <strong>Simular diferentes escenarios</strong> de pago</li>
              <li>📈 <strong>Visualizar tu progreso</strong> hacia tu fecha de libertad financiera</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="${buttonStyle}">
                Ir al Dashboard
              </a>
            </div>

            <p style="font-size: 14px; color: #64748b; margin: 30px 0;">
              Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #64748b; margin: 0;">
              © ${new Date().getFullYear()} Kredia. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
