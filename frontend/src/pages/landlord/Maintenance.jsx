import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, createTicket, updateTicket, deleteTicket } from '../../store/slices/maintenanceSlice';
import { fetchProperties } from '../../store/slices/propertySlice';
import { fetchTenants } from '../../store/slices/tenantSlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Wrench, Plus, Trash2, AlertTriangle, CheckCircle2, LayoutGrid, Kanban } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

export const Maintenance = () => {
  const dispatch = useDispatch();
  const { list: tickets, loading } = useSelector((state) => state.maintenance);
  const { list: properties } = useSelector((state) => state.properties);
  const { list: tenants } = useSelector((state) => state.tenants);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'cards' | 'kanban'
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(fetchProperties());
    dispatch(fetchTenants());
  }, [dispatch]);

  const onAddTicket = async (data) => {
    const res = await dispatch(createTicket(data));
    if (createTicket.fulfilled.match(res)) {
      reset();
      setIsModalOpen(false);
    }
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateTicket({ id, data: { status } }));
  };

  const handlePriorityChange = (id, priority) => {
    dispatch(updateTicket({ id, data: { priority } }));
  };

  const confirmDelete = () => {
    if (ticketToDelete) {
      dispatch(deleteTicket(ticketToDelete));
      setTicketToDelete(null);
    }
  };

  const filteredTickets = statusFilter
    ? tickets.filter((t) => t.status === statusFilter)
    : tickets;

  const KANBAN_COLUMNS = [
    { id: 'OPEN', label: 'Open', color: 'border-amber-500/50 bg-amber-500/5' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-500/50 bg-blue-500/5' },
    { id: 'RESOLVED', label: 'Resolved', color: 'border-emerald-500/50 bg-emerald-500/5' },
    { id: 'CLOSED', label: 'Closed', color: 'border-slate-500/50 bg-slate-500/5' },
  ];

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
            Maintenance Tickets
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track unit repair requests, set priority urgency, and update resolution statuses in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center space-x-2 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === st
                ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {st ? st.replace('_', ' ') : 'All Statuses'}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading maintenance tickets..." />
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 text-center rounded-3xl space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Maintenance Tickets</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">There are currently no maintenance tickets matching your filter criteria.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 px-6 py-2.5 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 rounded-xl font-semibold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
            Create New Ticket
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {KANBAN_COLUMNS.map((col) => {
            const colTickets = filteredTickets.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`flex flex-col rounded-3xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-sm ${col.color.replace('bg-', 'bg-opacity-10 dark:bg-opacity-5 bg-').split(' ')[1]}`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {col.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[10px] font-black shadow-sm text-slate-700 dark:text-slate-300">
                      {colTickets.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1 pb-2">
                  {colTickets.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
                      Empty column
                    </div>
                  ) : (
                    colTickets.map((ticket, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        whileHover={{ y: -2 }}
                        key={ticket._id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm space-y-3 group hover:border-brand-500/30 dark:hover:border-brand-500/30 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {ticket.title}
                          </h4>
                          <button
                            onClick={() => setTicketToDelete(ticket._id)}
                            className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {ticket.description}
                        </p>

                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg inline-block">
                          {ticket.propertyId?.propertyName} • Unit {ticket.unitId?.unitNumber || 'N/A'}
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${
                              ticket.priority === 'HIGH'
                                ? 'bg-danger/10 text-danger'
                                : ticket.priority === 'MEDIUM'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {ticket.priority}
                          </span>

                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                            className="text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-500 transition-colors shadow-sm cursor-pointer"
                          >
                            <option value="OPEN">Move to Open</option>
                            <option value="IN_PROGRESS">Move to Progress</option>
                            <option value="RESOLVED">Move to Resolved</option>
                            <option value="CLOSED">Move to Closed</option>
                          </select>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              key={ticket._id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {ticket.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {ticket.propertyId?.propertyName} - Unit {ticket.unitId?.unitNumber || 'N/A'}
                    </p>
                  </div>

                  <button
                    onClick={() => setTicketToDelete(ticket._id)}
                    className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                  {ticket.description}
                </p>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-slate-500">Tenant:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    {ticket.tenantProfileId?.fullName || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Priority</label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => handlePriorityChange(ticket._id, e.target.value)}
                    className={`text-xs font-bold rounded-lg px-2 py-1 focus:outline-none cursor-pointer ${
                      ticket.priority === 'HIGH'
                        ? 'bg-danger/10 text-danger'
                        : ticket.priority === 'MEDIUM'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <div className="text-right">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-500 cursor-pointer shadow-sm"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!ticketToDelete}
        title="Delete Maintenance Ticket"
        message="Are you sure you want to permanently remove this maintenance ticket? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setTicketToDelete(null)}
      />

      {/* Create Ticket Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Maintenance Ticket">
        <form onSubmit={handleSubmit(onAddTicket)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ticket Title *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. Water Leak in Bathroom"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Property *
              </label>
              <select
                {...register('propertyId', { required: 'Property selection is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="">Select Property...</option>
                {properties.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.propertyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tenant Profile *
              </label>
              <select
                {...register('tenantProfileId', { required: 'Tenant profile required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="">Select Tenant...</option>
                {tenants.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Priority Urgency
            </label>
            <select
              {...register('priority')}
              defaultValue="MEDIUM"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH (Urgent)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              placeholder="Detailed description of the issue..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            Create Ticket
          </button>
        </form>
      </Modal>
    </motion.div>
  );
};
