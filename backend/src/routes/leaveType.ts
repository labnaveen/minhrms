import express from 'express'
import { LeaveType } from '../models'
import { LeaveTypeController } from '../controllers/leavePolicy/leaveTypeController'
import { Authorize } from '../middleware/Authorize'
import { validate } from '../middleware/RequestValidate';
import { LeaveTypeCreationSchema, LeaveTypeUpdationSchema } from '../schemas/leaveType';
import { LeaveTypePolicyController } from '../controllers/leaveTypePolicy/leaveTypePolicyController';
import LeaveTypePolicy from '../models/leaveTypePolicy';
import { DropdownController } from '../controllers/dropdown/dropdownController';

var router = express.Router();


const leaveTypeController = LeaveTypeController(LeaveType)

const leaveTypePoliciesController = LeaveTypePolicyController(LeaveTypePolicy)


router.get('/', Authorize('leave_policies.view'), (req, res, next) => {

    const options = {
        included:['leave_type_policy']
    }

    leaveTypeController.getAll(req, res, next, options)
    
})


//Get all leave types as well as leave type policies
router.get('/dropdown',  (req, res, next) => DropdownController(LeaveType).getAllDropdown(req, res, next, {attribute: ['id', 'leave_type_name', 'allow_half_days'], included:['leave_type_policy'], attributes:{leave_type_policy: ['id', 'leave_policy_name']}}))



router.get('/:id', Authorize('leave_policies.view'), (req, res, next) =>{

    const option = {
        included:['leave_type_policy']
    }
    
    leaveTypeController.getById(req, res, next, option)

})
//@ts-ignore
router.get('/:id/leave-type-policy/dropdown', Authorize('leave_policies.view'), (req, res, next)=> DropdownController(LeaveTypePolicy).getAllDropdown(req, res, next, {where: {leave_type_id: req.params.id}, attributes: ['id', 'leave_policy_name']}))


//Get all the leave type policies for a particular leave type
router.get('/:id/leave-type-policy', Authorize('leave_policies.view'), (req, res, next) => {
    const option = {
        where:{
            leave_type_id: req.params.id
        }
    }

    leaveTypePoliciesController.getAll(req, res, next, option)
})


router.post('/', Authorize('leave_policies.add'), validate(LeaveTypeCreationSchema, 'body'), (req, res, next) => leaveTypeController.create(req, res, next))


router.put('/:id', Authorize('leave_policies.edit'), validate(LeaveTypeUpdationSchema, 'body'), (req, res, next) => leaveTypeController.update(req, res, next))

router.delete('/:id', Authorize('leave_policies.edit'), (req, res, next) => leaveTypeController.destroy(req, res, next))



export default router