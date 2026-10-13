import { paymentRepository } from '../repositories/paymentRepository.js';
import { leaseRepository } from '../repositories/leaseRepository.js';
import { tenantRepository } from '../repositories/tenantRepository.js';
import { ApiError } from '../utils/apiError.js';
import { PAYMENT_STATUS, LEASE_STATUS } from '../constants/roles.js';
import { emitToTenant } from '../config/socket.js';

export const paymentService = {
  createPayment: async (paymentData, user) => {
    const tenantId = user.tenantId || user._id;

    const payload = {
      ...paymentData,
      tenantId,
      paidDate: paymentData.paymentStatus === PAYMENT_STATUS.PAID ? paymentData.paidDate || new Date() : undefined,
    };

    const payment = await paymentRepository.create(payload);
    emitToTenant(tenantId, 'payment:created', payment);
    return payment;
  },

  getPayments: async (tenantFilter, tenantProfileId = null) => {
    const filter = { ...tenantFilter };
    if (tenantProfileId) {
      filter.tenantProfileId = tenantProfileId;
    }
    return await paymentRepository.findAll(filter);
  },

  getPaymentById: async (id, tenantFilter) => {
    const payment = await paymentRepository.findById(id, tenantFilter);
    if (!payment) {
      throw new ApiError(404, 'Payment record not found.');
    }
    return payment;
  },

  updatePayment: async (id, tenantFilter, updateData) => {
    if (updateData.paymentStatus === PAYMENT_STATUS.PAID && !updateData.paidDate) {
      updateData.paidDate = new Date();
    }

    const payment = await paymentRepository.updateById(id, tenantFilter, updateData);
    if (!payment) {
      throw new ApiError(404, 'Payment not found or unauthorized.');
    }
    emitToTenant(payment.tenantId, 'payment:updated', payment);
    return payment;
  },

  generateMonthlyRent: async (tenantFilter, user) => {
    const tenantId = user.tenantId || user._id;
    const activeLeases = await leaseRepository.findAll({ tenantId, status: LEASE_STATUS.ACTIVE });

    let createdCount = 0;
    const now = new Date();
    const nextMonthDue = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    for (const lease of activeLeases) {
      // Check if payment already exists for this lease and month
      const existing = await paymentRepository.findAll({
        leaseId: lease._id,
        dueDate: {
          $gte: new Date(nextMonthDue.getFullYear(), nextMonthDue.getMonth(), 1),
          $lte: new Date(nextMonthDue.getFullYear(), nextMonthDue.getMonth() + 1, 0),
        },
      });

      if (existing.length === 0) {
        await paymentRepository.create({
          tenantProfileId: lease.tenantProfileId._id || lease.tenantProfileId,
          leaseId: lease._id,
          amount: lease.rentAmount,
          dueDate: nextMonthDue,
          paymentStatus: PAYMENT_STATUS.PENDING,
          tenantId,
        });
        createdCount++;
      }
    }

    return { createdCount, totalActiveLeases: activeLeases.length };
  },

  generateReceipt: async (paymentId, tenantFilter) => {
    const payment = await paymentRepository.findById(paymentId, tenantFilter);
    if (!payment) {
      throw new ApiError(404, 'Payment record not found.');
    }

    const receipt = {
      receiptNumber: `REC-${payment._id.toString().slice(-6).toUpperCase()}`,
      date: payment.paidDate || new Date(),
      tenantName: payment.tenantProfileId?.fullName || 'N/A',
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.paymentStatus,
      propertyName: payment.leaseId?.unitId?.propertyId?.propertyName || 'N/A',
      unitNumber: payment.leaseId?.unitId?.unitNumber || 'N/A',
    };

    return receipt;
  },

  createPaymentIntent: async (paymentId, tenantFilter, user) => {
    const payment = await paymentRepository.findById(paymentId, tenantFilter);
    if (!payment) {
      throw new ApiError(404, 'Payment record not found.');
    }

    if (payment.paymentStatus === PAYMENT_STATUS.PAID) {
      throw new ApiError(400, 'Payment has already been marked as PAID.');
    }

    const { createPaymentIntent: createStripeIntent } = await import('../config/stripe.js');
    const result = await createStripeIntent({
      amount: payment.amount,
      metadata: {
        paymentId: payment._id.toString(),
        tenantProfileId: payment.tenantProfileId?._id?.toString() || payment.tenantProfileId?.toString(),
        tenantId: payment.tenantId?.toString(),
        userId: user._id?.toString(),
      },
    });

    payment.stripePaymentIntentId = result.paymentIntentId;
    await payment.save();

    return {
      paymentId: payment._id,
      amount: payment.amount,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
      isSimulated: result.isSimulated,
    };
  },

  confirmStripePayment: async (paymentId, tenantFilter, paymentIntentId, method = PAYMENT_METHOD.CREDIT_CARD) => {
    const payment = await paymentRepository.findById(paymentId, tenantFilter);
    if (!payment) {
      throw new ApiError(404, 'Payment record not found.');
    }

    payment.paymentStatus = PAYMENT_STATUS.PAID;
    payment.paidDate = new Date();
    payment.paymentMethod = method || PAYMENT_METHOD.CREDIT_CARD;
    if (paymentIntentId) {
      payment.stripePaymentIntentId = paymentIntentId;
    }
    await payment.save();

    emitToTenant(payment.tenantId, 'payment:updated', payment);
    return payment;
  },

  handleStripeWebhook: async (event) => {
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      const paymentId = intent.metadata?.paymentId;
      if (paymentId) {
        const payment = await paymentRepository.findById(paymentId, {});
        if (payment && payment.paymentStatus !== PAYMENT_STATUS.PAID) {
          payment.paymentStatus = PAYMENT_STATUS.PAID;
          payment.paidDate = new Date();
          payment.paymentMethod = PAYMENT_METHOD.CREDIT_CARD;
          payment.stripePaymentIntentId = intent.id;
          await payment.save();
          emitToTenant(payment.tenantId, 'payment:updated', payment);
        }
      }
    }
    return true;
  },
};
