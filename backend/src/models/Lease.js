import mongoose from 'mongoose';
import { LEASE_STATUS } from '../constants/roles.js';

const leaseSchema = new mongoose.Schema(
  {
    tenantProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TenantProfile',
      required: [true, 'Tenant is required for a lease'],
      index: true,
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: [true, 'Unit is required for a lease'],
      index: true,
    },
    rentAmount: {
      type: Number,
      required: [true, 'Rent amount is required'],
      min: 0,
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: 0,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    status: {
      type: String,
      enum: Object.values(LEASE_STATUS),
      default: LEASE_STATUS.ACTIVE,
      required: true,
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

leaseSchema.index({ tenantId: 1, status: 1, endDate: 1 });

export const Lease = mongoose.model('Lease', leaseSchema);
