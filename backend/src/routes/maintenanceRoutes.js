import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  uploadTicketImages,
} from '../controllers/maintenanceController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { enforceTenantScope } from '../middleware/tenantMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { maintenanceValidator } from '../validators/maintenanceValidator.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(authenticate, enforceTenantScope);

router
  .route('/')
  .post(maintenanceValidator, validateRequest, createTicket)
  .get(getTickets);

router.post('/:id/images', upload.array('images', 5), uploadTicketImages);

router
  .route('/:id')
  .get(getTicketById)
  .put(updateTicket)
  .delete(deleteTicket);

export default router;
