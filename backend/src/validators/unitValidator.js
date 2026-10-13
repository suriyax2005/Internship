import { body } from 'express-validator';

export const unitValidator = [
  body('propertyId').isMongoId().withMessage('Valid property ID is required.'),
  body('unitNumber').trim().notEmpty().withMessage('Unit number is required.'),
  body('floor').optional().isInt().withMessage('Floor must be a valid integer.'),
  body('rentAmount').isNumeric().withMessage('Rent amount must be a numeric value.'),
  body('depositAmount').isNumeric().withMessage('Deposit amount must be a numeric value.'),
  body('status').optional().isIn(['VACANT', 'OCCUPIED', 'MAINTENANCE']).withMessage('Invalid unit status.'),
];
