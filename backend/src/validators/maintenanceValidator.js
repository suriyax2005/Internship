import { body } from 'express-validator';

export const maintenanceValidator = [
  body('title').trim().notEmpty().withMessage('Ticket title is required.'),
  body('description').trim().notEmpty().withMessage('Ticket description is required.'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority.'),
  body('status')
    .optional()
    .isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
    .withMessage('Invalid status.'),
];
