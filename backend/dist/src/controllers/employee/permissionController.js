"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const masterController_1 = require("../masterController");
const index_1 = require("../../models/index");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const response_1 = require("../../services/response/response");
const BadRequest_1 = require("../../services/error/BadRequest");
const PermissionController = (model) => {
    const { update, destroy, getById, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next) => {
        try {
            const permissions = await index_1.Permissions.findAll({
                where: {
                    status: true,
                    is_deleted: false
                },
                attributes: ['id', 'name', 'status']
            });
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", permissions);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const create = async (req, res, next) => {
        try {
            const { name, level } = req.body;
            const existingPermission = await index_1.Permissions.findOne({
                where: {
                    name: name
                }
            });
            if (existingPermission) {
                return next((0, BadRequest_1.badRequest)("A permission with that name is already created!"));
            }
            const permission = await index_1.Permissions.create(req.body);
            const response = (0, response_1.generateResponse)(200, true, "Permission created succesfully!", permission);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, getById, update, destroy, create, getAllDropdown };
};
exports.PermissionController = PermissionController;
