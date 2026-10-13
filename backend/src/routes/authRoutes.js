import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidator, validateRequest, updateProfile);
router.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validateRequest, resetPassword);
router.put('/change-password', authenticate, changePasswordValidator, validateRequest, changePassword);

export default router;
