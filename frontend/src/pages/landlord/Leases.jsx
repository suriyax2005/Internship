import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeases, createLease, updateLease, deleteLease } from '../../store/slices/leaseSlice';
import { fetchTenants } from '../../store/slices/tenantSlice';
import { fetchUnits } from '../../store/slices/unitSlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

export const Leases = () => {
  const dispatch = useDispatch();
  const { list: leases, loading } = useSelector((state) => state.leases);
  const { list: tenants } = useSelector((state) => state.tenants);
  const { list: units } = useSelector((state) => state.units);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchLeases());
    dispatch(fetchTenants());
    dispatch(fetchUnits());
  }, [dispatch]);

  const onAddLease = async (data) => {
    const res = await dispatch(createLease(data));
    if (createLease.fulfilled.match(res)) {
      reset();
      setIsModalOpen(false);
    }
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateLease({ id, data: { status } }));
  };

  const handleDeleteLease = (id) => {
    if (window.confirm('Are you sure you want to terminate/delete this lease contract?')) {
      dispatch(deleteLease(id));
    }
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
            Lease Agreements
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Contract terms, start & expiration dates, monthly rent, and security deposits.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center space-x-2 w-full sm:w-auto hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>New Lease Agreement</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading lease contracts..." />
      ) : leases.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 text-center rounded-3xl space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Leases Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Create a lease agreement to start tracking rent payments and managing terms.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 px-6 py-2.5 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 rounded-xl font-semibold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
            Create First Lease
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="py-4 px-6 font-semibold">Tenant Name</th>
                  <th className="py-4 px-6 font-semibold">Unit / Property</th>
                  <th className="py-4 px-6 font-semibold">Rent / Month</th>
                  <th className="py-4 px-6 font-semibold">Security Deposit</th>
                  <th className="py-4 px-6 font-semibold">Start Date</th>
                  <th className="py-4 px-6 font-semibold">End Date</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {leases.map((lease) => (
                  <tr key={lease._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center font-bold text-xs">
                         {lease.tenantProfileId?.fullName ? lease.tenantProfileId.fullName.charAt(0).toUpperCase() : 'T'}
                       </div>
                       <span>{lease.tenantProfileId?.fullName || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">{lease.unitId?.unitNumber || 'N/A'}</span>{' '}
                      <span className="text-xs text-slate-400">
                        ({lease.unitId?.propertyId?.propertyName || 'Property'})
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-900 dark:text-white font-semibold">
                      {formatCurrency(lease.rentAmount)}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {formatCurrency(lease.securityDeposit)}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {formatDate(lease.startDate)}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {formatDate(lease.endDate)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-2">
                        <StatusBadge status={lease.status} />
                        <select
                          value={lease.status}
                          onChange={(e) => handleStatusChange(lease._id, e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] font-semibold focus:outline-none cursor-pointer py-1 px-1 text-slate-600 dark:text-slate-300 max-w-[120px]"
                        >
                          <option value="ACTIVE">Set ACTIVE</option>
                          <option value="EXPIRED">Set EXPIRED</option>
                          <option value="TERMINATED">Set TERMINATED</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteLease(lease._id)}
                          className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="Terminate Lease"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create Lease Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Lease Contract">
        <form onSubmit={handleSubmit(onAddLease)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Tenant *
            </label>
            <select
              {...register('tenantProfileId', { required: 'Tenant is required' })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">Select a Tenant Profile...</option>
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
              Select Unit *
            </label>
            <select
              {...register('unitId', { required: 'Unit is required' })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">Select Unit...</option>
              {units.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.unitNumber} - {u.propertyId?.propertyName || 'Property'} (${u.rentAmount}/mo)
                </option>
              ))}
            </select>
            {errors.unitId && <p className="text-xs text-rose-500 mt-1">{errors.unitId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Rent Amount ($) *
              </label>
              <input
                type="number"
                {...register('rentAmount', { required: 'Rent amount is required' })}
                placeholder="2400"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Security Deposit ($) *
              </label>
              <input
                type="number"
                {...register('securityDeposit', { required: 'Security deposit is required' })}
                placeholder="2400"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lease Start Date *
              </label>
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lease End Date *
              </label>
              <input
                type="date"
                {...register('endDate', { required: 'End date is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            Create Lease Contract
          </button>
        </form>
      </Modal>
    </motion.div>
  );
};
