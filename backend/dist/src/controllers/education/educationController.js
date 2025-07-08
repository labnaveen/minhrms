"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationController = void 0;
const masterController_1 = require("../masterController");
const education_1 = __importDefault(require("../../models/education"));
const InternalServerError_1 = require("../../services/error/InternalServerError");
const models_1 = require("../../models");
const NotFound_1 = require("../../services/error/NotFound");
const response_1 = require("../../services/response/response");
const EducationController = (model) => {
    const { getAll, update, getAllDropdown, getById } = (0, masterController_1.MasterController)(model);
    const create = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            const { institution_name, degree_id, course_name, field_of_study, year_of_completion, percentage } = req.body;
            if (user) {
                const formBody = {
                    user_id: id,
                    institution_name: institution_name,
                    degree_id: degree_id,
                    course_name: course_name,
                    field_of_study: field_of_study,
                    year_of_completion: year_of_completion,
                    percentage: percentage
                };
                const education = await education_1.default.create(formBody);
                const response = (0, response_1.generateResponse)(200, true, "Education experience created succesfully!", education);
                res.status(201).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("There is no employee with that id"));
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
            const education = await education_1.default.findByPk(id);
            if (education) {
                await education.destroy();
                const response = (0, response_1.generateResponse)(200, true, "Record deleted succesfully!");
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find education record with that id"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, destroy, update, getAllDropdown, getById };
};
exports.EducationController = EducationController;
