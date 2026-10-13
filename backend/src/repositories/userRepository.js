import { User } from '../models/User.js';

export const userRepository = {
  create: async (userData) => {
    return await User.create(userData);
  },

  findByEmail: async (email, includePassword = false) => {
    if (includePassword) {
      return await User.findOne({ email }).select('+password +refreshToken');
    }
    return await User.findOne({ email });
  },

  findById: async (id) => {
    return await User.findById(id);
  },

  updateById: async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  },

  findAllLandlords: async () => {
    return await User.find({ role: 'LANDLORD' }).select('-password');
  },
};
