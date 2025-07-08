import express from 'express'
import { Authorize } from '../middleware/Authorize';
import { HolidayDatabaseController } from '../controllers/holidayDatabase/holidayDatabaseController';
import HolidayDatabase from '../models/holidayDatabase';
import { DropdownController } from '../controllers/dropdown/dropdownController';


var router = express.Router()

const holidayDatabase = HolidayDatabaseController(HolidayDatabase)
const holidayDatabaseDropdown = DropdownController(HolidayDatabase)


router.get('/', Authorize('holiday_calendar.view'), (req, res, next) => {
    holidayDatabase.getAllForSpecificYear(req, res, next)
})






export default router;