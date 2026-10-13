import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnits, createUnit, updateUnit, deleteUnit } from '../../store/slices/unitSlice';
import { fetchProperties } from '../../store/slices/propertySlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';
import { Home, Plus, Trash2, Edit3, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

export const Units = () => {
  const dispatch = useDispatch();
  const { list: units, loading } = useSelector((state) => state.units);
  const { list: properties } = useSelector((state) => state.properties);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchUnits());
    dispatch(fetchProperties());
  }, [dispatch]);

  const onAddUnit = async (data) => {
    const res = await dispatch(createUnit(data));
    if (createUnit.fulfilled.match(res)) {
      reset();
      setIsModalOpen(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateUnit({ id, data: { status: newStatus } }));
  };

  const handleDeleteUnit = (id) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      dispatch(deleteUnit(id));
    }
  };

  const filteredUnits = selectedPropertyFilter
    ? units.filter((u) => u.propertyId?._id === selectedPropertyFilter || u.propertyId === selectedPropertyFilter)
    : units;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Unit Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage unit floors, rent rates, security deposit amounts, and availability statuses.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center space-x-2 w-full sm:w-auto hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Unit</span>
        </button>
      </div>

      {/* Property Filter Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl flex items-center space-x-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
        <div className="pl-3">
          <Filter className="w-5 h-5 text-slate-400" />
        </div>
        <select
          value={selectedPropertyFilter}
          onChange={(e) => setSelectedPropertyFilter(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none py-2 pr-4 appearance-none cursor-pointer"
        >
          <option value="" className="text-slate-900">All Properties</option>
          {properties.map((p) => (
            <option key={p._id} value={p._id} className="text-slate-900">
              {p.propertyName} ({p.city})
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading unit records..." />
      ) : filteredUnits.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 text-center rounded-3xl space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Units Available</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Add units to your properties to assign tenants, track rent, and handle maintenance.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 px-6 py-2.5 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 rounded-xl font-semibold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
            Create First Unit
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="py-4 px-6 font-semibold">Unit #</th>
                  <th className="py-4 px-6 font-semibold">Property</th>
                  <th className="py-4 px-6 font-semibold">Floor</th>
                  <th className="py-4 px-6 font-semibold">Monthly Rent</th>
                  <th className="py-4 px-6 font-semibold">Security Deposit</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUnits.map((unit) => (
                  <tr key={unit._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {unit.unitNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">
                      {unit.propertyId?.propertyName || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {unit.floor || 1}
                    </td>
                    <td className="py-4 px-6 text-slate-900 dark:text-white font-semibold">
                      {formatCurrency(unit.rentAmount)}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {formatCurrency(unit.depositAmount)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-2">
                        <StatusBadge status={unit.status} />
                        <select
                          value={unit.status}
                          onChange={(e) => handleStatusChange(unit._id, e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] font-semibold focus:outline-none cursor-pointer py-1 px-1 text-slate-600 dark:text-slate-300 max-w-[120px]"
                        >
                          <option value="VACANT">Set VACANT</option>
                          <option value="OCCUPIED">Set OCCUPIED</option>
                          <option value="MAINTENANCE">Set MAINTENANCE</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteUnit(unit._id)}
                          className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="Delete Unit"
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

      {/* Add Unit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Unit to Property">
        <form onSubmit={handleSubmit(onAddUnit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Property *
            </label>
            <select
              {...register('propertyId', { required: 'Property selection is required' })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">Select a Property...</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.propertyName}
                </option>
              ))}
            </select>
            {errors.propertyId && <p className="text-xs text-rose-500 mt-1">{errors.propertyId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit Number / Suite *
              </label>
              <input
                type="text"
                {...register('unitNumber', { required: 'Unit number is required' })}
                placeholder="Apt 101"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
              {errors.unitNumber && <p className="text-xs text-rose-500 mt-1">{errors.unitNumber.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Floor
              </label>
              <input
                type="number"
                {...register('floor')}
                defaultValue={1}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Rent Amount ($) *
              </label>
              <input
                type="number"
                {...register('rentAmount', { required: 'Rent amount is required' })}
                placeholder="2000"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Security Deposit ($) *
              </label>
              <input
                type="number"
                {...register('depositAmount', { required: 'Deposit amount is required' })}
                placeholder="2000"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Initial Status
            </label>
            <select
              {...register('status')}
              defaultValue="VACANT"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="VACANT">VACANT</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            Create Unit
          </button>
        </form>
      </Modal>
    </motion.div>
  );
};
