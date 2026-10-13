import express from 'express';
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  generateMonthlyRent,
  getReceipt,
  createPaymentIntent,
  confirmStripePayment,
  stripeWebhook,
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { enforceTenantScope } from '../middleware/tenantMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { paymentValidator } from '../validators/paymentValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Stripe Webhook (Public endpoint for Stripe notifications)
router.post('/stripe-webhook', stripeWebhook);

// Protected routes
router.use(authenticate, enforceTenantScope);

router
  .route('/')
  .post(authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), paymentValidator, validateRequest, createPayment)
  .get(getPayments);

router.post('/generate-monthly-rent', authorize(ROLES.LANDLORD, ROLES.SUPER_ADMIN), generateMonthlyRent);
router.get('/:id/receipt', getReceipt);
router.post('/:id/create-payment-intent', createPaymentIntent);
router.post('/:id/confirm-payment', confirmStripePayment);

router
  .route('/:id')
  .get(getPaymentById)
  .put(updatePayment);

export default router;
