"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const response_1 = require("../../services/response/response");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const db_1 = require("../../utilities/db");
const division_1 = __importDefault(require("../../models/division"));
const divisionUnits_1 = __importDefault(require("../../models/divisionUnits"));
const NotFound_1 = require("../../services/error/NotFound");
const BadRequest_1 = require("../../services/error/BadRequest");
const userDivision_1 = __importDefault(require("../../models/userDivision"));
const Forbidden_1 = require("../../services/error/Forbidden");
const DivisionController = (model) => {
    const { getAllDropdown } = (0, masterController_1.MasterController)(model);
    const create = async (req, res, next) => {
        try {
            const { division_name, division_units } = req.body;
            await db_1.sequelize.transaction(async (t) => {
                const data = {
                    division_name
                };
                const sameName = await division_1.default.findOne({
                    where: {
                        division_name: division_name
                    }
                });
                if (!sameName) {
                    const division = await division_1.default.create(data, { transaction: t });
                    if (division_units && division_units.length > 0) {
                        await Promise.all(division_units.map(async (unit) => {
                            await divisionUnits_1.default.create({
                                unit_name: unit,
                                division_id: division.id
                            }, { transaction: t });
                        }));
                    }
                    const response = (0, response_1.generateResponse)(201, true, "Division and it's units succesfully created!", division);
                    res.status(201).json(response);
                }
                else {
                    next((0, BadRequest_1.badRequest)("A division with the same name already exists."));
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went Wrong!"));
        }
    };
    const getAll = async (req, res, next) => {
        try {
            const { page, records, sortBy, sortOrder, search_term } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const orderOptions = [];
            const whereOptions = {};
            if (sortBy && sortOrder) {
                if (sortBy === 'division_name') {
                    orderOptions.push([sortBy, sortOrder]);
                }
                if (sortBy === 'division_unit') {
                    orderOptions.push([{ model: divisionUnits_1.default }, 'unit_name', sortOrder]);
                }
                if (sortBy === 'employee_count') {
                    orderOptions.push([db_1.sequelize.literal('employee_count'), sortOrder]);
                }
            }
            if (search_term) {
                whereOptions.division_name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            const data = await division_1.default.findAndCountAll({
                where: whereOptions,
                attributes: {
                    include: [
                        [
                            db_1.sequelize.literal(`(SELECT COUNT(*) FROM user_division WHERE unit_id IN (SELECT id FROM division_units WHERE division_id = division.id))`),
                            "employee_count",
                        ],
                    ],
                    exclude: ["createdAt", "updatedAt"]
                },
                include: [
                    {
                        model: divisionUnits_1.default,
                    }
                ],
                limit: recordsPerPage,
                offset: offset,
                order: orderOptions,
                distinct: true
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
            const result = {
                data: data.rows,
                meta
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", data.rows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const division = await division_1.default.findByPk(id, {
                include: [
                    {
                        model: divisionUnits_1.default,
                        attributes: ['id', 'unit_name']
                    }
                ],
                attributes: ['id', 'division_name', 'system_generated']
            });
            if (division) {
                const response = (0, response_1.generateResponse)(200, true, "Division fetched succesfully!", division);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find division with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const addEmployeeToUnit = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id, unit_id } = req.params;
                const divisionId = id;
                const { employee_id } = req.body;
                if (employee_id.length > 0) {
                    await Promise.all(employee_id.map(async (userId) => {
                        const existingAssociation = await userDivision_1.default.findOne({
                            where: {
                                user_id: userId,
                                division_id: id
                            }
                        });
                        if (existingAssociation) {
                            await existingAssociation.destroy();
                        }
                        await userDivision_1.default.create({
                            user_id: userId,
                            unit_id: unit_id,
                            division_id: id
                        });
                    }));
                    const response = (0, response_1.generateResponse)(201, true, "Employee added to the unit");
                    res.status(201).json(response);
                }
                else {
                    next((0, BadRequest_1.badRequest)("No employee id's in employee_id array."));
                }
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const removeEmployeeFromUnit = async (req, res, next) => {
        try {
            const { id, unit_id, user_id } = req.params;
            await db_1.sequelize.transaction(async (t) => {
                await userDivision_1.default.destroy({
                    where: {
                        user_id: user_id,
                        unit_id: unit_id
                    },
                    transaction: t
                });
                const response = (0, response_1.generateResponse)(200, true, "Employee removed from that particular unit!");
                res.status(200).json(response);
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next) => {
        try {
            const divisionId = req.params.id;
            const division = await division_1.default.findByPk(divisionId);
            if (division) {
                const unit = await divisionUnits_1.default.findAll({
                    where: {
                        division_id: divisionId
                    }
                });
                if (unit.length > 0) {
                    next((0, Forbidden_1.forbiddenError)('Cannot delete this division, a unit is already created under this division'));
                }
                else {
                    await division.destroy();
                    const response = (0, response_1.generateResponse)(200, true, "Division deleted succesfully!");
                    res.status(200).json(response);
                }
            }
            else {
                next((0, BadRequest_1.badRequest)("No division with that id exists."));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { division_name } = req.body;
            const division = await division_1.default.findByPk(id);
            const existingDivision = await division_1.default.findOne({
                where: {
                    division_name: division_name,
                    id: {
                        [sequelize_1.Op.not]: id
                    }
                }
            });
            if (existingDivision) {
                next((0, BadRequest_1.badRequest)('A division with that name already exists!'));
            }
            const update = await division?.update(req.body);
            const response = (0, response_1.generateResponse)(200, true, "Division updated succesfully!", update);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, update, getAllDropdown, getById, destroy, addEmployeeToUnit, removeEmployeeFromUnit };
};
exports.DivisionController = DivisionController;
