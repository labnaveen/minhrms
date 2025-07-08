"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalFlowController = void 0;
//@ts-nocheck
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const db_1 = require("../../utilities/db");
const approvalFlow_1 = __importDefault(require("../../models/approvalFlow"));
const approvalFlowReportingRole_1 = __importDefault(require("../../models/approvalFlowReportingRole"));
const response_1 = require("../../services/response/response");
const reportingRole_1 = __importDefault(require("../../models/reportingRole"));
const approvalFlowSupervisorIndirect_1 = __importDefault(require("../../models/approvalFlowSupervisorIndirect"));
const user_1 = __importDefault(require("../../models/user"));
const masterPolicy_1 = __importDefault(require("../../models/masterPolicy"));
const Conflict_1 = require("../../services/error/Conflict");
const BadRequest_1 = require("../../services/error/BadRequest");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const approvalFlowType_1 = __importDefault(require("../../models/dropdown/type/approvalFlowType"));
const ApprovalFlowController = (model) => {
    const { getAllDropdown } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { page, records, search_term, sortBy, sortOrder } = req.query;
            if (!page && !records) {
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            let whereOptions = {};
            if (search_term) {
                whereOptions.name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            const orderOptions = [];
            if (sortBy && sortOrder) {
                if (sortBy === 'flow_name') {
                    orderOptions.push(['name', sortOrder]);
                }
            }
            const data = await approvalFlow_1.default.findAndCountAll({
                where: whereOptions,
                include: [
                    { model: approvalFlowType_1.default }
                ],
                offset: offset,
                limit: recordsPerPage,
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
            next((0, InternalServerError_1.internalServerError)('Something went wrong!'));
        }
    };
    const create = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { name, description, approval_flow_type_id, confirm_by_both_direct_undirect, confirmation_by_all, confirmation_by_all_direct, confirmation_by_all_indirect, direct_reporting_manager_id, indirect_reporting_manager_id } = req.body;
                const formBody = {
                    name,
                    description,
                    approval_flow_type_id,
                    confirm_by_both_direct_undirect,
                    confirmation_by_all,
                    confirmation_by_all_direct,
                    confirmation_by_all_indirect
                };
                const existingApprovalFlow = await approvalFlow_1.default.findOne({
                    where: {
                        name: name
                    }
                });
                if (existingApprovalFlow) {
                    next((0, BadRequest_1.badRequest)("An approval flow with the same already exists!"));
                }
                let approvalFlowResponse = await approvalFlow_1.default.create(formBody, { transaction: t });
                if (direct_reporting_manager_id && direct_reporting_manager_id.length > 0) {
                    await Promise.all(direct_reporting_manager_id.map(async (id) => {
                        console.log(approvalFlowResponse.id);
                        if (typeof id !== 'number') {
                            throw new Error('Invalid id in direct_reporting_manager_id array');
                        }
                        await approvalFlowReportingRole_1.default.create({
                            approval_flow_id: approvalFlowResponse.id,
                            reporting_role_id: id
                        }, { transaction: t });
                    }));
                }
                if (indirect_reporting_manager_id && indirect_reporting_manager_id.length > 0) {
                    await Promise.all(indirect_reporting_manager_id.map(async (id) => {
                        if (typeof id !== 'number') {
                            throw new Error('Invalid id in indirect_reporting_manager_id array');
                        }
                        await approvalFlowSupervisorIndirect_1.default.create({
                            approval_flow_id: approvalFlowResponse.id,
                            supervisor_role_id: id
                        }, { transaction: t });
                    }));
                }
                const response = (0, response_1.generateResponse)(201, true, "Approval Flow Created Succesfully!", approvalFlowResponse);
                res.status(201).json(response);
            });
        }
        catch (err) {
            res.status(500).json(err);
            // console.log(err)
            // next(internalServerError("Something went wrong!"))
        }
    };
    const getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const approvalFlow = await approvalFlow_1.default.findByPk(id, {
                include: [
                    { model: reportingRole_1.default, as: 'direct', attributes: ['id', 'name', 'priority'], through: { attributes: [] } },
                    { model: user_1.default, as: 'indirect', attributes: ['id', 'employee_name', 'employee_generated_id'], through: { attributes: [] } }
                ]
            });
            const response = (0, response_1.generateResponse)(200, true, "Approval Flow fetched succesfully!", approvalFlow);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };
    const update = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.params;
                const approvalFlow = await approvalFlow_1.default.findByPk(id, {
                    include: [
                        { model: reportingRole_1.default, as: 'direct', attributes: ['id', 'name', 'priority'], through: { attributes: [] } },
                        { model: user_1.default, as: 'indirect', attributes: ['id', 'employee_name', 'employee_generated_id'], through: { attributes: [] } }
                    ]
                });
                if (approvalFlow.direct.length > 0 && approvalFlow.direct) {
                    approvalFlowReportingRole_1.default.destroy({
                        where: {
                            approval_flow_id: approvalFlow.id
                        }
                    }, { transaction: t });
                }
                if (approvalFlow.indirect && approvalFlow.indirect.length > 0) {
                    approvalFlowSupervisorIndirect_1.default.destroy({
                        where: {
                            approval_flow_id: approvalFlow.id
                        }
                    }, { transaction: t });
                }
                const { name, description, approval_flow_type_id, confirm_by_both_direct_undirect, confirmation_by_all, confirmation_by_all_direct, confirmation_by_all_indirect, direct_reporting_manager_id, indirect_reporting_manager_id } = req.body;
                const formBody = {
                    name,
                    description,
                    approval_flow_type_id,
                    confirm_by_both_direct_undirect,
                    confirmation_by_all,
                    confirmation_by_all_direct,
                    confirmation_by_all_indirect
                };
                const existingApprovalFlow = await approvalFlow_1.default.findOne({
                    where: {
                        name: name,
                        id: {
                            [sequelize_1.Op.not]: id
                        }
                    }
                });
                if (existingApprovalFlow) {
                    next((0, BadRequest_1.badRequest)("A approval flow with that name already exists!"));
                }
                if (!existingApprovalFlow) {
                    const approvalFlowResponse = await approvalFlow?.update(formBody, { transaction: t });
                    if (direct_reporting_manager_id && direct_reporting_manager_id.length > 0) {
                        await Promise.all(direct_reporting_manager_id.map(async (id) => {
                            console.log(approvalFlowResponse.id);
                            if (typeof id !== 'number') {
                                throw new Error('Invalid id in direct_reporting_manager_id array');
                            }
                            await approvalFlowReportingRole_1.default.create({
                                approval_flow_id: approvalFlowResponse.id,
                                reporting_role_id: id
                            }, { transaction: t });
                        }));
                    }
                    if (indirect_reporting_manager_id && indirect_reporting_manager_id.length > 0) {
                        await Promise.all(indirect_reporting_manager_id.map(async (id) => {
                            if (typeof id !== 'number') {
                                throw new Error('Invalid id in indirect_reporting_manager_id array');
                            }
                            await approvalFlowSupervisorIndirect_1.default.create({
                                approval_flow_id: approvalFlowResponse.id,
                                supervisor_role_id: id
                            }, { transaction: t });
                        }));
                    }
                    const response = (0, response_1.generateResponse)(200, true, "Approval Flow Updated Succesfully!", approvalFlowResponse);
                    res.status(200).json(response);
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)('Something went wrong!'));
        }
    };
    const destroy = async (req, res, next) => {
        try {
            const { id } = req.params;
            const isReferenced = await masterPolicy_1.default.findOne({
                where: {
                    [sequelize_1.Op.or]: [{ attendance_workflow: id }, { leave_workflow: id }]
                }
            });
            if (isReferenced) {
                next((0, Conflict_1.conflict)("Unable to delete. Policy is already in use."));
            }
            await db_1.sequelize.transaction(async (t) => {
                const approvalFlow = await approvalFlow_1.default.findByPk(id);
                console.log("APPROVAL FLOW>>>>>>>>", approvalFlow);
                // if(approvalFlow?.direct.length>0 && approvalFlow?.direct){
                approvalFlowReportingRole_1.default.destroy({
                    where: {
                        approval_flow_id: approvalFlow.id
                    },
                    transaction: t
                });
                // }
                // if(approvalFlow?.indirect && approvalFlow?.indirect.length > 0){
                approvalFlowSupervisorIndirect_1.default.destroy({
                    where: {
                        approval_flow_id: approvalFlow.id
                    },
                    transaction: t
                });
                // }
                await approvalFlow_1.default.destroy({
                    where: {
                        id: id
                    },
                    transaction: t
                });
                const response = (0, response_1.generateResponse)(200, true, "Approval Flow succesfully Deleted!");
                res.status(200).json(response);
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, update, getAllDropdown, getById, create, destroy };
};
exports.ApprovalFlowController = ApprovalFlowController;
