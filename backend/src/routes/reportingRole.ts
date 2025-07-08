import { DropdownController } from './../controllers/dropdown/dropdownController';
import express from 'express';
import { Authorize } from '../middleware/Authorize';
import { MasterController } from '../controllers/masterController';
import ReportingRole from '../models/reportingRole';
import { ReportingManagerController } from '../controllers/reportingStructure/reportingManager/reportingManagerController';
import ReportingManagers from '../models/reportingManagers';
import { ReportingRoleController } from '../controllers/reportingStructure/reportingRole/reportingRoleController';


var router = express.Router()

const reportingRoleControllers = ReportingRoleController(ReportingRole)
const reportingDropdownController = DropdownController(ReportingRole)
const reportingManagerController = ReportingManagerController(ReportingManagers)



//Creating a Reporting Role
router.post('/', Authorize('reporting_structure.add'), (req, res, next) => reportingRoleControllers.create(req, res, next))


//Dropdown to get all the reporting Managers based on reporting role
router.get('/:id/reporting-manager/dropdown', Authorize('reporting_structure.view'), (req, res, next) => {
    const {id} = req.params

    const options = {
        where: {reporting_role_id: id},
        included:['user'],
        attributes:{
            user: ['id', 'employee_name']
        },
        attribute: ['id']
    }

    DropdownController(ReportingManagers).getAllDropdown(req, res, next, options)

})

//Get Reporting Managers for a specific Reporting Role
router.get('/:id/reporting-manager', Authorize('reporting_structure.view'), (req, res, next) => {
    reportingManagerController.getAll(req, res, next)
})


//Dropdown for Reporting Role
router.get('/dropdown', Authorize('reporting_structure.view'), (req, res ,next) => {

    // const options = {
    //     included:['reporting_managers'],
    //     nestedIncluded:{
    //         reporting_managers: ['user']
    //     }
    // }

    reportingRoleControllers.dropdown(req, res, next)

    // reportingDropdownController.getAllDropdown(req, res, next, options)

})



//Get A specific Reporting Role
router.get('/:id', Authorize('reporting_structure.view'), (req, res, next) => reportingRoleControllers.getById(req, res, next))


//Get All Reporting Roles
router.get('/', Authorize('reporting_structure.view'), (req, res, next) => {
    const options = {
        included:['']
    }

    reportingRoleControllers.getAll(req, res,next)
})




//Deleting a Reporting Role
router.delete('/:id', Authorize('reporting_structure.delete'), (req, res, next) => reportingRoleControllers.destroy(req, res, next))


//Updating a Reporting Role
router.put('/:id', Authorize('reporting_structure.edit'), (req, res, next) => reportingRoleControllers.update(req, res, next))




export default router;