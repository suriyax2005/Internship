import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, color = 'brand', trend, subtitle }) => {
  const colorMap = {
    brand: {
      icon: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-50 dark:bg-brand-500/10',
      glow: 'shadow-brand-500/8',
      gradient: 'from-brand-500/10 to-brand-600/5',
      ring: 'ring-brand-500/10',
    },
    secondary: {
      icon: 'text-secondary',
      bg: 'bg-secondary/10',
      glow: 'shadow-secondary/8',
      gradient: 'from-secondary/10 to-secondary/5',
      ring: 'ring-secondary/10',
    },
    success: {
      icon: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      glow: 'shadow-emerald-500/8',
      gradient: 'from-emerald-500/10 to-emerald-600/5',
      ring: 'ring-emerald-500/10',
    },
    warning: {
      icon: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      glow: 'shadow-amber-500/8',
      gradient: 'from-amber-500/10 to-amber-600/5',
      ring: 'ring-amber-500/10',
    },
    danger: {
      icon: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      glow: 'shadow-rose-500/8',
      gradient: 'from-rose-500/10 to-rose-600/5',
      ring: 'ring-rose-500/10',
    },
  };

  const styles = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="glass-card-premium p-6 rounded-2xl relative overflow-hidden group cursor-default"
    >
      {/* Subtle gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
            {title}
          </p>
          <h3 className="text-3xl font-black mt-2.5 text-slate-900 dark:text-white tracking-tight font-sans">
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${styles.bg} ring-1 ${styles.ring} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`w-5 h-5 ${styles.icon}`} />
          </div>
        )}
      </div>

      {trend && (
        <div className="relative mt-5 pt-4 border-t border-slate-100/80 dark:border-slate-800/60 flex items-center text-xs">
          <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full ${
            trend.positive 
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="font-bold">{trend.value}</span>
          </div>
          <span className="text-slate-400 dark:text-slate-500 ml-2 font-medium">{trend.label}</span>
        </div>
      )}

      {/* Premium shimmer on hover */}
      <div className="stat-card-shimmer absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};
