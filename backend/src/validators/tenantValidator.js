import { body } from 'express-validator';

export const tenantValidator = [
  body('fullName').trim().notEmpty().withMessage('Tenant full name is required.'),
  body('email').isEmail().withMessage('Valid email address is required.').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required.'),
  body('unitId').optional({ nullable: true }).isMongoId().withMessage('Valid unit ID required.'),
  body('leaseStart').optional({ nullable: true }).isISO8601().withMessage('Valid start date required.'),
  body('leaseEnd').optional({ nullable: true }).isISO8601().withMessage('Valid end date required.'),
];
