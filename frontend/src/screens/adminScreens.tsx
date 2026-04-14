import type { ReactNode } from 'react'
import type { ScreenContext } from './index'
import AdminDashboard from './admin/AdminDashboard'
import ManageUsers from './admin/ManageUsers'
import AggregateWellness from './admin/AggregateWellness'
import ManageResources from './admin/ManageResources'
import SystemNotifications from './admin/SystemNotifications'
import Profile from './student/Profile'

export function getAdminScreen(page: string, context: ScreenContext): { title: string; content: ReactNode } {
  switch (page) {
    case 'manage-users':
      return {
        title: 'Manage User Accounts',
        content: <ManageUsers context={context} />,
      }

    case 'aggregate-wellness':
      return {
        title: 'Aggregate Wellness Dashboard',
        content: <AggregateWellness context={context} />,
      }

    case 'manage-resources':
      return {
        title: 'Manage Resource Library',
        content: <ManageResources context={context} />,
      }

    case 'system-notifications':
      return {
        title: 'System Notifications',
        content: <SystemNotifications context={context} />,
      }

    case 'profile':
      return {
        title: 'My Profile',
        content: <Profile context={context} />,
      }

    default:
      return {
        title: 'Administrator Dashboard',
        content: <AdminDashboard context={context} />,
      }
  }
}
