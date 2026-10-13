import { body } from 'express-validator';

export const paymentValidator = [
  body('tenantProfileId').isMongoId().withMessage('Valid tenant profile ID is required.'),
  body('leaseId').isMongoId().withMessage('Valid lease ID is required.'),
  body('amount').isNumeric().withMessage('Payment amount must be numeric.'),
  body('dueDate').isISO8601().withMessage('Valid due date required.'),
  body('paymentMethod')
    .optional()
    .isIn(['CREDIT_CARD', 'BANK_TRANSFER', 'CASH', 'CHECK', 'ONLINE'])
    .withMessage('Invalid payment method.'),
  body('paymentStatus')
    .optional()
    .isIn(['PAID', 'PENDING', 'OVERDUE'])
    .withMessage('Invalid payment status.'),
];
