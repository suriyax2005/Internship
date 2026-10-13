import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { BarChart3, DollarSign, Home, Wrench, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Reports = () => {
  const [reportType, setReportType] = useState('financial');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let endpoint = '/reports/financial';
      if (reportType === 'occupancy') endpoint = '/reports/occupancy';
      if (reportType === 'maintenance') endpoint = '/reports/maintenance';

      const res = await api.get(endpoint);
      setData(res.data.data);
    } catch (err) {
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial & Operational Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Export comprehensive revenue, occupancy rate, and maintenance audit summaries.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => setReportType('financial')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            reportType === 'financial'
              ? 'bg-brand-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financial Revenue Report</span>
        </button>

        <button
          onClick={() => setReportType('occupancy')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            reportType === 'occupancy'
              ? 'bg-brand-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Occupancy Audit</span>
        </button>

        <button
          onClick={() => setReportType('maintenance')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            reportType === 'maintenance'
              ? 'bg-brand-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Analytics</span>
        </button>
      </div>

      {/* Content */}
      {loading || !data ? (
        <LoadingSpinner text="Generating report analytics..." />
      ) : (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {reportType === 'financial' && (
              <>
                <div className="glass-panel p-6 rounded-3xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Collected</p>
                  <p className="text-2xl font-black text-emerald-500 mt-1">
                    {formatCurrency(data.summary.totalCollected)}
                  </p>
                </div>
                <div className="glass-panel p-6 rounded-3xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Pending</p>
                  <p className="text-2xl font-black text-amber-500 mt-1">
                    {formatCurrency(data.summary.totalPending)}
                  </p>
                </div>
                <div className="glass-panel p-6 rounded-3xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Overdue</p>
                  <p className="text-2xl font-black text-rose-500 mt-1">
                    {formatCurrency(data.summary.totalOverdue)}
                  </p>
                </div>
              </>
            )}

            {reportType === 'occupancy' && (
              <>
                <div className="glass-panel p-6 rounded-3xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Occupancy Rate</p>
                  <p className="text-2xl font-black text-brand-500 mt-1">{data.summary.occupancyRate}%</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Occupied Units</p>
                  <p className="text-2xl font-black text-emerald-500 mt-1">{data.summary.occupiedUnits}</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Vacant Units</p>
                  <p className="text-2xl font-black text-amber-500 mt-1">{data.summary.vacantUnits}</p>
                </div>
              </>
            )}

            {reportType === 'maintenance' && (
              <>
                <div className="glass-panel p-6 rounded-3xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Requests</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {data.summary.totalTickets}
                  </p>
                </div>
                <div className="glass-panel p-6 rounded-3xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Open / In Progress</p>
                  <p className="text-2xl font-black text-amber-500 mt-1">
                    {data.summary.openTickets + data.summary.inProgressTickets}
                  </p>
                </div>
                <div className="glass-panel p-6 rounded-3xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Resolved</p>
                  <p className="text-2xl font-black text-emerald-500 mt-1">{data.summary.resolvedTickets}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
