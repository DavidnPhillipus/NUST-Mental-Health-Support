import { useState } from 'react'
import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'
import { Trash2, Edit2, X, Check } from 'lucide-react'

export default function SetAvailability({ context }: { context: ScreenContext }) {
  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' })
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState({ date: '', startTime: '', endTime: '' })
  const today = new Date().toISOString().split('T')[0]

  const handleAdd = async () => {
    setError('')

    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      setError('Please fill in all fields')
      return
    }

    if (newSlot.date < today) {
      setError('Please choose today or a future date')
      return
    }

    if (newSlot.startTime >= newSlot.endTime) {
      setError('End time must be after start time')
      return
    }

    try {
      await context.onAddAvailability({
        counsellor_id: context.currentUser.id,
        date: newSlot.date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
      })
      setNewSlot({ date: '', startTime: '', endTime: '' })
    } catch (err) {
      setError('Failed to add availability: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this availability slot?')) {
      context.onDeleteAvailability(id)
    }
  }

  const handleEditStart = (avail: any) => {
    setEditingId(avail.id)
    setEditingData({
      date: avail.date,
      startTime: avail.startTime,
      endTime: avail.endTime,
    })
  }

  const handleEditSave = () => {
    setError('')

    if (!editingData.date || !editingData.startTime || !editingData.endTime) {
      setError('Please fill in all fields')
      return
    }

    if (editingData.date < today) {
      setError('Please choose today or a future date')
      return
    }

    if (editingData.startTime >= editingData.endTime) {
      setError('End time must be after start time')
      return
    }

    if (editingId) {
      context.onUpdateAvailability(editingId, {
        date: editingData.date,
        startTime: editingData.startTime,
        endTime: editingData.endTime,
      })
      setEditingId(null)
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setError('')
  }

  const myAvailability = context.availability.filter(a => a.counsellor_id === context.currentUser.id)
  
  // Sort availability by date and time
  const sortedAvailability = [...myAvailability].sort((a, b) => {
    const dateCompare = (a.date || '').localeCompare(b.date || '')
    if (dateCompare !== 0) return dateCompare
    return (a.startTime || '').localeCompare(b.startTime || '')
  })

  return (
    <div className={styles.card}>
      <div className={styles.cardHeading}>Set Your Availability</div>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Set your available appointment slots so students can book sessions with you.
      </p>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Date</label>
        <input
          type="date"
          className={styles.formInput}
          min={today}
          value={newSlot.date}
          onChange={(e) => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Start Time</label>
          <input
            type="time"
            className={styles.formInput}
            value={newSlot.startTime}
            onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>End Time</label>
          <input
            type="time"
            className={styles.formInput}
            value={newSlot.endTime}
            onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
          />
        </div>
      </div>

      {error && <div style={{ color: '#d32f2f', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

      <button type="button" className={styles.button} onClick={handleAdd} style={{ marginBottom: '2rem' }}>
        Add Availability Slot
      </button>

      <div className={styles.cardHeading} style={{ marginTop: '2rem', marginBottom: '1rem' }}>My Availability Slots</div>
      {sortedAvailability.length === 0 ? (
        <p style={{ color: '#999' }}>No availability slots set yet. Add one above!</p>
      ) : (
        <div className={styles.smallList} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sortedAvailability.map(a => (
            <div key={a.id} className={styles.smallListItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              {editingId === a.id ? (
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <input
                      type="date"
                      min={today}
                      style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      value={editingData.date}
                      onChange={(e) => setEditingData(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <input
                        type="time"
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        value={editingData.startTime}
                        onChange={(e) => setEditingData(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                      <input
                        type="time"
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        value={editingData.endTime}
                        onChange={(e) => setEditingData(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={handleEditSave}
                      style={{
                        padding: '0.6rem 1.2rem',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                      }}
                    >
                      <Check size={16} /> Save
                    </button>
                    <button
                      type="button"
                      onClick={handleEditCancel}
                      style={{
                        padding: '0.6rem 1.2rem',
                        backgroundColor: '#999',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                      }}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <strong style={{ fontSize: '1rem' }}>{new Date(a.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                    <br />
                    <span style={{ color: '#555', fontSize: '0.95rem', fontWeight: '500' }}>
                      {a.startTime} - {a.endTime}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleEditStart(a)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
