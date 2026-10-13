import { body } from 'express-validator';

export const documentValidator = [
  body('title').optional().trim().notEmpty().withMessage('Document title cannot be empty.'),
  body('documentType')
    .optional()
    .isIn(['LEASE', 'TENANT', 'PROPERTY', 'RECEIPT', 'OTHER'])
    .withMessage('Invalid document type.'),
];
