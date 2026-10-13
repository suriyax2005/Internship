import express from 'express';
import {
  getFinancialReport,
  getOccupancyReport,
  getMaintenanceReport,
} from '../controllers/reportController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { enforceTenantScope } from '../middleware/tenantMiddleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate, enforceTenantScope, authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN));

router.get('/financial', getFinancialReport);
router.get('/occupancy', getOccupancyReport);
router.get('/maintenance', getMaintenanceReport);

export default router;
