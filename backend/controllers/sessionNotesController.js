import prisma from '../services/prismaClient.js'

export async function getSessionNotes(req, res) {
  const requesterId = req.user?.userId || req.user?.id
  if (!requesterId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
      select: { id: true, role: true },
    })

    if (!requester) {
      return res.status(401).json({ error: 'Requester not found' })
    }

    const sessionNotes = await prisma.sessionNote.findMany({
      where: requester.role === 'admin' ? undefined : { counsellor_id: requesterId },
      orderBy: { created_at: 'desc' },
      include: {
        appointment: true,
        counsellor: true,
      },
    })
    res.json(sessionNotes)
  } catch (error) {
    console.error('Get session notes error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}

export async function createSessionNote(req, res) {
  const requesterId = req.user?.userId || req.user?.id
  if (!requesterId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const { appointment_id, counsellor_id, date, notes } = req.body

  if (!appointment_id || !counsellor_id) {
    return res.status(400).json({ error: 'Missing required fields: appointment_id, counsellor_id' })
  }

  try {
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
      select: { id: true, role: true },
    })

    if (!requester) {
      return res.status(401).json({ error: 'Requester not found' })
    }

    const isAdmin = requester.role === 'admin'
    if (!isAdmin && requesterId !== counsellor_id) {
      return res.status(403).json({ error: 'Counsellors can only create notes for themselves' })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointment_id },
      select: { id: true, counsellor_id: true, status: true },
    })

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' })
    }

    if (!isAdmin && appointment.counsellor_id !== requesterId) {
      return res.status(403).json({ error: 'You can only write notes for your own appointments' })
    }

    if (appointment.status !== 'confirmed' && appointment.status !== 'completed') {
      return res.status(400).json({ error: 'Session notes can only be created for confirmed or completed appointments' })
    }

    const sessionNote = await prisma.sessionNote.create({
      data: {
        appointment_id,
        counsellor_id,
        date: date || new Date().toISOString().split('T')[0],
        notes: notes || '',
      },
      include: {
        appointment: true,
        counsellor: true,
      },
    })
    res.status(201).json(sessionNote)
  } catch (error) {
    console.error('Create session note error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}
