import { body } from 'express-validator';

export const leaseValidator = [
  body('tenantProfileId').isMongoId().withMessage('Valid tenant profile ID is required.'),
  body('unitId').isMongoId().withMessage('Valid unit ID is required.'),
  body('rentAmount').isNumeric().withMessage('Rent amount must be numeric.'),
  body('securityDeposit').isNumeric().withMessage('Security deposit must be numeric.'),
  body('startDate').isISO8601().withMessage('Valid start date required.'),
  body('endDate').isISO8601().withMessage('Valid end date required.'),
  body('status').optional().isIn(['ACTIVE', 'EXPIRED', 'TERMINATED']).withMessage('Invalid lease status.'),
];
