import { maintenanceService } from '../services/maintenanceService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await maintenanceService.createTicket(req.body, req.user);
    return ApiResponse.success(res, 'Maintenance ticket created', ticket, 201);
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const tickets = await maintenanceService.getTickets(req.tenantFilter, req.user);
    return ApiResponse.success(res, 'Maintenance tickets retrieved', tickets);
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await maintenanceService.getTicketById(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Maintenance ticket details retrieved', ticket);
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await maintenanceService.updateTicket(req.params.id, req.tenantFilter, req.body);
    return ApiResponse.success(res, 'Maintenance ticket updated', ticket);
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = async (req, res, next) => {
  try {
    await maintenanceService.deleteTicket(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Maintenance ticket deleted');
  } catch (error) {
    next(error);
  }
};

export const uploadTicketImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return ApiResponse.error(res, 'Please provide at least one image file', 400);
    }
    const ticket = await maintenanceService.uploadImages(req.params.id, req.tenantFilter, req.files);
    return ApiResponse.success(res, 'Ticket images uploaded successfully', ticket);
  } catch (error) {
    next(error);
  }
};
