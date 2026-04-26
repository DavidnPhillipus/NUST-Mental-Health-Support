import type { ReactNode } from 'react'

export type Role = 'student' | 'counsellor' | 'admin'

export type Page = string

export type User = {
  name: string
  id: string
  institutionCode?: string
  auth_id?: string
  role: Role
  active?: boolean
  email?: string
  faculty?: string
}

export type Profile = {
  user_id: string
  display_id: string
  name: string
  role: Role
  active?: boolean
  email: string
  faculty?: string
}

export type NavItem = {
  icon: ReactNode
  label: string
  page: string
}

export type Appointment = {
  id: string
  student_id: string
  counsellor_id: string
  availability_id?: string
  date: string
  startTime?: string
  endTime?: string
  time?: string
  reason?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  urgent?: boolean
  flagged_by?: string
  created_at?: string
}

export type MoodLog = {
  id: string
  student_id: string
  date: string
  mood: string
  sleep: string
  appetite: string
  energy: string
  stress: string
  created_at?: string
}

export type Resource = {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'tool'
  category: string
  approvalStatus: 'pending' | 'approved'
  url?: string
  created_at?: string
}

export type Availability = {
  id: string
  counsellor_id: string
  date: string
  startTime: string
  endTime: string
  created_at?: string
}

export type SessionNote = {
  id: string
  appointment_id: string
  counsellor_id: string
  notes: string
  date: string
  created_at?: string
}
