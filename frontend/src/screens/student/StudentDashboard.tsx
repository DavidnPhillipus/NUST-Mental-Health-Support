import type { ScreenContext } from '../index'
import Calendar from '../../components/Calendar'
import styles from '../../styles/Content.module.css'

export default function StudentDashboard({ context }: { context: ScreenContext }) {
  return (
    <div className={styles.screen}>
      <div className={styles.grid3}>
        <article className={`${styles.card} ${styles.cardClickable}`} onClick={() => context.onNavigate('mood-checkin')}>
          <h3 className={styles.cardHeading}>Mood Check-in</h3>
          <p className={styles.cardText}>How are you feeling today?</p>
          <div className={styles.moodChips}>
            <span className={styles.moodChip}>1</span>
            <span className={styles.moodChip}>2</span>
            <span className={styles.moodChip}>3</span>
            <span className={styles.moodChip}>4</span>
            <span className={styles.moodChip}>5</span>
          </div>
        </article>
        <article className={`${styles.card} ${styles.cardClickable}`} onClick={() => context.onNavigate('resource-library')}>
          <h3 className={styles.cardHeading}>Resource Library</h3>
          <p className={styles.cardText}>Browse self-help tools and guides.</p>
        </article>
        <article className={`${styles.card} ${styles.cardClickable}`} onClick={() => context.onNavigate('appointments')}>
          <h3 className={styles.cardHeading}>Book Appointment</h3>
          <p className={styles.cardText}>Next available slot: Tomorrow 10:00.</p>
          <button type="button" className={styles.button} style={{ marginTop: '1rem' }}>
            Book Now
          </button>
        </article>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Appointment Calendar</h2>
        <Calendar
          appointments={context.appointments}
          availability={context.availability}
          currentUserId={context.currentUser.id}
          userRole="student"
        />
      </div>
    </div>
  )
}
