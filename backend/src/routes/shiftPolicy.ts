import express from "express";
import { ShiftPolicyController } from "../controllers/shiftPolicy/shiftPolicyController";
import ShiftPolicy from "../models/shiftPolicy";
import { Authorize } from "../middleware/Authorize";
import { validate } from "../middleware/RequestValidate";
import { ShiftPolicyCreation, ShiftPolicyUpdationSchema } from "../schemas/shiftPolicy";
import { DropdownController } from "../controllers/dropdown/dropdownController";



var router = express.Router()

var shiftPolicyController = ShiftPolicyController(ShiftPolicy)



//Create a Shift Policy
router.post('/', Authorize('attendance_policies.add'), validate(ShiftPolicyCreation, 'body'), (req, res, next) => shiftPolicyController.create(req, res, next))

//Dropdown
//@ts-ignore
router.get('/dropdown', Authorize('attendance_policies.view'), (req, res, next) => DropdownController(ShiftPolicy).getAllDropdown(req, res, next, {attributes: ['id', 'shift_name']}))


//Get a specific Shift Policy
router.get('/:id', Authorize('attendance_policies.view'), (req, res, next) => {
    const options = {
        included:["shift_type", "attendance_status"],
        where: {id: req.params.id} 
    }
    shiftPolicyController.getById(req, res, next, options)
})


//Get All Shift Policies
router.get('/', Authorize('attendance_policies.view'), (req, res,next) => shiftPolicyController.getAll(req, res, next))



//Updation
router.put('/:id', Authorize('attendance_policies.edit'), validate(ShiftPolicyUpdationSchema, 'body'), (req, res, next) => shiftPolicyController.update(req, res, next))




// Deletion
router.delete('/:id', Authorize('attendance_policies.delete'), (req, res, next) => shiftPolicyController.destroy(req, res, next))





export default router