import { paymentService } from '../services/paymentService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body, req.user);
    return ApiResponse.success(res, 'Payment recorded successfully', payment, 201);
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const tenantProfileId = req.query.tenantProfileId || null;
    const payments = await paymentService.getPayments(req.tenantFilter, tenantProfileId);
    return ApiResponse.success(res, 'Payments retrieved successfully', payments);
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Payment details retrieved', payment);
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const payment = await paymentService.updatePayment(req.params.id, req.tenantFilter, req.body);
    return ApiResponse.success(res, 'Payment updated successfully', payment);
  } catch (error) {
    next(error);
  }
};

export const generateMonthlyRent = async (req, res, next) => {
  try {
    const result = await paymentService.generateMonthlyRent(req.tenantFilter, req.user);
    return ApiResponse.success(res, 'Monthly rent payments generated', result);
  } catch (error) {
    next(error);
  }
};

export const getReceipt = async (req, res, next) => {
  try {
    const receipt = await paymentService.generateReceipt(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Payment receipt generated', receipt);
  } catch (error) {
    next(error);
  }
};

export const createPaymentIntent = async (req, res, next) => {
  try {
    const intentData = await paymentService.createPaymentIntent(req.params.id, req.tenantFilter, req.user);
    return ApiResponse.success(res, 'Payment intent created successfully', intentData);
  } catch (error) {
    next(error);
  }
};

export const confirmStripePayment = async (req, res, next) => {
  try {
    const { paymentIntentId, paymentMethod } = req.body;
    const payment = await paymentService.confirmStripePayment(
      req.params.id,
      req.tenantFilter,
      paymentIntentId,
      paymentMethod
    );
    return ApiResponse.success(res, 'Payment processed and confirmed successfully', payment);
  } catch (error) {
    next(error);
  }
};

export const stripeWebhook = async (req, res, next) => {
  try {
    const event = req.body;
    await paymentService.handleStripeWebhook(event);
    return res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
