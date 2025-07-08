"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const customHolidayController_1 = require("../controllers/customHoliday/customHolidayController");
const customHoliday_1 = __importDefault(require("../models/customHoliday"));
const RequestValidate_1 = require("../middleware/RequestValidate");
const holiday_1 = require("../schemas/holiday");
var router = express_1.default.Router();
const customHolidayController = (0, customHolidayController_1.CustomHolidayController)(customHoliday_1.default);
router.post('/', (0, Authorize_1.Authorize)("holiday_calendar.add"), (req, res, next) => customHolidayController.create(req, res, next));
router.get('/', (0, Authorize_1.Authorize)('holiday_calendar.view'), (req, res, next) => {
    const options = {
        included: ['holiday_calendar']
    };
    customHolidayController.getAll(req, res, next, options);
});
router.get('/:id', (0, Authorize_1.Authorize)('holiday_calendar.view'), (req, res, next) => customHolidayController.getById(req, res, next));
router.put('/:id', (0, Authorize_1.Authorize)('holiday_calendar.edit'), (0, RequestValidate_1.validate)(holiday_1.UpdateCustomHoliday, 'body'), (req, res, next) => customHolidayController.update(req, res, next));
router.delete('/:id', (0, Authorize_1.Authorize)('holiday_calendar.delete'), (req, res, next) => {
    customHolidayController.destroy(req, res, next);
});
exports.default = router;
