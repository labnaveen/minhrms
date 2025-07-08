"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionUnitController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const response_1 = require("../../services/response/response");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const divisionUnits_1 = __importDefault(require("../../models/divisionUnits"));
const models_1 = require("../../models");
const userDivision_1 = __importDefault(require("../../models/userDivision"));
const db_1 = require("../../utilities/db");
const BadRequest_1 = require("../../services/error/BadRequest");
const Forbidden_1 = require("../../services/error/Forbidden");
const NotFound_1 = require("../../services/error/NotFound");
const DivisionUnitController = (model) => {
    const { getAllDropdown, getById } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next) => {
        try {
            const { page, records, search_term, sortBy, sortOrder } = req.query;
            const divisionId = req.params.id;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            console.log(page, records);
            const offset = (pageNumber - 1) * recordsPerPage;
            let whereOptions = {
                division_id: divisionId
            };
            let orderOptions = [];
            if (search_term) {
                whereOptions.unit_name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            if (sortBy && sortOrder) {
                if (sortBy == 'unit_name') {
                    orderOptions.push([sortBy, sortOrder]);
                }
                if (sortBy == 'user_count') {
                    orderOptions.push([db_1.sequelize.literal('user_count'), sortOrder]);
                }
            }
            const divisionUnits = await divisionUnits_1.default.findAndCountAll({
                where: whereOptions,
                attributes: {
                    include: [[sequelize_1.Sequelize.literal('(SELECT COUNT(*) FROM user_division WHERE user_division.unit_id = division_units.id)'), 'user_count']]
                },
                include: [
                    {
                        model: models_1.User,
                        attributes: [],
                        through: { attributes: [] }, // Include this to avoid retrieving the user_division junction table attributes
                    },
                ],
                offset: offset,
                limit: recordsPerPage,
                distinct: true,
                order: orderOptions
            });
            const totalPages = Math.ceil(divisionUnits.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: divisionUnits.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const result = {
                data: divisionUnits.rows,
                meta
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", divisionUnits.rows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    async function create(req, res, next) {
        try {
            const { units, division_id } = req.body;
            const unit = await divisionUnits_1.default.findOne({
                where: {
                    unit_name: {
                        [sequelize_1.Op.in]: units
                    },
                    division_id: division_id
                }
            });
            if (!unit) {
                await Promise.all(units.map(async (unit) => {
                    await divisionUnits_1.default.create({
                        unit_name: unit,
                        division_id: division_id
                    });
                }));
                const response = (0, response_1.generateResponse)(201, true, "Division unit created succesfully!");
                res.status(201).json(response);
            }
            else {
                next((0, BadRequest_1.badRequest)("A unit with that name already exists."));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    }
    async function update(req, res, next) {
        try {
            const { id } = req.params;
            const { unit_name, division_id } = req.body;
            const unit = await divisionUnits_1.default.findByPk(id);
            const existingUnit = await divisionUnits_1.default.findOne({
                where: {
                    unit_name: unit_name,
                    id: {
                        [sequelize_1.Op.not]: id
                    },
                    division_id: unit?.division_id
                }
            });
            if (!unit) {
                next((0, NotFound_1.notFound)("No division unit with that id!"));
            }
            if (existingUnit) {
                next((0, BadRequest_1.badRequest)("A division unit of that name already exists!"));
            }
            const update = await unit?.update(req.body);
            const response = (0, response_1.generateResponse)(200, true, "Division unit updated succesfully!", update);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    }
    async function getDivisionUsers(req, res, next) {
        try {
            const { page, records } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            console.log(page, records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const divisionUnits = await divisionUnits_1.default.findAndCountAll({
                attributes: {
                    include: [[sequelize_1.Sequelize.literal('(SELECT COUNT(*) FROM user_division WHERE user_division.unit_id = division_units.id)'), 'user_count']]
                },
                include: [
                    {
                        model: models_1.User,
                        attributes: [],
                        through: { attributes: [] }, // Include this to avoid retrieving the user_division junction table attributes
                    },
                ],
                offset: offset,
                limit: recordsPerPage,
                distinct: true,
                order: [['id', 'DESC']]
            });
            // const divisionUnits = await DivisionUnits.findAndCountAll({
            //     attributes: [
            //         'id',
            //         'unit_name',
            //         [Sequelize.fn('COUNT', Sequelize.col('user_division.user_id')), 'user_id_count'],
            //     ],
            //     include: [
            //         {
            //             model: UserDivision,
            //             as: 'user_division',
            //             required: true,
            //             attributes:[],
            //         },
            //     ],
            //     subQuery: true,
            //     group: ['division_units.id'],
            //     offset: offset,
            //     limit: recordsPerPage,
            // })
            const totalPages = Math.ceil(divisionUnits.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            console.log('>>>>>>>>', divisionUnits.count);
            const meta = {
                totalCount: divisionUnits.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const result = {
                data: divisionUnits.rows,
                meta
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", result);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    }
    const destroy = async (req, res, next) => {
        try {
            const unit_id = req.params.id;
            const unit = await divisionUnits_1.default.findByPk(unit_id);
            if (unit) {
                const userAssociation = await userDivision_1.default.findAll({
                    where: {
                        unit_id: unit_id
                    }
                });
                if (userAssociation.length > 0) {
                    next((0, Forbidden_1.forbiddenError)("Cannot delete division unit, employees are already associated."));
                }
                else {
                    await unit.destroy();
                    const response = (0, response_1.generateResponse)(200, true, "Division unit deleted succesfully!");
                    res.status(200).json(response);
                }
            }
            else {
                next((0, BadRequest_1.badRequest)("No division unit exists with that id"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, update, getAllDropdown, getById, destroy, getDivisionUsers };
};
exports.DivisionUnitController = DivisionUnitController;
