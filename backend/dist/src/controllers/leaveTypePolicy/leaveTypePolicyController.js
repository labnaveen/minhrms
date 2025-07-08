"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveTypePolicyController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const models_1 = require("../../models");
const leaveTypePolicy_1 = __importDefault(require("../../models/leaveTypePolicy"));
const InternalServerError_1 = require("../../services/error/InternalServerError");
const db_1 = require("../../utilities/db");
const leaveAllocation_1 = __importDefault(require("../../models/leaveAllocation"));
const response_1 = require("../../services/response/response");
const NotFound_1 = require("../../services/error/NotFound");
const masterPolicyLeavePolicy_1 = __importDefault(require("../../models/masterPolicyLeavePolicy"));
const Forbidden_1 = require("../../services/error/Forbidden");
const BadRequest_1 = require("../../services/error/BadRequest");
const LeaveTypePolicyController = (model) => {
    const { getAllDropdown } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next) => {
        try {
            const leaveTypeId = req.params.id;
            const leaveType = await models_1.LeaveType.findByPk(leaveTypeId);
            if (leaveType) {
                const { page, records, search_term, sortBy, sortOrder } = req.query;
                if (!page && !records) {
                    next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                    return;
                }
                const pageNumber = parseInt(page);
                const recordsPerPage = parseInt(records);
                const offset = (pageNumber - 1) * recordsPerPage;
                let orderOptions = [];
                let whereOptions = {
                    leave_type_id: req.params.id
                };
                if (sortBy && sortOrder) {
                    if (sortBy === 'leave_policy_name') {
                        orderOptions.push(['leave_policy_name', sortOrder]);
                    }
                }
                if (search_term) {
                    whereOptions.leave_policy_name = {
                        [sequelize_1.Op.like]: `%${search_term}%`
                    };
                }
                const data = await leaveTypePolicy_1.default.findAndCountAll({
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
            else {
                next((0, NotFound_1.notFound)("Cannot find the leave type with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const create = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { leave_type_id, leave_policy_name, description, accrual_frequency, accrual_type, accrual_from, custom_leave_application_date, advance_accrual_for_entire_leave_year, annual_eligibility, annual_breakup, custom_annual_breakup } = req.body;
                const formData = {
                    leave_type_id,
                    leave_policy_name,
                    description,
                    accrual_frequency,
                    accrual_type,
                    accrual_from,
                    custom_leave_application_date,
                    advance_accrual_for_entire_leave_year,
                    annual_eligibility,
                    annual_breakup,
                };
                const leaveTypePolicy = await leaveTypePolicy_1.default.create(formData, { transaction: t });
                const leaveAllocations = Object.entries(custom_annual_breakup).map(([monthNumber, allocatedLeaves]) => ({
                    leave_type_policy_id: leaveTypePolicy.id,
                    month_number: parseInt(monthNumber, 10),
                    allocated_leaves: parseInt(allocatedLeaves, 10)
                }));
                await leaveAllocation_1.default.bulkCreate(leaveAllocations, { transaction: t });
                const response = (0, response_1.generateResponse)(201, true, "Leave type policy succesfully created!", leaveTypePolicy);
                res.status(201).json(response);
            });
        }
        catch (err) {
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    const getById = async (req, res, next) => {
        try {
            const leaveTypePolicyId = req.params.id;
            const leaveTypePolicy = await leaveTypePolicy_1.default.findByPk(leaveTypePolicyId, {
                include: [
                    {
                        model: leaveAllocation_1.default,
                        as: 'leaveAllocations',
                        attributes: ['id', 'month_number', 'allocated_leaves', 'leave_type_policy_id']
                    }
                ]
            });
            if (leaveTypePolicy) {
                const response = (0, response_1.generateResponse)(200, true, "Leave Type Policy fetched succesfully!", leaveTypePolicy);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find leave type policy with that id"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next) => {
        try {
            const leaveTypePolicyId = req.params.id;
            const leaveTypePolicy = await leaveTypePolicy_1.default.findByPk(leaveTypePolicyId);
            if (leaveTypePolicy) {
                const existing = await masterPolicyLeavePolicy_1.default.findAll({
                    where: {
                        leave_type_policy_id: leaveTypePolicyId
                    }
                });
                if (existing.length > 0) {
                    next((0, Forbidden_1.forbiddenError)('Cannot delete, this leave policy is assigned to a leave type in master policy'));
                }
                else {
                    await leaveTypePolicy.destroy();
                    const response = (0, response_1.generateResponse)(200, true, "Leave Type Policy succesfully deleted!");
                    res.status(200).json(response);
                }
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find a leave Type Policy with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const update = async (req, res, next) => {
        try {
            const leaveTypePolicyId = req.params.id;
            const leaveTypePolicy = await leaveTypePolicy_1.default.findByPk(leaveTypePolicyId);
            if (leaveTypePolicy) {
                await db_1.sequelize.transaction(async (t) => {
                    const { leave_type_id, leave_policy_name, description, accrual_frequency, accrual_type, accrual_from, custom_leave_application_date, advance_accrual_for_entire_leave_year, annual_eligibility, annual_breakup, custom_annual_breakup } = req.body;
                    const formData = {
                        leave_type_id,
                        leave_policy_name,
                        description,
                        accrual_frequency,
                        accrual_type,
                        accrual_from,
                        custom_leave_application_date,
                        advance_accrual_for_entire_leave_year,
                        annual_eligibility,
                        annual_breakup,
                    };
                    await leaveTypePolicy.update(formData, { transaction: t });
                    await leaveAllocation_1.default.destroy({
                        where: {
                            leave_type_policy_id: leaveTypePolicy.id
                        },
                        transaction: t
                    });
                    const leaveAllocations = Object.entries(custom_annual_breakup).map(([monthNumber, allocatedLeaves]) => ({
                        leave_type_policy_id: leaveTypePolicy.id,
                        month_number: parseInt(monthNumber, 10),
                        allocated_leaves: parseInt(allocatedLeaves, 10)
                    }));
                    console.log(">>>>>>>", leaveAllocations);
                    await leaveAllocation_1.default.bulkCreate(leaveAllocations, { transaction: t });
                    const response = (0, response_1.generateResponse)(200, true, "Policy updated succesfully!");
                    res.status(200).json(response);
                });
            }
            else {
                next((0, NotFound_1.notFound)("There are not policy with that id"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { create, getAll, getById, update, destroy, getAllDropdown };
};
exports.LeaveTypePolicyController = LeaveTypePolicyController;
