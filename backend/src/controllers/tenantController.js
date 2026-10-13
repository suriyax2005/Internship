import { tenantService } from '../services/tenantService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.createTenant(req.body, req.user);
    return ApiResponse.success(res, 'Tenant profile created successfully', tenant, 201);
  } catch (error) {
    next(error);
  }
};

export const getTenants = async (req, res, next) => {
  try {
    const tenants = await tenantService.getTenants(req.tenantFilter);
    return ApiResponse.success(res, 'Tenants retrieved successfully', tenants);
  } catch (error) {
    next(error);
  }
};

export const getTenantById = async (req, res, next) => {
  try {
    const tenant = await tenantService.getTenantById(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Tenant profile retrieved', tenant);
  } catch (error) {
    next(error);
  }
};

export const updateTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.updateTenant(req.params.id, req.tenantFilter, req.body);
    return ApiResponse.success(res, 'Tenant profile updated successfully', tenant);
  } catch (error) {
    next(error);
  }
};

export const deleteTenant = async (req, res, next) => {
  try {
    await tenantService.deleteTenant(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Tenant profile deleted successfully');
  } catch (error) {
    next(error);
  }
};
