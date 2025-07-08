import express from 'express';
import { Authorize } from '../middleware/Authorize';
import { ReportingManagerController } from '../controllers/reportingStructure/reportingManager/reportingManagerController';
import ReportingManagers from '../models/reportingManagers';
import { DropdownController } from '../controllers/dropdown/dropdownController';



var router = express.Router()


const reportingManagerControllers = ReportingManagerController(ReportingManagers)


router.post('/', Authorize('reporting_structure.add'), (req, res, next) => reportingManagerControllers.create(req, res, next))


router.get('/', Authorize('reporting_structure.view'), (req, res, next) => {
    const options = {
        included: ['user', 'reporting_role'],
        attributes: {
            user: ['id', 'employee_name', 'employee_generated_id', 'company_id'],
            reporting_role: ['id', 'name', 'priority']
        }
    }

    reportingManagerControllers.getAll(req, res, next, options)
})


//Adding employees under reporting managers
router.put('/:id', Authorize('reporting_structure.edit'), (req, res, next) => {
    reportingManagerControllers.update(req, res, next)
})


router.get('/:id', Authorize('reporting_structure.view'), (req, res, next) => {
    
    reportingManagerControllers.getById(req, res, next)
})

router.delete('/:id', Authorize('reporting_structure.delete'), (req, res, next) => {
    reportingManagerControllers.destroy(req, res, next)
})



export default router