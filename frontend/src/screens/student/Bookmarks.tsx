import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function Bookmarks({ context }: { context: ScreenContext }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardHeading}>Bookmarked Resources</h3>
      <ul className={styles.smallList}>
        {context.resources.map(r => (
          <li key={r.id} className={styles.smallListItem}>
            <span>{r.title}</span>
            <button type="button" className={styles.buttonSecondary} onClick={() => r.url && window.open(r.url, '_blank')}>
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
