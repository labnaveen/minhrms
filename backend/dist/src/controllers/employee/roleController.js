"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const index_1 = require("../../models/index");
const db_1 = require("../../utilities/db");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const NotFound_1 = require("../../services/error/NotFound");
const BadRequest_1 = require("../../services/error/BadRequest");
const response_1 = require("../../services/response/response");
const rolePermissions_1 = __importDefault(require("../../models/rolePermissions"));
const Forbidden_1 = require("../../services/error/Forbidden");
const RoleController = (model) => {
    const { getAllDropdown } = (0, masterController_1.MasterController)(model);
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
            const orderOptions = [];
            let whereOptions = {};
            if (sortBy && sortOrder) {
                if (sortBy === 'role_name') {
                    orderOptions.push(['name', sortOrder]);
                }
                if (sortBy === 'user_count') {
                    orderOptions.push([db_1.sequelize.literal('user_count'), sortOrder]);
                }
            }
            if (search_term) {
                whereOptions.name = {
                    [sequelize_1.Op.like]: `%${search_term}%`
                };
            }
            const roles = await index_1.Roles.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: index_1.Permissions,
                        attributes: ['id', 'name'],
                        as: 'permissions',
                        through: {
                            attributes: []
                        },
                        where: {
                            status: true
                        },
                        required: false
                    },
                    {
                        model: index_1.User,
                        attributes: [],
                        as: 'users',
                        where: db_1.sequelize.literal('`roles`.`id` = `users`.`role_id`'),
                        required: false,
                        duplicating: false
                    }
                ],
                attributes: {
                    include: [
                        [
                            db_1.sequelize.literal('(SELECT COUNT(*) FROM `user` WHERE `user`.`role_id` = `roles`.`id`)'),
                            'user_count'
                        ]
                    ]
                },
                offset: offset,
                limit: recordsPerPage,
                distinct: true,
                order: orderOptions
            });
            const totalPages = Math.ceil(roles.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: roles.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const response = (0, response_1.generateResponse)(200, true, "Roles fetched succesfully!", roles.rows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    };
    const getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const role = await index_1.Roles.findByPk(id, {
                include: [
                    {
                        model: index_1.Permissions,
                        attributes: ['id', 'name'],
                        as: 'permissions',
                        where: {
                            status: true
                        },
                        through: {
                            attributes: []
                        },
                        required: false
                    }
                ],
                logging: true
            });
            if (!role) {
                next((0, NotFound_1.notFound)("There is no role with that id"));
            }
            else {
                const response = (0, response_1.generateResponse)(200, true, "Role fetched succesfully!", role);
                res.status(200).json(response);
            }
        }
        catch (err) {
            // res.status(404).json(err)
            next((0, InternalServerError_1.internalServerError)("Something Went Wrong!"));
        }
    };
    const create = async (req, res, next) => {
        try {
            const { name, alias, description } = req.body;
            // await sequelize.transaction(async(t) => {
            const role = await index_1.Roles.findOne({
                where: {
                    name: name
                }
            });
            if (role) {
                next((0, BadRequest_1.badRequest)("A role with that name already exists"));
            }
            else {
                const roleBody = {
                    name,
                    alias,
                    description,
                };
                const role = await model.create(roleBody);
                const response = (0, response_1.generateResponse)(201, true, "Role created succesfully", role);
                res.status(201).json(response);
            }
            // })
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    };
    const addPermissions = async (req, res, next) => {
        try {
            const { permissions } = req.body;
            const roleId = req.params.id;
            const role = await index_1.Roles.findByPk(roleId);
            if (!role) {
                next((0, BadRequest_1.badRequest)("There is no role with that id"));
            }
            else {
                if (permissions.length > 0 && roleId) {
                    await Promise.all(permissions.map(async (permId) => {
                        if (typeof permId !== 'number') {
                            throw new Error('Invalid permissions ID in permissions array');
                        }
                        await rolePermissions_1.default.create({
                            permissions_id: permId,
                            roles_id: roleId
                        });
                    }));
                }
                else {
                    next((0, BadRequest_1.badRequest)("Please provide permissions"));
                }
            }
            const response = (0, response_1.generateResponse)(200, true, "Permissions added succesfully!");
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const editPermissions = async (req, res, next) => {
        try {
            const roleId = req.params.id;
            const { permissions } = req.body;
            const role = await index_1.Roles.findByPk(roleId);
            if (!role) {
                next((0, NotFound_1.notFound)("There is no role with that id"));
            }
            else {
                await db_1.sequelize.transaction(async (t) => {
                    const associations = await rolePermissions_1.default.findAll({
                        where: {
                            roles_id: roleId
                        }
                    });
                    if (associations && associations.length > 0) {
                        await rolePermissions_1.default.destroy({
                            where: {
                                roles_id: roleId
                            },
                            transaction: t
                        });
                    }
                    await Promise.all(permissions.map(async (permId) => {
                        if (typeof permId !== 'number') {
                            throw new Error('Invalid permissions ID in permissions array');
                        }
                        await rolePermissions_1.default.create({
                            permissions_id: permId,
                            roles_id: roleId
                        }, { transaction: t });
                    }));
                });
            }
            const response = (0, response_1.generateResponse)(200, true, "Permissions updated successfully!");
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const role_id = req.params.id;
                const role = await index_1.Roles.findByPk(role_id);
                const associatedUsers = await index_1.User.findAll({
                    where: {
                        role_id: role_id
                    }
                });
                if (role) {
                    if (associatedUsers.length === 0) {
                        await rolePermissions_1.default.destroy({
                            where: {
                                roles_id: role_id
                            },
                            transaction: t
                        });
                        await role.destroy({ transaction: t });
                        const response = (0, response_1.generateResponse)(200, true, "Role deleted succesfully!");
                        res.status(200).json(response);
                    }
                    else {
                        next((0, Forbidden_1.forbiddenError)("This role is associated to one or many users, you cannot delete this."));
                    }
                }
                else {
                    next((0, NotFound_1.notFound)("There is no role with that id."));
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
            const role = await index_1.Roles.findByPk(id);
            const existingRole = await index_1.Roles.findOne({
                where: {
                    name: req.body.name,
                    id: {
                        [sequelize_1.Op.not]: id
                    }
                }
            });
            if (existingRole) {
                next((0, BadRequest_1.badRequest)("A role with that name already exists"));
            }
            else {
                if (role) {
                    const newRole = await role.update(req.body);
                    const response = (0, response_1.generateResponse)(200, true, "Role updated succesfully!", newRole);
                    res.status(200).json(response);
                }
                else {
                    next((0, NotFound_1.notFound)("Cannot find a role with that id!"));
                }
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, getById, update, destroy, create, addPermissions, editPermissions, getAllDropdown };
};
exports.RoleController = RoleController;
