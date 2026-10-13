import { reportService } from '../services/reportService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getFinancialReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await reportService.getFinancialReport(req.tenantFilter, startDate, endDate);
    return ApiResponse.success(res, 'Financial report generated', report);
  } catch (error) {
    next(error);
  }
};

export const getOccupancyReport = async (req, res, next) => {
  try {
    const report = await reportService.getOccupancyReport(req.tenantFilter);
    return ApiResponse.success(res, 'Occupancy report generated', report);
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceReport = async (req, res, next) => {
  try {
    const report = await reportService.getMaintenanceReport(req.tenantFilter);
    return ApiResponse.success(res, 'Maintenance summary report generated', report);
  } catch (error) {
    next(error);
  }
};
