import express from 'express';
import { WeeklyOffPolicyController } from '../controllers/weeklyOffPolicy/weeklyOffPolicyController';
import WeeklyOffPolicy from '../models/weeklyOffPolicy';
import { Authorize } from '../middleware/Authorize';
import { DropdownController } from '../controllers/dropdown/dropdownController';



var router = express.Router()


const weeklyOffPolicyController = WeeklyOffPolicyController(WeeklyOffPolicy)
const weeklyOffPolicyDropdownController = DropdownController(WeeklyOffPolicy)


router.post('/', Authorize('weekly_off_policies.add'), (req, res, next) => weeklyOffPolicyController.create(req, res, next))


router.get('/', Authorize('weekly_off_policies.view'), (req, res, next) => {

    const options = {
        included: ['weekly_off_association'],
        attributes: {
            weekly_off_association: ['id', 'week_name', 'week_number']
        },
    }
    
    weeklyOffPolicyController.getAll(req, res, next, options)

})

router.get('/dropdown', Authorize('weekly_off_policies.view'), (req, res, next) => {

    const options = {
        attribute: ['id', 'name']
    }

    weeklyOffPolicyDropdownController.getAllDropdown(req, res, next, options)
    
})

router.get('/:id', Authorize('weekly_off_policies.view'), (req, res, next) => {

    // const options = {
    //     included: ['weekly_off_association'],
    //     attributes: {
    //         weekly_off_association: ['id', 'week_name', 'week_number']
    //     }
    // }

    weeklyOffPolicyController.getById(req, res, next)
})


router.put('/:id', Authorize('weekly_off_policies.edit'), (req, res, next) => weeklyOffPolicyController.update(req, res, next))



router.delete('/:id', Authorize('weekly_off_policies.delete'), (req, res, next) => weeklyOffPolicyController.destroy(req, res, next));








export default router;