import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function AdminDashboard({ context }: { context: ScreenContext }) {
  const totalUsers = context.users.length
  const totalLogs = context.moodLogs.length
  const averageMood = totalLogs > 0 ? context.moodLogs.reduce((sum, log) => sum + (log.mood === 'Good' ? 3 : log.mood === 'Neutral' ? 2 : 1), 0) / totalLogs : 0
  const totalAppointments = context.appointments.length
  const crisisRate = totalLogs > 0 ? (context.moodLogs.filter(log => log.mood === 'Bad').length / totalLogs * 100).toFixed(1) : 0

  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{totalUsers}</span>
          <span className={styles.statLabel}>Registered Users</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{averageMood.toFixed(1)}</span>
          <span className={styles.statLabel}>Avg Mood Score</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{crisisRate}%</span>
          <span className={styles.statLabel}>Crisis Rate</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{totalAppointments}</span>
          <span className={styles.statLabel}>Appointments</span>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginTop: 0 }}>Users in Database</h3>
        <p className={styles.sectionCopy} style={{ marginTop: 0 }}>
          Showing {context.users.length} registered users fetched from the database.
        </p>
        {context.users.length === 0 ? (
          <p className={styles.sectionCopy} style={{ marginBottom: 0 }}>
            No users have been registered yet.
          </p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Faculty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {context.users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.faculty || 'N/A'}</td>
                    <td>{user.active === false ? 'Deactivated' : 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
