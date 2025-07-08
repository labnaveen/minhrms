import express from 'express'
import { DivisionUnitController } from '../controllers/division/divisionUnitController'
import DivisionUnits from '../models/divisionUnits'
import { Authorize } from '../middleware/Authorize'
import { validate } from '../middleware/RequestValidate'
import { DivisionUnitCreationSchema, DivisionUnitUpdateSchema } from '../schemas/division'


let router = express.Router()

const divisionUnitController = DivisionUnitController(DivisionUnits)


//Unit Creation API
router.post('/', Authorize('division.add'), validate(DivisionUnitCreationSchema, 'body'), (req, res, next) => divisionUnitController.create(req, res, next))

//Get All Units
// router.get('/', Authorize('users.show'), (req, res, next) => {
//     const options = {
//         included: ['user'],
//         attributes: {
//          user:['employee_name'],
//         },
//     }

//     divisionUnitController.getAll(req, res, next, options)
// })
router.get('/', Authorize('division.view'), (req, res, next) => divisionUnitController.getDivisionUsers(req, res, next))

router.get('/:id', Authorize('division.view'), (req, res, next) => divisionUnitController.getById(req, res, next))

router.put('/:id', Authorize('division.edit'), validate(DivisionUnitUpdateSchema, "body"), (req, res, next) => divisionUnitController.update(req, res, next))

router.delete('/:id', Authorize('division.delete'), (req, res, next) => divisionUnitController.destroy(req, res, next))


export default router