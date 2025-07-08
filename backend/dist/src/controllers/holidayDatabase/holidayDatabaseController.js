"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayDatabaseController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const BadRequest_1 = require("../../services/error/BadRequest");
const holidayDatabase_1 = __importDefault(require("../../models/holidayDatabase"));
const response_1 = require("../../services/response/response");
const HolidayDatabaseController = (model) => {
    const { getAll, create, destroy, update, getById, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const getAllForSpecificYear = async (req, res, next, options) => {
        try {
            const { year } = req.query;
            if (!year) {
                next((0, BadRequest_1.badRequest)("Please enter a year"));
            }
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${parseInt(year) + 1}-01-01`);
            const holidays = await holidayDatabase_1.default.findAll({
                where: {
                    date: {
                        [sequelize_1.Op.gte]: startDate,
                        [sequelize_1.Op.lt]: endDate
                    }
                }
            });
            const response = (0, response_1.generateResponse)(200, true, "Holidays fetched Succesfully!", holidays);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, destroy, update, getById, getAllForSpecificYear, getAllDropdown };
};
exports.HolidayDatabaseController = HolidayDatabaseController;
