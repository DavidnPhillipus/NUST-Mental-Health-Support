import { useEffect, useMemo, useState } from 'react'
import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function SessionNotes({ context }: { context: ScreenContext }) {
  const [selectedAppointment, setSelectedAppointment] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const myAppointments = useMemo(
    () => context.appointments.filter(a =>
      a.counsellor_id === context.currentUser.id &&
      (a.status === 'confirmed' || a.status === 'completed')
    ),
    [context.appointments, context.currentUser.id]
  )

  const myNotes = useMemo(
    () => context.sessionNotes
      .filter(note => note.counsellor_id === context.currentUser.id)
      .sort((a, b) => String(b.created_at ?? b.date).localeCompare(String(a.created_at ?? a.date))),
    [context.sessionNotes, context.currentUser.id]
  )

  const getStudentName = (appointmentId: string) => {
    const appointment = context.appointments.find(entry => entry.id === appointmentId)
    if (!appointment) return 'Unknown student'
    const embeddedName = (appointment as any).student?.name
    if (embeddedName) return embeddedName
    return context.users.find(user => user.id === appointment.student_id)?.name || appointment.student_id
  }

  useEffect(() => {
    const queryString = context.currentPage.split('?')[1]
    if (!queryString) return

    const appointmentId = new URLSearchParams(queryString).get('appointment')
    if (appointmentId && myAppointments.some(appointment => appointment.id === appointmentId)) {
      setSelectedAppointment(appointmentId)
    }
  }, [context.currentPage, myAppointments])

  useEffect(() => {
    if (!selectedAppointment && myAppointments.length > 0) {
      setSelectedAppointment(myAppointments[0].id)
    }
  }, [myAppointments, selectedAppointment])

  const selectedAppointmentDetails = myAppointments.find(appointment => appointment.id === selectedAppointment)

  const handleSave = async () => {
    if (!selectedAppointment || !notes.trim()) {
      setFeedback({ type: 'error', message: 'Select an appointment and enter session notes first.' })
      return
    }

    try {
      setSaving(true)
      await context.onAddSessionNote({
        appointment_id: selectedAppointment,
        counsellor_id: context.currentUser.id,
        notes: notes.trim(),
        date: new Date().toISOString().split('T')[0],
      })
      setFeedback({ type: 'success', message: 'Session note saved successfully.' })
      setNotes('')
    } catch (error) {
      setFeedback({ type: 'error', message: (error as Error).message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.card}>
      {feedback && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.8rem 1rem',
            borderRadius: '0.75rem',
            border: `1px solid ${feedback.type === 'success' ? '#86efac' : '#fca5a5'}`,
            background: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: feedback.type === 'success' ? '#166534' : '#991b1b',
            fontWeight: 600,
          }}
        >
          {feedback.message}
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select Appointment</label>
        <select className={styles.formSelect} value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)}>
          <option value="">Choose an appointment</option>
          {myAppointments.map(a => (
            <option key={a.id} value={a.id}>
              {a.date} • {a.startTime} - {a.endTime} • {getStudentName(a.id)}
            </option>
          ))}
        </select>
      </div>

      {myAppointments.length === 0 && (
        <p className={styles.sectionCopy} style={{ marginTop: '0.5rem' }}>
          No confirmed or completed appointments are available for notes yet.
        </p>
      )}

      {selectedAppointmentDetails && (
        <div className={styles.noticeCard} style={{ marginTop: '1rem', marginBottom: '1rem', background: '#eef2ff', borderColor: '#c7d2fe', color: '#1e3a8a' }}>
          <strong>Selected appointment</strong>
          <div>
            {selectedAppointmentDetails.date} • {selectedAppointmentDetails.startTime} - {selectedAppointmentDetails.endTime}
          </div>
          <div>{getStudentName(selectedAppointmentDetails.id)}</div>
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Session Notes</label>
        <textarea className={styles.formTextarea} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write session notes here…" />
      </div>
      <button type="button" className={styles.button} onClick={() => void handleSave()} disabled={saving}>
        {saving ? 'Saving...' : 'Save Notes'}
      </button>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 className={styles.cardHeading}>Saved Notes</h3>
        {myNotes.length === 0 ? (
          <p className={styles.sectionCopy} style={{ marginBottom: 0 }}>
            No session notes saved yet.
          </p>
        ) : (
          <div className={styles.smallList}>
            {myNotes.map(note => (
              <div key={note.id} className={styles.smallListItem} style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
                <strong>{note.date} • {getStudentName(note.appointment_id)}</strong>
                <p className={styles.cardText} style={{ marginTop: '0.5rem' }}>{note.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
