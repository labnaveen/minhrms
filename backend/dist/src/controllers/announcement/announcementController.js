"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementController = void 0;
//@ts-nocheck
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const announcements_1 = __importDefault(require("../../models/announcements"));
const db_1 = require("../../utilities/db");
const announcementEmployee_1 = __importDefault(require("../../models/announcementEmployee"));
const announcementDivisionUnit_1 = __importDefault(require("../../models/announcementDivisionUnit"));
const sendNotification_1 = require("../../services/notification/sendNotification");
const response_1 = require("../../services/response/response");
const notification_1 = __importDefault(require("../../models/notification"));
const divisionUnits_1 = __importDefault(require("../../models/divisionUnits"));
const models_1 = require("../../models");
const BadRequest_1 = require("../../services/error/BadRequest");
const userDivision_1 = __importDefault(require("../../models/userDivision"));
const NotFound_1 = require("../../services/error/NotFound");
const moment_1 = __importDefault(require("moment"));
const AnnouncementController = (model) => {
    const { getAllDropdown, getById } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next) => {
        try {
            const { page, records, search_term, sortBy, sortOrder } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            let whereOptions = {};
            const orderOptions = [];
            if (sortBy && sortOrder) {
                orderOptions.push([sortBy, sortOrder]);
            }
            if (search_term) {
                whereOptions.title = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            const data = await announcements_1.default.findAndCountAll({
                where: whereOptions,
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
    async function create(req, res, next, options) {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { title, description, suspendable, start_date, end_date, employees, units, group_specific } = req.body;
                const announcementFormData = {
                    title,
                    description,
                    start_date: suspendable ? start_date : null,
                    end_date: suspendable ? end_date : null,
                    group_specific: group_specific,
                    suspendable: suspendable,
                };
                const announcement = await announcements_1.default.create(announcementFormData, { transaction: t });
                if (employees && employees.length > 0) {
                    await Promise.all(employees.map(async (id) => {
                        await announcementEmployee_1.default.create({
                            announcement_id: announcement.id,
                            user_id: id
                        }, { transaction: t });
                        const notificationFormData = {
                            user_id: id,
                            title: 'Announcement',
                            description: announcement.description,
                            type: 'announcement',
                        };
                        const notification = await notification_1.default.create(notificationFormData, { transaction: t });
                        await (0, sendNotification_1.sendNotification)(id, { ...notificationFormData, date: notification?.created_at, id: notification.id });
                    }));
                }
                if (units && units.length > 0) {
                    await Promise.all(units.map(async (unit) => {
                        await announcementDivisionUnit_1.default.create({
                            announcement_id: announcement.id,
                            division_unit_id: unit
                        }, { transaction: t });
                        const employee = await userDivision_1.default.findAll({
                            where: {
                                unit_id: unit,
                            },
                        });
                        await Promise.all(employee.map(async (user) => {
                            const notificationFormData = {
                                user_id: user.user_id,
                                title: 'Announcement',
                                description: announcement.description,
                                type: 'announcement',
                            };
                            const notification = await notification_1.default.create(notificationFormData, { transaction: t });
                            await (0, sendNotification_1.sendNotification)(user.user_id, { ...notificationFormData, date: notification.created_at, id: notification.id });
                        }));
                    }));
                }
                const response = (0, response_1.generateResponse)(201, true, "Announcement Posted Succesfully!", announcement);
                res.status(201).json(response);
            });
        }
        catch (err) {
            console.log(err);
            // res.status(500).json(err)
            next((0, InternalServerError_1.internalServerError)("Something went Wrong!"));
        }
    }
    async function getAnnouncementsForAUser(req, res, next, options) {
        try {
            const { id } = req.credentials;
            const { page, records } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const employee = await models_1.User.findByPk(id, {
                include: [
                    {
                        model: divisionUnits_1.default,
                    }
                ]
            });
            const divisionUnit = employee?.division_units?.map((unit) => unit.id);
            const today = (0, moment_1.default)().format("YYYY-MM-DD hh:mm:ss");
            console.log("TODAY>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", today);
            const _announcement = await announcements_1.default.findAll({
                attributes: ['id'],
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            suspendable: false,
                            start_date: null,
                            end_date: null
                        },
                        {
                            [sequelize_1.Op.and]: [
                                {
                                    suspendable: true,
                                    start_date: { [sequelize_1.Op.lte]: today },
                                    end_date: { [sequelize_1.Op.gte]: today }
                                },
                                {
                                    [sequelize_1.Op.or]: [
                                        {
                                            group_specific: false,
                                        },
                                        {
                                            group_specific: true,
                                            '$division_units.id$': {
                                                [sequelize_1.Op.in]: divisionUnit,
                                                where: {
                                                    start_date: {
                                                        [sequelize_1.Op.lte]: today
                                                    },
                                                    end_date: {
                                                        [sequelize_1.Op.lte]: today
                                                    }
                                                }
                                            },
                                        },
                                    ],
                                }
                            ]
                        }
                    ]
                },
                include: [
                    {
                        model: divisionUnits_1.default,
                        through: { attributes: [] },
                        as: 'division_units',
                        attributes: ['id'],
                        where: {
                            id: {
                                [sequelize_1.Op.in]: divisionUnit
                            }
                        }
                    }
                ]
            });
            const announcementIdsArray = _announcement.map(item => item.id);
            const announcements = await announcements_1.default.findAndCountAll({
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            id: {
                                [sequelize_1.Op.in]: announcementIdsArray
                            }
                        },
                        {
                            group_specific: false
                        }
                    ]
                },
                include: [
                    {
                        model: divisionUnits_1.default,
                        as: 'division_units',
                        through: {
                            attributes: [],
                        },
                        // where:{
                        //     id: {
                        //         [Op.in]: divisionUnit
                        //     }
                        // },
                        attributes: []
                    }
                ],
                limit: recordsPerPage,
                offset: offset,
                order: [['id', 'DESC']]
            });
            const totalPages = Math.ceil(announcements.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: announcements.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const result = {
                data: announcements.rows,
                meta
            };
            const response = (0, response_1.generateResponse)(200, true, "Announcements fetched succesfully!", result.data, meta);
            res.status(200).json(response);
        }
        catch (err) {
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    }
    const update = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const announcement_id = req.params.id;
            const today = (0, moment_1.default)().format('YYYY-MM-DD');
            const { title, description, suspendable, group_specific, end_date, units, employees, start_date } = req.body;
            if ((0, moment_1.default)(start_date).isBefore(today)) {
                next((0, BadRequest_1.badRequest)("Cannot change the start date once the announcement is active"));
            }
            await db_1.sequelize.transaction(async (t) => {
                const formBody = {
                    title,
                    description,
                    suspendable,
                    group_specific,
                    start_date,
                    end_date
                };
                if (suspendable === false) {
                    formBody.start_date = null;
                    formBody.end_date = null;
                }
                const announcement = await announcements_1.default.findByPk(announcement_id);
                await announcement?.update(formBody, { transaction: t });
                await announcementDivisionUnit_1.default.destroy({
                    where: {
                        announcement_id: announcement_id
                    },
                    transaction: t
                });
                if (units && units.length > 0) {
                    await Promise.all(units.map(async (unit_id) => {
                        await announcementDivisionUnit_1.default.create({
                            announcement_id: announcement_id,
                            division_unit_id: unit_id
                        }, { transaction: t });
                    }));
                }
                const response = (0, response_1.generateResponse)(200, true, "Announcement updated succesfully!");
                res.status(200).json(response);
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const announcement_id = req.params.id;
                const announcement = await announcements_1.default.findByPk(announcement_id);
                if (announcement) {
                    await announcementDivisionUnit_1.default.destroy({
                        where: {
                            announcement_id: announcement_id
                        },
                        transaction: t
                    });
                    await announcement.destroy({ transaction: t });
                    const response = (0, response_1.generateResponse)(200, true, "Announcement deleted succesfully!");
                    res.status(200).json(response);
                }
                else {
                    next((0, NotFound_1.notFound)("No announcement found with that ID"));
                }
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, update, getAllDropdown, getById, destroy, getAnnouncementsForAUser };
};
exports.AnnouncementController = AnnouncementController;
