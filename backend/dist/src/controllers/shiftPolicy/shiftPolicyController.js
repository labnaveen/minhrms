"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftPolicyController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const response_1 = require("../../services/response/response");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const masterPolicy_1 = __importDefault(require("../../models/masterPolicy"));
const Forbidden_1 = require("../../services/error/Forbidden");
const NotFound_1 = require("../../services/error/NotFound");
const shiftPolicy_1 = __importDefault(require("../../models/shiftPolicy"));
const BadRequest_1 = require("../../services/error/BadRequest");
const ShiftPolicyController = (model) => {
    const { create, update, getAllDropdown, getById } = (0, masterController_1.MasterController)(model);
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
                if (sortBy === 'shift_name') {
                    orderOptions.push(['shift_name', sortOrder]);
                }
            }
            if (search_term) {
                whereOptions.shift_name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            const data = await shiftPolicy_1.default.findAndCountAll({
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
    const destroy = async (req, res, next) => {
        try {
            const shiftPolicyId = req.params.id;
            const shiftPolicy = await shiftPolicy_1.default.findByPk(shiftPolicyId);
            const masterPolicy = await masterPolicy_1.default.findAll({
                where: {
                    shift_policy_id: shiftPolicyId
                }
            });
            if (shiftPolicy) {
                if (masterPolicy.length > 0) {
                    next((0, Forbidden_1.forbiddenError)("Cannot delete, Shift policy is assigned in a master policy!"));
                }
                else {
                    await shiftPolicy?.destroy();
                    const response = (0, response_1.generateResponse)(200, true, "Shift policy deleted succesfully!");
                    res.status(200).json(response);
                }
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find any shift policy with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, update, getAllDropdown, getById, destroy };
};
exports.ShiftPolicyController = ShiftPolicyController;
