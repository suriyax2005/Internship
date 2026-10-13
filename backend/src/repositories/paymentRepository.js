import { Payment } from '../models/Payment.js';

export const paymentRepository = {
  create: async (data) => {
    return await Payment.create(data);
  },

  findAll: async (filter = {}) => {
    return await Payment.find(filter)
      .populate('tenantProfileId', 'fullName email phone')
      .populate({
        path: 'leaseId',
        select: 'rentAmount unitId',
        populate: {
          path: 'unitId',
          select: 'unitNumber propertyId',
          populate: { path: 'propertyId', select: 'propertyName' },
        },
      })
      .sort({ dueDate: -1 });
  },

  findById: async (id, filter = {}) => {
    return await Payment.findOne({ _id: id, ...filter })
      .populate('tenantProfileId', 'fullName email phone emergencyContact')
      .populate({
        path: 'leaseId',
        select: 'rentAmount startDate endDate unitId',
        populate: {
          path: 'unitId',
          select: 'unitNumber floor propertyId',
          populate: { path: 'propertyId', select: 'propertyName address' },
        },
      });
  },

  updateById: async (id, filter, updateData) => {
    return await Payment.findOneAndUpdate({ _id: id, ...filter }, updateData, {
      new: true,
      runValidators: true,
    });
  },

  deleteById: async (id, filter) => {
    return await Payment.findOneAndDelete({ _id: id, ...filter });
  },

  aggregateRevenue: async (filter = {}) => {
    const result = await Payment.aggregate([
      { $match: { ...filter, paymentStatus: 'PAID' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);
    return result[0]?.totalRevenue || 0;
  },

  aggregatePendingRevenue: async (filter = {}) => {
    const result = await Payment.aggregate([
      { $match: { ...filter, paymentStatus: { $in: ['PENDING', 'OVERDUE'] } } },
      { $group: { _id: null, totalPending: { $sum: '$amount' } } },
    ]);
    return result[0]?.totalPending || 0;
  },
};
