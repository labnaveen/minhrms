import express from 'express'
import { Authorize } from '../middleware/Authorize';
import { validate } from '../middleware/RequestValidate';
import { DivisionCreationSchema } from '../schemas/division';
import { DivisionController } from '../controllers/division/divisionController';
import Division from '../models/division';
import { DivisionUnitController } from '../controllers/division/divisionUnitController';
import DivisionUnits from '../models/divisionUnits';
import { DropdownController } from '../controllers/dropdown/dropdownController';


let router = express.Router()


const divisionController = DivisionController(Division)

const dropdownController = DropdownController(Division)
 
const divisionUnitController = DivisionUnitController(DivisionUnits)



router.post('/', Authorize('division.add'), validate(DivisionCreationSchema, 'body'), (req, res, next) => divisionController.create(req, res, next) )


router.get('/dropdown', Authorize('division.view'), (req, res, next) => {

    const options = {
        included: ['division_units'],
        attribute:['id', 'division_name', 'system_generated'],
        attributes:{
            division_units: ['id', 'unit_name', 'system_generated']
        }
    }

    dropdownController.getAllDropdown(req, res, next, options)


})

router.get('/:id/dropdown', Authorize('division.view'), (req, res, next) => DropdownController(DivisionUnits).getAllDropdown(req, res, next, {where: {division_id: req.params.id}, attribute:['id', 'unit_name']}))

router.put('/:id', Authorize('division.edit'), (req, res, next) => divisionController.update(req, res, next))

router.post('/:id/division-unit/:unit_id/employee', (req, res, next) =>  divisionController.addEmployeeToUnit(req, res, next))

router.delete('/:id/division-unit/:unit_id/employee/:user_id', (req, res, next) => divisionController.removeEmployeeFromUnit(req, res, next))


router.get('/', Authorize('division.view'), (req, res,next) => {
    
    const options = {
        included:['division_units'],
    }

    divisionController.getAll(req, res, next, options)
})


router.get('/:id/division-unit',Authorize('division.view'), (req, res, next) => {
    const option = {
        where:{
            division_id: req.params.id
        }
    }
    divisionUnitController.getAll(req, res, next, option)
})


router.get('/:id', Authorize('division.view'), (req, res, next) => {

    // const options = {
    //     attribute:['id', 'division_name'],
    //     included: ['division_units'],
    //     attributes:{
    //         division_units: ["id", "unit_name"],
    //     }
    // }
    
    divisionController.getById(req, res, next)   
})


router.delete('/:id', Authorize('division.delete'), (req, res, next) => divisionController.destroy(req, res, next))


export default router;