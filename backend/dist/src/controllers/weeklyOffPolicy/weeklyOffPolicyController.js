"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyOffPolicyController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const db_1 = require("../../utilities/db");
const weeklyOffPolicy_1 = __importDefault(require("../../models/weeklyOffPolicy"));
const weeklyOffAssociation_1 = __importDefault(require("../../models/weeklyOffAssociation"));
const response_1 = require("../../services/response/response");
const BadRequest_1 = require("../../services/error/BadRequest");
const masterPolicy_1 = __importDefault(require("../../models/masterPolicy"));
const NotFound_1 = require("../../services/error/NotFound");
const Forbidden_1 = require("../../services/error/Forbidden");
const WeeklyOffPolicyController = (model) => {
    const { getAllDropdown } = (0, masterController_1.MasterController)(model);
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
                if (sortBy === 'policy_name') {
                    orderOptions.push(['name', sortOrder]);
                }
            }
            if (search_term) {
                whereOptions.name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            const data = await weeklyOffPolicy_1.default.findAndCountAll({
                where: whereOptions,
                include: [
                    { model: weeklyOffAssociation_1.default, attributes: ['id', 'week_name', 'week_number'] }
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
    const create = async (req, res, next) => {
        try {
            const { name, description, configuration } = req.body;
            const policyFormBody = {
                name,
                description
            };
            const existingWeeklyOffPolicy = await weeklyOffPolicy_1.default.findOne({
                where: {
                    name: name
                }
            });
            if (existingWeeklyOffPolicy) {
                return next((0, BadRequest_1.badRequest)("A policy with that name already exists!"));
            }
            else {
                await db_1.sequelize.transaction(async (t) => {
                    const weeklyOffPolicy = await weeklyOffPolicy_1.default.create(policyFormBody, { transaction: t });
                    if (configuration) {
                        const week_id = Object.keys(configuration);
                        if (weeklyOffPolicy) {
                            for (const weekId of week_id) {
                                for (const week_number of configuration[weekId]) {
                                    await weeklyOffAssociation_1.default.create({
                                        weekly_off_policy_id: weeklyOffPolicy.id,
                                        week_name: weekId,
                                        week_number: week_number
                                    }, { transaction: t });
                                }
                            }
                        }
                        const response = (0, response_1.generateResponse)(201, true, "Weekly Off Policy Created Succesfully!", weeklyOffPolicy);
                        res.status(201).json(response);
                    }
                    else {
                        next((0, BadRequest_1.badRequest)("Please enter atleast one configuration!"));
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const update = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { name, description, configuration } = req.body;
                const { id } = req.params;
                const weeklyOffPolicyFormBody = {
                    name,
                    description
                };
                const weeklyOffPolicy = await weeklyOffPolicy_1.default.findByPk(id);
                const existingWeeklyOffPolicy = await weeklyOffPolicy_1.default.findOne({
                    where: {
                        name: name,
                        id: {
                            [sequelize_1.Op.not]: id
                        }
                    }
                });
                if (existingWeeklyOffPolicy) {
                    next((0, BadRequest_1.badRequest)("A weekly off policy with that name already exists!"));
                }
                if (!weeklyOffPolicy) {
                    next((0, BadRequest_1.badRequest)("No weekly off policy exists with that id"));
                }
                else {
                    await weeklyOffPolicy.update(weeklyOffPolicyFormBody, { transaction: t });
                    await weeklyOffAssociation_1.default.destroy({
                        where: {
                            weekly_off_policy_id: id
                        },
                        transaction: t
                    });
                    if (configuration) {
                        const week_id = Object.keys(configuration);
                        if (weeklyOffPolicy) {
                            for (const weekId of week_id) {
                                for (const week_number of configuration[weekId]) {
                                    await weeklyOffAssociation_1.default.create({
                                        weekly_off_policy_id: id,
                                        week_name: weekId,
                                        week_number: week_number
                                    }, { transaction: t });
                                }
                            }
                        }
                    }
                }
                const response = (0, response_1.generateResponse)(200, true, "Weekly Off Policy updated succesfully!");
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
                const { id } = req.params;
                const weeklyOffPolicy = await weeklyOffPolicy_1.default.findByPk(id);
                if (!weeklyOffPolicy) {
                    next((0, BadRequest_1.badRequest)("There is no policy with that id"));
                }
                else {
                    const masterPolicy = await masterPolicy_1.default.findAll({
                        where: {
                            weekly_off_policy_id: id
                        }
                    });
                    if (masterPolicy.length > 0) {
                        next((0, Forbidden_1.forbiddenError)("Cannot delete, This weekly off policy is already assigned to a master policy"));
                    }
                    else {
                        await weeklyOffAssociation_1.default.destroy({
                            where: {
                                weekly_off_policy_id: id
                            },
                            transaction: t
                        });
                        await weeklyOffPolicy.destroy({ transaction: t });
                        const response = (0, response_1.generateResponse)(200, true, "Weekly Off Policy deleted succesfully!");
                        res.status(200).json(response);
                    }
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getById = async (req, res, next) => {
        try {
            const weeklyOffPolicyId = req.params.id;
            const weeklyOffPolicy = await weeklyOffPolicy_1.default.findByPk(weeklyOffPolicyId, {
                include: [
                    {
                        model: weeklyOffAssociation_1.default,
                        attributes: ['id', 'week_name', 'week_number'],
                        required: false
                    },
                ]
            });
            if (weeklyOffPolicy) {
                const response = (0, response_1.generateResponse)(200, true, "Weekly off policy fetched succesfully!", weeklyOffPolicy);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find weekly off policy with that id"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, update, getAllDropdown, getById, destroy };
};
exports.WeeklyOffPolicyController = WeeklyOffPolicyController;
