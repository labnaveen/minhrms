import express from 'express';
import { Authorize } from '../middleware/Authorize';
import { ApprovalFlowController } from '../controllers/approvalFlow/approvalFlowController';
import ApprovalFlow from '../models/approvalFlow';
import { DropdownController } from '../controllers/dropdown/dropdownController';


var router = express.Router()

const approvalFlowController = ApprovalFlowController(ApprovalFlow)
const approvalFlowDropdownController = DropdownController(ApprovalFlow)

const dropdownOptions = {
    attributes:['id', 'name']
}


router.post('/', Authorize('approval_flow.add'), (req, res, next) => {approvalFlowController.create(req, res, next)})

router.get('/', Authorize('approval_flow.view'), (req, res, next) => {

    const options = {
        included:['approval_flow_type'],
        searchBy: ['name']
    }

    approvalFlowController.getAll(req, res, next, options)
})

//@ts-ignore
router.get('/dropdown', Authorize('approval_flow.view'), (req, res, next) => approvalFlowDropdownController.getAllDropdown(req, res, next, dropdownOptions))

router.put('/:id', Authorize('approval_flow.edit'), (req, res, next) => approvalFlowController.update(req, res, next))

router.get('/:id', Authorize('approval_flow.view'), (req, res, next) => {
    // const options = {
    //     included: ['reporting_role'],
    //     attributes:{
    //         reporting_role:['id', 'name']
    //     },
    //     aliases:{
    //         reporting_role: 'direct',
    //     }
    // }

    approvalFlowController.getById(req, res, next)
})

router.delete('/:id', Authorize('approval_flow.delete'), (req, res, next) => approvalFlowController.destroy(req, res, next))



export default router;