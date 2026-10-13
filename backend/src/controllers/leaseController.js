import { leaseService } from '../services/leaseService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createLease = async (req, res, next) => {
  try {
    const lease = await leaseService.createLease(req.body, req.user);
    return ApiResponse.success(res, 'Lease created successfully', lease, 201);
  } catch (error) {
    next(error);
  }
};

export const getLeases = async (req, res, next) => {
  try {
    const leases = await leaseService.getLeases(req.tenantFilter);
    return ApiResponse.success(res, 'Leases retrieved successfully', leases);
  } catch (error) {
    next(error);
  }
};

export const getLeaseById = async (req, res, next) => {
  try {
    const lease = await leaseService.getLeaseById(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Lease contract retrieved', lease);
  } catch (error) {
    next(error);
  }
};

export const updateLease = async (req, res, next) => {
  try {
    const lease = await leaseService.updateLease(req.params.id, req.tenantFilter, req.body);
    return ApiResponse.success(res, 'Lease updated successfully', lease);
  } catch (error) {
    next(error);
  }
};

export const deleteLease = async (req, res, next) => {
  try {
    await leaseService.deleteLease(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Lease deleted successfully');
  } catch (error) {
    next(error);
  }
};
