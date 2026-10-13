import { propertyRepository } from '../repositories/propertyRepository.js';
import { ApiError } from '../utils/apiError.js';

export const propertyService = {
  createProperty: async (propertyData, user) => {
    const payload = {
      ...propertyData,
      ownerId: user._id,
      tenantId: user.tenantId || user._id,
    };
    return await propertyRepository.create(payload);
  },

  getProperties: async (tenantFilter) => {
    return await propertyRepository.findAll(tenantFilter);
  },

  getPropertyById: async (id, tenantFilter) => {
    const property = await propertyRepository.findById(id, tenantFilter);
    if (!property) {
      throw new ApiError(404, 'Property not found.');
    }
    return property;
  },

  updateProperty: async (id, tenantFilter, updateData) => {
    const property = await propertyRepository.updateById(id, tenantFilter, updateData);
    if (!property) {
      throw new ApiError(404, 'Property not found or unauthorized.');
    }
    return property;
  },

  deleteProperty: async (id, tenantFilter) => {
    const property = await propertyRepository.deleteById(id, tenantFilter);
    if (!property) {
      throw new ApiError(404, 'Property not found or unauthorized.');
    }
    return property;
  },

  uploadImages: async (id, tenantFilter, files) => {
    const property = await propertyRepository.findById(id, tenantFilter);
    if (!property) {
      throw new ApiError(404, 'Property not found or unauthorized.');
    }

    const imageUrls = files.map((f) => `/uploads/${f.filename}`);
    property.images = [...(property.images || []), ...imageUrls];
    await property.save();
    return property;
  },
};
