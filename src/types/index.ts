export type UrgencyLevel = 'High' | 'Normal' | 'Low';
export type WaitlistStatus = 'Waiting' | 'Resolved';

export type Patient = {
  row_number: number;
  patient_id: string;
  patient_name: string;
  phone: string;
  email: string;
  appointment_type: string;
  preferred_doctor: string;
  preferred_days: string;
  preferred_time: string;
  earliest_date: string;
  urgency: UrgencyLevel;
  status: WaitlistStatus;
  waitlist_date: string;
  notes: string;
};

export type NewPatient = {
  patient_name: string;
  patient_id?: string;
  phone: string;
  email: string;
  appointment_type: string;
  preferred_doctor: string;
  preferred_days: string; // comma-joined, e.g. "Monday, Wednesday"
  preferred_time: string;
  earliest_date: string; // YYYY-MM-DD
  urgency: string;
  notes?: string;
  status: 'Waiting'; // always set to Waiting on submit
  waitlist_date: string; // today, ISO
};

export type FilterState = {
  status: string; // 'All' | 'Waiting' | 'Resolved'
  urgency: string; // 'All' | 'High' | 'Normal' | 'Low'
  appointmentType: string; // 'All' | 'General' | 'Follow-up' | 'Dental' | 'Specialist'
  searchQuery: string;
};
