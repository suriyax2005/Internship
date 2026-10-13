import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const getStyle = (val) => {
    switch (val.toUpperCase()) {
      case 'VACANT':
      case 'RESOLVED':
      case 'CLOSED':
      case 'PAID':
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

      case 'OCCUPIED':
      case 'IN_PROGRESS':
      case 'PENDING':
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';

      case 'MAINTENANCE':
      case 'OVERDUE':
      case 'HIGH':
      case 'EXPIRED':
      case 'TERMINATED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';

      case 'OPEN':
      case 'LOW':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  const label = status.replace('_', ' ');

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle(
        status
      )} capitalize tracking-wide transition-all`}
    >
      {label}
    </span>
  );
};
