"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLeaveConfigurationController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const models_1 = require("../../models");
const baseLeaveConfiguration_1 = __importDefault(require("../../models/baseLeaveConfiguration"));
const masterPolicy_1 = __importDefault(require("../../models/masterPolicy"));
const Conflict_1 = require("../../services/error/Conflict");
const response_1 = require("../../services/response/response");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const getMasterPolicy_1 = require("../../services/masterPolicy/getMasterPolicy");
const Forbidden_1 = require("../../services/error/Forbidden");
const NotFound_1 = require("../../services/error/NotFound");
const BadRequest_1 = require("../../services/error/BadRequest");
const BaseLeaveConfigurationController = (model) => {
    const { getById, update, destroy, getAllDropdown } = (0, masterController_1.MasterController)(model);
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
                    orderOptions.push(['policy_name', sortOrder]);
                }
            }
            if (search_term) {
                whereOptions.policy_name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            const data = await baseLeaveConfiguration_1.default.findAndCountAll({
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
    const create = async (req, res, next) => {
        try {
            const { policy_name, policy_description, proxy_leave_application, notify_peer_mandatory, leave_calendar_from, leave_request_status, leave_balance_status, contact_number_allowed, contact_number_mandatory, reason_for_leave, reason_for_leave_mandatory, notify_peer, leave_rejection_reason } = req.body;
            const formData = {
                policy_name,
                policy_description,
                leave_calendar_from,
                proxy_leave_application,
                leave_request_status,
                leave_balance_status,
                contact_number_allowed,
                contact_number_mandatory,
                reason_for_leave,
                reason_for_leave_mandatory,
                notify_peer,
                notify_peer_mandatory,
                leave_rejection_reason,
            };
            console.log(formData);
            const baseLeaveConfiguration = await baseLeaveConfiguration_1.default.create(formData);
            const response = (0, response_1.generateResponse)(201, true, "Base Leave Configuration created succesfully!", baseLeaveConfiguration);
            res.status(201).json(response);
        }
        catch (err) {
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    async function baseLeaveConfigurationDelete(req, res, next, options) {
        try {
            const id = Number(req.params.id);
            const isReferenced = await masterPolicy_1.default.findOne({
                where: { id }
            });
            if (isReferenced) {
                next((0, Conflict_1.conflict)("Unable to delete. Policy is already in use"));
            }
            await baseLeaveConfiguration_1.default.destroy({
                where: {
                    id
                }
            });
            const response = (0, response_1.generateResponse)(200, true, "Deleted Succesfully!");
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    }
    const getAppliedConfiguration = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const employee = await models_1.User.findByPk(id);
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
            if (employee) {
                if (masterPolicy) {
                    const baseLeaveConfiguration = await baseLeaveConfiguration_1.default.findByPk(masterPolicy?.base_leave_configuration_id);
                    if (baseLeaveConfiguration) {
                        const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", baseLeaveConfiguration);
                        res.status(200).json(response);
                    }
                    else {
                        next((0, NotFound_1.notFound)("No base leave configuration found!"));
                    }
                }
                else {
                    next((0, Forbidden_1.forbiddenError)("No Master policy applied to this employee"));
                }
            }
            else {
                next((0, NotFound_1.notFound)("Employee not found!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, getById, update, destroy, create, getAllDropdown, baseLeaveConfigurationDelete, getAppliedConfiguration };
};
exports.BaseLeaveConfigurationController = BaseLeaveConfigurationController;
