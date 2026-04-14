import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function SystemNotifications({ context }: { context: ScreenContext }) {
  const pendingAppointments = context.appointments.filter(a => a.status === 'pending')
  const badMoodLogs = context.moodLogs.filter(log => log.mood === 'Bad')

  return (
    <div className={styles.card}>
      <div className={styles.noticeGrid}>
        {pendingAppointments.map(a => (
          <div key={a.id} className={styles.noticeCard}>Pending appointment from student {a.student_id} on {a.date} at {a.time}</div>
        ))}
        {badMoodLogs.map(log => (
          <div key={log.id} className={styles.noticeCard}>Bad mood reported by student {log.student_id} on {log.date}</div>
        ))}
        {pendingAppointments.length === 0 && badMoodLogs.length === 0 && (
          <div className={styles.noticeCard}>No new notifications</div>
        )}
      </div>
    </div>
  )
}
