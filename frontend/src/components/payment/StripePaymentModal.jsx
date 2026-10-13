import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const StripePaymentModal = ({ isOpen, onClose, payment, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmedPayment, setConfirmedPayment] = useState(null);

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardName, setCardName] = useState('Valued Tenant');

  if (!isOpen || !payment) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Payment Intent
      const intentRes = await api.post(`/payments/${payment._id}/create-payment-intent`);
      const { paymentIntentId } = intentRes.data.data;

      // 2. Confirm Payment
      const confirmRes = await api.post(`/payments/${payment._id}/confirm-payment`, {
        paymentIntentId,
        paymentMethod: 'CREDIT_CARD',
      });

      setSuccess(true);
      setConfirmedPayment(confirmRes.data.data);
      toast.success('Rent payment processed successfully!');
      if (onSuccess) onSuccess(confirmRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setConfirmedPayment(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-400/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Secure Rent Payment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>256-Bit SSL Encrypted & Powered by Stripe</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">Payment Confirmed!</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your payment of{' '}
              <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(payment.amount)}</span> has
              been settled successfully.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Receipt Number:</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  REC-{payment._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Date & Time:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Method:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">Credit Card (Stripe)</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Amount Summary */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex items-center justify-between shadow-lg shadow-brand-600/20">
              <div>
                <p className="text-xs text-brand-100 font-medium">Total Amount Due</p>
                <p className="text-2xl font-black tracking-tight">{formatCurrency(payment.amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-brand-100 font-medium">Due Date</p>
                <p className="text-sm font-semibold">{formatDate(payment.dueDate)}</p>
              </div>
            </div>

            {/* Credit Card Input Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    placeholder="4242 4242 4242 4242"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiration (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    placeholder="•••"
                  />
                </div>
              </div>
            </div>

            {/* Test demo credentials notice */}
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" />
              <span>Simulated demo credentials prefilled. Instant test payment settlement enabled.</span>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Pay {formatCurrency(payment.amount)} Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
