import type { ReactNode } from 'react'
import type { Role, User, Appointment, MoodLog, Resource, SessionNote, Availability } from '../types'
import { getStudentScreen } from './studentScreens'
import { getCounsellorScreen } from './counsellorScreens'
import { getAdminScreen } from './adminScreens'

export type ScreenContext = {
  currentUser: User
  currentPage: string
  appointments: Appointment[]
  moodLogs: MoodLog[]
  resources: Resource[]
  sessionNotes: SessionNote[]
  users: User[]
  availability: Availability[]
  onNavigate(page: string): void
  onFeedback(message: string): void
  onAddAppointment(appointment: Omit<Appointment, 'id' | 'created_at'>): void
  onAddMoodLog(moodLog: Omit<MoodLog, 'id' | 'created_at'>): void
  onAddResource(resource: Omit<Resource, 'id' | 'created_at'>): void
  onAddSessionNote(sessionNote: Omit<SessionNote, 'id' | 'created_at'>): void
  onUpdateAppointment(appointment: Appointment): void
  onAddAvailability(availability: Omit<Availability, 'id' | 'created_at'>): void
  onDeleteAvailability(availabilityId: string): void
  onUpdateAvailability(availabilityId: string, updates: Partial<Omit<Availability, 'id'>>): void
  onUpdateUser(user: User): void
}

export type ScreenDefinition = {
  title: string
  content: ReactNode
}

export function getScreen(role: Role, page: string, context: ScreenContext): ScreenDefinition {
  const basePage = page.split('?')[0]

  if (role === 'counsellor') {
    return getCounsellorScreen(basePage, context)
  }

  if (role === 'admin') {
    return getAdminScreen(basePage, context)
  }

  return getStudentScreen(basePage, context)
}
