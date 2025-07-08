"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const notificationController_1 = require("../controllers/notification/notificationController");
const notification_1 = __importDefault(require("../models/notification"));
var router = express_1.default.Router();
const notificationController = (0, notificationController_1.NotificationController)(notification_1.default);
router.get('/', (0, Authorize_1.Authorize)('employee_notifications.view'), (req, res, next) => notificationController.getAll(req, res, next));
router.put('/read', (0, Authorize_1.Authorize)('employee_notifications.edit'), (req, res, next) => notificationController.markAllRead(req, res, next));
router.put('/:id/read', (0, Authorize_1.Authorize)('employee_notifications.edit'), (req, res, next) => notificationController.markSingleRead(req, res, next));
exports.default = router;
