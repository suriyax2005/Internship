import { Lease } from '../models/Lease.js';

export const leaseRepository = {
  create: async (data) => {
    return await Lease.create(data);
  },

  findAll: async (filter = {}) => {
    return await Lease.find(filter)
      .populate('tenantProfileId', 'fullName email phone governmentId')
      .populate({
        path: 'unitId',
        select: 'unitNumber floor rentAmount propertyId',
        populate: { path: 'propertyId', select: 'propertyName address' },
      })
      .sort({ startDate: -1 });
  },

  findById: async (id, filter = {}) => {
    return await Lease.findOne({ _id: id, ...filter })
      .populate('tenantProfileId', 'fullName email phone governmentId emergencyContact')
      .populate({
        path: 'unitId',
        select: 'unitNumber floor rentAmount depositAmount propertyId',
        populate: { path: 'propertyId', select: 'propertyName address city state' },
      });
  },

  updateById: async (id, filter, updateData) => {
    return await Lease.findOneAndUpdate({ _id: id, ...filter }, updateData, {
      new: true,
      runValidators: true,
    });
  },

  deleteById: async (id, filter) => {
    return await Lease.findOneAndDelete({ _id: id, ...filter });
  },

  count: async (filter = {}) => {
    return await Lease.countDocuments(filter);
  },
};
