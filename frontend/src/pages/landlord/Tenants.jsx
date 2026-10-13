import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTenants, createTenant, deleteTenant } from '../../store/slices/tenantSlice';
import { fetchUnits } from '../../store/slices/unitSlice';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import { Users, Plus, Trash2, Mail, Phone, Home } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

export const Tenants = () => {
  const dispatch = useDispatch();
  const { list: tenants, loading } = useSelector((state) => state.tenants);
  const { list: units } = useSelector((state) => state.units);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchTenants());
    dispatch(fetchUnits());
  }, [dispatch]);

  const onAddTenant = async (data) => {
    const res = await dispatch(createTenant(data));
    if (createTenant.fulfilled.match(res)) {
      reset();
      setIsModalOpen(false);
    }
  };

  const handleDeleteTenant = (id) => {
    if (window.confirm('Are you sure you want to remove this tenant profile?')) {
      dispatch(deleteTenant(id));
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
            Tenant Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View active tenants, unit allocations, contact details, and lease timelines.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center space-x-2 w-full sm:w-auto hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Register Tenant</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading tenant directory..." />
      ) : tenants.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 text-center rounded-3xl space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Tenants Enrolled</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Register new tenant accounts to issue lease agreements, collect rent, and handle maintenance.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 px-6 py-2.5 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 rounded-xl font-semibold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
            Register First Tenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              key={tenant._id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-secondary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-600/20">
                      {tenant.fullName ? tenant.fullName.charAt(0).toUpperCase() : 'T'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                        {tenant.fullName}
                      </h3>
                      <span className="inline-flex items-center space-x-1 bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                        <span>Active</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTenant(tenant._id)}
                    className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{tenant.email}</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{tenant.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Unit:</span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <Home className="w-4 h-4 text-brand-600" />
                      <span>
                        {tenant.unitId?.unitNumber || 'Unassigned'}
                      </span>
                    </span>
                  </div>
                  
                  {tenant.unitId?.propertyId?.propertyName && (
                     <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Property:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {tenant.unitId.propertyId.propertyName}
                      </span>
                    </div>
                  )}

                  {tenant.leaseStart && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Lease:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {tenant.emergencyContact && (
                <div className="mt-4 px-4 py-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-xs text-rose-700 dark:text-rose-400 relative z-10 flex items-start space-x-2">
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Emergency Contact</span>
                    <span>{tenant.emergencyContact}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Register Tenant Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Tenant Profile">
        <form onSubmit={handleSubmit(onAddTenant)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              {...register('fullName', { required: 'Full name is required' })}
              placeholder="Michael Jordan"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            />
            {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email address is required' })}
                placeholder="tenant@example.com"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                {...register('phone', { required: 'Phone number is required' })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assign Unit (Optional)
            </label>
            <select
              {...register('unitId')}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">Select a vacant unit...</option>
              {units.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.unitNumber} - {u.propertyId?.propertyName || 'Property'} (${u.rentAmount}/mo)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Government ID #
              </label>
              <input
                type="text"
                {...register('governmentId')}
                placeholder="SSN / Passport / License"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                {...register('emergencyContact')}
                placeholder="Name & Phone Number"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            Create Tenant Account
          </button>
        </form>
      </Modal>
    </motion.div>
  );
};
