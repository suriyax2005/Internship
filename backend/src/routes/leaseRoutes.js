import express from 'express';
import {
  createLease,
  getLeases,
  getLeaseById,
  updateLease,
  deleteLease,
} from '../controllers/leaseController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { enforceTenantScope } from '../middleware/tenantMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { leaseValidator } from '../validators/leaseValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate, enforceTenantScope);

router
  .route('/')
  .post(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), leaseValidator, validateRequest, createLease)
  .get(getLeases);

router
  .route('/:id')
  .get(getLeaseById)
  .put(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), updateLease)
  .delete(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), deleteLease);

export default router;
