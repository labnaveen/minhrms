"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilyMemberController = void 0;
const masterController_1 = require("../masterController");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const models_1 = require("../../models");
const db_1 = require("../../utilities/db");
const NotFound_1 = require("../../services/error/NotFound");
const familyMember_1 = __importDefault(require("../../models/familyMember"));
const response_1 = require("../../services/response/response");
const BadRequest_1 = require("../../services/error/BadRequest");
const FamilyMemberController = (model) => {
    const { getAll, create, destroy, update, getAllDropdown, getById } = (0, masterController_1.MasterController)(model);
    const createFamilyMember = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const employee = await models_1.User.findByPk(id);
            if (employee) {
                await db_1.sequelize.transaction(async (t) => {
                    const { name, dob, relation_id, occupation, phone, email } = req.body;
                    const formBody = {
                        user_id: id,
                        name: name,
                        dob: dob,
                        relation_id: relation_id,
                        occupation: occupation,
                        phone: phone,
                        email: email
                    };
                    const newMember = await familyMember_1.default.create(formBody, { transaction: t });
                    const response = (0, response_1.generateResponse)(201, true, "New Family Member added", newMember);
                    res.status(201).json(response);
                });
            }
            else {
                next((0, NotFound_1.notFound)("The user does not exist with that id"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const updateFamilyMember = async (req, res, next) => {
        try {
            const { name, dob, relation_id, occupation, phone, email } = req.body;
            const { id } = req.params;
            const familyMember = await familyMember_1.default.findByPk(id);
            if (familyMember) {
                await familyMember.update(req.body);
                const response = (0, response_1.generateResponse)(200, true, "Family member data updated succesfully!");
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Family Member with that id does not exist"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const deleteFamilyMember = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.params;
                const { family_member_id } = req.params;
                const familyMember = await familyMember_1.default.findByPk(family_member_id);
                if (familyMember) {
                    await familyMember.destroy({ transaction: t });
                    const response = (0, response_1.generateResponse)(200, true, "Family Member deleted sucessfully!");
                    res.status(200).json(response);
                }
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getFamilyForEmployee = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await models_1.User.findByPk(id);
            if (user) {
                const familyMembers = await models_1.User.findByPk(id, {
                    include: [
                        {
                            model: familyMember_1.default,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            }
                        }
                    ],
                    attributes: ['id', 'employee_generated_id', 'employee_name']
                });
                const response = (0, response_1.generateResponse)(200, true, "Family members fetched succesfully!", familyMembers);
                res.status(200).json(response);
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
    return { getAll, create, destroy, update, getAllDropdown, getById, createFamilyMember, updateFamilyMember, deleteFamilyMember, getFamilyForEmployee };
};
exports.FamilyMemberController = FamilyMemberController;
