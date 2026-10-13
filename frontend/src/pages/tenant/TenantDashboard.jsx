import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Home, CreditCard, Wrench, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TenantDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !stats) {
    return <LoadingSpinner text="Accessing your tenant portal..." />;
  }

  const { profile, pendingPaymentsCount, openTicketsCount, recentPayments, recentTickets } = stats;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl bg-gradient-to-r from-brand-900/60 to-slate-900 border border-brand-500/20 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Tenant Resident Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            Welcome back, {profile?.fullName || 'Resident'}!
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Unit: <span className="font-bold text-white">{profile?.unitId?.unitNumber || 'Unassigned'}</span> |{' '}
            {profile?.unitId?.propertyId?.propertyName || 'Property'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/tenant/my-maintenance"
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center space-x-2"
          >
            <Wrench className="w-4 h-4" />
            <span>Submit Maintenance Ticket</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Assigned Unit"
          value={profile?.unitId?.unitNumber || 'None'}
          icon={Home}
          color="emerald"
          subtitle={profile?.unitId?.propertyId?.propertyName || 'No property linked'}
        />
        <StatCard
          title="Pending Payments"
          value={pendingPaymentsCount}
          icon={CreditCard}
          color="amber"
          subtitle="Rent payments awaiting settlement"
        />
        <StatCard
          title="Active Maintenance Requests"
          value={openTicketsCount}
          icon={Wrench}
          color="purple"
          subtitle="Tickets open or in progress"
        />
      </div>

      {/* Recent Payments & Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Rent Payments */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Rent Payments</h3>
            <Link to="/tenant/my-payments" className="text-xs text-brand-500 font-bold hover:underline">
              View All
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No recent payment activity.</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div
                  key={p._id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.amount)}</p>
                    <p className="text-slate-400">Due: {formatDate(p.dueDate)}</p>
                  </div>
                  <StatusBadge status={p.paymentStatus} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Maintenance Tickets */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Maintenance Tickets</h3>
            <Link to="/tenant/my-maintenance" className="text-xs text-brand-500 font-bold hover:underline">
              View All
            </Link>
          </div>

          {recentTickets.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No maintenance tickets submitted.</p>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((t) => (
                <div
                  key={t._id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{t.title}</p>
                    <p className="text-slate-400">Priority: {t.priority}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
