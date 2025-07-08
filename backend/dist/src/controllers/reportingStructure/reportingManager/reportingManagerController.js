"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingManagerController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../../masterController");
const reportingManagers_1 = __importDefault(require("../../../models/reportingManagers"));
const response_1 = require("../../../services/response/response");
const InternalServerError_1 = require("../../../services/error/InternalServerError");
const models_1 = require("../../../models");
const BadRequest_1 = require("../../../services/error/BadRequest");
const db_1 = require("../../../utilities/db");
const NotFound_1 = require("../../../services/error/NotFound");
const reportingManagerEmployeeAssociation_1 = __importDefault(require("../../../models/reportingManagerEmployeeAssociation"));
const leaveRequest_1 = __importDefault(require("../../../models/leaveRequest"));
const Forbidden_1 = require("../../../services/error/Forbidden");
const ReportingManagerController = (model) => {
    const { getAllDropdown } = (0, masterController_1.MasterController)(model);
    const create = async (req, res, next) => {
        try {
            const { user_id, reporting_role_id, employee_id } = req.body;
            // await sequelize.transaction(async(t) => {
            const reportingManager = await reportingManagers_1.default.findOne({
                where: {
                    user_id: user_id,
                    reporting_role_id: reporting_role_id
                },
                include: [
                    { model: models_1.User, as: 'Employees' }
                ]
            });
            const manager = await reportingManagers_1.default.findAll({
                where: {
                    user_id: user_id
                },
            });
            let employeesThoseAreManagers = [];
            for (let user of employee_id) {
                const manager = await reportingManagers_1.default.findAll({
                    where: {
                        user_id: user
                    },
                    include: [
                        { model: models_1.User, as: 'Employees', attributes: { include: ['id', 'employee_name'] } }
                    ]
                });
                // manager.forEach(item => {
                //     employeesThoseAreManagers.push(item)
                // })
                employeesThoseAreManagers.push(...manager);
            }
            // const conflict = employeesThoseAreManagers.some(manager => {
            //     return manager.Employees.some(employee => {console.log("!!!!!!!!!!!!!!!!!", employee.id, user_id); employee.id == user_id})
            // });
            const conflict = employeesThoseAreManagers.some(manager => {
                const hasConflict = manager?.Employees?.some((employee) => {
                    return employee.id === parseInt(user_id);
                });
                return hasConflict;
            });
            console.log("CONFLICTTT:", conflict);
            if (conflict) {
                return next((0, BadRequest_1.badRequest)('An employee is already a manager of the said employee!'));
            }
            if (reportingManager) {
                const association = await reportingManagerEmployeeAssociation_1.default.findAll({
                    where: {
                        reporting_manager_id: reportingManager.id,
                        reporting_role_id: reporting_role_id
                    }
                });
                const oldArray = [];
                association.length > 0 && association.forEach((item) => {
                    oldArray.push(item.user_id);
                });
                const _valuesToAdd = employee_id.filter((id) => !oldArray.includes(id));
                if (_valuesToAdd.length > 0) {
                    if (_valuesToAdd && _valuesToAdd.length > 0) {
                        await Promise.all(_valuesToAdd.map(async (employeeId) => {
                            const employee = await models_1.User.findByPk(employeeId);
                            if (typeof employeeId !== 'number') {
                                throw new Error('Invalid id in employee_id array');
                            }
                            if (employee) {
                                await reportingManagerEmployeeAssociation_1.default.create({
                                    user_id: employeeId,
                                    reporting_role_id: reporting_role_id,
                                    reporting_manager_id: reportingManager.id
                                });
                            }
                            else {
                                throw new Error("There are no employees with that id!");
                            }
                        }));
                    }
                    const response = (0, response_1.generateResponse)(200, true, "Created Succesfully!");
                    // res.status(200).json({message: "There are some new Values! ADD", data:"ADDED!"})
                    res.status(200).json(response);
                }
                else {
                    next((0, BadRequest_1.badRequest)("These employees are already added to this manager."));
                }
            }
            else {
                const formData = {
                    user_id,
                    reporting_role_id
                };
                const newManager = await reportingManagers_1.default.create(formData);
                if (employee_id && employee_id.length > 0) {
                    await Promise.all(employee_id.map(async (employeeId) => {
                        const employee = await models_1.User.findByPk(employeeId);
                        if (typeof employeeId !== 'number') {
                            throw new Error('Invalid id in employee_id array');
                        }
                        if (employee) {
                            await reportingManagerEmployeeAssociation_1.default.create({
                                user_id: employeeId,
                                reporting_role_id: reporting_role_id,
                                reporting_manager_id: newManager.id
                            });
                        }
                        else {
                            throw new Error("There are no employees with that id!");
                        }
                    }));
                }
                const response = (0, response_1.generateResponse)(201, true, "Reporting Manager succesfully created!");
                res.status(201).json(response);
            }
        }
        catch (err) {
            console.log(err);
            // res.status(500).json(err)
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getAll = async (req, res, next) => {
        try {
            const { page, records, search_term, sortBy, sortOrder } = req.query;
            const reporting_role_id = req.params.id;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            let orderOptions = [];
            let whereOption = {
                reporting_role_id: reporting_role_id
            };
            let whereOption2 = {};
            if (search_term) {
                whereOption2['$manager.employee_name$'] = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            const reportingManagers = await reportingManagers_1.default.findAndCountAll({
                where: whereOption,
                include: [
                    {
                        model: models_1.User,
                        as: 'manager',
                        attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'],
                        where: whereOption2,
                    },
                    {
                        model: models_1.User,
                        as: 'Employees',
                        attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'],
                        required: false
                    },
                ],
                attributes: ['id'],
                offset: offset,
                limit: recordsPerPage,
                logging: true,
            });
            const totalPages = Math.ceil(reportingManagers.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: reportingManagers.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", reportingManagers.rows, meta);
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
            const reportingManager = await reportingManagers_1.default.findByPk(id, {
                include: [
                    {
                        model: models_1.User, as: 'manager', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false
                    },
                    {
                        model: models_1.User, as: 'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false
                    },
                    // {
                    //     model: User, as: 'employees', where: {
                    //         reporting_manager_id: id
                    //     },
                    //     attributes: ['id', 'employee_name', 'employee_generated_id']
                    // }
                ]
            });
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", reportingManager);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    const update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { reporting_role_id, user_id, employee_id } = req.body;
            const reportingManager = await reportingManagers_1.default.findByPk(id);
            let employeesThoseAreManagers = [];
            for (let user of employee_id) {
                const manager = await reportingManagers_1.default.findAll({
                    where: {
                        user_id: user
                    },
                    include: [
                        { model: models_1.User, as: 'Employees', attributes: { include: ['id', 'employee_name'] } }
                    ]
                });
                employeesThoseAreManagers.push(...manager);
            }
            const conflict = employeesThoseAreManagers.some(manager => {
                const hasConflict = manager?.Employees?.some((employee) => {
                    return employee.id === parseInt(user_id);
                });
                return hasConflict;
            });
            console.log("CONFLICTTT:", conflict);
            if (conflict) {
                return next((0, BadRequest_1.badRequest)('An employee is already a manager of the said employee!'));
            }
            if (!conflict) {
                await db_1.sequelize.transaction(async (t) => {
                    if (!reportingManager) {
                        next((0, NotFound_1.notFound)("There is no reporting manager with that id"));
                    }
                    else {
                        if (reportingManager.user_id === user_id) {
                            console.log("IDHAR GAYA");
                            const entries = await reportingManagerEmployeeAssociation_1.default.findAll({
                                where: {
                                    reporting_role_id: reporting_role_id,
                                    reporting_manager_id: id
                                }
                            });
                            await Promise.all(entries.map(async (item) => {
                                try {
                                    await item.destroy({ transaction: t });
                                }
                                catch (err) {
                                    throw new Error("Error Deleting Item");
                                }
                            }));
                            if (employee_id && employee_id.length > 0) {
                                console.log("EMPLOYEE LENGTH IS MORE THAN 0");
                                await Promise.all(employee_id.map(async (employeeId) => {
                                    const employee = await models_1.User.findByPk(employeeId);
                                    if (typeof employeeId !== 'number') {
                                        throw new Error('Invalid id in employee_id array');
                                    }
                                    if (employee) {
                                        await reportingManagerEmployeeAssociation_1.default.create({
                                            user_id: employeeId,
                                            reporting_role_id: reporting_role_id,
                                            reporting_manager_id: reportingManager.id
                                        }, { transaction: t });
                                    }
                                    else {
                                        throw new Error("There are no employees with that id!");
                                    }
                                }));
                            }
                            const response = (0, response_1.generateResponse)(200, true, "Updated Succesfully!");
                            res.status(200).json(response);
                        }
                        else {
                            console.log("REPORTING MANAGER ID IS NOT THE SAME");
                            const _reportingManager = await reportingManagers_1.default.findOne({
                                where: {
                                    user_id,
                                    reporting_role_id
                                }
                            });
                            if (_reportingManager) {
                                const _entries = await reportingManagerEmployeeAssociation_1.default.findAll({
                                    where: {
                                        reporting_role_id: reporting_role_id,
                                        reporting_manager_id: _reportingManager.id
                                    }
                                });
                                const oldEntries = await reportingManagerEmployeeAssociation_1.default.findAll({
                                    where: {
                                        reporting_role_id: reporting_role_id,
                                        reporting_manager_id: id
                                    }
                                });
                                console.log(oldEntries);
                                // oldEntries.forEach(async(item) => {
                                //     await item.destroy({transaction: t})
                                // })
                                const oldArray = [];
                                _entries.length > 0 && _entries.forEach((item) => {
                                    oldArray.push(item.user_id);
                                });
                                console.log(">>>>>>>>>>>", oldArray);
                                const _valuesToAdd = employee_id.filter((id) => !oldArray.includes(id));
                                console.log(">>>>>>>>>>>>>>>>", _valuesToAdd);
                                if (_valuesToAdd && _valuesToAdd.length > 0) {
                                    console.log("Came in this again!");
                                    await Promise.all(oldEntries.map(async (item) => {
                                        try {
                                            await item.destroy({ transaction: t });
                                        }
                                        catch (err) {
                                            console.error("Error Deleting item:", err);
                                        }
                                    }));
                                    await Promise.all(_valuesToAdd.map(async (employeeId) => {
                                        const employee = await models_1.User.findByPk(employeeId);
                                        if (typeof employeeId !== 'number') {
                                            throw new Error('Invalid id in employee_id array');
                                        }
                                        if (employee) {
                                            console.log("This is where it should've gone to!");
                                            await reportingManagerEmployeeAssociation_1.default.create({
                                                user_id: employeeId,
                                                reporting_role_id: reporting_role_id,
                                                reporting_manager_id: _reportingManager.id
                                            }, { transaction: t });
                                        }
                                        else {
                                            throw new Error("There are no employees with that id!");
                                        }
                                    }));
                                    const response = (0, response_1.generateResponse)(200, true, "Updated Succesfully!");
                                    res.status(200).json(response);
                                }
                                else {
                                    const response = (0, response_1.generateResponse)(200, true, "Updated Succesfully!");
                                    res.status(200).json(response);
                                }
                            }
                            else {
                                const newManager = await reportingManagers_1.default.create({
                                    user_id: user_id,
                                    reporting_role_id
                                });
                                await reportingManager.destroy({ transaction: t });
                                await reportingManagerEmployeeAssociation_1.default.destroy({
                                    where: {
                                        reporting_manager_id: reportingManager?.id
                                    },
                                    transaction: t
                                });
                                await Promise.all(employee_id.map(async (employeeId) => {
                                    const employee = await models_1.User.findByPk(employeeId);
                                    if (typeof employeeId !== 'number') {
                                        throw new Error('Invalid id in employee_id array');
                                    }
                                    if (employee) {
                                        await reportingManagerEmployeeAssociation_1.default.create({
                                            user_id: employeeId,
                                            reporting_role_id: reporting_role_id,
                                            reporting_manager_id: newManager.id
                                        }, { transaction: t });
                                    }
                                    else {
                                        throw new Error("There are no employees with that id!");
                                    }
                                }));
                                const response = (0, response_1.generateResponse)(200, true, "updated succesfully!");
                                res.status(200).json(response);
                            }
                        }
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("something went wrong"))
        }
    };
    const destroy = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.params;
                const leaveRequests = await leaveRequest_1.default.findAll({
                    where: {
                        status: 1,
                        reporting_manager_id: id
                    }
                });
                const employeeAssociated = await reportingManagerEmployeeAssociation_1.default.findAll({
                    where: {
                        reporting_manager_id: id
                    }
                });
                const reportingManager = await reportingManagers_1.default.findByPk(id);
                if (reportingManager) {
                    if (employeeAssociated.length > 0) {
                        next((0, Forbidden_1.forbiddenError)("This manager has employees reporting to them, cannot delete!"));
                    }
                    else {
                        if (leaveRequests.length === 0) {
                            await reportingManagerEmployeeAssociation_1.default.destroy({
                                where: {
                                    reporting_manager_id: id
                                },
                                transaction: t
                            });
                            await reportingManagers_1.default.destroy({
                                where: {
                                    id: id
                                },
                                transaction: t
                            });
                            const response = (0, response_1.generateResponse)(200, true, "Reporting Manager removed succesfully!");
                            res.status(200).json(response);
                        }
                        else if (leaveRequests.length > 0) {
                            next((0, Forbidden_1.forbiddenError)("There are pending approval requests of this reporting manager!"));
                        }
                    }
                }
                else {
                    next((0, NotFound_1.notFound)("Cannot find a reporting manager with that id!"));
                }
            });
        }
        catch (err) {
            // res.status(500).json(err)
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, getById, update, destroy, create, getAllDropdown };
};
exports.ReportingManagerController = ReportingManagerController;
