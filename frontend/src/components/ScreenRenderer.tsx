import type { ScreenContext } from '../screens'
import type { ScreenDefinition } from '../screens'
import { getScreen } from '../screens'
import styles from '../styles/Content.module.css'

type ScreenRendererProps = {
  context: ScreenContext
}

export default function ScreenRenderer({ context }: ScreenRendererProps) {
  const screen: ScreenDefinition = getScreen(context.currentUser.role, context.currentPage, context)

  return (
    <section className={styles.screen}>
      <div className={styles.screenHeader}>
        <h2 className={styles.screenTitle}>{screen.title}</h2>
      </div>
      {screen.content}
    </section>
  )
}
