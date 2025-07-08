import express from 'express'
import { Authorize } from '../middleware/Authorize'
import { MasterPolicyController } from '../controllers/masterPolicy/masterPolicyController'
import MasterPolicy from '../models/masterPolicy'
import { validate } from '../middleware/RequestValidate'
import { MasterPolicyCreationSchema } from '../schemas/masterPolicy'
import { DropdownController } from '../controllers/dropdown/dropdownController'


var router = express.Router()

var masterPolicyController = MasterPolicyController(MasterPolicy)

const dropdownController = DropdownController(MasterPolicy)


router.post('/', Authorize('master_policies.add'), validate(MasterPolicyCreationSchema, "body"), (req, res, next) => masterPolicyController.create(req, res, next))

router.get('/', Authorize('master_policies.view'), (req, res, next) => {
    const options = {
        included: ['attendance_policy','approval_flow', 'leave_type_policies'],
    }

    masterPolicyController.getAll(req, res , next, options)
})

router.get('/dropdown', Authorize('master_policies.view'), (req, res, next) => {

    const options = {
        attribute: ['id', 'policy_name']
    }

    dropdownController.getAllDropdown(req, res, next, options)
})

router.get('/:id', Authorize('master_policies.view'), (req, res, next) => masterPolicyController.getById(req, res, next))

router.delete('/:id', Authorize('master_policies.delete'), (req, res, next) => masterPolicyController.destroy(req, res, next))

router.put('/:id', Authorize('master_policies.edit'), (req, res, next) => masterPolicyController.update(req, res, next))



export default router