import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  Search,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  Filter,
  AlertCircle,
  ClipboardList,
  CheckCircle,
  X,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { getWaitlist } from '../lib/api';
import type { Patient, FilterState } from '../types';
import { Link } from '../lib/router';
import { GlassPanel } from '../components/GlassPanel';
import { Avatar } from '../components/Avatar';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { TypeBadge } from '../components/TypeBadge';
import { PulseDot } from '../components/PulseDot';
import { SkeletonRow } from '../components/SkeletonRow';

export const WaitlistPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    status: 'Waiting',
    urgency: 'All',
    appointmentType: 'All',
    searchQuery: '',
  });

  const {
    data: patients = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useQuery<Patient[]>({
    queryKey: ['waitlist'],
    queryFn: getWaitlist,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Format date to "12 Sep 2026"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Last updated relative/time string
  const lastUpdatedText = useMemo(() => {
    if (!dataUpdatedAt) return 'Just now';
    const date = new Date(dataUpdatedAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, [dataUpdatedAt]);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Status filter
      if (filters.status !== 'All') {
        const pStatus = (patient.status || '').trim().toLowerCase();
        if (pStatus !== filters.status.toLowerCase()) {
          return false;
        }
      }

      // Urgency filter
      if (filters.urgency !== 'All') {
        const pUrgency = (patient.urgency || '').trim().toLowerCase();
        if (pUrgency !== filters.urgency.toLowerCase()) {
          return false;
        }
      }

      // Appointment Type filter
      if (filters.appointmentType !== 'All') {
        const pType = (patient.appointment_type || '').toLowerCase();
        const fType = filters.appointmentType.toLowerCase();
        if (!pType.includes(fType)) {
          return false;
        }
      }

      // Free text search (name, email, phone)
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesName = (patient.patient_name || '').toLowerCase().includes(q);
        const matchesEmail = (patient.email || '').toLowerCase().includes(q);
        const matchesPhone = (patient.phone || '').toLowerCase().includes(q);
        const matchesId = (patient.patient_id || '').toLowerCase().includes(q);

        if (!matchesName && !matchesEmail && !matchesPhone && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [patients, filters]);

  const waitingCount = useMemo(() => {
    return patients.filter((p) => (p.status || '').toLowerCase() === 'waiting').length;
  }, [patients]);

  const clearFilters = () => {
    setFilters({
      status: 'All',
      urgency: 'All',
      appointmentType: 'All',
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.status !== 'All' ||
    filters.urgency !== 'All' ||
    filters.appointmentType !== 'All' ||
    filters.searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-start gap-3.5">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-[#0F1F35]/80 hover:bg-[#142A47] text-slate-300 hover:text-white border border-[rgba(56,189,248,0.15)] hover:border-cyan-400/40 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5 text-cyan-400" />
          </Link>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Live Waitlist
              </h1>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold">
                <PulseDot color="cyan" size="sm" />
                <span>Live Feed</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              <span className="font-semibold text-cyan-300 tabular-nums">
                {isLoading ? '...' : waitingCount}
              </span>{' '}
              patients currently waiting for an appointment
            </p>
          </div>
        </div>

        {/* Right side: Search shortcut & Refresh button with last updated */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#0F1F35]/60 border border-[rgba(56,189,248,0.12)] px-3 py-1.5 rounded-lg">
            <span>Last sync:</span>
            <span className="font-mono text-cyan-300 tabular-nums">
              {lastUpdatedText}
            </span>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0F1F35] hover:bg-[#142A47] text-slate-200 hover:text-white border border-[rgba(56,189,248,0.2)] hover:border-cyan-400/50 text-xs font-medium transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50"
            title="Refresh waitlist from server"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-cyan-400 ${
                isFetching ? 'animate-spin' : ''
              }`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-cyan-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <span>+ Add Patient</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar (Horizontal, Glass Panel) */}
      <GlassPanel className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Free text search */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-cyan-400/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, phone, ID..."
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#0A1628]/80 border border-[rgba(56,189,248,0.2)] focus:border-cyan-400 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, searchQuery: '' }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Clear search text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="lg:col-span-2">
            <label className="sr-only">Status</label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0A1628]/80 border border-[rgba(56,189,248,0.2)] focus:border-cyan-400 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors cursor-pointer appearance-none pr-8"
              >
                <option value="All" className="bg-[#0F1F35] text-white">Status: All</option>
                <option value="Waiting" className="bg-[#0F1F35] text-white">Status: Waiting</option>
                <option value="Resolved" className="bg-[#0F1F35] text-white">Status: Resolved</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-cyan-400/80">
                <Filter className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Urgency Dropdown */}
          <div className="lg:col-span-2">
            <label className="sr-only">Urgency</label>
            <div className="relative">
              <select
                value={filters.urgency}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, urgency: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0A1628]/80 border border-[rgba(56,189,248,0.2)] focus:border-cyan-400 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors cursor-pointer appearance-none pr-8"
              >
                <option value="All" className="bg-[#0F1F35] text-white">Urgency: All</option>
                <option value="High" className="bg-[#0F1F35] text-white">Urgency: High</option>
                <option value="Normal" className="bg-[#0F1F35] text-white">Urgency: Normal</option>
                <option value="Low" className="bg-[#0F1F35] text-white">Urgency: Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-cyan-400/80">
                <Filter className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Appointment Type Dropdown */}
          <div className="lg:col-span-3">
            <label className="sr-only">Appointment Type</label>
            <div className="relative">
              <select
                value={filters.appointmentType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    appointmentType: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0A1628]/80 border border-[rgba(56,189,248,0.2)] focus:border-cyan-400 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors cursor-pointer appearance-none pr-8"
              >
                <option value="All" className="bg-[#0F1F35] text-white">Type: All</option>
                <option value="General" className="bg-[#0F1F35] text-white">General Consultation</option>
                <option value="Follow-up" className="bg-[#0F1F35] text-white">Follow-up</option>
                <option value="Dental" className="bg-[#0F1F35] text-white">Dental Consultation</option>
                <option value="Specialist" className="bg-[#0F1F35] text-white">Specialist Consultation</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-cyan-400/80">
                <Filter className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Clear Filter button if active */}
          <div className="lg:col-span-1 flex justify-end">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="w-full lg:w-auto px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 text-xs font-semibold border border-cyan-500/20 transition-colors text-center"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </GlassPanel>

      {/* Main Content: Error State */}
      {isError && (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_24px_rgba(244,63,94,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Couldn't load the waitlist.</p>
              <p className="text-xs text-rose-300/80 mt-0.5">
                {error instanceof Error ? error.message : 'Network error communicating with the clinical webhook.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Content: Table on Desktop, Cards on Mobile */}
      <GlassPanel className="overflow-hidden border-[rgba(56,189,248,0.18)] shadow-xl">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyan-500/15 bg-[#142A47]/40 text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
                <th scope="col" className="px-5 py-3.5">Patient</th>
                <th scope="col" className="px-5 py-3.5">Contact</th>
                <th scope="col" className="px-5 py-3.5">Appointment Type</th>
                <th scope="col" className="px-5 py-3.5">Preferred</th>
                <th scope="col" className="px-5 py-3.5">Urgency</th>
                <th scope="col" className="px-5 py-3.5">Waitlist Date</th>
                <th scope="col" className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10 text-sm">
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => {
                  const isWaiting = (patient.status || '').toLowerCase() === 'waiting';
                  return (
                    <tr
                      key={patient.patient_id || patient.row_number || index}
                      className="transition-colors duration-150 hover:bg-white/[0.03] group border-l-2 border-l-transparent hover:border-l-cyan-400"
                    >
                      {/* Patient column */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar name={patient.patient_name} size="md" />
                          <div>
                            <p className="font-semibold text-white group-hover:text-cyan-200 transition-colors">
                              {patient.patient_name}
                            </p>
                            <p className="text-xs text-slate-500 font-mono tracking-tight">
                              {patient.patient_id || `PT-${patient.row_number || index + 1}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact column */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs">
                        <div className="space-y-1">
                          {patient.phone ? (
                            <a
                              href={`tel:${patient.phone}`}
                              className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 transition-colors font-mono"
                            >
                              <Phone className="w-3 h-3 text-cyan-400/80" />
                              <span>{patient.phone}</span>
                            </a>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}

                          {patient.email ? (
                            <a
                              href={`mailto:${patient.email}`}
                              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors max-w-[180px] truncate"
                              title={patient.email}
                            >
                              <Mail className="w-3 h-3 text-cyan-400/80 shrink-0" />
                              <span className="truncate">{patient.email}</span>
                            </a>
                          ) : null}
                        </div>
                      </td>

                      {/* Appointment Type */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <TypeBadge type={patient.appointment_type} />
                      </td>

                      {/* Preferred column */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs">
                        <div className="space-y-0.5">
                          <p className="font-medium text-white flex items-center gap-1">
                            <span className="text-slate-400">Dr:</span> {patient.preferred_doctor || 'Any'}
                          </p>
                          <p className="text-slate-400">
                            {patient.preferred_days || 'Any days'}
                          </p>
                          <p className="text-slate-500">
                            {patient.preferred_time || 'Any time'}
                          </p>
                        </div>
                      </td>

                      {/* Urgency */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <UrgencyBadge urgency={patient.urgency} />
                      </td>

                      {/* Waitlist Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-300 font-mono">
                        {formatDate(patient.waitlist_date)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {isWaiting ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
                            <PulseDot color="cyan" size="sm" />
                            <span>Waiting</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span>Resolved</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="lg:hidden divide-y divide-cyan-500/10">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <div className="h-20 bg-cyan-900/20 rounded-xl animate-pulse" />
              <div className="h-20 bg-cyan-900/20 rounded-xl animate-pulse" />
              <div className="h-20 bg-cyan-900/20 rounded-xl animate-pulse" />
            </div>
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => {
              const isWaiting = (patient.status || '').toLowerCase() === 'waiting';
              return (
                <div
                  key={patient.patient_id || patient.row_number || index}
                  className="p-4 sm:p-5 space-y-3.5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={patient.patient_name} size="md" />
                      <div>
                        <h3 className="font-semibold text-white">
                          {patient.patient_name}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono">
                          {patient.patient_id || `PT-${patient.row_number || index + 1}`}
                        </p>
                      </div>
                    </div>
                    <UrgencyBadge urgency={patient.urgency} />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <TypeBadge type={patient.appointment_type} />
                    {isWaiting ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
                        <PulseDot color="cyan" size="sm" />
                        Waiting
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                        Resolved
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#0A1628]/60 p-3 rounded-xl border border-cyan-500/10">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-mono">Preferred Doctor</p>
                      <p className="text-slate-200 font-medium truncate">{patient.preferred_doctor || 'Any'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-mono">Availability</p>
                      <p className="text-slate-300 truncate">
                        {patient.preferred_days || 'Any'} ({patient.preferred_time || 'Any'})
                      </p>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-cyan-500/10 flex items-center justify-between text-slate-400">
                      <span>Waitlisted on: {formatDate(patient.waitlist_date)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    {patient.phone && (
                      <a
                        href={`tel:${patient.phone}`}
                        className="inline-flex items-center gap-1.5 text-cyan-300 hover:underline font-mono"
                      >
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{patient.phone}</span>
                      </a>
                    )}
                    {patient.email && (
                      <a
                        href={`mailto:${patient.email}`}
                        className="inline-flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 max-w-[200px] truncate"
                      >
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="truncate">{patient.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          ) : null}
        </div>

        {/* Empty state */}
        {!isLoading && filteredPatients.length === 0 && !isError && (
          <div className="py-20 px-6 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 mx-auto flex items-center justify-center text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
              <Stethoscope className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                No patients match these filters
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Try loosening your filter parameters, searching for a different keyword, or checking resolved status.
              </p>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-cyan-glow"
            >
              <span>Clear filters</span>
            </button>
          </div>
        )}
      </GlassPanel>
    </div>
  );
};
