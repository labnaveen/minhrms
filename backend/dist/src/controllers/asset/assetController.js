"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const asset_1 = __importDefault(require("../../models/asset"));
const models_1 = require("../../models");
const BadRequest_1 = require("../../services/error/BadRequest");
const response_1 = require("../../services/response/response");
const assignedAsset_1 = __importDefault(require("../../models/assignedAsset"));
const NotFound_1 = require("../../services/error/NotFound");
const db_1 = require("../../utilities/db");
const AssetController = (model) => {
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
                if (sortBy == 'asset_cost') {
                    orderOptions.push([db_1.sequelize.cast(db_1.sequelize.col('asset_cost'), 'DECIMAL'), sortOrder]);
                }
                else {
                    orderOptions.push([sortBy, sortOrder]);
                }
            }
            if (search_term) {
                whereOptions = {
                    [sequelize_1.Op.or]: [
                        { asset_code: { [sequelize_1.Op.like]: `%${search_term}%` } },
                        { asset_name: { [sequelize_1.Op.like]: `%${search_term}%` } },
                        { asset_cost: { [sequelize_1.Op.like]: `%${search_term}%` } }
                    ]
                };
            }
            const data = await asset_1.default.findAndCountAll({
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
            const response = (0, response_1.generateResponse)(200, true, "Data", data.rows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const create = async (req, res, next) => {
        try {
            const { asset_code, asset_name, date_of_purchase, asset_cost, description, } = req.body;
            const existingAsset = await asset_1.default.findOne({
                where: {
                    asset_code: asset_code
                }
            });
            if (existingAsset) {
                next((0, BadRequest_1.badRequest)("An asset with that asset code already exists."));
            }
            else {
                const asset = await asset_1.default.create(req.body);
                const response = (0, response_1.generateResponse)(201, true, "Asset created succesfully!", asset);
                res.status(200).json(response);
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const assignAsset = async (req, res, next, options) => {
        try {
            const { employee_id } = req.body;
            const { id } = req.params;
            const asset = await asset_1.default.findByPk(id);
            const employee = await models_1.User.findByPk(employee_id);
            if (!employee) {
                next((0, BadRequest_1.badRequest)('There is no employee with that id!'));
            }
            if (!asset) {
                next((0, BadRequest_1.badRequest)("There is not asset with that id"));
            }
            if (asset) {
                if (asset.user_id !== null) {
                    next((0, BadRequest_1.badRequest)("The asset is already assigned to someone"));
                }
                else {
                    asset.user_id = employee_id;
                }
            }
            await asset?.save();
            const response = (0, response_1.generateResponse)(200, true, 'Asset assigned to employee');
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const unassignAsset = async (req, res, next, options) => {
        try {
            const { id } = req.params;
            const asset = await asset_1.default.findByPk(id);
            if (asset) {
                if (asset.user_id !== null) {
                    asset.user_id = null;
                    await asset?.save();
                    const response = (0, response_1.generateResponse)(200, true, "Asset unassigned succesfully!");
                    res.status(200).json(response);
                }
                else {
                    next((0, BadRequest_1.badRequest)("Asset is not assigned to anybody"));
                }
            }
            if (!asset) {
                next((0, BadRequest_1.badRequest)("No asset exists with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next, options) => {
        try {
            const { id } = req.params;
            const asset = await asset_1.default.findByPk(id);
            const assignedAsset = await assignedAsset_1.default.findAll({
                where: {
                    asset_id: id,
                    date_of_return: null
                }
            });
            if (asset) {
                if (assignedAsset.length > 0) {
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
            else {
                next((0, NotFound_1.notFound)('Cannot find any asset with that id!'));
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
            const asset = await asset_1.default.findByPk(id);
            const { asset_code, asset_name, date_of_purchase, asset_cost, description, is_assigned } = req.body;
            const existingAsset = await asset_1.default.findOne({
                where: {
                    asset_name: asset_name,
                    id: {
                        [sequelize_1.Op.not]: id
                    }
                }
            });
            if (existingAsset) {
                next((0, BadRequest_1.badRequest)("An asset with that name already exists"));
            }
            const updatedAssset = await asset?.update(req.body);
            const response = (0, response_1.generateResponse)(200, true, "Asset updated succesfully!", updatedAssset);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, update, getAllDropdown, getById, destroy, assignAsset, unassignAsset };
};
exports.AssetController = AssetController;
