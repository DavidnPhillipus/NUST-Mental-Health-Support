import { useMemo, useState } from 'react'
import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

type AdviceResult = {
  headline: string
  tips: string[]
  priority: 'low' | 'medium' | 'high'
}

const SLEEP_OPTIONS = ['4 hours or less', '5 hours', '6 hours', '7 hours', '8 hours', '9+ hours']
const APPETITE_OPTIONS = ['Low', 'Normal', 'High']
const MOOD_OPTIONS = ['Very low', 'Low', 'Neutral', 'Good', 'Great']
const ENERGY_OPTIONS = ['Very low', 'Low', 'Medium', 'High']
const STRESS_OPTIONS = ['Very high', 'High', 'Moderate', 'Low']

const parseSleepHours = (sleepValue: string) => {
  const match = sleepValue.match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

const generateAdvice = (formData: {
  sleep: string
  appetite: string
  mood: string
  energy: string
  stress: string
}): AdviceResult => {
  const tips: string[] = []
  const mood = formData.mood.toLowerCase()
  const stress = formData.stress.toLowerCase()
  const energy = formData.energy.toLowerCase()
  const appetite = formData.appetite.toLowerCase()
  const sleepHours = parseSleepHours(formData.sleep)

  let riskScore = 0

  if (sleepHours !== null) {
    if (sleepHours < 6) {
      riskScore += 2
      tips.push('Try to target at least 7 hours of sleep tonight. Consider a fixed sleep time and no screens 30 minutes before bed.')
    } else if (sleepHours < 7) {
      riskScore += 1
      tips.push('Your sleep is a bit low. A short wind-down routine can help improve sleep quality.')
    }
  }

  if (mood.includes('bad') || mood.includes('low') || mood.includes('sad')) {
    riskScore += 2
    tips.push('Do one small reset activity today: a 10-minute walk, brief journaling, or talking to someone you trust.')
  }

  if (stress.includes('high') || stress.includes('very')) {
    riskScore += 2
    tips.push('Use a quick stress reset: inhale for 4 seconds, exhale for 6 seconds, repeat for 2 minutes.')
  }

  if (energy.includes('low') || energy.includes('tired')) {
    riskScore += 1
    tips.push('Low energy can improve with hydration and light movement. Take a short stretch break every 60-90 minutes.')
  }

  if (appetite.includes('low') || appetite.includes('poor') || appetite.includes('none')) {
    riskScore += 1
    tips.push('Keep nutrition simple today: try small regular meals or snacks even if appetite is reduced.')
  }

  if (tips.length === 0) {
    tips.push('You seem fairly balanced today. Keep your current routine and check in again tomorrow to track trends.')
  }

  if (riskScore >= 5) {
    tips.push('If this pattern continues for several days, consider reaching out to your counsellor for support.')
    return {
      headline: 'You may need extra support today',
      tips,
      priority: 'high',
    }
  }

  if (riskScore >= 3) {
    return {
      headline: 'Here are a few focused steps for today',
      tips,
      priority: 'medium',
    }
  }

  return {
    headline: 'Nice check-in. Keep the momentum going',
    tips,
    priority: 'low',
  }
}

export default function MoodCheckin({ context }: { context: ScreenContext }) {
  const [formData, setFormData] = useState({
    sleep: '6 hours',
    appetite: 'Normal',
    mood: 'Neutral',
    energy: 'Medium',
    stress: 'High',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [advice, setAdvice] = useState<AdviceResult | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const pastMoodLogs = useMemo(() => {
    return context.moodLogs
      .filter(log => log.student_id === context.currentUser.id)
      .sort((a, b) => {
        const aTime = new Date(a.created_at ?? a.date).getTime()
        const bTime = new Date(b.created_at ?? b.date).getTime()
        return bTime - aTime
      })
  }, [context.moodLogs, context.currentUser.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setAdvice(null)

    try {
      const analysis = generateAdvice(formData)
      await context.onAddMoodLog({
        student_id: context.currentUser.id,
        date: new Date().toISOString().split('T')[0],
        ...formData,
      })
      setMessage({ type: 'success', text: '✅ Mood check-in saved successfully!' })
      setAdvice(analysis)
      setFormData({
        sleep: '6 hours',
        appetite: 'Normal',
        mood: 'Neutral',
        energy: 'Medium',
        stress: 'High',
      })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Failed to save check-in: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className={styles.card}>
      <div className={styles.appointmentRow}>
        <p className={styles.sectionCopy} style={{ marginBottom: 0 }}>How are you feeling today?</p>
        <button
          type="button"
          className={styles.buttonSecondary}
          style={{ marginTop: 0 }}
          onClick={() => setShowHistory(prev => !prev)}
        >
          {showHistory ? 'Hide Past Moods' : 'View Past Moods'}
        </button>
      </div>
      {message && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '8px',
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#7f1d1d',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {message.text}
        </div>
      )}

      {advice && (
        <div
          style={{
            padding: '14px',
            marginBottom: '16px',
            borderRadius: '10px',
            border: advice.priority === 'high' ? '1px solid #fca5a5' : advice.priority === 'medium' ? '1px solid #fde68a' : '1px solid #86efac',
            backgroundColor: advice.priority === 'high' ? '#fef2f2' : advice.priority === 'medium' ? '#fffbeb' : '#f0fdf4',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: '8px',
              color: advice.priority === 'high' ? '#b91c1c' : advice.priority === 'medium' ? '#92400e' : '#166534',
            }}
          >
            🧠 Automated Advice: {advice.headline}
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', lineHeight: 1.6 }}>
            {advice.tips.map(tip => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Sleep</label>
            <select
              className={styles.formSelect}
              value={formData.sleep}
              onChange={e => handleChange('sleep', e.target.value)}
              disabled={loading}
            >
              {SLEEP_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Appetite</label>
            <select
              className={styles.formSelect}
              value={formData.appetite}
              onChange={e => handleChange('appetite', e.target.value)}
              disabled={loading}
            >
              {APPETITE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Mood</label>
            <select
              className={styles.formSelect}
              value={formData.mood}
              onChange={e => handleChange('mood', e.target.value)}
              disabled={loading}
            >
              {MOOD_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Energy</label>
            <select
              className={styles.formSelect}
              value={formData.energy}
              onChange={e => handleChange('energy', e.target.value)}
              disabled={loading}
            >
              {ENERGY_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Stress</label>
            <select
              className={styles.formSelect}
              value={formData.stress}
              onChange={e => handleChange('stress', e.target.value)}
              disabled={loading}
            >
              {STRESS_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? '⏳ Submitting...' : '✅ Submit Check-in'}
        </button>
      </form>

      {showHistory && (
        <div style={{ marginTop: '1.75rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Past Mood Check-ins</h3>
          {pastMoodLogs.length === 0 ? (
            <p className={styles.sectionCopy} style={{ marginBottom: 0 }}>
              No mood history yet. Submit your first check-in to start tracking trends.
            </p>
          ) : (
            <div className={styles.list}>
              {pastMoodLogs.map(log => (
                <article key={log.id} className={styles.listItem}>
                  <div>
                    <strong>{new Date(log.date).toLocaleDateString()}</strong>
                    <p>Mood: {log.mood}</p>
                    <p>Stress: {log.stress}</p>
                  </div>
                  <div>
                    <p>Sleep: {log.sleep}</p>
                    <p>Energy: {log.energy}</p>
                    <p>Appetite: {log.appetite}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
