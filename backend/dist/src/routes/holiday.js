"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const holidayCalendarController_1 = require("../controllers/holiday/holidayCalendarController");
const holidayCalendar_1 = __importDefault(require("../models/holidayCalendar"));
const RequestValidate_1 = require("../middleware/RequestValidate");
const holiday_1 = require("../schemas/holiday");
const holidayDatabaseController_1 = require("../controllers/holidayDatabase/holidayDatabaseController");
const holidayDatabase_1 = __importDefault(require("../models/holidayDatabase"));
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
var router = express_1.default.Router();
const holidayCalendarController = (0, holidayCalendarController_1.HolidayCalendarController)(holidayCalendar_1.default);
const holidayDatabaseController = (0, holidayDatabaseController_1.HolidayDatabaseController)(holidayDatabase_1.default);
const holidayCalenderDropdownController = (0, dropdownController_1.DropdownController)(holidayCalendar_1.default);
router.post('/', (0, Authorize_1.Authorize)('holiday_calendar.add'), (0, RequestValidate_1.validate)(holiday_1.HolidayCalendarCreationSchema, "body"), (req, res, next) => holidayCalendarController.createCalendar(req, res, next));
router.get('/', (0, Authorize_1.Authorize)('holiday_calendar.view'), (req, res, next) => {
    holidayCalendarController.getAll(req, res, next);
});
router.get('/dropdown', (0, Authorize_1.Authorize)('holiday_calendar.view'), (req, res, next) => {
    const options = {
        attribute: ['id', 'name', 'year']
    };
    holidayCalenderDropdownController.getAllDropdown(req, res, next, options);
});
router.get('/:id/holiday', (0, Authorize_1.Authorize)('holiday_calendar.view'), (req, res, next) => {
    holidayCalendarController.holidayForSpecificCalendar(req, res, next);
});
router.get('/:id', (0, Authorize_1.Authorize)('holiday_calendar.view'), (req, res, next) => {
    const options = {
        included: ['holiday_database'],
        attributes: {
            holiday_database: ['id', 'name', 'date']
        }
    };
    holidayCalendarController.getById(req, res, next, options);
});
//Unlink/Delete holday from holiday calendar from association
router.delete('/:id/holiday/:holidayId', (0, Authorize_1.Authorize)('holiday_calendar.delete'), (req, res, next) => {
    holidayCalendarController.deleteSingleHoliday(req, res, next);
});
router.put('/:id', (0, Authorize_1.Authorize)('holiday_calendar.edit'), (req, res, next) => holidayCalendarController.update(req, res, next));
router.delete('/:id', (0, Authorize_1.Authorize)('holiday_calendar.delete'), (req, res, next) => holidayCalendarController.destroy(req, res, next));
exports.default = router;
