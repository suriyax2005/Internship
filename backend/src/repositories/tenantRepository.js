import { TenantProfile } from '../models/TenantProfile.js';

export const tenantRepository = {
  create: async (data) => {
    return await TenantProfile.create(data);
  },

  findAll: async (filter = {}) => {
    return await TenantProfile.find(filter)
      .populate('userId', 'fullName email phone')
      .populate({
        path: 'unitId',
        select: 'unitNumber floor rentAmount propertyId',
        populate: { path: 'propertyId', select: 'propertyName address' },
      })
      .sort({ createdAt: -1 });
  },

  findById: async (id, filter = {}) => {
    return await TenantProfile.findOne({ _id: id, ...filter })
      .populate('userId', 'fullName email phone')
      .populate({
        path: 'unitId',
        select: 'unitNumber floor rentAmount depositAmount propertyId',
        populate: { path: 'propertyId', select: 'propertyName address city state' },
      });
  },

  findByUserId: async (userId) => {
    return await TenantProfile.findOne({ userId })
      .populate('userId', 'fullName email phone')
      .populate({
        path: 'unitId',
        select: 'unitNumber floor rentAmount depositAmount propertyId',
        populate: { path: 'propertyId', select: 'propertyName address city state' },
      });
  },

  updateById: async (id, filter, updateData) => {
    return await TenantProfile.findOneAndUpdate({ _id: id, ...filter }, updateData, {
      new: true,
      runValidators: true,
    });
  },

  deleteById: async (id, filter) => {
    return await TenantProfile.findOneAndDelete({ _id: id, ...filter });
  },

  count: async (filter = {}) => {
    return await TenantProfile.countDocuments(filter);
  },
};
