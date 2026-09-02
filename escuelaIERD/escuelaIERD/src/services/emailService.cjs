const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true para puerto 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetPasswordEmail = async (to, token, rol) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(to)}&rol=${rol}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Escuela IERD <no-reply@ierdduitama.com>',
    to,
    subject: 'Restablecimiento de contraseña - Escuela IERD',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2d5a27;">Restablecimiento de contraseña</h2>
        <p>Hola,</p>
        <p>Has solicitado restablecer tu contraseña para la cuenta de <strong>${rol}</strong> en el sistema de la Escuela IERD Duitama.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2d5a27; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0;">
          Restablecer mi contraseña
        </a>
        <p>O copia y pega este enlace en tu navegador:</p>
        <p style="word-break: break-all; color: #555;">${resetUrl}</p>
        <p><strong>Este enlace expira en 1 hora.</strong></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">
          Si no solicitaste este cambio, ignora este correo. Tu contraseña actual seguirá siendo válida.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };