"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const reportsController_1 = require("../controllers/reports/reportsController");
var router = express_1.default.Router();
router.get('/daily-logs', (0, Authorize_1.Authorize)('admin_dashboard.view'), (req, res, next) => (0, reportsController_1.dailyLogs)(req, res, next));
router.get('/export/daily-logs', (0, Authorize_1.Authorize)('admin_dashboard.view'), (req, res, next) => (0, reportsController_1.exportDailyLogs)(req, res, next));
router.get('/leave-records', (0, Authorize_1.Authorize)('admin_dashboard.view'), (req, res, next) => (0, reportsController_1.leaveRequestLogs)(req, res, next));
router.get('/export/leave-records', (0, Authorize_1.Authorize)('admin_dashboard.view'), (req, res, next) => (0, reportsController_1.exportLeaveRequestLogs)(req, res, next));
exports.default = router;
