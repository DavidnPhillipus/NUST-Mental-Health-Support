import { useState } from 'react'
import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function Appointments({ context }: { context: ScreenContext }) {
  const [selectedCounsellor, setSelectedCounsellor] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [reason, setReason] = useState('')
  const [bookingMessage, setBookingMessage] = useState('')

  const isSlotBooked = (slotId: string) => {
    const slot = context.availability.find(availabilitySlot => availabilitySlot.id === slotId)
    if (!slot) return false

    return context.appointments.some(
      appointment =>
        appointment.counsellor_id === slot.counsellor_id &&
        appointment.date === slot.date &&
        appointment.startTime === slot.startTime &&
        appointment.endTime === slot.endTime &&
        appointment.status !== 'cancelled'
    )
  }

  // Get counselors with their availability
  const counsellorsWithSlots = context.users
    .filter(u => u.role === 'counsellor')
    .map(counsellor => {
      const slots = context.availability.filter(a => a.counsellor_id === counsellor.id)
      return { ...counsellor, slots }
    })
    .filter(c => c.slots.length > 0) // Only show counselors with available slots

  const handleSlotClick = (slotId: string) => {
    setSelectedSlot(slotId)
  }

  const handleBook = async () => {
    if (!selectedSlot) {
      setBookingMessage('Please select a time slot')
      return
    }

    const slot = context.availability.find(a => a.id === selectedSlot)
    if (!slot) return

    if (isSlotBooked(slot.id)) {
      setBookingMessage('That time is already booked. Please choose another slot.')
      return
    }

    try {
      await context.onAddAppointment({
        student_id: context.currentUser.id,
        counsellor_id: slot.counsellor_id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        reason: reason || '',
        status: 'pending',
      })
      setBookingMessage('✅ Appointment request submitted. Waiting for counsellor response.')
      setSelectedSlot('')
      setReason('')
      setTimeout(() => setBookingMessage(''), 3000)
    } catch (error) {
      setBookingMessage('❌ Failed to book appointment: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const pendingAppointments = context.appointments.filter(a => a.student_id === context.currentUser.id && a.status === 'pending')
  const upcoming = context.appointments.filter(a => a.student_id === context.currentUser.id && a.status === 'confirmed')
  const cancelledAppointments = context.appointments.filter(a => a.student_id === context.currentUser.id && a.status === 'cancelled')
  const getCounsellorName = (id: string) => context.users.find(u => u.id === id)?.name || 'Unknown'

  const avatarColors = ['#1e3a8a', '#0f766e', '#92400e', '#7c2d12', '#374151', '#4338ca']

  const getAvatarColor = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return avatarColors[hash % avatarColors.length]
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  const handleCancelAppointment = (appointment: typeof upcoming[number]) => {
    if (!confirm('Cancel this appointment? This slot will become available again.')) return

    const cancellationReason = appointment.reason
      ? `${appointment.reason} (Cancelled by student)`
      : 'Cancelled by student'

    context.onUpdateAppointment({
      ...appointment,
      status: 'cancelled',
      reason: cancellationReason,
      urgent: false,
    })
  }

  const handleToggleUrgent = (appointment: typeof upcoming[number]) => {
    context.onUpdateAppointment({
      ...appointment,
      urgent: !appointment.urgent,
      flagged_by: context.currentUser.id,
    })

    setBookingMessage(appointment.urgent ? 'Urgent flag removed from appointment.' : 'Appointment flagged as urgent.')
    setTimeout(() => setBookingMessage(''), 2500)
  }

  return (
    <div>
      <div className={styles.card}>
        <h3 className={styles.cardHeading}>📅 Available Counsellors</h3>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Select a counsellor and choose an available time slot below
        </p>

        {counsellorsWithSlots.length === 0 ? (
          <p style={{ color: '#999' }}>No counsellors have available slots at the moment</p>
        ) : (
          <div>
            {counsellorsWithSlots.map(counsellor => (
              <div
                key={counsellor.id}
                className={styles.counsellorCard}
                style={{ backgroundColor: selectedCounsellor === counsellor.id ? '#f0f8ff' : '#fff' }}
              >
                <div
                  className={styles.counsellorHeader}
                  onClick={() => setSelectedCounsellor(counsellor.id)}
                >
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: getAvatarColor(counsellor.name),
                      color: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}
                  >
                    {getInitials(counsellor.name)}
                  </span>
                  {counsellor.name}
                </div>
                <div className={styles.slotGrid}>
                  {counsellor.slots.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isSlotBooked(slot.id)}
                      onClick={() => {
                        if (isSlotBooked(slot.id)) {
                          setBookingMessage('That time is already booked. Please choose another slot.')
                          return
                        }
                        setSelectedCounsellor(counsellor.id)
                        handleSlotClick(slot.id)
                      }}
                      style={{
                        padding: '0.75rem',
                        border: isSlotBooked(slot.id)
                          ? '1px solid #fca5a5'
                          : selectedSlot === slot.id
                            ? '2px solid #2196F3'
                            : '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: isSlotBooked(slot.id)
                          ? '#fee2e2'
                          : selectedSlot === slot.id
                            ? '#e3f2fd'
                            : '#f9f9f9',
                        cursor: isSlotBooked(slot.id) ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s',
                        opacity: isSlotBooked(slot.id) ? 0.8 : 1,
                      }}
                    >
                      <div style={{ fontWeight: '500' }}>📆 {slot.date}</div>
                      <div style={{ fontSize: '0.85rem', color: isSlotBooked(slot.id) ? '#b91c1c' : '#666' }}>
                        {slot.startTime} - {slot.endTime} {isSlotBooked(slot.id) ? '• Booked' : '• Available'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSlot && (
          <div className={styles.bookingPanel}>
            <label className={styles.formLabel}>Reason for appointment (optional)</label>
            <textarea
              className={styles.formTextarea}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="E.g., Stress management, Career guidance, etc."
              style={{ marginBottom: '1rem' }}
            />
            <button className={styles.button} onClick={handleBook} style={{ marginBottom: '0', marginTop: '1rem' }}>
              ✅ Confirm Booking
            </button>
            {bookingMessage && (
              <div style={{ marginTop: '1rem', color: bookingMessage.includes('✅') ? '#4caf50' : '#f44336', fontSize: '0.9rem' }}>
                {bookingMessage}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.card} style={{ marginTop: '2rem' }}>
        <h3 className={styles.cardHeading}>⏳ Pending Requests</h3>
        {pendingAppointments.length === 0 ? (
          <p style={{ color: '#999' }}>No pending appointment requests</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingAppointments.map(a => (
              <div
                key={a.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #fde68a',
                  borderRadius: '4px',
                  backgroundColor: '#fffbeb',
                }}
              >
                <div style={{ fontWeight: '500' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: getAvatarColor(getCounsellorName(a.counsellor_id)),
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {getInitials(getCounsellorName(a.counsellor_id))}
                    </span>
                    {getCounsellorName(a.counsellor_id)}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  📅 {a.date || 'TBD'} • 🕐 {a.startTime || 'TBD'}
                  {a.endTime && <span> - {a.endTime}</span>}
                </div>
                {a.reason && <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.35rem' }}>💭 {a.reason}</div>}
                <div style={{ fontSize: '0.8rem', color: '#92400e', marginTop: '0.5rem', fontWeight: 600 }}>
                  Waiting for counsellor to accept or reject
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.card} style={{ marginTop: '2rem' }}>
        <h3 className={styles.cardHeading}>📋 Your Appointments</h3>
        {upcoming.length === 0 ? (
          <p style={{ color: '#999' }}>You have no confirmed appointments yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcoming.map(a => (
              <div
                key={a.id}
                style={{
                  padding: '1rem',
                  border: a.urgent ? '2px solid #ff6b6b' : '1px solid #e0e0e0',
                  borderRadius: '4px',
                  backgroundColor: a.urgent ? '#ffe6e6' : '#f9f9f9',
                }}
              >
                <div className={styles.appointmentRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: getAvatarColor(getCounsellorName(a.counsellor_id)),
                            color: '#fff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        >
                          {getInitials(getCounsellorName(a.counsellor_id))}
                        </span>
                        {getCounsellorName(a.counsellor_id)}
                      </span>
                      {a.urgent && <span style={{ color: '#ff6b6b', marginLeft: '0.5rem' }}>🚨 URGENT</span>}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                      📅 {a.date || 'TBD'} • 🕐 {a.startTime || 'TBD'}
                      {a.endTime && <span> - {a.endTime}</span>}
                    </div>
                    {a.reason && <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>💭 {a.reason}</div>}
                  </div>
                  <div className={styles.appointmentActions}>
                    <button
                      onClick={() => handleToggleUrgent(a)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: a.urgent ? '#ff6b6b' : '#ddd',
                        color: a.urgent ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {a.urgent ? '✓ Flagged' : 'Flag 🚨'}
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(a)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: '#f87171',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.card} style={{ marginTop: '2rem' }}>
        <h3 className={styles.cardHeading}>🗂️ Cancelled Appointments</h3>
        {cancelledAppointments.length === 0 ? (
          <p style={{ color: '#999' }}>No cancelled appointments.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cancelledAppointments.map(a => (
              <div
                key={a.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #fecaca',
                  borderRadius: '4px',
                  backgroundColor: '#fef2f2',
                }}
              >
                <div style={{ fontWeight: '600', color: '#b91c1c' }}>Cancelled</div>
                <div style={{ marginTop: '0.4rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: getAvatarColor(getCounsellorName(a.counsellor_id)),
                      color: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}
                  >
                    {getInitials(getCounsellorName(a.counsellor_id))}
                  </span>
                  {getCounsellorName(a.counsellor_id)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.35rem' }}>
                  📅 {a.date || 'TBD'} • 🕐 {a.startTime || 'TBD'}{a.endTime ? ` - ${a.endTime}` : ''}
                </div>
                {a.reason && <div style={{ fontSize: '0.85rem', color: '#991b1b', marginTop: '0.35rem' }}>💭 {a.reason}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
