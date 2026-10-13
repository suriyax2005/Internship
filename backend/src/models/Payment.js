import mongoose from 'mongoose';
import { PAYMENT_STATUS, PAYMENT_METHOD } from '../constants/roles.js';

const paymentSchema = new mongoose.Schema(
  {
    tenantProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TenantProfile',
      required: [true, 'Tenant profile is required'],
      index: true,
    },
    leaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lease',
      required: [true, 'Lease ID is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    paidDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.ONLINE,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      required: true,
      index: true,
    },
    receiptUrl: {
      type: String,
      default: '',
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
      index: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ tenantId: 1, paymentStatus: 1, dueDate: 1 });

export const Payment = mongoose.model('Payment', paymentSchema);
