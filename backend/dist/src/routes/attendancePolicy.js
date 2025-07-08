"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendancePolicyController_1 = require("../controllers/attendancePolicy/attendancePolicyController");
const attendancePolicy_1 = __importDefault(require("../models/attendancePolicy"));
const Authorize_1 = require("../middleware/Authorize");
const RequestValidate_1 = require("../middleware/RequestValidate");
const attendancePolicy_2 = require("../schemas/attendancePolicy");
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
var router = express_1.default.Router();
const attendancePolicyController = (0, attendancePolicyController_1.AttendancePolicyController)(attendancePolicy_1.default);
const attendancePolicyDropdownController = (0, dropdownController_1.DropdownController)(attendancePolicy_1.default);
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
router.get('/', (0, Authorize_1.Authorize)('attendance_policies.view'), (req, res, next) => attendancePolicyController.getAll(req, res, next));
//@ts-ignore
router.get('/dropdown', (0, Authorize_1.Authorize)('attendance_policies.view'), (req, res, next) => attendancePolicyDropdownController.getAllDropdown(req, res, next, { attributes: ['id', 'name'] }));
router.get('/:id', (0, Authorize_1.Authorize)('attendance_policies.view'), (req, res, next) => {
    // const options = {
    //     included: ['regularisation_status', 'attendance_status'],
    //     where: {id: req.params.id} 
    // }
    attendancePolicyController.getById(req, res, next);
});
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
router.post('/', (0, Authorize_1.Authorize)('attendance_policies.add'), (0, RequestValidate_1.validate)(attendancePolicy_2.AttendancePolicyCreationSchema, 'body'), (req, res, next) => attendancePolicyController.create(req, res, next));
router.put('/:id', (0, Authorize_1.Authorize)('attendance_policies.edit'), (0, RequestValidate_1.validate)(attendancePolicy_2.AttendancePolicyUpdationSchema, 'body'), (req, res, next) => attendancePolicyController.attendancePolicyUpdate(req, res, next));
router.delete('/:id', (0, Authorize_1.Authorize)('attendance_policies.delete'), (req, res, next) => attendancePolicyController.attendancePolicyDelete(req, res, next));
exports.default = router;
