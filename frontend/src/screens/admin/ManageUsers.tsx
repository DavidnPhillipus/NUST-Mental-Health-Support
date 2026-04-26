import { useRef, useState } from 'react'
import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

const roles = ['student', 'counsellor', 'admin'] as const

export default function ManageUsers({ context }: { context: ScreenContext }) {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const toastTimer = useRef<number | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current)
    }
    toastTimer.current = window.setTimeout(() => {
      setToast(null)
      toastTimer.current = null
    }, 3000)
  }

  const handleDelete = async (userId: string, userName: string) => {
    const confirmed = window.confirm(`Delete ${userName}? This will remove related appointments and records.`)
    if (!confirmed) return

    try {
      await context.onDeleteUser(userId)
      showToast('success', `${userName} was deleted successfully.`)
    } catch (error) {
      showToast('error', (error as Error).message)
    }
  }

  const handleRoleChange = async (userId: string, nextRole: (typeof roles)[number]) => {
    const user = context.users.find(entry => entry.id === userId)
    if (!user) return

    try {
      await context.onUpdateUser({ ...user, role: nextRole })
      showToast('success', `${user.name}'s role was updated.`)
    } catch (error) {
      showToast('error', (error as Error).message)
    }
  }

  const handleToggleActive = async (userId: string) => {
    const user = context.users.find(entry => entry.id === userId)
    if (!user) return

    try {
      await context.onUpdateUser({ ...user, active: user.active === false ? true : false })
      showToast('success', `${user.name} was ${user.active === false ? 'reactivated' : 'deactivated'}.`)
    } catch (error) {
      showToast('error', (error as Error).message)
    }
  }

  return (
    <div className={styles.card}>
      {toast && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.8rem 1rem',
            borderRadius: '0.75rem',
            border: `1px solid ${toast.type === 'success' ? '#86efac' : '#fca5a5'}`,
            background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: toast.type === 'success' ? '#166534' : '#991b1b',
            fontWeight: 600,
          }}
        >
          {toast.message}
        </div>
      )}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Faculty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {context.users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.id === context.currentUser.id ? (
                    user.role
                  ) : (
                    <select
                      className={styles.formSelect}
                      style={{ margin: 0, minWidth: '9rem', padding: '0.7rem 0.9rem' }}
                      value={user.role}
                      onChange={(event) => void handleRoleChange(user.id, event.target.value as (typeof roles)[number])}
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td>{user.faculty || 'N/A'}</td>
                <td>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '999px',
                    background: user.active === false ? '#fee2e2' : '#dcfce7',
                    color: user.active === false ? '#991b1b' : '#166534',
                    fontWeight: 700,
                  }}>
                    {user.active === false ? 'Deactivated' : 'Active'}
                  </span>
                </td>
                <td>
                  {user.id === context.currentUser.id ? (
                    <span>Current user</span>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={styles.buttonSecondary}
                        style={{ marginTop: 0, padding: '0.5rem 0.85rem' }}
                        onClick={() => void handleToggleActive(user.id)}
                      >
                        {user.active === false ? 'Reactivate' : 'Deactivate'}
                      </button>
                      <button
                        type="button"
                        className={styles.buttonSecondary}
                        style={{ marginTop: 0, padding: '0.5rem 0.85rem', borderColor: '#ef4444', color: '#b91c1c' }}
                        onClick={() => void handleDelete(user.id, user.name)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
