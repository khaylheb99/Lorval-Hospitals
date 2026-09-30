import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Stethoscope,
  FileText,
  ArrowRight,
  RefreshCw,
  Plus,
  Shield,
} from 'lucide-react';
import { addToWaitlist } from '../lib/api';
import type { NewPatient } from '../types';
import { Link, useRouter } from '../lib/router';
import { GlassPanel } from '../components/GlassPanel';
import { PulseDot } from '../components/PulseDot';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Any'];
const URGENCY_LEVELS = [
  { level: 'Low', label: 'Low', color: 'slate' },
  { level: 'Normal', label: 'Normal', color: 'amber' },
  { level: 'High', label: 'High', color: 'rose' },
];

export const JoinPage: React.FC = () => {
  const { navigate } = useRouter();
  const queryClient = useQueryClient();

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const initialFormState = {
    patient_name: '',
    patient_id: '',
    phone: '',
    email: '',
    appointment_type: 'General Consultation',
    preferred_doctor: 'Any',
    preferred_days: ['Mon', 'Wed', 'Fri'] as string[],
    preferred_time: 'Morning',
    earliest_date: getTodayString(),
    urgency: 'Normal',
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'patient_name':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Full name is required (at least 2 letters)';
        }
        return '';
      case 'phone':
        if (!value || typeof value !== 'string' || value.trim().length < 6) {
          return 'Valid contact phone number is required';
        }
        return '';
      case 'email':
        if (!value || typeof value !== 'string') {
          return 'Email address is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'appointment_type':
        if (!value) return 'Appointment type is required';
        return '';
      case 'preferred_days':
        if (!value || !Array.isArray(value) || value.length === 0) {
          return 'Select at least one preferred day';
        }
        return '';
      case 'earliest_date':
        if (!value) return 'Earliest date is required';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, (formData as any)[field]);
    setFormErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      const exists = prev.preferred_days.includes(day);
      const updated = exists
        ? prev.preferred_days.filter((d) => d !== day)
        : [...prev.preferred_days, day];
      
      const err = validateField('preferred_days', updated);
      setFormErrors((e) => ({ ...e, preferred_days: err }));
      return { ...prev, preferred_days: updated };
    });
  };

  const mutation = useMutation({
    mutationFn: async (payload: NewPatient) => {
      return addToWaitlist(payload);
    },
    onSuccess: () => {
      // Invalidate waitlist cache so table updates on return
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      setSubmittedEmail(formData.email);
      setIsSuccess(true);
      setErrorMessage(null);
    },
    onError: (err: any) => {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to communicate with the waitlist webhook. Please check connection and try again.'
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate all required fields
    const fieldsToValidate = [
      'patient_name',
      'phone',
      'email',
      'appointment_type',
      'preferred_days',
      'earliest_date',
    ];

    const errors: Record<string, string> = {};
    let hasError = false;

    fieldsToValidate.forEach((f) => {
      const err = validateField(f, (formData as any)[f]);
      if (err) {
        errors[f] = err;
        hasError = true;
      }
    });

    setTouched({
      patient_name: true,
      phone: true,
      email: true,
      appointment_type: true,
      preferred_days: true,
      earliest_date: true,
    });
    setFormErrors(errors);

    if (hasError) {
      return;
    }

    const payload: NewPatient = {
      patient_name: formData.patient_name.trim(),
      ...(formData.patient_id.trim() ? { patient_id: formData.patient_id.trim() } : {}),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      appointment_type: formData.appointment_type,
      preferred_doctor: formData.preferred_doctor.trim() || 'Any',
      preferred_days: formData.preferred_days.join(', '),
      preferred_time: formData.preferred_time,
      earliest_date: formData.earliest_date,
      urgency: formData.urgency,
      notes: formData.notes.trim() || undefined,
      status: 'Waiting',
      waitlist_date: new Date().toISOString(),
    };

    mutation.mutate(payload);
  };

  const handleResetForm = () => {
    setFormData(initialFormState);
    setTouched({});
    setFormErrors({});
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <Link
          href="/"
          className="p-2.5 rounded-xl bg-[#0F1F35]/80 hover:bg-[#142A47] text-slate-300 hover:text-white border border-[rgba(56,189,248,0.15)] hover:border-cyan-400/40 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 shrink-0"
          aria-label="Back to home"
        >
          <ChevronLeft className="w-5 h-5 text-cyan-400" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Join the Waitlist
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            We'll contact you as soon as a matching appointment opens up.
          </p>
        </div>
      </div>

      {/* Success State */}
      {isSuccess ? (
        <GlassPanel elevated glow className="p-8 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              You're on the waitlist.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto">
              We'll be in touch at{' '}
              <span className="font-semibold text-cyan-300">{submittedEmail}</span> as soon as a
              matching appointment opens.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0A1628]/80 border border-cyan-500/20 max-w-sm mx-auto text-xs text-slate-400 flex items-center gap-2.5 text-left">
            <PulseDot color="emerald" size="sm" />
            <span>Triage queue position registered in clinic database. Priority: Normal routing.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-cyan-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Add another
            </button>
            <button
              type="button"
              onClick={() => navigate('/waitlist')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-cyan-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              View waitlist
            </button>
          </div>
        </GlassPanel>
      ) : (
        /* Form Card */
        <GlassPanel className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Inline Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-start gap-3 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-semibold text-rose-100">Unable to submit waitlist registration</p>
                  <p className="text-rose-300/90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Row 1: Full Name & Patient ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Amara Okafor"
                    value={formData.patient_name}
                    onChange={(e) => {
                      setFormData({ ...formData, patient_name: e.target.value });
                      if (touched.patient_name) {
                        setFormErrors({
                          ...formErrors,
                          patient_name: validateField('patient_name', e.target.value),
                        });
                      }
                    }}
                    onBlur={() => handleBlur('patient_name')}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0A1628]/90 border text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                      formErrors.patient_name && touched.patient_name
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-[rgba(56,189,248,0.2)] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    }`}
                  />
                </div>
                {formErrors.patient_name && touched.patient_name && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.patient_name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Patient ID <span className="text-slate-500 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. PT-1049"
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1628]/90 border border-[rgba(56,189,248,0.2)] focus:border-cyan-400 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">Leave blank if new patient</p>
              </div>
            </div>

            {/* Row 2: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+234 803 000 0000"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (touched.phone) {
                        setFormErrors({
                          ...formErrors,
                          phone: validateField('phone', e.target.value),
                        });
                      }
                    }}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0A1628]/90 border text-sm text-white placeholder-slate-600 focus:outline-none transition-colors font-mono ${
                      formErrors.phone && touched.phone
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-[rgba(56,189,248,0.2)] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    }`}
                  />
                </div>
                {formErrors.phone && touched.phone ? (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.phone}</p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1">Include country code hint (e.g. +234)</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (touched.email) {
                        setFormErrors({
                          ...formErrors,
                          email: validateField('email', e.target.value),
                        });
                      }
                    }}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0A1628]/90 border text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                      formErrors.email && touched.email
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-[rgba(56,189,248,0.2)] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    }`}
                  />
                </div>
                {formErrors.email && touched.email && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Row 3: Appointment Type & Preferred Doctor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Appointment Type <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={formData.appointment_type}
                  onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1628]/90 border border-[rgba(56,189,248,0.2)] focus:border-cyan-400 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors cursor-pointer"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Dental Consultation">Dental Consultation</option>
                  <option value="Specialist Consultation">Specialist Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Preferred Doctor
                </label>
                <input
                  type="text"
                  placeholder="Any, or Dr. Ade"
                  value={formData.preferred_doctor}
                  onChange={(e) => setFormData({ ...formData, preferred_doctor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1628]/90 border border-[rgba(56,189,248,0.2)] focus:border-cyan-400 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Row 4: Preferred Days (Multi-select chips) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Preferred Days <span className="text-cyan-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = formData.preferred_days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`
                        px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
                        ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                            : 'bg-[#0A1628]/80 text-slate-400 border border-slate-700/60 hover:border-slate-500 hover:text-white'
                        }
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              {formErrors.preferred_days && touched.preferred_days && (
                <p className="text-xs text-rose-400 mt-1.5">{formErrors.preferred_days}</p>
              )}
            </div>

            {/* Row 5: Preferred Time & Earliest Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Preferred Time
                </label>
                <div className="flex items-center gap-2">
                  {TIME_SLOTS.map((time) => {
                    const isSelected = formData.preferred_time === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferred_time: time })}
                        className={`
                          flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all text-center cursor-pointer
                          ${
                            isSelected
                              ? 'bg-sky-500/20 text-sky-200 border border-sky-400/50 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                              : 'bg-[#0A1628]/80 text-slate-400 border border-slate-700/60 hover:text-white'
                          }
                        `}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Earliest Date <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    min={getTodayString()}
                    value={formData.earliest_date}
                    onChange={(e) => setFormData({ ...formData, earliest_date: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#0A1628]/90 border border-[rgba(56,189,248,0.2)] focus:border-cyan-400 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Row 6: Urgency (Radio pills: Low / Normal / High - default Normal) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {URGENCY_LEVELS.map((u) => {
                  const isSelected = formData.urgency === u.level;
                  let selectedStyle = 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
                  if (u.level === 'High') {
                    selectedStyle = 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]';
                  } else if (u.level === 'Low') {
                    selectedStyle = 'bg-slate-700/40 text-slate-200 border-slate-500 shadow-[0_0_10px_rgba(148,163,184,0.1)]';
                  }

                  return (
                    <button
                      key={u.level}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: u.level })}
                      className={`
                        py-2.5 px-3 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer
                        ${
                          isSelected
                            ? selectedStyle + ' border'
                            : 'bg-[#0A1628]/80 text-slate-400 border border-slate-700/60 hover:text-white hover:bg-slate-800/40'
                        }
                      `}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          u.level === 'High'
                            ? 'bg-rose-400'
                            : u.level === 'Normal'
                            ? 'bg-amber-400'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span>{u.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 7: Notes (optional, 3 rows) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Clinical Notes or Reason <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Mention any symptoms, ongoing medications, or specific availability constraints..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1628]/90 border border-[rgba(56,189,248,0.2)] focus:border-cyan-400 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-4 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold text-sm tracking-wide transition-all duration-200 shadow-cyan-glow hover:shadow-cyan-glow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Transmitting to Clinical Queue...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add to Waitlist</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </GlassPanel>
      )}
    </div>
  );
};
