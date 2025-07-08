import express from 'express'
import { AttendanceController } from '../controllers/attendance/attendanceController'
import { Attendance } from '../models'
import { Authorize } from '../middleware/Authorize'


var router = express.Router()


const attendanceController = AttendanceController(Attendance)

router.get('/', Authorize('employee_attendance.view'), (req, res, next) => attendanceController.getAll(req, res, next))

router.put('/', Authorize('employee_attendance.add'), (req, res, next) => attendanceController.punch(req, res, next))

router.get("/punch-location", Authorize('employee_attendance.view'), (req, res, next) => attendanceController.getPunchLocation(req, res, next))

router.post('/regularization-record', Authorize('employee_attendance.add'), (req, res, next) => attendanceController.createRegularizationRequest(req, res, next))

router.get('/regularization-request', Authorize('regularisation_requests.view'), (req, res, next) => attendanceController.getRegularizationRequest(req, res, next))

router.get('/admin/regularization-request', Authorize('regularisation_requests.view'), (req, res, next) => attendanceController.getAdminRegularizationRequests(req, res, next))

router.get('/regularization-record', Authorize('employee_attendance.view'), (req, res, next) => attendanceController.getRegularizationRecord(req, res, next))

router.get('/admin/regularization-record', Authorize('regularisation_requests.view'), (req, res, next) => attendanceController.getAdminRegularizationRecord(req, res, next))

router.put('/regularization-record/:id', Authorize('employee_attendance.edit'), (req, res, next) => attendanceController.updateRegularizationRecord(req, res, next))

router.delete('/regularization-record/:id', Authorize('employee_attendance.delete'), (req, res, next) => attendanceController.deleteRecord(req, res, next))

router.get('/regularization-record/:id', Authorize('employee_attendance.view'), (req, res, next) => attendanceController.getSingleRegularizationRecord(req, res, next))

router.get('/logs', Authorize('employee_attendance.view'), (req, res, next) => attendanceController.getAttendanceLogs(req, res, next))


//Approval of Regularization request
router.put('/regularization-request/approve/:id', Authorize('regularisation_requests.edit'), (req, res, next) => attendanceController.approveRegularizationRequest(req, res, next))
//Rejection of Regularization request
router.put('/regularization-request/reject/:id', Authorize('regularisation_requests.edit'), (req, res, next) => attendanceController.rejectRegularizationRequest(req, res, next))

//Approval of Regularization request by the admin
router.put('/admin/regularization-request/approve/:id', Authorize('regularisation_requests.edit'), (req, res, next) => attendanceController.approveRegularizationRequestByAdmin(req, res, next))

//Rejection of Regularization request by the admin
router.put('/admin/regularisation-request/reject/:id', Authorize('regularisation_requests.edit'), (req, res, next) => attendanceController.rejectRegularizationRequestByAdmin(req, res, next))

router.delete('/testing/:id', (req, res, next) => attendanceController.deleteAttendanceRecordForTesting(req, res, next))

router.get('/testing/:id', (req, res, next) => attendanceController.getAttendanceRecordDetails(req, res, next))

router.get('/regularization/dropdown', Authorize('employee_attendance.edit'), (req, res , next) => attendanceController.dropdown(req, res, next))

// router.get('regularization-request', Authorize('regularisation_requests.view'), (req, res, next) => attendanceController.)

export default router;