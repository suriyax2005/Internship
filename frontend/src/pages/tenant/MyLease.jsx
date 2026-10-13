import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FileText, Home, Calendar, ShieldCheck, DollarSign } from 'lucide-react';

export const MyLease = () => {
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLease = async () => {
      try {
        const res = await api.get('/leases');
        if (res.data.data.length > 0) {
          setLease(res.data.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getLease();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching lease contract details..." />;
  }

  if (!lease) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
        <FileText className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Active Lease Contract</h3>
        <p className="text-xs text-slate-500">Contact your landlord to issue your digital lease agreement.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          My Lease Agreement
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your official rental terms, monthly rate, deposit, and duration.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Contract Status</span>
            <div className="mt-1">
              <StatusBadge status={lease.status} />
            </div>
          </div>
          <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl">
            <FileText className="w-7 h-7" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 uppercase font-semibold">Property & Unit</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {lease.unitId?.unitNumber || 'N/A'} - {lease.unitId?.propertyId?.propertyName || 'Property'}
            </p>
            <p className="text-xs text-slate-500">{lease.unitId?.propertyId?.address || ''}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 uppercase font-semibold">Monthly Rent Amount</p>
            <p className="text-2xl font-extrabold text-emerald-500">{formatCurrency(lease.rentAmount)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 uppercase font-semibold">Security Deposit</p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {formatCurrency(lease.securityDeposit)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 uppercase font-semibold">Lease Term Duration</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
