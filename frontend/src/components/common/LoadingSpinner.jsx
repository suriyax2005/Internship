import React from 'react';

export const LoadingSpinner = ({ fullScreen = false, text = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      {text && <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="glass-panel p-6 rounded-2xl shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
