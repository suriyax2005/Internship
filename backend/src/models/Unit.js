import mongoose from 'mongoose';
import { UNIT_STATUS } from '../constants/roles.js';

const unitSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property ID is required'],
      index: true,
    },
    unitNumber: {
      type: String,
      required: [true, 'Unit number is required'],
      trim: true,
    },
    floor: {
      type: Number,
      default: 1,
    },
    rentAmount: {
      type: Number,
      required: [true, 'Rent amount is required'],
      min: 0,
    },
    depositAmount: {
      type: Number,
      required: [true, 'Deposit amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(UNIT_STATUS),
      default: UNIT_STATUS.VACANT,
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

unitSchema.index({ tenantId: 1, propertyId: 1, status: 1 });

export const Unit = mongoose.model('Unit', unitSchema);
