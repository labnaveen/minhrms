"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const announcementController_1 = require("../controllers/announcement/announcementController");
const announcements_1 = __importDefault(require("../models/announcements"));
const RequestValidate_1 = require("../middleware/RequestValidate");
const announcement_1 = require("../schemas/announcement");
var router = express_1.default.Router();
const announcementController = (0, announcementController_1.AnnouncementController)(announcements_1.default);
router.post('/', (0, Authorize_1.Authorize)('announcements.add'), (0, RequestValidate_1.validate)(announcement_1.AnnouncementCreationSchema, 'body'), (req, res, next) => announcementController.create(req, res, next));
router.get('/', (0, Authorize_1.Authorize)('employee_dashboard.view'), (req, res, next) => announcementController.getAll(req, res, next));
router.get('/:id', (0, Authorize_1.Authorize)('announcements.view'), (req, res, next) => {
    const options = {
        included: ['division_units'],
        attributes: {
            division_units: ['id', 'unit_name']
        },
        aliases: {
            division_units: 'division_units'
        }
    };
    announcementController.getById(req, res, next, options);
});
router.put('/:id', (0, Authorize_1.Authorize)('announcements.edit'), (req, res, next) => announcementController.update(req, res, next));
router.delete('/:id', (0, Authorize_1.Authorize)('announcements.delete'), (req, res, next) => announcementController.destroy(req, res, next));
exports.default = router;
