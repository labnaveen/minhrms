import express from 'express'
import { LeaveTypePolicyController } from "../controllers/leaveTypePolicy/leaveTypePolicyController";
import LeaveTypePolicy from "../models/leaveTypePolicy";
import { Authorize } from "../middleware/Authorize";
import { DropdownController } from '../controllers/dropdown/dropdownController';

var router = express.Router()

const leaveTypePolicyController = LeaveTypePolicyController(LeaveTypePolicy)



router.post('/', Authorize('leave_policies.add'), (req, res, next) => leaveTypePolicyController.create(req, res, next))

// router.get('/:id/leave-type-policy', Authorize('users.show'), (req, res, next) =>{
    
//     const option = {
//         where:{
//             leave_type_id: req.params.id
//         }
//     }

//     leaveTypePolicyController.getAll(req, res, next, option)
// })

router.get('/:id', Authorize('leave_policies.view'), (req, res, next) => leaveTypePolicyController.getById(req, res, next))

router.delete('/:id', Authorize('leave_policies.delete'), (req, res, next) => leaveTypePolicyController.destroy(req, res, next))

router.put('/:id', Authorize('leave_policies.delete'), (req, res, next) => leaveTypePolicyController.update(req, res, next))

export default router;