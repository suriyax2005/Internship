import { authService } from '../services/authService.js';
import { ApiResponse } from '../utils/apiResponse.js';

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res.cookie('refreshToken', result.refreshToken, getCookieOptions());

    return ApiResponse.success(res, 'User registered successfully', result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res.cookie('refreshToken', result.refreshToken, getCookieOptions());

    return ApiResponse.success(res, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await authService.logout(req.user._id);
    }
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });
    return ApiResponse.success(res, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const result = await authService.refreshToken(token);

    res.cookie('refreshToken', result.refreshToken, getCookieOptions());

    return ApiResponse.success(res, 'Token refreshed successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    return ApiResponse.success(res, 'Profile retrieved successfully', req.user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    return ApiResponse.success(res, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    return ApiResponse.success(
      res,
      'If an account exists with that email, a password reset link has been sent.'
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.params.token, req.body.newPassword);
    return ApiResponse.success(res, 'Password reset successful. You can now log in.');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(
      req.user._id,
      req.body.currentPassword,
      req.body.newPassword
    );
    return ApiResponse.success(res, 'Password changed successfully.');
  } catch (error) {
    next(error);
  }
};
