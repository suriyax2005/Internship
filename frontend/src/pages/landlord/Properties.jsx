import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, createProperty } from '../../store/slices/propertySlice';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { exportToCSV } from '../../utils/csvExport';
import { Building, Plus, MapPin, Home, Search, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

export const Properties = () => {
  const dispatch = useDispatch();
  const { list: properties, loading } = useSelector((state) => state.properties);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const onAddProperty = async (data) => {
    const res = await dispatch(createProperty(data));
    if (createProperty.fulfilled.match(res)) {
      reset();
      setIsModalOpen(false);
    }
  };

  const handleExportCSV = () => {
    const formatted = properties.map((p) => ({
      propertyName: p.propertyName,
      propertyType: p.propertyType,
      address: p.address,
      city: p.city,
      state: p.state,
      zipCode: p.zipCode,
      totalUnits: p.totalUnits || 0,
    }));
    exportToCSV('properties_portfolio', formatted, [
      { key: 'propertyName', label: 'Property Name' },
      { key: 'propertyType', label: 'Type' },
      { key: 'address', label: 'Address' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'zipCode', label: 'Zip Code' },
      { key: 'totalUnits', label: 'Total Units' },
    ]);
  };

  const filteredProperties = properties.filter(
    (p) =>
      p.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Properties
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your rental buildings, complexes, and commercial spaces.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {properties.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center space-x-2 w-full sm:w-auto hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl flex items-center space-x-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
        <div className="pl-3">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by property name or city..."
          className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none py-2 pr-4"
        />
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading property catalog..." />
      ) : filteredProperties.length === 0 ? (
        <EmptyState
          icon={Building}
          title="No Properties Found"
          description="Get started by creating your first rental property or adjust your search filter."
          actionLabel="Add New Property"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              key={property._id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group"
            >
              <div>
                <div className="h-56 w-full bg-slate-800 relative overflow-hidden">
                  <img
                    src={
                      property.images?.[0] ||
                      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={property.propertyName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
                  <span className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {property.propertyType}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {property.propertyName}
                  </h3>

                  <div className="flex items-start text-sm text-slate-500 dark:text-slate-400 space-x-2">
                    <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">
                      {property.address}, {property.city}, {property.state} {property.zipCode}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {property.description || 'Premium residential property with modern amenities and features.'}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <div className="p-1.5 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <Home className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <span>{property.totalUnits || 0} Units</span>
                </div>
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  <span>Active</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Property">
        <form onSubmit={handleSubmit(onAddProperty)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Property Name *
            </label>
            <input
              type="text"
              {...register('propertyName', { required: 'Property name is required' })}
              placeholder="e.g. Grand Heights Apartments"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            />
            {errors.propertyName && <p className="text-xs text-rose-500 mt-1">{errors.propertyName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                {...register('propertyType')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Apartment">Apartment Complex</option>
                <option value="Commercial">Commercial Plaza</option>
                <option value="Single Family">Single Family Home</option>
                <option value="Villa">Villa / Townhouse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Units
              </label>
              <input
                type="number"
                {...register('totalUnits')}
                defaultValue={1}
                min={0}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Address *
            </label>
            <input
              type="text"
              {...register('address', { required: 'Address is required' })}
              placeholder="123 Main Street"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City *</label>
              <input
                type="text"
                {...register('city', { required: 'City is required' })}
                placeholder="Seattle"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">State *</label>
              <input
                type="text"
                {...register('state', { required: 'State is required' })}
                placeholder="WA"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Zip Code *</label>
              <input
                type="text"
                {...register('zipCode', { required: 'Zip code is required' })}
                placeholder="98101"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Property details and amenities..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            Create Property
          </button>
        </form>
      </Modal>
    </div>
  );
};
