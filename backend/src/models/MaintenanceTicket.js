import mongoose from 'mongoose';
import { TICKET_PRIORITY, TICKET_STATUS } from '../constants/roles.js';

const maintenanceTicketSchema = new mongoose.Schema(
  {
    tenantProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TenantProfile',
      required: [true, 'Tenant profile is required'],
      index: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property ID is required'],
      index: true,
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Ticket description is required'],
    },
    images: [
      {
        type: String,
      },
    ],
    priority: {
      type: String,
      enum: Object.values(TICKET_PRIORITY),
      default: TICKET_PRIORITY.MEDIUM,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TICKET_STATUS),
      default: TICKET_STATUS.OPEN,
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

maintenanceTicketSchema.index({ tenantId: 1, status: 1, priority: 1 });

export const MaintenanceTicket = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
