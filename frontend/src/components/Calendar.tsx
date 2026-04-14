import { useEffect, useState, useMemo } from 'react'
import type { Appointment, Availability } from '../types'
import styles from '../styles/Calendar.module.css'

interface CalendarProps {
  appointments: Appointment[]
  availability: Availability[]
  currentUserId: string
  userRole: 'student' | 'counsellor'
  counsellorId?: string
}

export default function Calendar({
  appointments,
  availability,
  currentUserId,
  userRole,
  counsellorId,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const monthString = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const formatSlotRange = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return 'TBD'
    return `${startTime} - ${endTime}`
  }

  const formatDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const isUpcomingOrOngoingSlot = (dateString: string, startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return true
    const todayString = formatDateString(now)
    if (dateString !== todayString) return true
    return endTime >= currentTime
  }

  const sortByStartTime = <T extends { startTime?: string }>(items: T[]) =>
    [...items].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))

  const addUniqueSlot = (
    slots: Array<{ type: 'booked' | 'available'; range: string; startTime?: string }>,
    slot: { type: 'booked' | 'available'; range: string; startTime?: string }
  ) => {
    if (!slots.some(existing => existing.range === slot.range && existing.type === slot.type)) {
      slots.push(slot)
    }
  }

  const getDaySummary = (day: number | null) => {
    if (!day) return null

    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayAppointments = appointments.filter(
      appointment =>
        appointment.date === dateString &&
        appointment.status !== 'cancelled' &&
        isUpcomingOrOngoingSlot(dateString, appointment.startTime, appointment.endTime)
    )
    const dayAvailability = availability.filter(
      slot => slot.date === dateString && isUpcomingOrOngoingSlot(dateString, slot.startTime, slot.endTime)
    )

    if (userRole === 'counsellor') {
      const myAppointments = dayAppointments.filter(appointment => appointment.counsellor_id === currentUserId)
      const myAvailability = dayAvailability.filter(slot => slot.counsellor_id === currentUserId)

      const sortedAppointments = sortByStartTime(myAppointments)
      if (sortedAppointments.length > 0) {
        const nextBooked = sortedAppointments[0]
        return {
          type: 'booked' as const,
          range: formatSlotRange(nextBooked.startTime, nextBooked.endTime),
        }
      }

      const sortedAvailability = sortByStartTime(myAvailability)
      if (sortedAvailability.length > 0) {
        const nextAvailable = sortedAvailability[0]
        return {
          type: 'available' as const,
          range: formatSlotRange(nextAvailable.startTime, nextAvailable.endTime),
        }
      }

      return null
    }

    const studentAppointments = dayAppointments.filter(appointment => appointment.student_id === currentUserId)
    const counsellorAvailability = counsellorId
      ? dayAvailability.filter(slot => slot.counsellor_id === counsellorId)
      : dayAvailability

    const bookedForCounsellor = dayAppointments.filter(
      appointment => appointment.counsellor_id === counsellorId && appointment.status !== 'cancelled'
    )

    const nextSlots: Array<{ type: 'booked' | 'available'; range: string; startTime?: string }> = []

    studentAppointments.forEach(appointment => {
      addUniqueSlot(nextSlots, {
        type: 'booked',
        range: formatSlotRange(appointment.startTime, appointment.endTime),
        startTime: appointment.startTime,
      })
    })

    bookedForCounsellor.forEach(appointment => {
      addUniqueSlot(nextSlots, {
        type: 'booked',
        range: formatSlotRange(appointment.startTime, appointment.endTime),
        startTime: appointment.startTime,
      })
    })

    counsellorAvailability.forEach(slot => {
      const isBooked = bookedForCounsellor.some(
        appointment => appointment.startTime === slot.startTime && appointment.endTime === slot.endTime
      )
      addUniqueSlot(nextSlots, {
        type: isBooked ? 'booked' : 'available',
        range: formatSlotRange(slot.startTime, slot.endTime),
        startTime: slot.startTime,
      })
    })

    const sortedNextSlots = sortByStartTime(nextSlots)
    const nextSlot = sortedNextSlots[0]
    if (!nextSlot) {
      return null
    }

    return {
      type: nextSlot.type,
      range: nextSlot.range,
    }
  }

  // Generate calendar days
  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const calendarDays = []

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i)
    }

    return calendarDays
  }, [currentDate])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className={`${styles.calendarContainer} ${userRole === 'student' ? styles.studentCalendar : ''}`}>
      <div className={styles.calendarHeader}>
        <button onClick={handlePrevMonth} className={styles.navButton}>
          ←
        </button>
        <h3 className={styles.monthTitle}>{monthString}</h3>
        <button onClick={handleNextMonth} className={styles.navButton}>
          →
        </button>
      </div>

      <div className={styles.weekDays}>
        <div className={styles.weekDay}>Sun</div>
        <div className={styles.weekDay}>Mon</div>
        <div className={styles.weekDay}>Tue</div>
        <div className={styles.weekDay}>Wed</div>
        <div className={styles.weekDay}>Thu</div>
        <div className={styles.weekDay}>Fri</div>
        <div className={styles.weekDay}>Sat</div>
      </div>

      <div className={styles.daysGrid}>
        {days.map((day, index) => {
          const status = day ? getDaySummary(day) : null
          const hasBooked = status?.type === 'booked'
          const hasAvailable = status?.type === 'available'

          return (
            <div
              key={index}
              className={`${styles.dayCell} ${
                day ? styles.dayWithNumber : styles.emptyDay
              } ${hasAvailable ? styles.available : ''} ${hasBooked ? styles.booked : ''}`}
            >
              {day && (
                <>
                  <div className={styles.dayNumber}>{day}</div>
                  {status && (
                    <div className={styles.slotInfo}>
                      <div className={styles.slotRow}>
                        <span className={`${styles.statusBadge} ${hasBooked ? styles.bookedBadge : styles.availableBadge}`}>
                          {hasBooked ? 'B' : 'A'}
                        </span>
                        <span className={styles.slotTimes}>
                          <span className={`${styles.timeChip} ${hasBooked ? styles.bookedTime : styles.availableTime}`}>
                            {status.range}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.availableColor}`}></div>
          <span>Available Slots</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.bookedColor}`}></div>
          <span>Booked Appointments</span>
        </div>
      </div>
    </div>
  )
}
