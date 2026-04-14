import type { ReactNode } from 'react'
import type { ScreenContext } from './index'
import StudentDashboard from './student/StudentDashboard'
import MoodCheckin from './student/MoodCheckin'
import ResourceLibrary from './student/ResourceLibrary'
import Appointments from './student/Appointments'
import Bookmarks from './student/Bookmarks'
import Profile from './student/Profile'

export function getStudentScreen(page: string, context: ScreenContext): { title: string; content: ReactNode } {
  switch (page) {
    case 'mood-checkin':
      return {
        title: 'Mood Check-in',
        content: <MoodCheckin context={context} />,
      }

    case 'resource-library':
      return {
        title: 'Resource Library',
        content: <ResourceLibrary context={context} />,
      }

    case 'appointments':
      return {
        title: 'Appointments',
        content: <Appointments context={context} />,
      }

    case 'bookmarks':
      return {
        title: 'My Bookmarks',
        content: <Bookmarks context={context} />,
      }

    case 'profile':
      return {
        title: 'My Profile',
        content: <Profile context={context} />,
      }

    default:
      return {
        title: `Welcome, ${context.currentUser.name}`,
        content: <StudentDashboard context={context} />,
      }
  }
}
