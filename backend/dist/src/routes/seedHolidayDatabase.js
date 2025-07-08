"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const calendarSeeder_1 = require("../cronjobs/calendarSeeder");
const InternalServerError_1 = require("../services/error/InternalServerError");
const moment_1 = __importDefault(require("moment"));
const BadRequest_1 = require("../services/error/BadRequest");
var router = express_1.default.Router();
router.post('/', async (req, res, next) => {
    try {
        const { year } = req.query;
        if (year) {
            const validYearRegex = /^\d{4}$/;
            const startDate = (0, moment_1.default)(year, 'YYYY').startOf('year').format('YYYY-MM-DD');
            const endDate = (0, moment_1.default)(year, 'YYYY').endOf('year').format('YYYY-MM-DD');
            await (0, calendarSeeder_1.seedHolidays)(startDate, endDate);
            if (!validYearRegex.test(year)) {
                return next((0, BadRequest_1.badRequest)("Invalid year format. Please provide a valid 4-digit year."));
            }
            res.status(201).json("Holidays seeded succesfully!");
        }
        else {
            const nextYear = (0, moment_1.default)().add(1, 'year');
            const timeMin = nextYear.startOf('year').format('YYYY-MM-DD');
            const timeMax = nextYear.endOf('year').format('YYYY-MM-DD');
            await (0, calendarSeeder_1.seedHolidays)(timeMin, timeMax);
            res.status(201).json("Holidays seeded succesfully!");
        }
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
});
exports.default = router;
