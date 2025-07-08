"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayCalendarController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const response_1 = require("../../services/response/response");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const masterPolicy_1 = __importDefault(require("../../models/masterPolicy"));
const db_1 = require("../../utilities/db");
const holidayCalendar_1 = __importDefault(require("../../models/holidayCalendar"));
const holidayCalendarAssociation_1 = __importDefault(require("../../models/holidayCalendarAssociation"));
const holidayDatabase_1 = __importDefault(require("../../models/holidayDatabase"));
const BadRequest_1 = require("../../services/error/BadRequest");
const customHoliday_1 = __importDefault(require("../../models/customHoliday"));
const NotFound_1 = require("../../services/error/NotFound");
const Forbidden_1 = require("../../services/error/Forbidden");
const HolidayCalendarController = (model) => {
    const { getAllDropdown, getById, create } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next) => {
        try {
            const { page, records, search_term, sortBy, sortOrder } = req.query;
            if (!page && !records) {
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            let orderOptions = [];
            let whereOptions = {};
            if (sortBy && sortOrder) {
                orderOptions.push([sortBy, sortOrder]);
            }
            if (search_term) {
                whereOptions[sequelize_1.Op.or] = [
                    { name: { [sequelize_1.Op.like]: `%${search_term}%` } },
                    { year: { [sequelize_1.Op.like]: `%${search_term}%` } }
                ];
            }
            const data = await holidayCalendar_1.default.findAndCountAll({
                where: whereOptions,
                include: [
                    { model: holidayDatabase_1.default, attributes: ['id', 'name', 'date'] }
                ],
                limit: recordsPerPage,
                offset: offset,
                order: orderOptions
            });
            const totalPages = Math.ceil(data.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: data.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", data.rows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const createCalendar = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { name, year, holiday_id } = req.body;
                const CalendarFormBody = {
                    name,
                    year
                };
                const holidayCalendar = await holidayCalendar_1.default.create(CalendarFormBody, { transaction: t });
                if (holiday_id && holiday_id.length > 0) {
                    await Promise.all(holiday_id.map(async (id) => {
                        if (typeof id !== 'number') {
                            throw new Error('Invalid id in holiday_id array');
                        }
                        await holidayCalendarAssociation_1.default.create({
                            holiday_calendar_id: holidayCalendar.id,
                            holiday_id: id
                        }, { transaction: t });
                    }));
                    const response = (0, response_1.generateResponse)(201, true, "Holiday Calendar created Succesfully!", holidayCalendar);
                    res.status(201).json(response);
                }
                else {
                    next((0, BadRequest_1.badRequest)("Please select atleast one holiday!"));
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong"));
        }
    };
    const update = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.params;
                const { name, year, holiday_id } = req.body;
                const formBody = {
                    name,
                    year
                };
                const holidayCalendar = await holidayCalendar_1.default.findByPk(id, {
                    include: [{ model: holidayDatabase_1.default, through: { attributes: [] } }]
                });
                await holidayCalendar?.update(formBody, { transaction: t });
                await holidayCalendarAssociation_1.default.destroy({
                    where: {
                        holiday_calendar_id: id
                    },
                    transaction: t
                });
                if (holiday_id && holiday_id.length > 0) {
                    await Promise.all(holiday_id.map(async (holiday) => {
                        console.log('ahaha', holiday);
                        if (typeof holiday !== 'number') {
                            throw new Error('Invalid id in holiday_id array');
                        }
                        await holidayCalendarAssociation_1.default.create({
                            holiday_calendar_id: holidayCalendar?.id,
                            holiday_id: holiday
                        }, { transaction: t });
                    }));
                }
                const response = (0, response_1.generateResponse)(200, true, "Holiday Calendar updated succesfully!", holidayCalendar);
                res.status(200).json(response);
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next) => {
        try {
            const { id } = req.params;
            await db_1.sequelize.transaction(async (t) => {
                const holidayCalendar = await holidayCalendar_1.default.findByPk(id, { transaction: t });
                const masterPolicy = await masterPolicy_1.default.findAll({
                    where: {
                        holiday_calendar_id: id
                    }
                });
                if (holidayCalendar) {
                    if (masterPolicy.length > 0) {
                        next((0, Forbidden_1.forbiddenError)("This holiday calendar is already assigned to a master policy!"));
                    }
                    else {
                        await customHoliday_1.default.destroy({
                            where: {
                                holiday_calendar_id: id
                            },
                            transaction: t
                        });
                        await holidayCalendarAssociation_1.default.destroy({
                            where: {
                                holiday_calendar_id: id
                            },
                            transaction: t
                        });
                        await holidayCalendar.destroy({ transaction: t });
                        const response = (0, response_1.generateResponse)(200, true, "Holiday Calendar deleted succesfully!");
                        res.status(200).json(response);
                    }
                }
                else {
                    next((0, NotFound_1.notFound)("Cannot find holiday calendar with that id!"));
                }
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const holidayForSpecificCalendar = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { page, records, sortOrder, sortBy, search_term } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const holidayCalendar = await holidayCalendar_1.default.findByPk(id);
            if (!holidayCalendar) {
                next((0, BadRequest_1.badRequest)("There is no Holiday Calendar with that id"));
            }
            let orderOptions = [];
            if (sortBy && sortOrder) {
                if (sortBy == 'holiday_name') {
                    orderOptions.push(['name', sortOrder]);
                }
                if (sortBy == 'holiday_date') {
                    orderOptions.push(['date', sortOrder]);
                }
            }
            let whereOptions = {};
            if (search_term) {
                whereOptions.name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const holiday = await holidayDatabase_1.default.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: holidayCalendar_1.default,
                        where: { id: id },
                        through: {
                            attributes: []
                        },
                        attributes: []
                    },
                ],
                limit: recordsPerPage,
                offset: offset,
                order: orderOptions
            });
            const totalPages = Math.ceil(holiday.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: holiday.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const response = (0, response_1.generateResponse)(200, true, "Data Fetched Succesfully!", holiday.rows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            // res.status(500).json(err)
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const deleteSingleHoliday = async (req, res, next) => {
        try {
            const { id, holidayId } = req.params;
            const holiday = await holidayCalendarAssociation_1.default.findOne({
                where: {
                    holiday_calendar_id: id,
                    holiday_id: holidayId
                }
            });
            if (!holiday) {
                next((0, BadRequest_1.badRequest)("No holiday exists with that id"));
            }
            else {
                await holidayCalendarAssociation_1.default.destroy({
                    where: {
                        holiday_calendar_id: id,
                        holiday_id: holidayId
                    }
                });
                const response = (0, response_1.generateResponse)(200, true, "Holiday Deleted succesfully!");
                res.status(200).json(response);
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went Wrong!"));
        }
    };
    return {
        getAll,
        createCalendar,
        getAllDropdown,
        getById,
        destroy,
        update,
        holidayForSpecificCalendar,
        deleteSingleHoliday,
        create
    };
};
exports.HolidayCalendarController = HolidayCalendarController;
