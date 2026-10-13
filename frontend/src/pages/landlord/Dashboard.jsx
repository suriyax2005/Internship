import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { motion } from 'framer-motion';
import {
  Building2,
  Home,
  DollarSign,
  AlertCircle,
  Wrench,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !stats) {
    return <LoadingSpinner text="Fetching SaaS analytics..." />;
  }

  const { summary, charts } = stats;

  const COLORS = ['#3366ff', '#10B981', '#F59E0B', '#EF4444'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const CustomTooltipStyle = {
    backgroundColor: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(12px)',
    borderColor: 'rgba(226, 232, 240, 0.5)',
    borderRadius: '16px',
    color: '#0f172a',
    boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.1)',
    padding: '12px 16px',
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* ═══════════ PREMIUM WELCOME BANNER ═══════════ */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 p-8 md:p-10 text-white shadow-premium"
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary/10 rounded-full blur-[60px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Dashboard Overview</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 font-display">
              Welcome back to <span className="gradient-text-brand">SmartRental</span>
            </h1>
            <p className="text-white/40 max-w-xl text-sm leading-relaxed">
              Here's what's happening with your properties today. You have <span className="font-bold text-white/80">{summary.openTickets}</span> maintenance requests requiring attention.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button className="group px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-sm flex items-center space-x-2">
              <span>View Reports</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ═══════════ KPI STAT CARDS ═══════════ */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Properties"
            value={summary.totalProperties}
            icon={Building2}
            color="brand"
            subtitle={`${summary.totalUnits} Total Units`}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Occupancy Rate"
            value={`${summary.occupancyRate}%`}
            icon={Home}
            color="success"
            subtitle={`${summary.occupiedUnits} Occupied / ${summary.vacantUnits} Vacant`}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(summary.totalRevenue)}
            icon={DollarSign}
            color="secondary"
            trend={{ positive: true, value: '+12%', label: 'vs last month' }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Pending Rent"
            value={formatCurrency(summary.pendingRent)}
            icon={AlertCircle}
            color="warning"
            subtitle={`${summary.openTickets} Open Tickets`}
          />
        </motion.div>
      </motion.div>

      {/* ═══════════ CHARTS GRID ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Trend Line Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card-premium p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Revenue Collection</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Total rent collected across all properties</p>
            </div>
            <div className="p-2.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl ring-1 ring-brand-500/10">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.monthlyRevenue} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3366ff" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#3366ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                  contentStyle={CustomTooltipStyle}
                  itemStyle={{ color: '#3366ff' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3366ff"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{ r: 4, fill: '#ffffff', stroke: '#3366ff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#3366ff', stroke: '#ffffff', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Occupancy Donut Chart */}
        <motion.div variants={itemVariants} className="glass-card-premium p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Unit Occupancy</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Current status distribution</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.occupancy}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {charts.occupancy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CustomTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col space-y-2.5 pt-4 border-t border-slate-100/80 dark:border-slate-800/40">
            {charts.occupancy.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Maintenance Tickets Bar Chart */}
      <motion.div variants={itemVariants} className="glass-card-premium p-6 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Maintenance Tickets</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Distribution of active tenant repair tickets by priority</p>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl ring-1 ring-amber-500/10">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.ticketPriority} margin={{ top: 20, right: 0, bottom: 0, left: 0 }} barSize={40}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="priority" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(226, 232, 240, 0.2)' }}
                contentStyle={CustomTooltipStyle}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};
