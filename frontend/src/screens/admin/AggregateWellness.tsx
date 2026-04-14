import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function AggregateWellness({ context }: { context: ScreenContext }) {
  const totalLogs = context.moodLogs.length
  const averageMood = totalLogs > 0 ? context.moodLogs.reduce((sum, log) => sum + (log.mood === 'Good' ? 3 : log.mood === 'Neutral' ? 2 : 1), 0) / totalLogs : 0

  return (
    <div className={styles.card}>
      <div className={styles.cardHeading}>Aggregate Wellness Dashboard</div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{totalLogs}</span>
          <span className={styles.statLabel}>Total Mood Logs</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{averageMood.toFixed(1)}</span>
          <span className={styles.statLabel}>Average Mood Score</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{context.appointments.filter(a => a.status === 'completed').length}</span>
          <span className={styles.statLabel}>Completed Sessions</span>
        </div>
      </div>
    </div>
  )
}
