import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { Sun, Moon, LogOut, Menu, User as UserIcon, Building2, Bell, CheckCheck, Trash2, Sparkles } from 'lucide-react';
import { formatRole } from '../../utils/formatters';
import { useSocket } from '../../context/SocketContext';

export const Navbar = ({ toggleSidebar, isDarkMode, toggleDarkMode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications = [], unreadCount = 0, markAllAsRead, clearNotifications } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 glass-navbar px-4 lg:px-8 py-3 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2.5 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition-all duration-200"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-secondary flex items-center justify-center text-white shadow-lg shadow-brand-600/25 transition-transform duration-300 hover:scale-105">
            <Building2 className="w-5 h-5" />
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Smart<span className="gradient-text-brand">Rental</span>
            </span>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-accent-gold" />
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Premium</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Real-time Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) {
                markAllAsRead();
              }
            }}
            className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50/80 dark:hover:bg-brand-500/10 rounded-xl transition-all duration-200"
            title="Real-time Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center notification-dot shadow-lg shadow-rose-500/30">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-card-premium rounded-2xl overflow-hidden z-50" style={{ animation: 'fade-in-up 0.2s ease-out forwards' }}>
              <div className="p-4 border-b border-slate-100/80 dark:border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-sm font-bold text-slate-900 dark:text-white font-display">Activity Feed</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-brand-500 to-secondary text-white shadow-sm">
                    Live
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {notifications.length > 0 && (
                    <>
                      <button
                        onClick={markAllAsRead}
                        className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-all"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={clearNotifications}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Clear all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/60 dark:divide-slate-800/40">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No recent notifications</p>
                    <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-1">Real-time alerts will appear here</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 transition-all duration-200 hover:bg-brand-50/30 dark:hover:bg-brand-500/5 ${
                        !item.read ? 'bg-brand-50/20 dark:bg-brand-950/10 border-l-2 border-brand-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50/80 dark:hover:bg-amber-500/10 rounded-xl transition-all duration-300"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Info — Premium */}
        <div className="flex items-center space-x-3 pl-3 ml-1 border-l border-slate-200/60 dark:border-slate-700/30">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-secondary/20 dark:from-brand-500/30 dark:to-secondary/30 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm ring-2 ring-white/80 dark:ring-slate-800/80 shadow-sm">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
          </div>

          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {user?.fullName || 'User'}
            </p>
            <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
              {formatRole(user?.role)}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => dispatch(logoutUser())}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50/80 dark:hover:bg-rose-500/10 rounded-xl transition-all duration-200 ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
