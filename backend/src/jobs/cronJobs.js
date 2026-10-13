import cron from 'node-cron';
import { Lease } from '../models/Lease.js';
import { Payment } from '../models/Payment.js';
import { LEASE_STATUS, PAYMENT_STATUS } from '../constants/roles.js';
import { logger } from '../config/logger.js';
import { sendEmail } from '../config/mailer.js';

export const startCronJobs = () => {
  // Daily midnight task to check lease expirations and overdue payments
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running daily background job: Checking lease expirations and overdue payments...');
    try {
      const now = new Date();

      // 1. Mark expired leases
      const expiredLeases = await Lease.updateMany(
        { endDate: { $lt: now }, status: LEASE_STATUS.ACTIVE },
        { status: LEASE_STATUS.EXPIRED }
      );
      if (expiredLeases.modifiedCount > 0) {
        logger.info(`Updated ${expiredLeases.modifiedCount} active leases to EXPIRED status.`);
      }

      // 2. Mark overdue rent payments
      const overduePayments = await Payment.find({
        dueDate: { $lt: now },
        paymentStatus: PAYMENT_STATUS.PENDING,
      }).populate('tenantProfileId');

      for (const payment of overduePayments) {
        payment.paymentStatus = PAYMENT_STATUS.OVERDUE;
        await payment.save();

        if (payment.tenantProfileId && payment.tenantProfileId.email) {
          await sendEmail({
            to: payment.tenantProfileId.email,
            subject: 'Overdue Rent Payment Reminder',
            text: `Dear ${payment.tenantProfileId.fullName}, your rent payment of \$${payment.amount} due on ${new Date(payment.dueDate).toLocaleDateString()} is now OVERDUE. Please make your payment promptly.`,
          });
        }
      }
      if (overduePayments.length > 0) {
        logger.info(`Flagged ${overduePayments.length} pending payments as OVERDUE and sent email reminders.`);
      }

      // 3. Send upcoming rent due reminders (due in next 3 days)
      const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const upcomingPayments = await Payment.find({
        dueDate: { $gte: now, $lte: inThreeDays },
        paymentStatus: PAYMENT_STATUS.PENDING,
      }).populate('tenantProfileId');

      for (const p of upcomingPayments) {
        if (p.tenantProfileId?.email) {
          await sendEmail({
            to: p.tenantProfileId.email,
            subject: 'Friendly Reminder: Upcoming Rent Payment Due',
            text: `Dear ${p.tenantProfileId.fullName}, this is a reminder that your rent payment of \$${p.amount} is due on ${new Date(p.dueDate).toLocaleDateString()}.`,
          });
        }
      }

      // 4. Send lease expiration alert (expiring in next 30 days)
      const inThirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const expiringSoonLeases = await Lease.find({
        endDate: { $gte: now, $lte: inThirtyDays },
        status: LEASE_STATUS.ACTIVE,
      }).populate('tenantProfileId');

      for (const l of expiringSoonLeases) {
        if (l.tenantProfileId?.email) {
          await sendEmail({
            to: l.tenantProfileId.email,
            subject: 'Notice: Lease Expiring Soon',
            text: `Dear ${l.tenantProfileId.fullName}, your lease agreement is set to conclude on ${new Date(l.endDate).toLocaleDateString()}. Please contact your property manager to arrange renewal.`,
          });
        }
      }
    } catch (error) {
      logger.error(`Error in daily background cron job: ${error.message}`);
    }
  });

  logger.info('Scheduled cron jobs initialized.');
};
