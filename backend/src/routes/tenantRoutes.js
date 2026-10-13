import express from 'express';
import {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
} from '../controllers/tenantController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { enforceTenantScope } from '../middleware/tenantMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { tenantValidator } from '../validators/tenantValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate, enforceTenantScope);

router
  .route('/')
  .post(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), tenantValidator, validateRequest, createTenant)
  .get(getTenants);

router
  .route('/:id')
  .get(getTenantById)
  .put(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), updateTenant)
  .delete(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), deleteTenant);

export default router;
