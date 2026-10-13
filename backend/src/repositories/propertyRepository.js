import { Property } from '../models/Property.js';

export const propertyRepository = {
  create: async (data) => {
    return await Property.create(data);
  },

  findAll: async (filter = {}) => {
    return await Property.find(filter).sort({ createdAt: -1 });
  },

  findById: async (id, filter = {}) => {
    return await Property.findOne({ _id: id, ...filter }).populate('ownerId', 'fullName email phone');
  },

  updateById: async (id, filter, updateData) => {
    return await Property.findOneAndUpdate({ _id: id, ...filter }, updateData, {
      new: true,
      runValidators: true,
    });
  },

  deleteById: async (id, filter) => {
    return await Property.findOneAndDelete({ _id: id, ...filter });
  },

  count: async (filter = {}) => {
    return await Property.countDocuments(filter);
  },
};
