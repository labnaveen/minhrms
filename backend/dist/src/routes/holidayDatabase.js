"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const holidayDatabaseController_1 = require("../controllers/holidayDatabase/holidayDatabaseController");
const holidayDatabase_1 = __importDefault(require("../models/holidayDatabase"));
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
var router = express_1.default.Router();
const holidayDatabase = (0, holidayDatabaseController_1.HolidayDatabaseController)(holidayDatabase_1.default);
const holidayDatabaseDropdown = (0, dropdownController_1.DropdownController)(holidayDatabase_1.default);
router.get('/', (0, Authorize_1.Authorize)('holiday_calendar.view'), (req, res, next) => {
    holidayDatabase.getAllForSpecificYear(req, res, next);
});
exports.default = router;
