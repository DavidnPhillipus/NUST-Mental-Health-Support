import prisma from '../services/prismaClient.js'

async function getRequester(requesterId) {
  if (!requesterId) {
    return null
  }

  return prisma.user.findUnique({
    where: { id: requesterId },
    select: { id: true, role: true },
  })
}

export async function getAllProfiles(req, res) {
  const requesterId = req.user?.userId || req.user?.id

  try {
    const requester = await getRequester(requesterId)
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view all users' })
    }

    // Return all users so the admin table reflects newly created accounts.
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
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
        active: true,
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
  const requesterId = req.user?.userId || req.user?.id
  if (!requesterId) return res.status(401).json({ error: 'Not authenticated' })

  const { name, faculty, institution_code, role, active } = req.body
  const targetUserId = req.params.id || requesterId

  try {
    const requester = await getRequester(requesterId)
    if (!requester) {
      return res.status(401).json({ error: 'Requester not found' })
    }

    const isAdmin = requester.role === 'admin'
    if (!isAdmin && targetUserId !== requesterId) {
      return res.status(403).json({ error: 'Only admins can update other users' })
    }

    if (!isAdmin && (role !== undefined || active !== undefined)) {
      return res.status(403).json({ error: 'Only admins can change roles or active status' })
    }

    if (isAdmin && targetUserId === requesterId && (role !== undefined || active !== undefined)) {
      return res.status(400).json({ error: 'Admins cannot change their own role or active status' })
    }

    const user = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...(name !== undefined && { name }),
        ...(faculty !== undefined && { faculty }),
        ...(institution_code !== undefined && { institution_code: institution_code || null }),
        ...(isAdmin && targetUserId !== requesterId && role !== undefined && { role }),
        ...(isAdmin && targetUserId !== requesterId && active !== undefined && { active }),
      },
    })

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      faculty: user.faculty,
      institution_code: user.institution_code,
    })
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
    const requester = await getRequester(requesterId)

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

