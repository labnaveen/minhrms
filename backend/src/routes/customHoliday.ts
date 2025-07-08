import express from 'express'
import { Authorize } from '../middleware/Authorize'
import { CustomHolidayController } from '../controllers/customHoliday/customHolidayController'
import CustomHoliday from '../models/customHoliday'
import { validate } from '../middleware/RequestValidate'
import { UpdateCustomHoliday } from '../schemas/holiday'


var router = express.Router()

const customHolidayController = CustomHolidayController(CustomHoliday)


router.post('/', Authorize("holiday_calendar.add"), (req, res, next) => customHolidayController.create(req, res, next))

router.get('/', Authorize('holiday_calendar.view'), (req, res, next) => {
    const options = {
        included:['holiday_calendar']
    }

    customHolidayController.getAll(req, res, next, options)
})
router.get('/:id', Authorize('holiday_calendar.view'), (req, res, next) => customHolidayController.getById(req, res, next))

router.put('/:id', Authorize('holiday_calendar.edit'), validate(UpdateCustomHoliday, 'body'), (req, res, next) => customHolidayController.update(req, res, next))

router.delete('/:id', Authorize('holiday_calendar.delete'), (req, res, next) => {
    customHolidayController.destroy(req, res, next)
})


export default router