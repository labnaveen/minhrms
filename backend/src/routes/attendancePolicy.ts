import express from 'express'
import { AttendancePolicyController } from '../controllers/attendancePolicy/attendancePolicyController'
import AttendancePolicy from '../models/attendancePolicy'
import { Authorize } from '../middleware/Authorize'
import RegularisationStatus from '../models/regularisationStatus'
import { validate } from '../middleware/RequestValidate'
import { AttendancePolicyCreationSchema, AttendancePolicyUpdationSchema } from '../schemas/attendancePolicy'
import { DropdownController } from '../controllers/dropdown/dropdownController'



var router = express.Router()

const attendancePolicyController = AttendancePolicyController(AttendancePolicy)
const attendancePolicyDropdownController = DropdownController(AttendancePolicy)

/**
 * @swagger
 * /api/attendancePolicy?page={page}&records={records}:
 *   get:
 *      summary: Get a list of all Attendance Policy
 *      tags:
 *        - Attendance Policy
 *      description: Get a list of all Attendance Policies
 *      parameters:
 *        - name: page
 *          in: path
 *          description: The number of page, which is 1 by default
 *          required: false
 *          type: integer
 *          format: int64
 *          minimum: 1
 *        - name: records
 *          in: path
 *          description: The number of records per page, which is 10 by default
 *          required: false
 *          type: integer
 *          format: int64
 *          minimum: 10
 *      security:
 *        - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
router.get('/', Authorize('attendance_policies.view'), (req, res, next) => attendancePolicyController.getAll(req, res, next))
//@ts-ignore
router.get('/dropdown', Authorize('attendance_policies.view'), (req, res, next) => attendancePolicyDropdownController.getAllDropdown(req, res, next, {attributes:['id', 'name']}))


router.get('/:id', Authorize('attendance_policies.view'), (req, res, next) => {

    // const options = {
    //     included: ['regularisation_status', 'attendance_status'],
    //     where: {id: req.params.id} 
    // }

    attendancePolicyController.getById(req, res, next)
}) 





/**
 * @swagger
 * /api/attendancePolicy:
 *   post:
 *      summary: Creating a new Attendance Policy.
 *      tags:
 *        - Attendance Policy
 *      parameters:
 *         - in: body
 *           name: body
 *           required: true
 *           schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 *                  working_hours:
 *                      type: number
 *                  attendance_cycle_start:
 *                      type: integer
 *                  biometric:
 *                      type: boolean
 *                  web:
 *                      type: array
 *                  app:
 *                      type: boolean
 *                  manual:
 *                      type: boolean
 *                  regularisation_status:
 *                      type: string
 *                  half_day:
 *                      type: boolean
 *                  hours_half_day:
 *                      type: integer
 *                  display_overtime_hours:
 *                      type: boolean
 *                  display_deficit_hours:
 *                      type: boolean
 *                  display_late_mark:
 *                      type: boolean
 *                  display_average_working_hours:
 *                      type: boolean
 *                  display_present_number_of_days:
 *                      type: boolean
 *              required:
 *                  - name
 *              example:
 *                  name: string
 *                  description: string
 *                  working_hours: number
 *                  attendance_cycle_start:
 *                  biometric: boolean
 *                  web: boolean
 *                  app: boolean
 *                  manual: boolean
 *                  regularisation_status: string
 *                  half_day: boolean
 *                  hours_half_day: integer
 *                  display_overtime_hours: boolean
 *                  display_deficit_hours: boolean
 *                  display_late_mark: boolean
 *                  display_average_working_hours: boolean
 *                  display_present_number_of_days: boolean
 *      description: API to create new role.
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
router.post('/', Authorize('attendance_policies.add'), validate(AttendancePolicyCreationSchema, 'body'), (req, res, next) => attendancePolicyController.create(req, res, next))



router.put('/:id', Authorize('attendance_policies.edit'), validate(AttendancePolicyUpdationSchema, 'body'), (req, res, next) => attendancePolicyController.attendancePolicyUpdate(req, res, next))


router.delete('/:id', Authorize('attendance_policies.delete'), (req, res, next) => attendancePolicyController.attendancePolicyDelete(req, res, next))


export default router;
