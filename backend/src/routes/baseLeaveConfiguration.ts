import express from 'express'
import BaseLeaveConfiguration from '../models/baseLeaveConfiguration'
import { Authorize } from '../middleware/Authorize'
import { BaseLeaveConfigurationController } from '../controllers/leavePolicy/baseLeaveConfigurationController'
import { validate } from '../middleware/RequestValidate'
import { BaseLeaveConfigurationCreationSchema } from '../schemas/baseLeaveConfigurationSchema'
import { DropdownController } from '../controllers/dropdown/dropdownController'


let router = express.Router()

const LeaveConfigurationController = BaseLeaveConfigurationController(BaseLeaveConfiguration)


//Route to create a new base leave configuration
router.post('/', Authorize('leave_policies.add'), validate(BaseLeaveConfigurationCreationSchema, 'body'), LeaveConfigurationController.create)


//Route to get all base leave configurations
router.get('/', Authorize('leave_policies.view'), (req, res, next) => LeaveConfigurationController.getAll(req, res, next))

//Route for dropdown
//@ts-ignore
router.get('/dropdown', Authorize('leave_policies.view'), (req, res, next) => DropdownController(BaseLeaveConfiguration).getAllDropdown(req, res, next, {attributes: ['id', 'policy_name']}))

//Route to get a specific base leave configuration
router.get('/:id', Authorize('leave_policies.view'), (req, res, next) => LeaveConfigurationController.getById(req, res, next) )


//Route to delete a base leave configuration
router.delete('/:id', Authorize('leave_policies.delete'), (req, res, next) => LeaveConfigurationController.destroy(req, res, next))


router.put('/:id', Authorize('leave_policies.edit'), (req, res, next) => LeaveConfigurationController.update(req, res, next))


export default router;