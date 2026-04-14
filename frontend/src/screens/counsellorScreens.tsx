import type { ReactNode } from 'react'
import type { ScreenContext } from './index'
import CounsellorDashboard from './counsellor/CounsellorDashboard'
import AppointmentCalendar from './counsellor/AppointmentCalendar'
import SetAvailability from './counsellor/SetAvailability'
import SessionNotes from './counsellor/SessionNotes'
import UrgentFlags from './counsellor/UrgentFlags'
import Profile from './student/Profile'

export function getCounsellorScreen(page: string, context: ScreenContext): { title: string; content: ReactNode } {
  switch (page) {
    case 'appointment-calendar':
      return {
        title: 'Appointment Calendar',
        content: <AppointmentCalendar context={context} />,
      }

    case 'set-availability':
      return {
        title: 'Set Availability',
        content: <SetAvailability context={context} />,
      }

    case 'session-notes':
      return {
        title: 'Session Notes',
        content: <SessionNotes context={context} />,
      }

    case 'urgent-flags':
      return {
        title: 'Urgent Appointment Flags',
        content: <UrgentFlags context={context} />,
      }

    case 'profile':
      return {
        title: 'My Profile',
        content: <Profile context={context} />,
      }

    default:
      return {
        title: `Welcome, ${context.currentUser.name}`,
        content: <CounsellorDashboard context={context} />,
      }
  }
}
