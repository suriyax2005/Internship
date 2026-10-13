import express from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
} from '../controllers/propertyController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { enforceTenantScope } from '../middleware/tenantMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { propertyValidator } from '../validators/propertyValidator.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate, enforceTenantScope);

router
  .route('/')
  .post(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), propertyValidator, validateRequest, createProperty)
  .get(getProperties);

router.post(
  '/:id/images',
  authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN),
  upload.array('images', 5),
  uploadPropertyImages
);

router
  .route('/:id')
  .get(getPropertyById)
  .put(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), updateProperty)
  .delete(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), deleteProperty);

export default router;
