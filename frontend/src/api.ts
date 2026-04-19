const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function fetchJson(path: string, options: RequestInit = {}) {
  const { headers: optionHeaders, ...requestOptions } = options
  const headers = new Headers(optionHeaders)
  if (requestOptions.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...requestOptions,
    headers,
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.error ?? 'Request failed')
  }

  return body
}

function authHeader(token?: string, userId?: string): Record<string, string> {
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  if (userId) {
    headers['X-User-Id'] = userId
  }
  return headers
}

export async function login(email: string, password: string, role?: string) {
  return fetchJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  })
}

export async function registerUser(data: { name: string; email: string; password: string; role: string; faculty?: string; institution_code?: string }) {
  return fetchJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getProfile(token: string, userId?: string) {
  return fetchJson('/api/auth/profile', {
    headers: authHeader(token, userId),
  })
}

export async function getAppointments(token: string, userId?: string) {
  return fetchJson('/api/appointments', {
    headers: authHeader(token, userId),
  })
}

export async function getMoodLogs(token: string, userId?: string) {
  return fetchJson('/api/mood_logs', {
    headers: authHeader(token, userId),
  })
}

export async function getResources(token: string, userId?: string) {
  return fetchJson('/api/resources', {
    headers: authHeader(token, userId),
  })
}

export async function getSessionNotes(token: string, userId?: string) {
  return fetchJson('/api/session_notes', {
    headers: authHeader(token, userId),
  })
}

export async function getAvailability(token: string, userId?: string) {
  return fetchJson('/api/availability', {
    headers: authHeader(token, userId),
  })
}

export async function getProfiles(token: string, userId?: string) {
  return fetchJson('/api/profiles', {
    headers: authHeader(token, userId),
  })
}

export async function addAppointment(appointment: any, token: string, userId?: string) {
  return fetchJson('/api/appointments', {
    method: 'POST',
    headers: authHeader(token, userId),
    body: JSON.stringify(appointment),
  })
}

export async function addMoodLog(moodLog: any, token: string, userId?: string) {
  return fetchJson('/api/mood_logs', {
    method: 'POST',
    headers: authHeader(token, userId),
    body: JSON.stringify(moodLog),
  })
}

export async function addResource(resource: any, token: string, userId?: string) {
  return fetchJson('/api/resources', {
    method: 'POST',
    headers: authHeader(token, userId),
    body: JSON.stringify(resource),
  })
}

export async function addSessionNote(sessionNote: any, token: string, userId?: string) {
  return fetchJson('/api/session_notes', {
    method: 'POST',
    headers: authHeader(token, userId),
    body: JSON.stringify(sessionNote),
  })
}

export async function addAvailability(availability: any, token: string, userId?: string) {
  return fetchJson('/api/availability', {
    method: 'POST',
    headers: authHeader(token, userId),
    body: JSON.stringify(availability),
  })
}

export async function updateAvailability(availabilityId: string, updates: any, token: string, userId?: string) {
  return fetchJson(`/api/availability/${availabilityId}`, {
    method: 'PUT',
    headers: authHeader(token, userId),
    body: JSON.stringify(updates),
  })
}

export async function deleteAvailability(availabilityId: string, token: string, userId?: string) {
  return fetchJson(`/api/availability/${availabilityId}`, {
    method: 'DELETE',
    headers: authHeader(token, userId),
  })
}

export async function updateAppointment(appointment: any, token: string, userId?: string) {
  return fetchJson(`/api/appointments/${appointment.id}`, {
    method: 'PUT',
    headers: authHeader(token, userId),
    body: JSON.stringify(appointment),
  })
}

export async function updateProfile(profile: any, token: string, userId?: string) {
  return fetchJson(`/api/profiles/${profile.user_id ?? profile.id}`, {
    method: 'PUT',
    headers: authHeader(token, userId),
    body: JSON.stringify(profile),
  })
}

export async function deleteProfile(profileId: string, token: string, userId?: string) {
  return fetchJson(`/api/profiles/${profileId}`, {
    method: 'DELETE',
    headers: authHeader(token, userId),
  })
}
