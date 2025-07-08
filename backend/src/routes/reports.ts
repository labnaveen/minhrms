import express from 'express';
import { Authorize } from '../middleware/Authorize';
import { dailyLogs, exportDailyLogs, exportLeaveRequestLogs, leaveRequestLogs } from '../controllers/reports/reportsController';



var router = express.Router()



router.get('/daily-logs', Authorize('admin_dashboard.view'), (req, res, next) => dailyLogs(req, res, next))

router.get('/export/daily-logs', Authorize('admin_dashboard.view'), (req, res, next) => exportDailyLogs(req, res, next))


router.get('/leave-records', Authorize('admin_dashboard.view'), (req, res, next) => leaveRequestLogs(req, res, next))

router.get('/export/leave-records', Authorize('admin_dashboard.view'), (req, res, next) => exportLeaveRequestLogs(req, res, next))


export default router