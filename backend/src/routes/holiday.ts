import express from 'express';
import { Authorize } from '../middleware/Authorize';
import { HolidayCalendarController } from '../controllers/holiday/holidayCalendarController';
import HolidayCalendar from '../models/holidayCalendar';
import { badRequest } from '../services/error/BadRequest';
import { validate } from '../middleware/RequestValidate';
import { HolidayCalendarCreationSchema } from '../schemas/holiday';
import { HolidayDatabaseController } from '../controllers/holidayDatabase/holidayDatabaseController';
import HolidayDatabase from '../models/holidayDatabase';
import { MasterController } from '../controllers/masterController';
import CustomHoliday from '../models/customHoliday';
import HolidayCalendarAssociation from '../models/holidayCalendarAssociation';
import { DropdownController } from '../controllers/dropdown/dropdownController';


var router = express.Router()

const holidayCalendarController = HolidayCalendarController(HolidayCalendar)
const holidayDatabaseController = HolidayDatabaseController(HolidayDatabase)
const holidayCalenderDropdownController = DropdownController(HolidayCalendar)



router.post('/', Authorize('holiday_calendar.add'), validate(HolidayCalendarCreationSchema, "body"), (req, res, next) => holidayCalendarController.createCalendar(req, res, next))

router.get('/', Authorize('holiday_calendar.view'), (req, res, next) => {
    holidayCalendarController.getAll(req, res, next)
})

router.get('/dropdown', Authorize('holiday_calendar.view'), (req, res, next) => {

    const options = {
        attribute: ['id', 'name', 'year']
    }
    
    holidayCalenderDropdownController.getAllDropdown(req, res, next, options)
})

router.get('/:id/holiday', Authorize('holiday_calendar.view'), (req, res,next) => {

    holidayCalendarController.holidayForSpecificCalendar(req, res, next)
})


router.get('/:id', Authorize('holiday_calendar.view'), (req, res, next) => {

    const options = {
        included: ['holiday_database'],
        attributes:{
            holiday_database: ['id', 'name', 'date']
        }
    }
    
    holidayCalendarController.getById(req, res, next, options)

})

//Unlink/Delete holday from holiday calendar from association
router.delete('/:id/holiday/:holidayId', Authorize('holiday_calendar.delete'), (req, res, next) => {
    holidayCalendarController.deleteSingleHoliday(req, res, next)
})

router.put('/:id', Authorize('holiday_calendar.edit') , (req, res, next) => holidayCalendarController.update(req, res, next))

router.delete('/:id', Authorize('holiday_calendar.delete'), (req, res, next) => holidayCalendarController.destroy(req, res, next))




export default router;