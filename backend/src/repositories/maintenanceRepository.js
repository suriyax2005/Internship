import { MaintenanceTicket } from '../models/MaintenanceTicket.js';

export const maintenanceRepository = {
  create: async (data) => {
    return await MaintenanceTicket.create(data);
  },

  findAll: async (filter = {}) => {
    return await MaintenanceTicket.find(filter)
      .populate('tenantProfileId', 'fullName email phone')
      .populate('propertyId', 'propertyName address')
      .populate('unitId', 'unitNumber floor')
      .sort({ createdAt: -1 });
  },

  findById: async (id, filter = {}) => {
    return await MaintenanceTicket.findOne({ _id: id, ...filter })
      .populate('tenantProfileId', 'fullName email phone')
      .populate('propertyId', 'propertyName address city state')
      .populate('unitId', 'unitNumber floor');
  },

  updateById: async (id, filter, updateData) => {
    return await MaintenanceTicket.findOneAndUpdate({ _id: id, ...filter }, updateData, {
      new: true,
      runValidators: true,
    });
  },

  deleteById: async (id, filter) => {
    return await MaintenanceTicket.findOneAndDelete({ _id: id, ...filter });
  },

  count: async (filter = {}) => {
    return await MaintenanceTicket.countDocuments(filter);
  },
};
