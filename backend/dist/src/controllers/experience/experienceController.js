"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceController = void 0;
const masterController_1 = require("../masterController");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const models_1 = require("../../models");
const BadRequest_1 = require("../../services/error/BadRequest");
const db_1 = require("../../utilities/db");
const experience_1 = __importDefault(require("../../models/experience"));
const response_1 = require("../../services/response/response");
const NotFound_1 = require("../../services/error/NotFound");
const ExperienceController = (model) => {
    const { getAll, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const create = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const { company_name, user_id, designation, employment_type_id, start_date, end_date, address } = req.body;
            const employee = await models_1.User.findByPk(id);
            if (employee) {
                await db_1.sequelize.transaction(async (t) => {
                    const formBody = {
                        company_name,
                        user_id: id,
                        designation,
                        employment_type_id,
                        start_date,
                        end_date,
                        address
                    };
                    const experience = await experience_1.default.create(formBody, { transaction: t });
                    const response = (0, response_1.generateResponse)(201, true, "Experience created succesfully!", experience);
                    res.status(201).json(response);
                });
            }
            else {
                next((0, BadRequest_1.badRequest)("There is no employee with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const destroy = async (req, res, next) => {
        try {
            const { id } = req.params;
            //@ts-ignore
            const employee_id = req.credentials?.id;
            await db_1.sequelize.transaction(async (t) => {
                const experience = await experience_1.default.findByPk(id);
                await experience?.destroy({ transaction: t });
                const response = (0, response_1.generateResponse)(200, true, "Record deleted succesfully!");
                res.status(200).json(response);
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            //@ts-ignore
            const employee_id = req.credentials;
            const experience = await experience_1.default.findByPk(id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });
            if (experience) {
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", experience);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Experience with that id not found!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const experience = await experience_1.default.findByPk(id);
            if (experience) {
                await experience.update(req.body);
                const response = (0, response_1.generateResponse)(200, true, "Record updated succesfully!");
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find experience with that id"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, update, getAllDropdown, getById, destroy };
};
exports.ExperienceController = ExperienceController;
