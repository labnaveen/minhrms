import express from 'express'
import { Authorize } from '../middleware/Authorize'
import { NotificationController } from '../controllers/notification/notificationController'
import Notification from '../models/notification'



var router = express.Router()

const notificationController = NotificationController(Notification)


router.get('/', Authorize('employee_notifications.view'), (req, res, next) => notificationController.getAll(req, res, next))
router.put('/read', Authorize('employee_notifications.edit'), (req, res, next) => notificationController.markAllRead(req, res, next))
router.put('/:id/read', Authorize('employee_notifications.edit'), (req, res, next) => notificationController.markSingleRead(req, res, next))

export default router