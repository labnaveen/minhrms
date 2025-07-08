import express from 'express'
import { Authorize } from '../middleware/Authorize'
import { getAdminDivisionSummary, getAdminSpecificAttendanceData, getAdminSpecificLeaveData, getAnnouncementsForDashboard, getEmployeeAttendanceSummary, getEmployeeMetaData, getManagerEvents, getManagerRequestsSummary, getManagerSpecificAttendanceData, getManagerSpecificLeaveData, getMyTeam, getSelfLeaveStatus, getTimeSheet, getTodayEvents } from '../controllers/dashboard/dashboardController'



var router = express.Router()



router.get('/announcements', Authorize('employee_dashboard.view'), (req, res, next) => getAnnouncementsForDashboard(req, res, next))

router.get('/events', Authorize('employee_dashboard.view'), (req, res, next) => getTodayEvents(req, res, next))

router.get('/timesheet', Authorize('employee_dashboard.view'), (req, res, next) => getTimeSheet(req, res, next))

router.get('/admin', Authorize('admin_dashboard.view'), (req, res, next) => getEmployeeMetaData(req, res, next) )

router.get('/leave-table', Authorize('employee_dashboard.view'), (req, res, next) => getSelfLeaveStatus(req, res, next))

router.get('/admin/leave-table', Authorize('admin_dashboard.view'), (req, res, next) => getAdminSpecificLeaveData(req, res, next))

router.get('/admin/attendance-table', Authorize('admin_dashboard.view'), (req, res, next) => getAdminSpecificAttendanceData(req, res, next))

router.get('/admin/division-summary', Authorize('admin_dashboard.view'), (req, res, next) => getAdminDivisionSummary(req, res, next))

router.get('/manager/attendance-table', Authorize('manager_dashboard.view'), (req, res, next) => getManagerSpecificAttendanceData(req, res, next))

router.get('/manager/leave-table', Authorize('manager_dashboard.view'), (req, res, next) => getManagerSpecificLeaveData(req, res, next))

router.get('/manager/events', Authorize('manager_dashboard.view'), (req, res, next) => getManagerEvents(req, res, next))

router.get('/manager/requests-summary', Authorize('manager_dashboard.view'), (req, res, next) => getManagerRequestsSummary(req, res, next))


router.get('/team', Authorize('employee_dashboard.view'), (req, res, next) => getMyTeam(req, res, next))

router.get('/attendance-summary', Authorize('employee_dashboard.view'), (req, res, next) => getEmployeeAttendanceSummary(req, res, next))



export default router