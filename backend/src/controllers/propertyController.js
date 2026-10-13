import { propertyService } from '../services/propertyService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createProperty = async (req, res, next) => {
  try {
    const property = await propertyService.createProperty(req.body, req.user);
    return ApiResponse.success(res, 'Property created successfully', property, 201);
  } catch (error) {
    next(error);
  }
};

export const getProperties = async (req, res, next) => {
  try {
    const properties = await propertyService.getProperties(req.tenantFilter);
    return ApiResponse.success(res, 'Properties retrieved successfully', properties);
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Property details retrieved', property);
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await propertyService.updateProperty(req.params.id, req.tenantFilter, req.body);
    return ApiResponse.success(res, 'Property updated successfully', property);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    await propertyService.deleteProperty(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Property deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const uploadPropertyImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return ApiResponse.error(res, 'Please provide at least one image file', 400);
    }
    const property = await propertyService.uploadImages(req.params.id, req.tenantFilter, req.files);
    return ApiResponse.success(res, 'Property images uploaded successfully', property);
  } catch (error) {
    next(error);
  }
};
