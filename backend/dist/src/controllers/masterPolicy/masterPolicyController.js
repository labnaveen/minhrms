"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterPolicyController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const models_1 = require("../../models");
const masterPolicy_1 = __importDefault(require("../../models/masterPolicy"));
const attendancePolicy_1 = __importDefault(require("../../models/attendancePolicy"));
const response_1 = require("../../services/response/response");
const approvalFlow_1 = __importDefault(require("../../models/approvalFlow"));
const db_1 = require("../../utilities/db");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const masterPolicyLeavePolicy_1 = __importDefault(require("../../models/masterPolicyLeavePolicy"));
const leaveTypePolicy_1 = __importDefault(require("../../models/leaveTypePolicy"));
const BadRequest_1 = require("../../services/error/BadRequest");
const Forbidden_1 = require("../../services/error/Forbidden");
const NotFound_1 = require("../../services/error/NotFound");
const MasterPolicyController = (model) => {
    const { getAllDropdown } = (0, masterController_1.MasterController)(model);
    const create = async (req, res, next) => {
        try {
            const { policy_name, policy_description, attendance_policy_id, base_leave_configuration_id, attendance_workflow_id, leave_workflow_id, shift_policy_id, weekly_off_policy_id, holiday_calendar_id, expense_workflow_id, leave_type_policies, profile_change_workflow_id } = req.body;
            const existingPolicy = await masterPolicy_1.default.findOne({
                where: {
                    policy_name: policy_name
                }
            });
            if (existingPolicy) {
                next((0, BadRequest_1.badRequest)("A master policy with that name already exists!"));
            }
            else {
                await db_1.sequelize.transaction(async (t) => {
                    const formData = {
                        policy_name,
                        policy_description,
                        attendance_policy_id,
                        base_leave_configuration_id,
                        attendance_workflow: attendance_workflow_id,
                        leave_workflow: leave_workflow_id,
                        shift_policy_id,
                        weekly_off_policy_id,
                        holiday_calendar_id,
                        expense_workflow: expense_workflow_id,
                        profile_change_workflow: profile_change_workflow_id
                    };
                    const masterPolicy = await masterPolicy_1.default.create(formData, { transaction: t });
                    if (leave_type_policies) {
                        await Promise.all(leave_type_policies.map(async (id) => {
                            if (typeof id !== 'number') {
                                throw new Error('Invalid id in leave_type_policies array');
                            }
                            const leaveTypePolicy = await leaveTypePolicy_1.default.findByPk(id);
                            await masterPolicyLeavePolicy_1.default.create({
                                master_policy_id: masterPolicy.id,
                                leave_type_id: leaveTypePolicy?.leave_type_id,
                                leave_type_policy_id: id
                            }, { transaction: t });
                        }));
                    }
                    const response = (0, response_1.generateResponse)(201, true, "Master Policy Succesfully Generated!", masterPolicy);
                    res.status(201).json(response);
                });
            }
        }
        catch (err) {
            // next(internalServerError("Something went wrong!"))
            res.status(500).json(err);
        }
    };
    const getAll = async (req, res, next) => {
        try {
            const { page, records, search_term, sortBy, sortOrder } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            let orderOptions = [];
            let whereOptions = {};
            if (search_term) {
                whereOptions.policy_name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            if (sortBy && sortOrder) {
                orderOptions.push([sortBy, sortOrder]);
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const masterPolicy = await masterPolicy_1.default.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: attendancePolicy_1.default
                    },
                    {
                        model: approvalFlow_1.default,
                        as: 'attendanceWorkflow'
                    },
                    {
                        model: approvalFlow_1.default,
                        as: 'leaveWorkflow'
                    },
                    {
                        model: leaveTypePolicy_1.default,
                        as: 'LeaveTypePolicies',
                        attributes: ['id', 'leave_policy_name', 'description'],
                        include: [{ model: models_1.LeaveType, attributes: ['id', 'leave_type_name'] }],
                        through: {
                            attributes: []
                        }
                    },
                ],
                limit: recordsPerPage,
                offset: offset,
                order: orderOptions
            });
            const totalPages = Math.ceil(masterPolicy.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: masterPolicy.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", masterPolicy.rows, meta);
            return res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };
    const getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const masterPolicy = await masterPolicy_1.default.findByPk(id, {
                include: [
                    {
                        model: attendancePolicy_1.default
                    },
                    {
                        model: approvalFlow_1.default,
                        as: 'attendanceWorkflow'
                    },
                    {
                        model: approvalFlow_1.default,
                        as: 'leaveWorkflow'
                    },
                    {
                        model: leaveTypePolicy_1.default,
                        as: 'LeaveTypePolicies',
                        attributes: ['id', 'leave_policy_name', 'description'],
                        include: [{ model: models_1.LeaveType, attributes: ['id', 'leave_type_name'] }],
                        through: {
                            attributes: []
                        }
                    },
                ],
            });
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", masterPolicy);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.params;
                const masterPolicy = await masterPolicy_1.default.findByPk(id, {
                    include: [
                        { model: models_1.User, attributes: ['id', 'employee_name'] }
                    ]
                });
                if (masterPolicy?.users.length > 0) {
                    next((0, Forbidden_1.forbiddenError)("This policy is already assigned to users, you cannot delete this!"));
                }
                else {
                    const leaveTypePolicies = await masterPolicyLeavePolicy_1.default.findAll({
                        where: {
                            master_policy_id: id
                        }
                    });
                    if (leaveTypePolicies.length > 0) {
                        await masterPolicyLeavePolicy_1.default.destroy({
                            where: {
                                master_policy_id: id
                            },
                            transaction: t
                        });
                    }
                    await masterPolicy?.destroy({ transaction: t });
                    const response = (0, response_1.generateResponse)(200, true, "Master Policy deleted succesfully!");
                    res.status(200).json(response);
                }
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const masterPolicy = await masterPolicy_1.default.findByPk(id);
            const { policy_name, policy_description, attendance_policy_id, base_leave_configuration_id, attendance_workflow_id, leave_workflow_id, shift_policy_id, weekly_off_policy_id, holiday_calendar_id, expense_workflow_id, leave_type_policies, profile_change_workflow_id } = req.body;
            const existingMasterPolicy = await masterPolicy_1.default.findOne({
                where: {
                    policy_name: policy_name,
                    id: {
                        [sequelize_1.Op.not]: id
                    }
                }
            });
            if (existingMasterPolicy) {
                next((0, BadRequest_1.badRequest)("A master policy with that name already exists!"));
            }
            else {
                if (masterPolicy) {
                    await db_1.sequelize.transaction(async (t) => {
                        const formData = {
                            policy_name,
                            policy_description,
                            attendance_policy_id,
                            base_leave_configuration_id,
                            attendance_workflow: attendance_workflow_id,
                            leave_workflow: leave_workflow_id,
                            shift_policy_id,
                            weekly_off_policy_id,
                            holiday_calendar_id,
                            expense_workflow: expense_workflow_id,
                            profile_change_workflow: profile_change_workflow_id
                        };
                        if (req.body.leave_type_policies) {
                            await masterPolicyLeavePolicy_1.default.destroy({
                                where: {
                                    master_policy_id: id
                                },
                                transaction: t,
                                logging: false
                            });
                            const users = await models_1.User.findAll({
                                where: {
                                    master_policy_id: id
                                }
                            });
                            let leaveTypes = [];
                            for (const policy of leave_type_policies) {
                                const leaveTypePolicy = await leaveTypePolicy_1.default.findByPk(policy);
                                if (leaveTypePolicy) {
                                    leaveTypes.push(leaveTypePolicy?.leave_type_id);
                                }
                            }
                            for (const user of users) {
                                await models_1.LeaveBalance.destroy({
                                    where: {
                                        user_id: user.id,
                                        leave_type_id: {
                                            [sequelize_1.Op.not]: leaveTypes
                                        }
                                    },
                                    transaction: t
                                });
                                for (const policy of leave_type_policies) {
                                    const leaveTypePolicy = await leaveTypePolicy_1.default.findByPk(policy);
                                    const isIncluded = await models_1.LeaveBalance.findOne({
                                        where: {
                                            user_id: user?.id,
                                            leave_type_id: leaveTypePolicy?.leave_type_id
                                        },
                                        paranoid: true
                                    });
                                    console.log(">>>>>>>>>>>>>", isIncluded);
                                    if (leaveTypePolicy && !isIncluded) {
                                        await models_1.LeaveBalance.create({
                                            user_id: user?.id,
                                            leave_type_id: leaveTypePolicy.leave_type_id,
                                            leave_balance: 0,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        }, { transaction: t });
                                        console.log("CREATED!!!");
                                    }
                                }
                            }
                            for (const leaveTypePolicyId of leave_type_policies) {
                                if (typeof leaveTypePolicyId !== 'number') {
                                    throw new Error('Invalid id in leave type policies array');
                                }
                                const leaveTypePolicy = await leaveTypePolicy_1.default.findByPk(leaveTypePolicyId);
                                await masterPolicyLeavePolicy_1.default.create({
                                    master_policy_id: id,
                                    leave_type_id: leaveTypePolicy?.leave_type_id,
                                    leave_type_policy_id: leaveTypePolicyId
                                }, { transaction: t });
                            }
                        }
                        await masterPolicy?.update(formData, { transaction: t });
                        const response = (0, response_1.generateResponse)(200, true, "Master Policy updated succesfully!");
                        res.status(200).json(response);
                    });
                }
                else {
                    next((0, NotFound_1.notFound)("Cannot find master policy with that id!"));
                }
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return {
        //@ts-ignore
        getAll,
        getById,
        destroy,
        create,
        update,
        getAllDropdown
    };
};
exports.MasterPolicyController = MasterPolicyController;
