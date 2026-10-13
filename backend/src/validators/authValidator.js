import { body } from 'express-validator';

export const registerValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required.'),
  body('email').isEmail().withMessage('Valid email address is required.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('role').optional().isIn(['LANDLORD', 'TENANT', 'SUPER_ADMIN']).withMessage('Invalid role specified.'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email address is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email address is required.').normalizeEmail(),
];

export const resetPasswordValidator = [
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.'),
];

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.'),
];

export const updateProfileValidator = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty.'),
  body('phone').optional().trim(),
];
