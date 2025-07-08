"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignedAssetController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const asset_1 = __importDefault(require("../../models/asset"));
const models_1 = require("../../models");
const BadRequest_1 = require("../../services/error/BadRequest");
const response_1 = require("../../services/response/response");
const assignedAsset_1 = __importDefault(require("../../models/assignedAsset"));
const db_1 = require("../../utilities/db");
const NotFound_1 = require("../../services/error/NotFound");
const AssignedAssetController = (model) => {
    const { create, update, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next, options) => {
        try {
            const { page, records, sortBy, sortOrder, search_term } = req.query;
            console.log(page, records);
            if (!page && !records) {
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const orderOptions = [];
            let whereOptions = {
                deleted_at: null,
                date_of_return: null
            };
            if (search_term) {
                whereOptions[sequelize_1.Op.or] = [
                    {
                        '$user.employee_name$': {
                            [sequelize_1.Op.like]: `%${search_term}%`
                        }
                    },
                    {
                        '$asset.asset_name$': {
                            [sequelize_1.Op.like]: `%${search_term}%`
                        }
                    }
                ];
            }
            if (sortBy && sortOrder) {
                if (sortBy === 'employee_name') {
                    orderOptions.push([{ model: models_1.User }, 'employee_name', sortOrder]);
                }
                if (sortBy === 'asset_name') {
                    orderOptions.push([{ model: asset_1.default }, 'asset_name', sortOrder]);
                }
                if (sortBy === 'date_of_issue') {
                    orderOptions.push([sortBy, sortOrder]);
                }
            }
            const assignedAsset = await assignedAsset_1.default.findAndCountAll({
                where: whereOptions,
                include: [
                    { model: asset_1.default, attributes: ['id', 'asset_code', 'asset_name'] },
                    { model: models_1.User, attributes: ['id', 'employee_name', 'employee_generated_id'] }
                ],
                offset: offset,
                limit: recordsPerPage,
                order: orderOptions
            });
            const totalPages = Math.ceil(assignedAsset.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: assignedAsset.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const result = {
                data: assignedAsset.rows,
                meta
            };
            const response = (0, response_1.generateResponse)(200, true, "Data Fetched Succesfully!", result.data, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something went wrong"))
        }
    };
    const assignAsset = async (req, res, next, options) => {
        try {
            const { employee_id, date_of_issue, description } = req.body;
            const { id } = req.params;
            const result = await db_1.sequelize.transaction(async (t) => {
                let asset = await asset_1.default.findByPk(id, { transaction: t });
                const employee = await models_1.User.findByPk(employee_id, { transaction: t });
                if (!employee) {
                    next((0, BadRequest_1.badRequest)('There is no employee with that id!'));
                }
                if (!asset) {
                    next((0, BadRequest_1.badRequest)("There is not asset with that id"));
                }
                const formBody = {
                    user_id: employee_id,
                    asset_id: id,
                    date_of_issue: date_of_issue,
                    description: description
                };
                const assignedAsset = await assignedAsset_1.default.create(formBody, { transaction: t });
                asset.is_assigned = true;
                await asset?.save({ transaction: t });
                return { assignedAsset };
            });
            const response = (0, response_1.generateResponse)(200, true, 'Asset assigned to employee', result.assignedAsset);
            res.status(200).json(response);
        }
        catch (err) {
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    const unassignAsset = async (req, res, next, options) => {
        try {
            const { id } = req.params;
            const { date_of_return } = req.body;
            await db_1.sequelize.transaction(async (t) => {
                const assignedAsset = await assignedAsset_1.default.findOne({
                    where: {
                        asset_id: id,
                        deleted_at: null,
                        date_of_return: null
                    },
                    transaction: t
                });
                const asset = await asset_1.default.findByPk(id, { transaction: t });
                console.log(date_of_return);
                if (!date_of_return) {
                    next((0, BadRequest_1.badRequest)("Please give a date of return"));
                }
                if (assignedAsset && date_of_return) {
                    assignedAsset.date_of_return = date_of_return;
                    assignedAsset.deleted_at = date_of_return;
                    //@ts-ignore
                    asset.is_assigned = false;
                    await asset?.save({ transaction: t });
                    await assignedAsset.save({ transaction: t });
                    const response = (0, response_1.generateResponse)(200, true, "Asset Unassigned Succesfully!", assignedAsset);
                    res.status(200).json(response);
                }
                if (!assignedAsset) {
                    next((0, BadRequest_1.badRequest)("No asset is assigned with that id."));
                }
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next, options) => {
        try {
            const { id } = req.params;
            const asset = await asset_1.default.findByPk(id);
            if (asset?.user_id) {
                next((0, BadRequest_1.badRequest)("This asset is already assigned to an employee!"));
            }
            else {
                await asset_1.default.destroy({
                    where: {
                        id: id
                    }
                });
                const response = (0, response_1.generateResponse)(200, true, "Asset deleted Sucesfully!");
                res.status(200).json(response);
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const assignedAsset = await assignedAsset_1.default.findOne({
                where: {
                    id: id
                },
                include: [
                    {
                        model: asset_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: models_1.User,
                        attributes: ['id', 'employee_name', 'employee_generated_id']
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });
            console.log(assignedAsset);
            if (!assignedAsset) {
                next((0, NotFound_1.notFound)('There is no asset assignment with that id'));
            }
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", assignedAsset);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong"));
        }
    };
    return { getAll, create, update, getAllDropdown, getById, destroy, assignAsset, unassignAsset };
};
exports.AssignedAssetController = AssignedAssetController;
