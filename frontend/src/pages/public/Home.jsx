import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  ShieldCheck,
  CreditCard,
  Wrench,
  Users,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Globe2,
  Star,
  Sparkles,
  Zap,
  Lock,
  ArrowUpRight,
  Heart,
  ChevronRight,
} from 'lucide-react';

export const Home = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.12 } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-hidden">

      {/* ═══════════════════════════════════════
          PREMIUM NAVIGATION
          ═══════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/30 dark:border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-secondary flex items-center justify-center text-white shadow-lg shadow-brand-600/25 transition-all duration-300 group-hover:shadow-brand-600/40 group-hover:scale-105">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Smart<span className="gradient-text-brand">Rental</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-white transition-colors hidden sm:inline">
              Sign in
            </Link>
            <Link to="/register" className="btn-premium flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          HERO SECTION — CINEMATIC
          ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-6 overflow-hidden">
        {/* Full-width Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Modern Luxury Property"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full text-center flex flex-col items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="w-full"
          >
            {/* Premium Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Enterprise-Grade Property Platform</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 font-display text-white">
              Property management,
              <br />
              <span className="text-brand-400">reimagined.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl mx-auto font-sans">
              Streamline operations, automate rent collection, and deliver an exceptional experience to your tenants — all from one platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/register" className="group w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-base font-bold shadow-xl shadow-brand-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-600/30 flex items-center justify-center space-x-2.5">
                <span>Start for free</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white text-white rounded-2xl text-base font-semibold transition-all duration-300 text-center hover:-translate-y-0.5 backdrop-blur-sm">
                Watch Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATISTICS BAR
          ═══════════════════════════════════════ */}
      <section className="py-16 border-y border-slate-200/50 dark:border-slate-800/30 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            {[
              { label: 'Properties Managed', value: '10,000+', icon: Building2 },
              { label: 'Rent Processed', value: '$2B+', icon: CreditCard },
              { label: 'Happy Tenants', value: '50K+', icon: Users },
              { label: 'Uptime SLA', value: '99.99%', icon: ShieldCheck },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeUp} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center ring-1 ring-brand-500/10">
                  <stat.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight font-sans">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES GRID — PREMIUM CARDS
          ═══════════════════════════════════════ */}
      <section id="features" className="py-28 px-6 relative bg-luxury-50 dark:bg-slate-900/50">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-brand-500/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
              <Zap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Powerful Features</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
              Everything you need<br />to <span className="gradient-text-brand">scale</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
              A comprehensive suite of tools designed to replace your spreadsheets and fragmented software stack.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Building2,
                color: 'from-brand-500 to-brand-700',
                bg: 'bg-brand-50 dark:bg-brand-500/10',
                title: 'Portfolio Management',
                desc: 'Centralize your property data. Track units, occupancy, and property specifics with effortless precision.',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                icon: CreditCard,
                color: 'from-emerald-500 to-emerald-700',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                title: 'Automated Payments',
                desc: 'Collect rent automatically. Send invoices, track arrears, and generate financial reports instantly.',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                icon: Wrench,
                color: 'from-secondary to-purple-700',
                bg: 'bg-secondary/10',
                title: 'Maintenance Hub',
                desc: 'Streamline repair requests. Tenants submit tickets, and you track resolution directly in-app.',
                image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              }
            ].map((feature, idx) => (
              <motion.div
                variants={scaleIn}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                key={idx}
                className="group glass-card-premium rounded-3xl overflow-hidden flex flex-col"
              >
                <div className="h-52 overflow-hidden relative">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5 ring-1 ring-black/5 dark:ring-white/5 transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-display">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 font-sans">{feature.desc}</p>
                  <div className="mt-6 flex items-center text-brand-600 dark:text-brand-400 text-sm font-semibold group/link cursor-pointer">
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ADDITIONAL FEATURES — ICON GRID
          ═══════════════════════════════════════ */}
      <section className="py-20 px-6 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/30 dark:border-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Lock, title: 'Bank-Grade Security', desc: 'JWT, encryption, rate limiting, and RBAC protection.' },
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Revenue reports, occupancy trends, and financial insights.' },
              { icon: Globe2, title: 'Multi-Tenancy', desc: 'Complete data isolation between landlord accounts.' },
              { icon: Zap, title: 'Real-Time Updates', desc: 'WebSocket notifications for instant activity feed.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="glass-card-premium p-6 rounded-2xl group cursor-default"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-4 ring-1 ring-brand-500/10 transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 font-display">{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIAL — EDITORIAL STYLE
          ═══════════════════════════════════════ */}
      <section id="testimonials" className="py-28 px-6 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent-gold/[0.02] rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200/40 dark:border-amber-500/20 mb-6">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Client Stories</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                Trusted by <span className="gradient-text-brand">thousands</span> of property managers
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-sans">
                See how SmartRental is transforming real estate businesses across the globe.
              </p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-sm text-slate-500 font-semibold ml-3">4.9/5 average rating</span>
              </div>
            </motion.div>

            <motion.div variants={scaleIn}>
              <div className="glass-card-premium p-8 md:p-10 rounded-3xl relative overflow-hidden">
                {/* Decorative quote mark */}
                <div className="absolute -top-4 -left-2 text-8xl font-display text-brand-500/10 font-bold select-none">"</div>

                <div className="relative">
                  <p className="text-xl text-slate-700 dark:text-slate-200 italic leading-relaxed mb-8 font-display font-medium">
                    Since migrating to SmartRental, our team has saved over 40 hours a week on administrative tasks. The automated rent collection and maintenance tracking is simply a game-changer.
                  </p>
                  <div className="flex items-center space-x-4 pt-6 border-t border-slate-200/60 dark:border-slate-700/30">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                      alt="Sarah Jenkins"
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-md"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Director of Operations, Apex Properties</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA SECTION — DRAMATIC
          ═══════════════════════════════════════ */}
      <section className="py-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto relative"
        >
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-[2.5rem] p-12 md:p-20 overflow-hidden">
            {/* Decorative orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary/10 rounded-full blur-[60px] -translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px]" />

            <div className="relative text-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
                <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Ready to transform?</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight font-display">
                Ready to upgrade your<br />
                <span className="gradient-text-brand">property management</span>?
              </h2>
              <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto font-sans">
                Join thousands of landlords who are growing their portfolios faster and with less stress.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link to="/register" className="group w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl text-base font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-2">
                  <span>Start your free trial</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link to="/login" className="btn-glass w-full sm:w-auto flex items-center justify-center">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          PREMIUM FOOTER
          ═══════════════════════════════════════ */}
      <footer className="bg-slate-950 text-white pt-16 pb-8 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Smart<span className="text-brand-400">Rental</span></span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md mb-6">
                The modern property management platform built for ambitious landlords. Automate everything from rent to repairs.
              </p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-xs text-slate-500 font-medium ml-2">Rated 4.9/5</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-5">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Security', 'Integrations'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-5">Company</h4>
              <ul className="space-y-3">
                {['About', 'Privacy', 'Terms', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} SmartRental. All rights reserved.</p>
            <div className="flex items-center space-x-1 text-xs text-slate-600">
              <span>Crafted with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>for modern landlords</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
