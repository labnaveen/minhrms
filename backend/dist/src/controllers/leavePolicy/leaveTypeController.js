"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveTypeController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const models_1 = require("../../models");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const leaveTypePolicy_1 = __importDefault(require("../../models/leaveTypePolicy"));
const Forbidden_1 = require("../../services/error/Forbidden");
const response_1 = require("../../services/response/response");
const masterPolicyLeavePolicy_1 = __importDefault(require("../../models/masterPolicyLeavePolicy"));
const BadRequest_1 = require("../../services/error/BadRequest");
const NotFound_1 = require("../../services/error/NotFound");
const getMasterPolicy_1 = require("../../services/masterPolicy/getMasterPolicy");
const LeaveTypeController = (model) => {
    const { getById, getAllDropdown } = (0, masterController_1.MasterController)(model);
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
                if (sortBy === 'leave_type_name') {
                    orderOptions.push(['leave_type_name', sortOrder]);
                }
            }
            if (search_term) {
                whereOptions.leave_type_name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            const data = await models_1.LeaveType.findAndCountAll({
                where: whereOptions,
                include: [
                    { model: leaveTypePolicy_1.default }
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
            const { leave_type_name, negative_balance, max_leave_allowed_in_negative_balance, max_days_per_leave, max_days_per_month, allow_half_days, application_on_holidays, restriction_for_application, limit_back_dated_application, notice_for_application, auto_approval, auto_action_after, auto_approval_action, supporting_document_mandatory, prorated_accrural_first_month, prorated_rounding, prorated_rounding_factor, encashment_yearly, max_leaves_for_encashment, carry_forward_yearly, carry_forward_rounding, carry_forward_rounding_factor, intra_cycle_carry_forward, prefix_postfix_weekly_off_sandwhich_rule, prefix_postfix_holiday_sandwhich_rule, inbetween_weekly_off_sandwhich_rule, leave_application_after } = req.body;
            const existingLeaveType = await models_1.LeaveType.findOne({
                where: {
                    leave_type_name: leave_type_name
                }
            });
            if (existingLeaveType) {
                return next((0, BadRequest_1.badRequest)("A leave with that name already exists!"));
            }
            const formData = {
                leave_type_name,
                negative_balance,
                max_leave_allowed_in_negative_balance,
                max_days_per_leave,
                max_days_per_month,
                allow_half_days,
                application_on_holidays,
                restriction_for_application,
                limit_back_dated_application,
                notice_for_application,
                auto_approval,
                auto_action_after,
                auto_approval_action,
                supporting_document_mandatory,
                prorated_accrural_first_month,
                prorated_rounding,
                prorated_rounding_factor,
                encashment_yearly,
                max_leaves_for_encashment,
                carry_forward_yearly,
                carry_forward_rounding,
                carry_forward_rounding_factor,
                intra_cycle_carry_forward,
                prefix_postfix_weekly_off_sandwhich_rule,
                prefix_postfix_holiday_sandwhich_rule,
                inbetween_weekly_off_sandwhich_rule,
                leave_application_after
            };
            const leaveType = await models_1.LeaveType.create(formData);
            res.status(201).json(leaveType);
        }
        catch (err) {
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    const update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const leaveType = await models_1.LeaveType.findByPk(id);
            if (leaveType) {
                const existingLeaveType = await models_1.LeaveType.findOne({
                    where: {
                        leave_type_name: req.body.leave_type_name,
                        id: {
                            [sequelize_1.Op.not]: id
                        }
                    }
                });
                if (existingLeaveType) {
                    next((0, BadRequest_1.badRequest)('A leave type with that name already exists!'));
                }
                else {
                    const updatedLeaveType = leaveType.update(req.body);
                    const response = (0, response_1.generateResponse)(200, true, "Data updated succesfully!", updatedLeaveType);
                    res.status(200).json(response);
                }
            }
            else {
                next((0, NotFound_1.notFound)("There is no leave type with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next) => {
        try {
            const leaveTypeId = req.params.id;
            const leaveType = await models_1.LeaveType.findByPk(leaveTypeId);
            const existing = await masterPolicyLeavePolicy_1.default.findAll({
                where: {
                    leave_type_id: leaveTypeId
                }
            });
            if (existing.length > 0) {
                next((0, Forbidden_1.forbiddenError)("Cannot delete. This leave type is already has a policy assigned to in the master policy."));
            }
            else {
                await leaveType?.destroy();
                const response = (0, response_1.generateResponse)(200, true, "Leave Type Deleted succesfully!");
                res.status(200).json(response);
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    /**
     * This is a function for the employees where they'll only see the leave types that have been allotted to them.
     * @param req
     * @param res
     * @param next
     */
    const dropdownForEmployees = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            if (user) {
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                const leaveTypes = [];
                for (const leaveType of masterPolicy.LeaveTypePolicies) {
                    leaveTypes.push(leaveType.leave_type);
                }
                console.log(">>>>>>>>>>>>>>>>>>>>>>>", leaveTypes);
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", leaveTypes);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("There is no user with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, getById, update, destroy, create, getAllDropdown, dropdownForEmployees };
};
exports.LeaveTypeController = LeaveTypeController;
