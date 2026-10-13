import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { enforceTenantScope } from '../middleware/tenantMiddleware.js';

const router = express.Router();

router.use(authenticate, enforceTenantScope);

router.get('/stats', getDashboardStats);

export default router;
