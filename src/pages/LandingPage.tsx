import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Brain,
  Shield,
  Eye,
  ArrowRight,
  UserPlus,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';
import { getWaitlist } from '../lib/api';
import { Link } from '../lib/router';
import { GlassPanel } from '../components/GlassPanel';
import { PulseDot } from '../components/PulseDot';
import { Avatar } from '../components/Avatar';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { TypeBadge } from '../components/TypeBadge';

// Import generated medical AI hologram image asset
import medicalHologramImg from '../assets/images/medical_hologram_hero_1790759364377.jpg';

export const LandingPage: React.FC = () => {
  const { data: waitlist, isLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: getWaitlist,
    staleTime: 1000 * 30,
  });

  const patientCount = waitlist ? waitlist.length : 8;
  const previewPatients = waitlist && waitlist.length > 0
    ? waitlist.slice(0, 3)
    : [
        {
          row_number: 1,
          patient_id: 'PT-1082',
          patient_name: 'Amara Okafor',
          phone: '+234 803 291 0021',
          email: 'a.okafor@gmail.com',
          appointment_type: 'General Consultation',
          preferred_doctor: 'Dr. Ade',
          preferred_days: 'Mon, Wed',
          preferred_time: 'Morning',
          earliest_date: '2026-10-02',
          urgency: 'High' as const,
          status: 'Waiting' as const,
          waitlist_date: '2026-09-28',
          notes: 'Chronic migraine flare-up',
        },
        {
          row_number: 2,
          patient_id: 'PT-1083',
          patient_name: 'Marcus Vance',
          phone: '+234 812 404 9912',
          email: 'm.vance@lorval.org',
          appointment_type: 'Specialist Consultation',
          preferred_doctor: 'Dr. Mensah',
          preferred_days: 'Tue, Thu',
          preferred_time: 'Afternoon',
          earliest_date: '2026-10-04',
          urgency: 'Normal' as const,
          status: 'Waiting' as const,
          waitlist_date: '2026-09-29',
          notes: 'Cardiac echo review',
        },
        {
          row_number: 3,
          patient_id: 'PT-1084',
          patient_name: 'Elena Rostova',
          phone: '+234 701 555 8820',
          email: 'elena.r@synapse.io',
          appointment_type: 'Follow-up',
          preferred_doctor: 'Any',
          preferred_days: 'Fri, Sat',
          preferred_time: 'Morning',
          earliest_date: '2026-10-03',
          urgency: 'Normal' as const,
          status: 'Waiting' as const,
          waitlist_date: '2026-09-30',
          notes: 'Post-op checkup',
        },
      ];

  return (
    <div className="relative overflow-hidden">
      {/* Top subtle radial glow gradient */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(34,211,238,0.18),transparent)]"
        aria-hidden="true"
      />

      {/* Hero Section with faint grid overlay */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8 z-10">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-wider shadow-[0_0_16px_rgba(34,211,238,0.2)]">
              <PulseDot color="cyan" size="sm" />
              <span>Live Waitlist System</span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
              Never miss a freed{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 drop-shadow-[0_0_24px_rgba(34,211,238,0.4)]">
                appointment slot.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
              Lorval Hospitals intelligently routes cancelled appointments to waiting
              patients — faster, fairer, and always on time.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold text-sm tracking-wide transition-all duration-200 shadow-cyan-glow hover:shadow-cyan-glow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <span>View Waitlist</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/join"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0F1F35]/90 hover:bg-[#142A47] text-cyan-300 hover:text-white font-semibold text-sm tracking-wide border border-cyan-400/35 hover:border-cyan-400 transition-all duration-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Join Waitlist</span>
              </Link>
            </div>

            {/* Small Stat Row */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 pt-2 border-t border-[rgba(56,189,248,0.15)] max-w-xl">
              <span className="font-semibold text-white tabular-nums">
                {isLoading ? '...' : `${patientCount} patients waiting`}
              </span>
              <span className="text-slate-600" aria-hidden="true">&middot;</span>
              <span className="flex items-center gap-1.5 text-cyan-300/90 font-medium">
                <PulseDot color="cyan" size="sm" />
                Updated live
              </span>
              <span className="text-slate-600" aria-hidden="true">&middot;</span>
              <span className="text-slate-300">Lorval Hospitals</span>
            </div>
          </div>

          {/* Right Column: Holographic Display + 3D Tilted Mini Waitlist Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Holographic background panel */}
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden border border-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.12)] bg-[#07111f]">
                <img
                  src={medicalHologramImg}
                  alt="Lorval Medical AI Hologram Visualization"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover opacity-80 mix-blend-screen scale-105 filter brightness-110"
                />
                {/* Visual gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_30%,#0A1628_85%)]" />
              </div>

              {/* Floating decorative chips around the visual */}
              <div className="absolute -top-3 -left-3 px-3 py-1.5 rounded-full bg-[#0F1F35]/90 border border-cyan-400/40 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse hidden sm:flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                <span>General Consultation</span>
              </div>

              <div className="absolute top-2 -right-4 px-3 py-1.5 rounded-full bg-[#0F1F35]/90 border border-sky-400/40 text-sky-300 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.2)] hidden sm:flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Follow-up Queue</span>
              </div>

              <div className="absolute -bottom-3 right-6 px-3 py-1.5 rounded-full bg-[#0F1F35]/90 border border-violet-400/40 text-violet-300 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(167,139,250,0.2)] hidden sm:flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Dental Consultation</span>
              </div>

              {/* Tilted 3D Mini Live Waitlist Card */}
              <div className="absolute -bottom-6 -left-2 sm:-left-6 right-2 sm:right-6 lg:-bottom-8 transform lg:-rotate-2 transition-transform duration-300 hover:rotate-0">
                <GlassPanel
                  elevated
                  glow
                  className="p-4 sm:p-5 shadow-2xl border-cyan-400/30"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/15">
                    <div className="flex items-center gap-2">
                      <PulseDot color="cyan" size="sm" />
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                        Top Queue Slots
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Queue Auto-Triage
                    </span>
                  </div>

                  {/* Top 3 patient rows */}
                  <div className="space-y-2.5">
                    {previewPatients.map((p, idx) => (
                      <div
                        key={p.patient_id || idx}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#0A1628]/70 border border-cyan-500/10 hover:border-cyan-400/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar name={p.patient_name} size="sm" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {p.patient_name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {p.appointment_type}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/20 font-mono">
                            {p.preferred_time || 'Any'}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.urgency === 'High'
                                ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                                : 'bg-amber-400'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[rgba(56,189,248,0.12)]">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>High-Availability Clinical Routing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for busy hospital command centers
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Streamlined queue visibility and rapid patient allocation without the administrative burden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <GlassPanel className="p-7 relative group hover:border-cyan-400/40 hover:shadow-cyan-glow transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-5 group-hover:scale-110 transition-transform duration-200 shadow-[0_0_16px_rgba(34,211,238,0.2)]">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Real-time Waitlist
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              See every patient currently waiting, updated live from the clinic system.
            </p>
            <div className="mt-6 pt-4 border-t border-cyan-500/10 flex items-center justify-between text-xs text-slate-400">
              <span>Auto-refresh enabled</span>
              <span className="text-cyan-400 font-mono">0.0s lag</span>
            </div>
          </GlassPanel>

          {/* Feature 2 */}
          <GlassPanel className="p-7 relative group hover:border-cyan-400/40 hover:shadow-cyan-glow transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-300 mb-5 group-hover:scale-110 transition-transform duration-200 shadow-[0_0_16px_rgba(56,189,248,0.2)]">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Smart Triage
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Patients are evaluated by urgency, preferences, and availability.
            </p>
            <div className="mt-6 pt-4 border-t border-cyan-500/10 flex items-center justify-between text-xs text-slate-400">
              <span>Priority weighted</span>
              <span className="text-cyan-400 font-mono">High &middot; Normal &middot; Low</span>
            </div>
          </GlassPanel>

          {/* Feature 3 */}
          <GlassPanel className="p-7 relative group hover:border-cyan-400/40 hover:shadow-cyan-glow transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-5 group-hover:scale-110 transition-transform duration-200 shadow-[0_0_16px_rgba(16,185,129,0.2)]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Secure by Design
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              All patient data is handled per clinic privacy standards.
            </p>
            <div className="mt-6 pt-4 border-t border-cyan-500/10 flex items-center justify-between text-xs text-slate-400">
              <span>Encrypted Webhook</span>
              <span className="text-emerald-400 font-mono">Active</span>
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
};
