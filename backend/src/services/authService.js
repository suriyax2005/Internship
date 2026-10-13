import { userRepository } from '../repositories/userRepository.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtUtils.js';
import { sendEmail } from '../config/mailer.js';
import crypto from 'crypto';

export const authService = {
  register: async ({ fullName, email, password, phone, role }) => {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists.');
    }

    const user = await userRepository.create({
      fullName,
      email,
      password,
      phone,
      role: role || 'LANDLORD',
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
  },

  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
  },

  refreshToken: async (token) => {
    if (!token) {
      throw new ApiError(401, 'Refresh token required.');
    }

    const decoded = verifyRefreshToken(token);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token.');
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  logout: async (userId) => {
    await userRepository.updateById(userId, { refreshToken: null });
    return true;
  },

  forgotPassword: async (email) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Return success to avoid email enumeration
      return true;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hash;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Smart Rental SaaS',
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
      text: `Reset your password here: ${resetUrl}`,
    });

    return true;
  },

  resetPassword: async (resetToken, newPassword) => {
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, 'Invalid or expired password reset token.');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return true;
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect.');
    }

    user.password = newPassword;
    await user.save();

    return true;
  },

  updateProfile: async (userId, updateData) => {
    const allowedFields = ['fullName', 'phone'];
    const filteredData = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const updatedUser = await userRepository.updateById(userId, filteredData);
    return updatedUser;
  },
};
