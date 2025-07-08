"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileChangeController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const BadRequest_1 = require("../../services/error/BadRequest");
const response_1 = require("../../services/response/response");
const models_1 = require("../../models");
const reportingManagers_1 = __importDefault(require("../../models/reportingManagers"));
const profileChangeRequests_1 = __importDefault(require("../../models/profileChangeRequests"));
const profileChangeRecord_1 = __importDefault(require("../../models/profileChangeRecord"));
const approval_1 = __importDefault(require("../../models/dropdown/status/approval"));
const Forbidden_1 = require("../../services/error/Forbidden");
const ProfileChangeController = (model) => {
    const { create, destroy, update, getById, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const { page, records, sortBy, sortOrder, search_term } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const manager = await reportingManagers_1.default.findAll({
                where: {
                    user_id: id
                }
            });
            const orderOptions = [];
            if (sortBy && sortOrder) {
                if (sortBy === 'employee_name') {
                    orderOptions.push([{ model: profileChangeRecord_1.default }, { model: models_1.User }, 'employee_name', sortOrder]);
                }
                if (sortBy === 'section') {
                    orderOptions.push([{ model: profileChangeRecord_1.default }, 'section', sortOrder]);
                }
                // orderOptions.push([sortBy, sortOrder])
            }
            if (manager.length > 0) {
                //@ts-ignore
                const managerIds = manager.map(manager => manager.id); // Extract manager IDs from the array
                let whereOptions = {
                    reporting_manager_id: { [sequelize_1.Op.in]: managerIds },
                    status: 1
                };
                if (search_term) {
                    whereOptions[sequelize_1.Op.or] = [
                        {
                            '$profile_change_record.user.employee_name$': {
                                [sequelize_1.Op.like]: `%${search_term}%`
                            }
                        }
                    ];
                }
                const profileChangeRequests = await profileChangeRequests_1.default.findAndCountAll({
                    where: whereOptions,
                    include: [
                        {
                            model: profileChangeRecord_1.default,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            },
                            include: [
                                {
                                    model: approval_1.default,
                                    attributes: ['id', 'name']
                                },
                                {
                                    model: models_1.User,
                                    attributes: ['id', 'employee_name']
                                }
                            ]
                        },
                    ],
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    offset: offset,
                    limit: recordsPerPage,
                    order: orderOptions
                });
                const totalPages = Math.ceil(profileChangeRequests.count / recordsPerPage);
                const hasNextPage = pageNumber < totalPages;
                const hasPrevPage = pageNumber > 1;
                const meta = {
                    totalCount: profileChangeRequests.count,
                    pageCount: totalPages,
                    currentPage: page,
                    perPage: recordsPerPage,
                    hasNextPage,
                    hasPrevPage
                };
                const result = {
                    data: profileChangeRequests.rows,
                    meta
                };
                const response = (0, response_1.generateResponse)(200, true, "Requests fetched succesfully!", result.data, result.meta);
                res.status(200).json(response);
            }
            else {
                next((0, Forbidden_1.forbiddenError)("You don't have the access role to view this resource!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, destroy, update, getById, getAllDropdown };
};
exports.ProfileChangeController = ProfileChangeController;
