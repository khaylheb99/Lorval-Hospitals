import type { Patient, NewPatient } from '../types';

const N8N_BASE = 'https://tenalyticsbusiness.app.n8n.cloud';

// GET current waitlist
export async function getWaitlist(): Promise<Patient[]> {
  const res = await fetch(`${N8N_BASE}/webhook/waiting-list`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load waitlist: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // Normalize data in case webhook returns { data: [...] } or array directly
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.data)) {
    return data.data;
  }
  if (data && typeof data === 'object') {
    // If it's a keyed object or single item
    const possibleArray = Object.values(data).find(Array.isArray);
    if (possibleArray) return possibleArray as Patient[];
  }

  return [];
}

// POST new patient
export async function addToWaitlist(payload: NewPatient): Promise<void> {
  const res = await fetch(`${N8N_BASE}/webhook/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorDetail = `Status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.message) errorDetail = errJson.message;
    } catch {
      // ignore parsing failure
    }
    throw new Error(`Failed to add patient to waitlist (${errorDetail})`);
  }
}
