import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function UrgentFlags({ context }: { context: ScreenContext }) {
  // Get urgent appointments for this counselor
  const urgentAppointments = context.appointments.filter(
    a => a.counsellor_id === context.currentUser.id && a.urgent
  )

  // Get bad mood logs (students with mental health concerns)
  const badMoodLogs = context.moodLogs.filter(log => log.mood === 'Bad')
  const today = new Date().toISOString().split('T')[0]
  const todaysBadLogs = badMoodLogs.filter(log => log.date === today)

  const getStudentName = (id: string) => context.users.find(u => u.id === id)?.name || id

  const avatarColors = ['#1e3a8a', '#0f766e', '#92400e', '#7c2d12', '#374151', '#4338ca']

  const getAvatarColor = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return avatarColors[hash % avatarColors.length]
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (
    <div>
      <div className={styles.noticeGrid}>
        <div className={styles.noticeCard}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff6b6b' }}>{urgentAppointments.length}</div>
          <div>Flagged Appointments</div>
        </div>
        <div className={styles.noticeCard}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f97316' }}>{badMoodLogs.length}</div>
          <div>Students with Bad Mood</div>
        </div>
        <div className={styles.noticeCard}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff6b6b' }}>{todaysBadLogs.length}</div>
          <div>Bad Mood Today</div>
        </div>
      </div>

      {urgentAppointments.length > 0 && (
        <div className={styles.card} style={{ marginTop: '1.5rem', borderColor: '#ff6b6b', borderWidth: '2px' }}>
          <h3 className={styles.cardHeading} style={{ color: '#ff6b6b' }}>
            🚨 Urgent Appointments
          </h3>
          <div className={styles.list}>
            {urgentAppointments.map(appointment => (
              <div
                key={appointment.id}
                className={styles.listItem}
                style={{ borderColor: '#ff6b6b', backgroundColor: '#ffe6e6' }}
              >
                <div>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: getAvatarColor(getStudentName(appointment.student_id)),
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {getInitials(getStudentName(appointment.student_id))}
                    </span>
                    {getStudentName(appointment.student_id)}
                  </strong>
                  <p>📅 {appointment.date} at {appointment.startTime}</p>
                  <p>💬 Reason: {appointment.reason || 'Not specified'}</p>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>Flagged by: {appointment.flagged_by === appointment.student_id ? 'Student' : 'Counsellor'}</p>
                </div>
                <span style={{ color: '#ff6b6b', fontWeight: '700', fontSize: '1.5rem' }}>!</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {badMoodLogs.length > 0 && (
        <div className={styles.card} style={{ marginTop: '1.5rem' }}>
          <h3 className={styles.cardHeading}>😔 Students with Bad Mood</h3>
          <div className={styles.list}>
            {badMoodLogs.map(log => (
              <div key={log.id} className={styles.listItem}>
                <div>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: getAvatarColor(getStudentName(log.student_id)),
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {getInitials(getStudentName(log.student_id))}
                    </span>
                    {getStudentName(log.student_id)}
                  </strong>
                  <p>📅 {log.date}</p>
                  <p>Sleep: {log.sleep} | Energy: {log.energy} | Stress: {log.stress}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {urgentAppointments.length === 0 && badMoodLogs.length === 0 && (
        <div className={styles.card} style={{ marginTop: '1.5rem' }}>
          <p className={styles.cardText} style={{ textAlign: 'center', color: '#999' }}>
            ✓ No urgent flags at this time. All students appear to be doing well!
          </p>
        </div>
      )}
    </div>
  )
}
