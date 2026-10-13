import mongoose from 'mongoose';
import { DOCUMENT_TYPE } from '../constants/roles.js';

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    documentType: {
      type: String,
      enum: Object.values(DOCUMENT_TYPE),
      default: DOCUMENT_TYPE.OTHER,
      required: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    publicId: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: 'pdf',
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

documentSchema.index({ tenantId: 1, documentType: 1 });

export const Document = mongoose.model('Document', documentSchema);
