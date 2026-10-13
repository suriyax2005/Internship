import express from 'express';
import {
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} from '../controllers/unitController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { enforceTenantScope } from '../middleware/tenantMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { unitValidator } from '../validators/unitValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate, enforceTenantScope);

router
  .route('/')
  .post(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), unitValidator, validateRequest, createUnit)
  .get(getUnits);

router
  .route('/:id')
  .get(getUnitById)
  .put(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), updateUnit)
  .delete(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), deleteUnit);

export default router;
