import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayments, createPayment, updatePayment, generateMonthlyRent } from '../../store/slices/paymentSlice';
import { fetchTenants } from '../../store/slices/tenantSlice';
import { fetchLeases } from '../../store/slices/leaseSlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { exportToCSV } from '../../utils/csvExport';
import { CreditCard, Plus, RefreshCw, FileText, CheckCircle, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export const Payments = () => {
  const dispatch = useDispatch();
  const { list: payments, loading } = useSelector((state) => state.payments);
  const { list: tenants } = useSelector((state) => state.tenants);
  const { list: leases } = useSelector((state) => state.leases);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptModalData, setReceiptModalData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchTenants());
    dispatch(fetchLeases());
  }, [dispatch]);

  const onAddPayment = async (data) => {
    const res = await dispatch(createPayment(data));
    if (createPayment.fulfilled.match(res)) {
      reset();
      setIsModalOpen(false);
    }
  };

  const handleGenerateMonthlyRent = () => {
    if (window.confirm('Generate upcoming monthly rent payments for all active leases?')) {
      dispatch(generateMonthlyRent());
    }
  };

  const handleStatusChange = (id, paymentStatus) => {
    dispatch(updatePayment({ id, data: { paymentStatus } }));
  };

  const handleViewReceipt = async (paymentId) => {
    try {
      const res = await api.get(`/payments/${paymentId}/receipt`);
      setReceiptModalData(res.data.data);
    } catch (err) {
      toast.error('Failed to load receipt.');
    }
  };

  const handleExportCSV = () => {
    const formatted = payments.map((p) => ({
      tenant: p.tenantProfileId?.fullName || 'N/A',
      unit: p.leaseId?.unitId?.unitNumber || 'N/A',
      amount: p.amount,
      dueDate: formatDate(p.dueDate),
      paidDate: formatDate(p.paidDate),
      method: p.paymentMethod || 'ONLINE',
      status: p.paymentStatus,
    }));
    exportToCSV('payments_records', formatted, [
      { key: 'tenant', label: 'Tenant' },
      { key: 'unit', label: 'Unit' },
      { key: 'amount', label: 'Amount ($)' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'paidDate', label: 'Paid Date' },
      { key: 'method', label: 'Method' },
      { key: 'status', label: 'Status' },
    ]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Rent & Payment Records
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track paid, pending, and overdue rent payments, generate monthly invoices, and view receipts.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-wrap gap-3">
          {payments.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={handleGenerateMonthlyRent}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold transition-all flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Monthly Rent</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center space-x-2 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading payment ledger..." />
      ) : payments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 text-center rounded-3xl space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Payments Recorded</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Generate monthly rent or record a payment transaction to begin tracking cash flow.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 px-6 py-2.5 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 rounded-xl font-semibold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
            Record First Payment
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="py-4 px-6 font-semibold">Tenant Name</th>
                  <th className="py-4 px-6 font-semibold">Property / Unit</th>
                  <th className="py-4 px-6 font-semibold">Amount</th>
                  <th className="py-4 px-6 font-semibold">Due Date</th>
                  <th className="py-4 px-6 font-semibold">Paid Date</th>
                  <th className="py-4 px-6 font-semibold">Method</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 text-right font-semibold">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center font-bold text-xs">
                        {payment.tenantProfileId?.fullName ? payment.tenantProfileId.fullName.charAt(0).toUpperCase() : 'T'}
                      </div>
                      <span>{payment.tenantProfileId?.fullName || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">{payment.leaseId?.unitId?.unitNumber || 'N/A'}</span>{' '}
                      <span className="text-xs text-slate-400">
                        ({payment.leaseId?.unitId?.propertyId?.propertyName || 'Property'})
                      </span>
                    </td>
                    <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {formatDate(payment.dueDate)}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {formatDate(payment.paidDate)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-semibold">
                        {payment.paymentMethod?.replace('_', ' ') || 'ONLINE'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-2">
                        <StatusBadge status={payment.paymentStatus} />
                        <select
                          value={payment.paymentStatus}
                          onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] font-semibold focus:outline-none cursor-pointer py-1 px-1 text-slate-600 dark:text-slate-300 max-w-[120px]"
                        >
                          <option value="PAID">Set PAID</option>
                          <option value="PENDING">Set PENDING</option>
                          <option value="OVERDUE">Set OVERDUE</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleViewReceipt(payment._id)}
                          className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg transition-colors"
                          title="View Official Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Payment Transaction">
        <form onSubmit={handleSubmit(onAddPayment)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Tenant *
            </label>
            <select
              {...register('tenantProfileId', { required: 'Tenant selection required' })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">Select Tenant...</option>
              {tenants.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.fullName} ({t.email})
                </option>
              ))}
            </select>
            {errors.tenantProfileId && <p className="text-xs text-rose-500 mt-1">{errors.tenantProfileId.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Lease Contract *
            </label>
            <select
              {...register('leaseId', { required: 'Lease selection required' })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">Select Active Lease...</option>
              {leases.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.tenantProfileId?.fullName} - Unit {l.unitId?.unitNumber} (${l.rentAmount}/mo)
                </option>
              ))}
            </select>
            {errors.leaseId && <p className="text-xs text-rose-500 mt-1">{errors.leaseId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Amount ($) *
              </label>
              <input
                type="number"
                {...register('amount', { required: 'Amount required' })}
                placeholder="2400"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                {...register('dueDate', { required: 'Due date required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                {...register('paymentMethod')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="BANK_TRANSFER">Bank Wire Transfer</option>
                <option value="CASH">Cash</option>
                <option value="CHECK">Check</option>
                <option value="ONLINE">Online Portal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Status
              </label>
              <select
                {...register('paymentStatus')}
                defaultValue="PAID"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="OVERDUE">OVERDUE</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            Submit Payment Entry
          </button>
        </form>
      </Modal>

      {/* View Receipt Modal */}
      {receiptModalData && (
        <Modal
          isOpen={!!receiptModalData}
          onClose={() => setReceiptModalData(null)}
          title="Payment Receipt"
        >
          <div className="space-y-6 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">Smart Rental SaaS</h4>
                <p className="text-xs text-slate-500">Official Payment Receipt</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">Receipt #</span>
                <p className="text-sm font-mono font-bold text-brand-500">{receiptModalData.receiptNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400">Tenant Name:</p>
                <p className="font-bold text-slate-900 dark:text-white">{receiptModalData.tenantName}</p>
              </div>
              <div>
                <p className="text-slate-400">Date Paid:</p>
                <p className="font-bold text-slate-900 dark:text-white">{formatDate(receiptModalData.date)}</p>
              </div>
              <div>
                <p className="text-slate-400">Property / Unit:</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {receiptModalData.propertyName} ({receiptModalData.unitNumber})
                </p>
              </div>
              <div>
                <p className="text-slate-400">Payment Method:</p>
                <p className="font-bold text-slate-900 dark:text-white">{receiptModalData.paymentMethod}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Total Amount Paid</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(receiptModalData.amount)}
              </span>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Print / Save Receipt
            </button>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};
