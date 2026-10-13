import { maintenanceRepository } from '../repositories/maintenanceRepository.js';
import { tenantRepository } from '../repositories/tenantRepository.js';
import { ApiError } from '../utils/apiError.js';
import { TICKET_STATUS } from '../constants/roles.js';
import { emitToTenant } from '../config/socket.js';

export const maintenanceService = {
  createTicket: async (ticketData, user) => {
    let tenantProfileId = ticketData.tenantProfileId;
    let tenantId = user.tenantId || user._id;

    if (user.role === 'TENANT') {
      const profile = await tenantRepository.findByUserId(user._id);
      if (!profile) {
        throw new ApiError(400, 'Tenant profile required to create maintenance ticket.');
      }
      tenantProfileId = profile._id;
      tenantId = profile.tenantId;
      ticketData.propertyId = profile.unitId?.propertyId?._id || profile.unitId?.propertyId || ticketData.propertyId;
      ticketData.unitId = profile.unitId?._id || profile.unitId;
    }

    const payload = {
      ...ticketData,
      tenantProfileId,
      tenantId,
      status: ticketData.status || TICKET_STATUS.OPEN,
    };

    const ticket = await maintenanceRepository.create(payload);
    emitToTenant(tenantId, 'ticket:created', ticket);
    return ticket;
  },

  getTickets: async (tenantFilter, user) => {
    const filter = { ...tenantFilter };

    if (user.role === 'TENANT') {
      const profile = await tenantRepository.findByUserId(user._id);
      if (profile) {
        filter.tenantProfileId = profile._id;
      }
    }

    return await maintenanceRepository.findAll(filter);
  },

  getTicketById: async (id, tenantFilter) => {
    const ticket = await maintenanceRepository.findById(id, tenantFilter);
    if (!ticket) {
      throw new ApiError(404, 'Maintenance ticket not found.');
    }
    return ticket;
  },

  updateTicket: async (id, tenantFilter, updateData) => {
    const ticket = await maintenanceRepository.updateById(id, tenantFilter, updateData);
    if (!ticket) {
      throw new ApiError(404, 'Maintenance ticket not found or unauthorized.');
    }
    emitToTenant(ticket.tenantId, 'ticket:updated', ticket);
    return ticket;
  },

  deleteTicket: async (id, tenantFilter) => {
    const ticket = await maintenanceRepository.deleteById(id, tenantFilter);
    if (!ticket) {
      throw new ApiError(404, 'Maintenance ticket not found or unauthorized.');
    }
    return true;
  },

  uploadImages: async (id, tenantFilter, files) => {
    const ticket = await maintenanceRepository.findById(id, tenantFilter);
    if (!ticket) {
      throw new ApiError(404, 'Maintenance ticket not found or unauthorized.');
    }

    const imageUrls = files.map((f) => `/uploads/${f.filename}`);
    ticket.images = [...(ticket.images || []), ...imageUrls];
    await ticket.save();
    emitToTenant(ticket.tenantId, 'ticket:updated', ticket);
    return ticket;
  },
};
