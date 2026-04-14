import type { ScreenContext } from '../index'
import Calendar from '../../components/Calendar'
import styles from '../../styles/Content.module.css'

export default function CounsellorDashboard({ context }: { context: ScreenContext }) {
  const today = new Date().toISOString().split('T')[0]
  const counsellorAppointments = context.appointments.filter(a => a.counsellor_id === context.currentUser.id)
  const todaysAppointments = counsellorAppointments.filter(a => a.date === today)
  const thisWeekAppointments = counsellorAppointments.filter(a => {
    const apptDate = new Date(a.date)
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return apptDate >= weekStart && apptDate <= weekEnd
  })
  const urgentAppointments = counsellorAppointments.filter(a => a.urgent).length
  const supportedStudents = new Set(counsellorAppointments.map(a => a.student_id)).size

  return (
    <div className={styles.screen}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{todaysAppointments.length}</span>
          <span className={styles.statLabel}>Today's Appointments</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{thisWeekAppointments.length}</span>
          <span className={styles.statLabel}>This Week</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: urgentAppointments > 0 ? '#ff6b6b' : '#1e3a8a' }}>
            {urgentAppointments}
          </span>
          <span className={styles.statLabel}>Urgent Flags</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{supportedStudents}</span>
          <span className={styles.statLabel}>Students Supported</span>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Availability & Appointments</h2>
        <Calendar
          appointments={context.appointments}
          availability={context.availability}
          currentUserId={context.currentUser.id}
          userRole="counsellor"
        />
      </div>

      {urgentAppointments > 0 && (
        <div className={styles.card} style={{ marginTop: '2rem', borderColor: '#ff6b6b', borderWidth: '2px' }}>
          <h3 className={styles.cardHeading} style={{ color: '#ff6b6b' }}>
            🚨 {urgentAppointments} Urgent Appointment{urgentAppointments !== 1 ? 's' : ''} Flagged
          </h3>
          <p className={styles.cardText}>Students have flagged {urgentAppointments} appointment{urgentAppointments !== 1 ? 's' : ''} as urgent. Please review them in the Urgent Flags section.</p>
        </div>
      )}
    </div>
  )
}
