import mongoose from 'mongoose';

const tenantProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Tenant full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Tenant email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Tenant phone number is required'],
      trim: true,
    },
    emergencyContact: {
      type: String,
      default: '',
    },
    governmentId: {
      type: String,
      default: '',
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      index: true,
    },
    leaseStart: {
      type: Date,
    },
    leaseEnd: {
      type: Date,
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

tenantProfileSchema.index({ tenantId: 1, email: 1 });

export const TenantProfile = mongoose.model('TenantProfile', tenantProfileSchema);
