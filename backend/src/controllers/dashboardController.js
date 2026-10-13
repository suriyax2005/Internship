import { dashboardService } from '../services/dashboardService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    if (req.user.role === 'TENANT') {
      const tenantStats = await dashboardService.getTenantMetrics(req.user._id);
      return ApiResponse.success(res, 'Tenant dashboard stats retrieved', tenantStats);
    }

    const landlordStats = await dashboardService.getLandlordMetrics(req.tenantFilter);
    return ApiResponse.success(res, 'Landlord dashboard stats retrieved', landlordStats);
  } catch (error) {
    next(error);
  }
};
