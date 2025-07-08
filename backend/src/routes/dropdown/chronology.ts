import express from 'express'
import { DropdownController } from '../../controllers/dropdown/dropdownController'
import Week from '../../models/dropdown/chronology/week'
import RoundingTime from '../../models/dropdown/chronology/rounding_time'
import DayOfMonth from '../../models/dropdown/chronology/day_of_month'
import LeaveCalendarCycle from '../../models/dropdown/chronology/leave_calendar_cycle'
import { Authorize } from '../../middleware/Authorize'
import Months from '../../models/dropdown/chronology/months'
import { AccrualFrom } from '../../models'
import AccrualFrequency from '../../models/dropdown/frequency/accrualFrequency'


var router = express.Router()


const WeekDropdownController = DropdownController(Week)
const RoundingTimeDropdownController = DropdownController(RoundingTime)
const DayOfMonthDropdownController = DropdownController(DayOfMonth)
const LeaveCalendarCycleDropdownController = DropdownController(LeaveCalendarCycle)
const monthsDropdownController = DropdownController(Months)
const accrualFromController = DropdownController(AccrualFrom)
const accrualFrequencyController = DropdownController(AccrualFrequency)


router.get('/week', (req, res, next) => WeekDropdownController.getAllDropdown(req, res, next))
router.get('/rounding-time', (req, res, next) => RoundingTimeDropdownController.getAllDropdown(req, res, next))
router.get('/day-of-month', (req, res, next) => DayOfMonthDropdownController.getAllDropdown(req, res, next))
router.get('/leave-calendar-cycle', (req, res, next) => LeaveCalendarCycleDropdownController.getAllDropdown(req, res, next))
router.get('/months',  (req, res, next) => monthsDropdownController.getAllDropdown(req, res, next))
router.get('/accrual-from', (req, res, next) => accrualFromController.getAllDropdown(req, res, next))
router.get('/accrual-frequency', (req, res, next) => accrualFrequencyController.getAllDropdown(req, res, next))

export default router;