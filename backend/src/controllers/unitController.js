import { unitService } from '../services/unitService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createUnit = async (req, res, next) => {
  try {
    const unit = await unitService.createUnit(req.body, req.user);
    return ApiResponse.success(res, 'Unit created successfully', unit, 201);
  } catch (error) {
    next(error);
  }
};

export const getUnits = async (req, res, next) => {
  try {
    const propertyId = req.query.propertyId || null;
    const units = await unitService.getUnits(req.tenantFilter, propertyId);
    return ApiResponse.success(res, 'Units retrieved successfully', units);
  } catch (error) {
    next(error);
  }
};

export const getUnitById = async (req, res, next) => {
  try {
    const unit = await unitService.getUnitById(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Unit details retrieved', unit);
  } catch (error) {
    next(error);
  }
};

export const updateUnit = async (req, res, next) => {
  try {
    const unit = await unitService.updateUnit(req.params.id, req.tenantFilter, req.body);
    return ApiResponse.success(res, 'Unit updated successfully', unit);
  } catch (error) {
    next(error);
  }
};

export const deleteUnit = async (req, res, next) => {
  try {
    await unitService.deleteUnit(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Unit deleted successfully');
  } catch (error) {
    next(error);
  }
};
