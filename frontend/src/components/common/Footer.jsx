import React from 'react';
import { Building2, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
      <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center">
            <Building2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold">
            SmartRental <span className="text-slate-300 dark:text-slate-600">·</span> © {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-[11px] text-slate-400 dark:text-slate-500">
          <span>for modern landlords</span>
        </div>
      </div>
    </footer>
  );
};
