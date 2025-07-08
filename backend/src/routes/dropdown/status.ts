import express from 'express'
import { DropdownController } from '../../controllers/dropdown/dropdownController'
import Approval from '../../models/dropdown/status/approval'
import Marking from '../../models/dropdown/status/marking'
import { Authorize } from '../../middleware/Authorize'
import { AttendanceStatus, expencesApprovalStatus, expenses } from '../../models'


var router = express.Router()


const ApprovalDropdownController = DropdownController(Approval)
const MarkingDropdownController = DropdownController(Marking)
const AttendanceStatusDropdownController = DropdownController(AttendanceStatus)
const ExpenseDropdownController = DropdownController(expencesApprovalStatus)
// const DropdownController = DropdownController(Approval)

router.get('/approval',  (req, res, next) => ApprovalDropdownController.getAllDropdown(req, res, next))
router.get('/expense-approval', (req, res, next) => ExpenseDropdownController.getAllDropdown(req, res, next))
router.get('/marking', (req, res, next) => MarkingDropdownController.getAllDropdown(req, res, next))
router.get('/attendance', (req, res, next) => AttendanceStatusDropdownController.getAllDropdown(req, res, next))

export default router;