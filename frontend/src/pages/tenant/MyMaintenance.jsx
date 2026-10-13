import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Wrench, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

export const MyMaintenance = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchTickets = async () => {
    try {
      const res = await api.get('/maintenance');
      setTickets(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onSubmitTicket = async (data) => {
    try {
      await api.post('/maintenance', data);
      toast.success('Maintenance request submitted');
      reset();
      setIsModalOpen(false);
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            My Maintenance Tickets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submit repair requests to your landlord and track real-time resolution status.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Report Issue</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading tickets..." />
      ) : tickets.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
          <Wrench className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Active Tickets</h3>
          <p className="text-xs text-slate-500">Report plumbing, electrical, or structural issues here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {ticket.title}
                  </h3>
                  <StatusBadge status={ticket.status} />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl">
                  {ticket.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Urgency:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{ticket.priority}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Issue Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Maintenance Ticket">
        <form onSubmit={handleSubmit(onSubmitTicket)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Issue Title *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. Leaking Faucet in Kitchen"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
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
              Detailed Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              placeholder="Describe what needs repair..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            Submit Maintenance Ticket
          </button>
        </form>
      </Modal>
    </div>
  );
};
