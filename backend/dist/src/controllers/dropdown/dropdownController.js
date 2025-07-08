"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownController = void 0;
const sequelize_1 = require("sequelize");
const BadRequest_1 = require("../../services/error/BadRequest");
const response_1 = require("../../services/response/response");
const DropdownController = (model) => {
    const getAllDropdown = async (req, res, next, options) => {
        try {
            const findOptions = options || {};
            findOptions.searchBy = options?.searchBy;
            findOptions.included = options?.included;
            findOptions.order = options?.sortBy?.map((field) => [field, 'DESC']);
            if (options?.searchBy && options.searchBy.length > 0) {
                const searchConditions = options.searchBy.map((field) => ({
                    [field]: { [sequelize_1.Op.like]: `%${req.query.search}%` },
                }));
                findOptions.where = {
                    [sequelize_1.Op.or]: searchConditions
                };
                console.log(searchConditions);
            }
            if (options?.where) {
                findOptions.where = options.where;
            }
            if (options?.included) {
                findOptions.include = options.included.map((relation) => {
                    const nestedIncluded = options.nestedIncluded?.[relation];
                    const attributes = options.attributes?.[relation];
                    if (nestedIncluded) {
                        return {
                            model: model.sequelize?.model(relation),
                            include: nestedIncluded.map((nestedRelation) => ({
                                model: model.sequelize?.model(nestedRelation),
                            })),
                        };
                    }
                    else if (attributes) {
                        return {
                            model: model.sequelize?.model(relation),
                            attributes: attributes.map((attribute) => {
                                return attribute;
                            })
                        };
                    }
                    else {
                        return {
                            model: model.sequelize?.model(relation)
                        };
                    }
                });
            }
            if (options?.attribute) {
                findOptions.attributes = options.attribute;
            }
            //@ts-ignore
            const data = await model.findAndCountAll(findOptions);
            const result = {
                data: data.rows,
            };
            const response = (0, response_1.generateResponse)(200, true, "Dropdown fetched succesfull", data.rows);
            if (data) {
                res.status(200).json(response);
            }
            else {
                next((0, BadRequest_1.badRequest)('There is no data!'));
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    };
    // Return the controller methods
    return {
        getAllDropdown,
        // Add more methods for other models
    };
};
exports.DropdownController = DropdownController;
