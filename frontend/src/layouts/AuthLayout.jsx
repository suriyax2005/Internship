import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Shield, Zap, BarChart3, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'Bank-grade encryption & SOC2 compliance',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Instant dashboards & real-time updates',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    desc: 'AI-powered insights for your portfolio',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Multi-role access with granular permissions',
  },
];

export const AuthLayout = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">
      {/* Left Panel — Branding & Features (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] relative overflow-hidden auth-mesh-gradient">
        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500/20 rounded-full blur-[100px] animate-float-orb pointer-events-none" />
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] animate-float-orb-reverse pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-teal-400/10 rounded-full blur-[80px] animate-float-orb pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Logo */}
          <div>
            <Link to="/" className="inline-flex items-center space-x-3 group" aria-label="Go to homepage">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Smart Rental <span className="text-brand-400">SaaS</span>
              </span>
            </Link>
          </div>

          {/* Center content — hero */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
                The modern way to<br />
                <span className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent">
                  manage properties
                </span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Join thousands of property managers who streamline operations, automate rent collection, and delight tenants — all from one platform.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="auth-feature-card p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
                >
                  <feature.icon className="w-5 h-5 text-brand-400 mb-2" />
                  <p className="text-white text-xs font-semibold">{feature.title}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-snug">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <p className="text-slate-300 text-xs leading-relaxed italic">
                "Smart Rental SaaS transformed how we manage our 200+ unit portfolio. Rent collection is now automated, maintenance requests are tracked in real-time, and our tenants love the self-service portal."
              </p>
              <div className="flex items-center space-x-3 mt-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                  SK
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Sarah K.</p>
                  <p className="text-slate-500 text-[10px]">Property Manager, 200+ Units</p>
                </div>
              </div>
            </div>
            <p className="text-slate-600 text-[10px]">
              © {new Date().getFullYear()} Smart Rental SaaS. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile header */}
        <div className="lg:hidden p-5 pb-0">
          <Link to="/" className="inline-flex items-center space-x-2.5 group" aria-label="Go to homepage">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">
              Smart Rental <span className="text-brand-400">SaaS</span>
            </span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-5 sm:p-8">
          <div className={`w-full ${isRegister ? 'max-w-lg' : 'max-w-md'}`}>
            {/* Animated card */}
            <div className="auth-card-enter bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/20">
              <Outlet />
            </div>

            {/* Mobile footer */}
            <p className="lg:hidden text-center text-[10px] text-slate-600 mt-6">
              © {new Date().getFullYear()} Smart Rental SaaS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
