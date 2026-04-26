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

export async function getResources(req, res) {
  try {
    const requesterId = req.user?.userId || req.user?.id
    const requester = await getRequester(requesterId)
    const isAdmin = requester?.role === 'admin'

    const resources = await prisma.resource.findMany({
      where: isAdmin ? undefined : { approval_status: 'approved' },
      orderBy: { created_at: 'desc' },
    })
    res.json(resources)
  } catch (error) {
    console.error('Get resources error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}

export async function createResource(req, res) {
  const requesterId = req.user?.userId || req.user?.id
  const requester = await getRequester(requesterId)

  if (!requester || requester.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can add resources' })
  }

  const { title, description, url, type, category, approvalStatus } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Missing required field: title' })
  }

  try {
    const resource = await prisma.resource.create({
      data: {
        title,
        description: description || '',
        url: url || '',
        type: type || 'article',
        category: category || 'general',
        approval_status: approvalStatus || 'pending',
      },
    })
    res.status(201).json(resource)
  } catch (error) {
    console.error('Create resource error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}

export async function updateResource(req, res) {
  const requesterId = req.user?.userId || req.user?.id
  const requester = await getRequester(requesterId)

  if (!requester || requester.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can update resources' })
  }

  const { id } = req.params
  const { title, description, url, type, category, approvalStatus } = req.body

  try {
    const resource = await prisma.resource.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(url !== undefined && { url }),
        ...(type !== undefined && { type }),
        ...(category !== undefined && { category }),
        ...(approvalStatus !== undefined && { approval_status: approvalStatus }),
      },
    })

    res.json(resource)
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Resource not found' })
    }
    console.error('Update resource error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}

export async function deleteResource(req, res) {
  const requesterId = req.user?.userId || req.user?.id
  const requester = await getRequester(requesterId)

  if (!requester || requester.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can delete resources' })
  }

  try {
    await prisma.resource.delete({
      where: { id: req.params.id },
    })

    res.json({ success: true })
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Resource not found' })
    }
    console.error('Delete resource error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}
