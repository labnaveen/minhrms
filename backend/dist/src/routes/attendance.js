"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendance/attendanceController");
const models_1 = require("../models");
const Authorize_1 = require("../middleware/Authorize");
var router = express_1.default.Router();
const attendanceController = (0, attendanceController_1.AttendanceController)(models_1.Attendance);
router.get('/', (0, Authorize_1.Authorize)('employee_attendance.view'), (req, res, next) => attendanceController.getAll(req, res, next));
router.put('/', (0, Authorize_1.Authorize)('employee_attendance.add'), (req, res, next) => attendanceController.punch(req, res, next));
router.get("/punch-location", (0, Authorize_1.Authorize)('employee_attendance.view'), (req, res, next) => attendanceController.getPunchLocation(req, res, next));
router.post('/regularization-record', (0, Authorize_1.Authorize)('employee_attendance.add'), (req, res, next) => attendanceController.createRegularizationRequest(req, res, next));
router.get('/regularization-request', (0, Authorize_1.Authorize)('regularisation_requests.view'), (req, res, next) => attendanceController.getRegularizationRequest(req, res, next));
router.get('/regularization-record', (0, Authorize_1.Authorize)('employee_attendance.view'), (req, res, next) => attendanceController.getRegularizationRecord(req, res, next));
router.put('/regularization-record/:id', (0, Authorize_1.Authorize)('employee_attendance.edit'), (req, res, next) => attendanceController.updateRegularizationRecord(req, res, next));
router.delete('/regularization-record/:id', (0, Authorize_1.Authorize)('employee_attendance.delete'), (req, res, next) => attendanceController.deleteRecord(req, res, next));
router.get('/regularization-record/:id', (0, Authorize_1.Authorize)('employee_attendance.view'), (req, res, next) => attendanceController.getSingleRegularizationRecord(req, res, next));
router.get('/logs', (0, Authorize_1.Authorize)('employee_attendance.view'), (req, res, next) => attendanceController.getAttendanceLogs(req, res, next));
//Approval of Regularization request
router.put('/regularization-request/approve/:id', (0, Authorize_1.Authorize)('regularisation_requests.edit'), (req, res, next) => attendanceController.approveRegularizationRequest(req, res, next));
router.put('/regularization-request/reject/:id', (0, Authorize_1.Authorize)('regularisation_requests.edit'), (req, res, next) => attendanceController.rejectRegularizationRequest(req, res, next));
router.delete('/testing/:id', (req, res, next) => attendanceController.deleteAttendanceRecordForTesting(req, res, next));
router.get('/testing/:id', (req, res, next) => attendanceController.getAttendanceRecordDetails(req, res, next));
router.get('/regularization/dropdown', (0, Authorize_1.Authorize)('employee_attendance.edit'), (req, res, next) => attendanceController.dropdown(req, res, next));
// router.get('regularization-request', Authorize('regularisation_requests.view'), (req, res, next) => attendanceController.)
exports.default = router;
