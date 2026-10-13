import { Unit } from '../models/Unit.js';

export const unitRepository = {
  create: async (data) => {
    return await Unit.create(data);
  },

  findAll: async (filter = {}) => {
    return await Unit.find(filter)
      .populate('propertyId', 'propertyName address city')
      .sort({ unitNumber: 1 });
  },

  findById: async (id, filter = {}) => {
    return await Unit.findOne({ _id: id, ...filter }).populate(
      'propertyId',
      'propertyName address city state zipCode'
    );
  },

  updateById: async (id, filter, updateData) => {
    return await Unit.findOneAndUpdate({ _id: id, ...filter }, updateData, {
      new: true,
      runValidators: true,
    });
  },

  deleteById: async (id, filter) => {
    return await Unit.findOneAndDelete({ _id: id, ...filter });
  },

  count: async (filter = {}) => {
    return await Unit.countDocuments(filter);
  },
};
