import { tenantRepository } from '../repositories/tenantRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { unitRepository } from '../repositories/unitRepository.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES, UNIT_STATUS } from '../constants/roles.js';

export const tenantService = {
  createTenant: async (tenantData, user) => {
    const tenantId = user.tenantId || user._id;

    // Check if user account exists for tenant email, create if not
    let tenantUser = await userRepository.findByEmail(tenantData.email);
    if (!tenantUser) {
      tenantUser = await userRepository.create({
        fullName: tenantData.fullName,
        email: tenantData.email,
        password: tenantData.password || 'Tenant@12345',
        phone: tenantData.phone,
        role: ROLES.TENANT,
        tenantId,
      });
    }

    const payload = {
      ...tenantData,
      userId: tenantUser._id,
      tenantId,
    };

    const profile = await tenantRepository.create(payload);

    // If unit is assigned, update unit status to OCCUPIED
    if (tenantData.unitId) {
      await unitRepository.updateById(tenantData.unitId, { tenantId }, { status: UNIT_STATUS.OCCUPIED });
    }

    return profile;
  },

  getTenants: async (tenantFilter) => {
    return await tenantRepository.findAll(tenantFilter);
  },

  getTenantById: async (id, tenantFilter) => {
    const tenant = await tenantRepository.findById(id, tenantFilter);
    if (!tenant) {
      throw new ApiError(404, 'Tenant profile not found.');
    }
    return tenant;
  },

  getTenantByUserId: async (userId) => {
    const tenant = await tenantRepository.findByUserId(userId);
    if (!tenant) {
      throw new ApiError(404, 'Tenant profile for user not found.');
    }
    return tenant;
  },

  updateTenant: async (id, tenantFilter, updateData) => {
    const currentTenant = await tenantRepository.findById(id, tenantFilter);
    if (!currentTenant) {
      throw new ApiError(404, 'Tenant not found or unauthorized.');
    }

    // If unit assignment changed
    if (updateData.unitId && updateData.unitId.toString() !== currentTenant.unitId?.toString()) {
      if (currentTenant.unitId) {
        await unitRepository.updateById(currentTenant.unitId, tenantFilter, { status: UNIT_STATUS.VACANT });
      }
      await unitRepository.updateById(updateData.unitId, tenantFilter, { status: UNIT_STATUS.OCCUPIED });
    }

    const updated = await tenantRepository.updateById(id, tenantFilter, updateData);
    return updated;
  },

  deleteTenant: async (id, tenantFilter) => {
    const tenant = await tenantRepository.findById(id, tenantFilter);
    if (!tenant) {
      throw new ApiError(404, 'Tenant not found or unauthorized.');
    }

    if (tenant.unitId) {
      await unitRepository.updateById(tenant.unitId, tenantFilter, { status: UNIT_STATUS.VACANT });
    }

    await tenantRepository.deleteById(id, tenantFilter);
    return true;
  },
};
