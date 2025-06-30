import express from 'express'

import {
  getServicesWithMediaCounts,
  getServiceWithMedia,
  downloadMedia,
  creditHistory,
  downloadHistory,
} from '../controllers/mobile.js'

const router = express.Router()

router.get('/mobile/services', getServicesWithMediaCounts)
router.get('/mobile/media/download/:mediaId/:userId', downloadMedia)
router.get('/mobile/services/:serviceId', getServiceWithMedia)
router.get('/mobile/credit/history/:userId', creditHistory)
router.get('/mobile/download/history/:userId', downloadHistory)

export default router
