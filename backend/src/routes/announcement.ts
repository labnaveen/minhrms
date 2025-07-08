import express from 'express'
import { Authorize } from '../middleware/Authorize'
import { AnnouncementController } from '../controllers/announcement/announcementController'
import Announcement from '../models/announcements'
import { decode } from 'jsonwebtoken'
import { validate } from '../middleware/RequestValidate'
import { AnnouncementCreationSchema } from '../schemas/announcement'

var router = express.Router()


const announcementController = AnnouncementController(Announcement)



router.post('/', Authorize('announcements.add'), validate(AnnouncementCreationSchema, 'body'), (req, res, next) => announcementController.create(req, res, next))


router.get('/', Authorize('employee_dashboard.view'), (req, res, next) => announcementController.getAll(req, res, next))

router.get('/:id', Authorize('announcements.view'), (req, res, next) => {
    
    const options = {
        included:['division_units'],
        attributes:{
            division_units: ['id', 'unit_name']
        },
        aliases:{
            division_units: 'division_units'
        }
    }

    announcementController.getById(req, res, next, options)}
)

router.put('/:id', Authorize('announcements.edit'), (req, res, next) => announcementController.update(req, res, next))

router.delete('/:id', Authorize('announcements.delete'), (req, res, next) =>  announcementController.destroy(req, res, next))



export default router;