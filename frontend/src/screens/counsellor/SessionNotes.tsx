import { useEffect, useMemo, useState } from 'react'
import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function SessionNotes({ context }: { context: ScreenContext }) {
  const [selectedAppointment, setSelectedAppointment] = useState('')
  const [notes, setNotes] = useState('')

  const myAppointments = useMemo(
    () => context.appointments.filter(a => a.counsellor_id === context.currentUser.id && a.status === 'confirmed'),
    [context.appointments, context.currentUser.id]
  )

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
    if (selectedAppointment && notes) {
      await context.onAddSessionNote({
        appointment_id: selectedAppointment,
        counsellor_id: context.currentUser.id,
        notes,
        date: new Date().toISOString().split('T')[0],
      })
      setNotes('')
      setSelectedAppointment('')
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select Appointment</label>
        <select className={styles.formSelect} value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)}>
          <option value="">Choose an appointment</option>
          {myAppointments.map(a => (
            <option key={a.id} value={a.id}>
              {a.date} • {a.startTime} - {a.endTime} • {context.users.find(user => user.id === a.student_id)?.name || a.student_id}
            </option>
          ))}
        </select>
      </div>

      {selectedAppointmentDetails && (
        <div className={styles.noticeCard} style={{ marginTop: '1rem', marginBottom: '1rem', background: '#eef2ff', borderColor: '#c7d2fe', color: '#1e3a8a' }}>
          <strong>Selected appointment</strong>
          <div>
            {selectedAppointmentDetails.date} • {selectedAppointmentDetails.startTime} - {selectedAppointmentDetails.endTime}
          </div>
          <div>{context.users.find(user => user.id === selectedAppointmentDetails.student_id)?.name || selectedAppointmentDetails.student_id}</div>
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Session Notes</label>
        <textarea className={styles.formTextarea} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write session notes here…" />
      </div>
      <button type="button" className={styles.button} onClick={handleSave}>
        Save Notes
      </button>
    </div>
  )
}
