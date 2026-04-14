import styles from '../styles/Sidebar.module.css'
import { LogOut } from 'lucide-react'
import type { NavItem } from '../types'

type SidebarProps = {
  items: NavItem[]
  activePage: string
  currentRoleName: string
  onNavigate(page: string): void
}

export default function Sidebar({
  items,
  activePage,
  currentRoleName,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div>
          <h1>NUST Mental Health</h1>
          <p>Digital mental health support</p>
        </div>
      </div>

      <div className={styles.roleLabel}>
        <span>{currentRoleName}</span>
      </div>

      <nav className={styles.nav}>
        {items.map(item => (
          <button
            key={item.page}
            type="button"
            className={`${styles.navItem} ${activePage === item.page ? styles.active : ''}`}
            onClick={() => onNavigate(item.page)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
        <button type="button" className={styles.signout} onClick={() => onNavigate('logout')}>
          <span><LogOut /></span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
