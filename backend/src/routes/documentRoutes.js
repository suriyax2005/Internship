import express from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from '../controllers/documentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { enforceTenantScope } from '../middleware/tenantMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { documentValidator } from '../validators/documentValidator.js';

const router = express.Router();

router.use(authenticate, enforceTenantScope);

router
  .route('/')
  .post(upload.single('file'), documentValidator, validateRequest, uploadDocument)
  .get(getDocuments);

router
  .route('/:id')
  .get(getDocumentById)
  .put(upload.single('file'), updateDocument)
  .delete(deleteDocument);

export default router;
