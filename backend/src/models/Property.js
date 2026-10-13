import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: [true, 'Property name is required'],
      trim: true,
      index: true,
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      default: 'Apartment',
    },
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      index: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    country: {
      type: String,
      default: 'USA',
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
    },
    totalUnits: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

// Compound indexes for fast multi-tenant queries
propertySchema.index({ tenantId: 1, propertyName: 1 });

export const Property = mongoose.model('Property', propertySchema);
