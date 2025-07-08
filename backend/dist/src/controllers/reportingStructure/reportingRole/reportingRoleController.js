"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingRoleController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../../masterController");
const reportingManagers_1 = __importDefault(require("../../../models/reportingManagers"));
const response_1 = require("../../../services/response/response");
const reportingRole_1 = __importDefault(require("../../../models/reportingRole"));
const InternalServerError_1 = require("../../../services/error/InternalServerError");
const db_1 = require("../../../utilities/db");
const BadRequest_1 = require("../../../services/error/BadRequest");
const models_1 = require("../../../models");
const NotFound_1 = require("../../../services/error/NotFound");
const Forbidden_1 = require("../../../services/error/Forbidden");
const ReportingRoleController = (model) => {
    const { getById, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const create = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const formData = {
                name: req.body.name,
                priority: req.body.priority
            };
            const existingReportingRole = await reportingRole_1.default.findAll({
                where: {
                    priority: formData.priority
                }
            });
            const existingReportingRoleName = await reportingRole_1.default.findAll({
                where: {
                    name: formData.name
                }
            });
            if (existingReportingRoleName.length > 0) {
                next((0, BadRequest_1.badRequest)("A reporting role with the same name is already created!"));
            }
            if (existingReportingRole.length > 0) {
                next((0, BadRequest_1.badRequest)("A reporting role with that same priority is already created!"));
            }
            else {
                const reportingRole = await reportingRole_1.default.create(formData);
                const response = (0, response_1.generateResponse)(201, true, "Reporting role succesfully created!", reportingRole);
                res.status(201).json(response);
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getAll = async (req, res, next, options) => {
        try {
            const { page, records, sortBy, sortOrder, search_term } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            let whereOptions = {};
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const orderOptions = [];
            if (search_term) {
                whereOptions.name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            if (sortBy && sortOrder) {
                if (sortBy === 'role_name') {
                    orderOptions.push(['name', sortOrder]);
                }
                if (sortBy === 'reporting_manager_count') {
                    orderOptions.push([db_1.sequelize.literal('reporting_manager_count'), sortOrder]);
                }
                if (sortBy === 'priority') {
                    orderOptions.push([sortBy, sortOrder]);
                }
            }
            const reportingRole = await reportingRole_1.default.findAndCountAll({
                where: whereOptions,
                attributes: {
                    include: [[sequelize_1.Sequelize.literal('(SELECT COUNT(*) FROM reporting_managers WHERE reporting_managers.reporting_role_id = reporting_role.id)'), 'reporting_manager_count']],
                },
                include: [
                    {
                        model: reportingManagers_1.default,
                        required: false
                    }
                ],
                limit: recordsPerPage,
                offset: offset,
                distinct: true,
                order: orderOptions
            });
            const totalPages = Math.ceil(reportingRole.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: reportingRole.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const response = (0, response_1.generateResponse)(200, true, "Reporting Manager fetched Succesfully!", reportingRole.rows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something went wrong"))
        }
    };
    const dropdown = async (req, res, next) => {
        try {
            const reportingRole = await reportingRole_1.default.findAll({
                include: [
                    { model: reportingManagers_1.default, attributes: ['id', 'user_id'], include: [
                            { model: models_1.User, attributes: ['id', 'employee_name', 'employee_generated_id'] }
                        ] }
                ],
                attributes: ['id', 'name']
            });
            const response = (0, response_1.generateResponse)(200, true, "Dropdown fetched Succesfully!", reportingRole);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    const destroy = async (req, res, next) => {
        try {
            const reportingRoleId = req.params.id;
            const reportingRole = await reportingRole_1.default.findByPk(reportingRoleId);
            const reportingManagers = await reportingManagers_1.default.findAll({
                where: {
                    reporting_role_id: reportingRoleId
                }
            });
            if (reportingRole) {
                if (reportingManagers.length > 0) {
                    next((0, Forbidden_1.forbiddenError)("Cannot delete reporting role, there are managers assigned to this reporting role"));
                }
                else {
                    await reportingRole.destroy();
                    const response = (0, response_1.generateResponse)(200, true, "Deleted Reporting role succesfully!");
                    res.status(200).json(response);
                }
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find a reporting role with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, priority } = req.body;
            const reportingRole = await reportingRole_1.default.findByPk(id);
            if (reportingRole) {
                const existingReportingPriority = await reportingRole_1.default.findAll({
                    where: {
                        priority: priority,
                        id: {
                            [sequelize_1.Op.not]: id
                        }
                    }
                });
                const existingReportingName = await reportingRole_1.default.findAll({
                    where: {
                        name: name,
                        id: {
                            [sequelize_1.Op.not]: id
                        }
                    }
                });
                if (existingReportingPriority.length > 0) {
                    next((0, BadRequest_1.badRequest)("A reporting role with that same priority is already created!"));
                }
                else if (existingReportingName.length > 0) {
                    next((0, BadRequest_1.badRequest)("A reporting role with that same name already exists!"));
                }
                else {
                    await reportingRole.update({
                        name,
                        priority
                    });
                    const response = (0, response_1.generateResponse)(200, true, "Data updated succesfully!");
                    res.status(200).json(response);
                }
            }
            else {
                next((0, NotFound_1.notFound)("There is no reporting role with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, getById, update, destroy, create, getAllDropdown, dropdown };
};
exports.ReportingRoleController = ReportingRoleController;
