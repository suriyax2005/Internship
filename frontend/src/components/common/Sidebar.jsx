import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Building,
  Home,
  Users,
  FileText,
  CreditCard,
  Wrench,
  FolderArchive,
  BarChart3,
  Settings,
  User,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);

  const isTenant = user?.role === 'TENANT';

  const landlordNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Properties', path: '/properties', icon: Building },
    { label: 'Units', path: '/units', icon: Home },
    { label: 'Tenants', path: '/tenants', icon: Users },
    { label: 'Leases', path: '/leases', icon: FileText },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Maintenance', path: '/maintenance', icon: Wrench },
    { label: 'Documents', path: '/documents', icon: FolderArchive },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const tenantNavItems = [
    { label: 'Dashboard', path: '/tenant/dashboard', icon: LayoutDashboard },
    { label: 'My Lease', path: '/tenant/my-lease', icon: FileText },
    { label: 'My Payments', path: '/tenant/my-payments', icon: CreditCard },
    { label: 'Maintenance', path: '/tenant/my-maintenance', icon: Wrench },
    { label: 'Documents', path: '/tenant/my-documents', icon: FolderArchive },
    { label: 'Profile', path: '/tenant/profile', icon: User },
  ];

  const navItems = isTenant ? tenantNavItems : landlordNavItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 glass-sidebar transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-out flex flex-col justify-between`}
      >
        <div className="p-5 pt-6">
          {/* Mobile Close */}
          <div className="flex items-center justify-between lg:hidden mb-6">
            <span className="text-base font-bold text-slate-900 dark:text-white font-display">Navigation</span>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Label */}
          <div className="flex items-center space-x-2 mb-5 px-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
              {isTenant ? 'Tenant Portal' : 'Property Management'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-[13px] transition-all duration-200 relative ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-600/20 font-semibold'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`} />
                      <span>{item.label}</span>
                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/60" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Support Card */}
        <div className="p-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-500/10 dark:to-secondary/5 border border-brand-200/40 dark:border-brand-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-200/20 dark:bg-brand-400/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center space-x-2 mb-2">
                <HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <p className="text-xs font-bold text-brand-800 dark:text-brand-200">Need Help?</p>
              </div>
              <p className="text-[11px] text-brand-600/70 dark:text-brand-400/60 leading-relaxed">
                24/7 Priority Support
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
