import { useState } from 'react'
import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function Profile({ context }: { context: ScreenContext }) {
  const [user, setUser] = useState(context.currentUser)

  const avatarColors = ['#1e3a8a', '#0f766e', '#92400e', '#7c2d12', '#374151', '#4338ca']

  const getAvatarColor = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return avatarColors[hash % avatarColors.length]
  }

  const handleSave = () => {
    context.onUpdateUser(user)
  }

  const handleChange = (field: keyof typeof user, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }))
  }

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const codeLabel = user.role === 'student'
    ? 'Student Card Number'
    : user.role === 'counsellor'
      ? 'Counsellor Code'
      : 'Admin Code'

  return (
    <div className={styles.card}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: getAvatarColor(user.name),
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            overflow: 'hidden',
            border: '2px solid #dbeafe',
          }}
        >
          {initials}
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>First Name</label>
          <input className={styles.formInput} value={user.name.split(' ')[0]} onChange={(e) => handleChange('name', e.target.value + ' ' + user.name.split(' ').slice(1).join(' '))} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Last Name</label>
          <input className={styles.formInput} value={user.name.split(' ').slice(1).join(' ')} onChange={(e) => handleChange('name', user.name.split(' ')[0] + ' ' + e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>{codeLabel}</label>
          <input className={styles.formInput} value={user.institutionCode || ''} onChange={(e) => handleChange('institutionCode', e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>NUST Email</label>
          <input className={styles.formInput} value={user.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
        </div>
        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.formLabel}>Faculty</label>
          <input className={styles.formInput} value={user.faculty || ''} onChange={(e) => handleChange('faculty', e.target.value)} />
        </div>
      </div>
      <button type="button" className={styles.button} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  )
}
