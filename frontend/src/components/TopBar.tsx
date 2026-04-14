import styles from '../styles/TopBar.module.css'

type TopBarProps = {
  title: string
  userName: string
  userSubtitle: string
  onShowHelpline(): void
}

const AVATAR_COLORS = ['#1e3a8a', '#0f766e', '#92400e', '#7c2d12', '#374151', '#4338ca']

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const getAvatarColor = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export default function TopBar({
  title,
  userName,
  userSubtitle,
  onShowHelpline,
}: TopBarProps) {
  const initials = getInitials(userName)

  return (
    <header className={styles.topBar}>
      <div>
        <div className={styles.title}>{title}</div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.crisisButton} onClick={onShowHelpline}>
          <span>📞</span>
          <span>Crisis Helpline</span>
        </button>
        <div className={styles.userPanel}>
          <div className={styles.userMeta}>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.userSubtitle}>{userSubtitle}</div>
          </div>
          <div className={styles.userBadge} style={{ backgroundColor: getAvatarColor(userName) }}>
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
