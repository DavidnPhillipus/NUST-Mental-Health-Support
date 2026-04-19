import { useRef, useState } from 'react'
import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

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
                <td>{user.role}</td>
                <td>{user.faculty || 'N/A'}</td>
                <td>Active</td>
                <td>
                  {user.id === context.currentUser.id ? (
                    <span>Current user</span>
                  ) : (
                    <button
                      type="button"
                      className={styles.buttonSecondary}
                      style={{ marginTop: 0, padding: '0.5rem 0.85rem', borderColor: '#ef4444', color: '#b91c1c' }}
                      onClick={() => handleDelete(user.id, user.name)}
                    >
                      Delete
                    </button>
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
