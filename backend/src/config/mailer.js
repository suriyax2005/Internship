import nodemailer from 'nodemailer';
import { logger } from './logger.js';

let transporter;

const setupTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    logger.info('Nodemailer SMTP Transporter configured.');
  } else {
    // Development fallback to ethereal / mock logger
    transporter = null;
    logger.info('SMTP credentials not configured. Email notifications will be logged to console.');
  }
};

setupTransporter();

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (transporter) {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Smart Rental SaaS" <noreply@smartrental.com>',
        to,
        subject,
        text: text || subject,
        html,
      });
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } else {
      logger.info(`[MOCK EMAIL SENT] To: ${to} | Subject: ${subject}`);
      logger.debug(`[MOCK EMAIL CONTENT]: ${text || html}`);
      return { mock: true, to, subject };
    }
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    return null;
  }
};
