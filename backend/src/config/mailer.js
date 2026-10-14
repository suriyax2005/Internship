import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

let transporter = null;
let isEthereal = false;

const initTransporter = async () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const isGmail =
      (process.env.SMTP_HOST || '').includes('gmail') ||
      (process.env.SMTP_USER || '').endsWith('@gmail.com');

    const cleanPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

    if (isGmail) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: cleanPass,
        },
      });
      logger.info(`Nodemailer Gmail Transporter configured for ${process.env.SMTP_USER}`);
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: cleanPass,
        },
      });
      logger.info('Nodemailer SMTP Transporter configured.');
    }

    try {
      await transporter.verify();
      logger.info('✅ Gmail SMTP connection verified and ready to send real emails!');
    } catch (verifyErr) {
      logger.error(`❌ Gmail SMTP verify error: ${verifyErr.message}`);
    }
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      isEthereal = true;
      logger.info(`Nodemailer Ethereal test account created: ${testAccount.user}`);
    } catch (err) {
      logger.warn(`Failed to create Ethereal test account (${err.message}). Falling back to mock email mode.`);
      transporter = null;
    }
  }
};

const transporterPromise = initTransporter();

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await transporterPromise;

    if (transporter) {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Dwellora" <${process.env.SMTP_USER || 'noreply@dwellora.com'}>`,
        to,
        subject,
        text: text || subject,
        html,
      });

      let previewUrl = null;
      if (isEthereal) {
        previewUrl = nodemailer.getTestMessageUrl(info);
      }

      logger.info('================================================================');
      logger.info(`📧 Email sent to ${to} | Subject: ${subject}`);
      if (previewUrl) {
        logger.info(`🔗 Ethereal Email Web Preview: ${previewUrl}`);
      }
      logger.info('================================================================');

      return {
        success: true,
        messageId: info.messageId,
        previewUrl,
      };
    } else {
      logger.info('================================================================');
      logger.info(`📧 [MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      if (text) logger.info(`Body: ${text}`);
      logger.info('================================================================');
      return { mock: true, to, subject };
    }
  } catch (error) {
    logger.error(`Error delivering email to ${to}: ${error.message}`);
    return null;
  }
};

export const sendVerificationEmail = async ({ to, fullName, verificationUrl }) => {
  const subject = 'Verify your email address - Dwellora';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #f8fafc; }
        .card { max-width: 540px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 36px 32px; }
        .logo-badge { display: inline-block; padding: 8px 16px; background: #0284c7; color: #ffffff; border-radius: 10px; font-weight: 800; font-size: 18px; letter-spacing: -0.5px; }
        .title { font-size: 24px; font-weight: 800; color: #ffffff; margin-top: 24px; margin-bottom: 8px; }
        .subtitle { font-size: 15px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }
        .btn { display: inline-block; background: #0284c7; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4); }
        .fallback { margin-top: 28px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; line-height: 1.5; word-break: break-all; }
        .footer { margin-top: 24px; text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo-badge">Dwellora</div>
        <h1 class="title">Verify your email address</h1>
        <p class="subtitle">
          Hello ${fullName || 'there'},<br><br>
          Thank you for joining <strong>Dwellora</strong> — the modern rental property & tenant management platform. Please click the button below to verify your email address and activate your account:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}" class="btn" target="_blank">Verify Email Address</a>
        </div>
        <p class="subtitle" style="font-size: 13px; margin-bottom: 0;">
          This verification link is valid for <strong>24 hours</strong>. If you did not create a Dwellora account, you can safely ignore this email.
        </p>
        <div class="fallback">
          If the button above does not work, copy and paste this link into your web browser:<br>
          <a href="${verificationUrl}" style="color: #38bdf8;">${verificationUrl}</a>
        </div>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Dwellora. Every property. Every tenant. One place.
      </div>
    </body>
    </html>
  `;

  const text = `Hello ${fullName},\n\nPlease verify your email address for Dwellora by clicking the following link:\n${verificationUrl}\n\nThis link is valid for 24 hours.`;

  return await sendEmail({ to, subject, html, text });
};
