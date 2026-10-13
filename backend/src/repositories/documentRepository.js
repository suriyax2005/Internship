import { Document } from '../models/Document.js';

export const documentRepository = {
  create: async (data) => {
    return await Document.create(data);
  },

  findAll: async (filter = {}) => {
    return await Document.find(filter)
      .populate('uploadedBy', 'fullName email role')
      .sort({ createdAt: -1 });
  },

  findById: async (id, filter = {}) => {
    return await Document.findOne({ _id: id, ...filter }).populate(
      'uploadedBy',
      'fullName email role'
    );
  },

  updateById: async (id, filter, updateData) => {
    return await Document.findOneAndUpdate({ _id: id, ...filter }, updateData, {
      new: true,
      runValidators: true,
    }).populate('uploadedBy', 'fullName email role');
  },

  deleteById: async (id, filter) => {
    return await Document.findOneAndDelete({ _id: id, ...filter });
  },
};
