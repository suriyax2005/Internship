import { body } from 'express-validator';

export const propertyValidator = [
  body('propertyName').trim().notEmpty().withMessage('Property name is required.'),
  body('address').trim().notEmpty().withMessage('Address is required.'),
  body('city').trim().notEmpty().withMessage('City is required.'),
  body('state').trim().notEmpty().withMessage('State is required.'),
  body('zipCode').trim().notEmpty().withMessage('Zip code is required.'),
  body('totalUnits').optional().isInt({ min: 0 }).withMessage('Total units must be a non-negative integer.'),
];
