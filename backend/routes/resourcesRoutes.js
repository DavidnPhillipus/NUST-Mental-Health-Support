import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { getResources, createResource, updateResource, deleteResource } from '../controllers/resourcesController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', getResources)
router.post('/', createResource)
router.put('/:id', updateResource)
router.delete('/:id', deleteResource)

export default router
