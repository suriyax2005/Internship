import { unitRepository } from '../repositories/unitRepository.js';
import { propertyRepository } from '../repositories/propertyRepository.js';
import { ApiError } from '../utils/apiError.js';

export const unitService = {
  createUnit: async (unitData, user) => {
    const property = await propertyRepository.findById(unitData.propertyId, { tenantId: user.tenantId });
    if (!property) {
      throw new ApiError(404, 'Associated property not found.');
    }

    const payload = {
      ...unitData,
      tenantId: user.tenantId || user._id,
    };

    const unit = await unitRepository.create(payload);

    // Increment property totalUnits
    property.totalUnits = (property.totalUnits || 0) + 1;
    await property.save();

    return unit;
  },

  getUnits: async (tenantFilter, propertyId = null) => {
    const filter = { ...tenantFilter };
    if (propertyId) {
      filter.propertyId = propertyId;
    }
    return await unitRepository.findAll(filter);
  },

  getUnitById: async (id, tenantFilter) => {
    const unit = await unitRepository.findById(id, tenantFilter);
    if (!unit) {
      throw new ApiError(404, 'Unit not found.');
    }
    return unit;
  },

  updateUnit: async (id, tenantFilter, updateData) => {
    const unit = await unitRepository.updateById(id, tenantFilter, updateData);
    if (!unit) {
      throw new ApiError(404, 'Unit not found or unauthorized.');
    }
    return unit;
  },

  deleteUnit: async (id, tenantFilter) => {
    const unit = await unitRepository.findById(id, tenantFilter);
    if (!unit) {
      throw new ApiError(404, 'Unit not found or unauthorized.');
    }

    await unitRepository.deleteById(id, tenantFilter);

    // Decrement property totalUnits
    const property = await propertyRepository.findById(unit.propertyId, tenantFilter);
    if (property && property.totalUnits > 0) {
      property.totalUnits -= 1;
      await property.save();
    }

    return true;
  },
};
