import express from 'express'
import { DropdownController } from '../../controllers/dropdown/dropdownController'
import Accurals from '../../models/dropdown/type/accrual'
import Rounding from '../../models/dropdown/type/rounding'
import Shift from '../../models/dropdown/type/shift'
import { Authorize } from '../../middleware/Authorize'
import ApprovalFlowType from '../../models/dropdown/type/approvalFlowType'
import Gender from '../../models/dropdown/type/gender'
import EmploymentType from '../../models/dropdown/type/employment'
import EducationType from '../../models/dropdown/type/educationType'
import Relation from '../../models/dropdown/relation/relation'
import DayType from '../../models/dropdown/dayType/dayType'
import HalfDayType from '../../models/dropdown/dayType/halfDayType'
import { LeaveTypeController } from '../../controllers/leavePolicy/leaveTypeController'
import { LeaveType } from '../../models'
import { authorize } from '../../services/auth/AuthService'


var router = express.Router()


const AccuralsDropdownController = DropdownController(Accurals)
const MarkingDropdownController = DropdownController(Rounding)
const ShiftDropdownController = DropdownController(Shift)
const ApprovalDropdownController = DropdownController(ApprovalFlowType)
const GenderDropdownController = DropdownController(Gender)
const EmploymentTypeDropdownController = DropdownController(EmploymentType)
const EducationTypeDropdownController = DropdownController(EducationType)
const RelationTypeDropdownController = DropdownController(Relation)
const dayTypeDropdownController = DropdownController(DayType)
const hafDayTypeDropdownController = DropdownController(HalfDayType)
const leaveTypeDropdownController = LeaveTypeController(LeaveType)


router.get('/accurals',  (req, res , next) => AccuralsDropdownController.getAllDropdown(req, res, next))
router.get('/rounding', (req, res, next) => MarkingDropdownController.getAllDropdown(req, res, next))
router.get('/shift',  (req, res, next) => ShiftDropdownController.getAllDropdown(req, res, next))
router.get('/approval-flow-type',  (req, res, next) => ApprovalDropdownController.getAllDropdown(req, res ,next))
router.get('/gender', (req, res, next) => GenderDropdownController.getAllDropdown(req, res, next) )
router.get('/employment-type', (req, res, next) => EmploymentTypeDropdownController.getAllDropdown(req, res, next))
router.get('/education-type', (req, res, next) => EducationTypeDropdownController.getAllDropdown(req, res, next))
router.get('/relation', (req, res, next) => RelationTypeDropdownController.getAllDropdown(req, res, next))
router.get('/day-type', (req, res, next) => {

    const options = {
        attribute: ['id', 'name']
    }

    dayTypeDropdownController.getAllDropdown(req, res, next, options)
})
router.get('/half-day-type', (req, res, next) => {
    const options = {
        attribute: ['id', 'name']
    }

    hafDayTypeDropdownController.getAllDropdown(req, res, next, options)
    
})
router.get('/leave-type', Authorize('employee_leaves.view'), (req, res, next) => leaveTypeDropdownController.dropdownForEmployees(req, res, next))

export default router;