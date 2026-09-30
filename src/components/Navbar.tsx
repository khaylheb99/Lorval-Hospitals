import React, { useState } from 'react';
import { Plus, Menu, X, Activity, User, ClipboardList, UserPlus, Shield } from 'lucide-react';
import { useRouter, Link } from '../lib/router';

export const Navbar: React.FC = () => {
  const { currentPath } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', href: '/', icon: Activity },
    { label: 'Waitlist', href: '/waitlist', icon: ClipboardList },
    { label: 'Join', href: '/join', icon: UserPlus },
  ];

  const isActive = (href: string) => {
    if (href === '/' && currentPath === '/') return true;
    if (href !== '/' && currentPath.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0A1628]/85 border-b border-[rgba(56,189,248,0.15)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.35)] transition-transform duration-200 group-hover:scale-105">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors">
              Lorval
            </span>
            <span className="text-sm font-medium text-slate-400">
              Hospitals
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-[#0F1F35]/70 border border-[rgba(56,189,248,0.12)] rounded-full backdrop-blur-md shadow-inner">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200
                  ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.25)] border border-cyan-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Clinic Admin & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 pl-3 py-1 pr-1.5 rounded-full bg-[#0F1F35]/60 border border-[rgba(56,189,248,0.15)] text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="font-medium text-slate-200">Clinic Admin</span>
            <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 border border-cyan-500/10"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sliding Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-[#0A1628]/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#0F1F35] border-l border-[rgba(56,189,248,0.2)] shadow-2xl p-6 flex flex-col justify-between z-50 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-cyan-400 flex items-center justify-center text-slate-950 font-bold">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="font-bold text-white">Lorval Hospitals</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#142A47]/80 border border-cyan-500/20 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-medium text-slate-200">Clinic Admin System Active</span>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                        ${
                          active
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-cyan-500/15 text-xs text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Certified Clinical Data Guard &middot; v2.4</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
