import prisma from '../services/prismaClient.js'

export async function getAllProfiles(req, res) {
  try {
    // Return all users so the admin table reflects newly created accounts.
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        faculty: true,
        institution_code: true,
      },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getProfile(req, res) {
  const userId = req.user?.userId || req.user?.id
  if (!userId) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        faculty: true,
        institution_code: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateProfile(req, res) {
  const userId = req.user?.userId || req.user?.id
  if (!userId) return res.status(401).json({ error: 'Not authenticated' })

  const { name, faculty, institution_code } = req.body

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(faculty !== undefined && { faculty }),
        ...(institution_code !== undefined && { institution_code: institution_code || null }),
      },
    })

    res.json(user)
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'That student card / counsellor code is already in use' })
    }
    res.status(500).json({ error: error.message })
  }
}

export async function deleteProfile(req, res) {
  const requesterId = req.user?.userId || req.user?.id
  if (!requesterId) return res.status(401).json({ error: 'Not authenticated' })

  const targetUserId = req.params.id
  if (!targetUserId) {
    return res.status(400).json({ error: 'User id is required' })
  }

  try {
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
      select: { id: true, role: true },
    })

    if (!requester) {
      return res.status(401).json({ error: 'Requester not found' })
    }

    if (requester.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete users' })
    }

    if (requester.id === targetUserId) {
      return res.status(400).json({ error: 'Admin cannot delete their own account' })
    }

    const target = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    })

    if (!target) {
      return res.status(404).json({ error: 'User not found' })
    }

    await prisma.$transaction(async (tx) => {
      await tx.sessionNote.deleteMany({
        where: {
          OR: [
            { counsellor_id: targetUserId },
            {
              appointment: {
                OR: [
                  { student_id: targetUserId },
                  { counsellor_id: targetUserId },
                ],
              },
            },
          ],
        },
      })

      await tx.appointment.deleteMany({
        where: {
          OR: [
            { student_id: targetUserId },
            { counsellor_id: targetUserId },
          ],
        },
      })

      await tx.availability.deleteMany({
        where: { counsellor_id: targetUserId },
      })

      await tx.moodLog.deleteMany({
        where: { student_id: targetUserId },
      })

      await tx.user.delete({
        where: { id: targetUserId },
      })
    })

    return res.json({ success: true })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

