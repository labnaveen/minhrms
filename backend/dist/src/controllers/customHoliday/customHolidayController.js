"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomHolidayController = void 0;
const masterController_1 = require("../masterController");
const response_1 = require("../../services/response/response");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const holidayCalendar_1 = __importDefault(require("../../models/holidayCalendar"));
const NotFound_1 = require("../../services/error/NotFound");
const holidayDatabase_1 = __importDefault(require("../../models/holidayDatabase"));
const db_1 = require("../../utilities/db");
const holidayCalendarAssociation_1 = __importDefault(require("../../models/holidayCalendarAssociation"));
const BadRequest_1 = require("../../services/error/BadRequest");
const moment_1 = __importDefault(require("moment"));
const CustomHolidayController = (model) => {
    const { getAll, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const create = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                //@ts-ignore
                const { id } = req.credentials;
                const { holiday_calendar_id, name, date } = req.body;
                const yearOfHoliday = (0, moment_1.default)(date).get('years');
                const currentYear = (0, moment_1.default)().get('years');
                const holidayCalendar = await holidayCalendar_1.default.findByPk(holiday_calendar_id);
                if (holidayCalendar) {
                    const existingCustomHoliday = await holidayDatabase_1.default.findOne({
                        where: {
                            name: name,
                            custom_holiday: true
                        }
                    });
                    if (existingCustomHoliday) {
                        next((0, BadRequest_1.badRequest)("A custom holiday with that holiday already exists."));
                    }
                    if (yearOfHoliday !== currentYear) {
                        next((0, BadRequest_1.badRequest)("The holiday should be of the current holiday calendar year"));
                    }
                    const customHoliday = await holidayDatabase_1.default.create({
                        name: name,
                        date: date,
                        custom_holiday: true
                    }, { transaction: t });
                    console.log(customHoliday);
                    const association = await holidayCalendarAssociation_1.default.create({
                        holiday_calendar_id: holiday_calendar_id,
                        holiday_id: customHoliday.id
                    }, { transaction: t });
                    const response = (0, response_1.generateResponse)(201, true, "Custom Holiday created succesfully!", customHoliday);
                    res.status(201).json(response);
                }
                else {
                    next((0, NotFound_1.notFound)("Cannot find a holiday calendar with that id!"));
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next) => {
        try {
            const { id } = req.params;
            await db_1.sequelize.transaction(async (t) => {
                const holiday = await holidayDatabase_1.default.findByPk(id);
                if (holiday) {
                    await holidayCalendarAssociation_1.default.destroy({
                        where: {
                            holiday_id: id
                        },
                        transaction: t
                    });
                    await holiday.destroy({ transaction: t });
                    const response = (0, response_1.generateResponse)(200, true, "Deleted Succesfully!");
                    res.status(200).json(response);
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const holiday = await holidayDatabase_1.default.findOne({
                where: {
                    id: id,
                    custom_holiday: true
                }
            });
            if (holiday) {
                await holiday.update(req.body);
                const response = (0, response_1.generateResponse)(200, true, "Record updated succesfully!");
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find the holida"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const customHoliday = await holidayDatabase_1.default.findOne({
                where: {
                    id: id,
                    custom_holiday: true
                }
            });
            if (customHoliday) {
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", customHoliday);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find any custom holiday with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, update, getAllDropdown, getById, destroy };
};
exports.CustomHolidayController = CustomHolidayController;
