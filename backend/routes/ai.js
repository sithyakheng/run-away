import express from 'express'
import { generateCode, generateProCode } from '../controllers/aiController.js'

const router = express.Router()

router.post('/generate', generateCode)
router.post('/generate-pro', generateProCode)

export default router
