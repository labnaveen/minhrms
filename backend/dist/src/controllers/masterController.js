"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterController = void 0;
const sequelize_1 = require("sequelize");
const BadRequest_1 = require("../services/error/BadRequest");
const NotFound_1 = require("../services/error/NotFound");
const response_1 = require("../services/response/response");
function MasterController(model) {
    async function getAll(req, res, next, options) {
        try {
            const findOptions = options || {}; //Can add Options such as where, attributes, etc.
            const { page, records } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            findOptions.searchBy = options?.searchBy;
            findOptions.included = options?.included;
            findOptions.order = options?.sortBy?.map((field) => [field, 'DESC']);
            findOptions.offset = offset;
            findOptions.limit = recordsPerPage;
            findOptions.distinct = true;
            if (req.query.search_term) {
                if (options?.searchBy && options.searchBy.length > 0) {
                    const searchConditions = options.searchBy.map((field) => ({
                        [field]: { [sequelize_1.Op.like]: `%${req.query.search_term}%` },
                    }));
                    findOptions.where = {
                        [sequelize_1.Op.or]: searchConditions
                    };
                }
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
                            }),
                        };
                    }
                    else {
                        return {
                            model: model.sequelize?.model(relation),
                        };
                    }
                });
            }
            // const data = await model.findAndCountAll({
            //   offset,
            //   limit: recordsPerPage,
            // });
            // console.log(findOptions)
            const data = await model.findAndCountAll(findOptions);
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
            const response = (0, response_1.generateResponse)(200, true, "Data Fetched Succesfully!", result.data, meta);
            if (data) {
                res.status(200).json(response);
            }
            else {
                // res.status(404).json({error: 'There are no companies!'})
                next((0, BadRequest_1.badRequest)("There are no companies!"));
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    }
    async function getById(req, res, next, options) {
        try {
            const id = Number(req.params.id);
            const findOptions = options || {}; //Can add Options here such as 'attributes' etc.
            findOptions.where = { id };
            // if (options?.included) {
            //   findOptions.include = options.included.map((relation) => ({
            //     model: model?.sequelize?.models[relation],
            //     // through: {
            //     //   attributes: [], // Exclude join table attributes from the result
            //     // },
            //   }));
            // }
            if (options?.included) {
                findOptions.include = options.included.map((relation) => {
                    const nestedIncluded = options.nestedIncluded?.[relation];
                    const attributes = options.attributes?.[relation];
                    const alias = options.aliases?.[relation];
                    if (nestedIncluded) {
                        return {
                            model: model.sequelize?.model(relation),
                            as: alias,
                            include: nestedIncluded.map((nestedRelation) => ({
                                model: model.sequelize?.model(nestedRelation),
                            })),
                        };
                    }
                    else if (attributes) {
                        return {
                            model: model.sequelize?.model(relation),
                            as: alias,
                            attributes: attributes.map((attribute) => {
                                return attribute;
                            }),
                            through: { attributes: [] }
                        };
                    }
                    else {
                        return {
                            model: model.sequelize?.model(relation),
                            as: alias,
                        };
                    }
                });
            }
            if (options?.attribute) {
                findOptions.attributes = options.attribute;
            }
            const data = await model.findOne(findOptions);
            const response = (0, response_1.generateResponse)(200, true, "Record Fetched Succesfully!", data);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    }
    async function create(req, res, next, options) {
        try {
            const data = await model.create(req.body);
            const response = (0, response_1.generateResponse)(201, true, "Created succesfully!", data);
            res.status(201).json(response);
        }
        catch (err) {
            res.status(500).json(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    }
    async function update(req, res, next, options) {
        try {
            const id = Number(req.params.id);
            const options = { where: { id } };
            const [numsRowsUpdated] = await model.update(req.body, options);
            if (numsRowsUpdated === 0) {
                // res.status(404).json({ message: `No ${model.name} record found with id ${id}` });
                next((0, NotFound_1.notFound)(`No ${model.name} record found with id ${id}`));
            }
            else {
                const updatedData = await model.findByPk(id);
                const response = (0, response_1.generateResponse)(200, true, "Updated succesfully!", updatedData);
                res.status(200).json(response);
            }
        }
        catch (err) {
            res.status(500).json(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    }
    async function destroy(req, res, next, options) {
        try {
            const id = Number(req.params.id);
            // const isReferenced = await MasterPolicy.findOne({
            //   where{ id: id }
            // })
            const options = { where: { id } };
            await model.destroy(options);
            const response = (0, response_1.generateResponse)(200, true, "Deleted Succesfully!");
            res.status(200).json(response);
        }
        catch (err) {
            res.status(500).json(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    }
    /**********Shikha  */
    async function getAllDropdown(req, res, next, options) {
        try {
            const data = await model.findAndCountAll({});
            const result = {
                data: data.rows,
            };
            const response = (0, response_1.generateResponse)(200, true, "Dropdown fetched succesfully!", result);
            if (data) {
                res.status(200).json(response);
            }
            else {
                next((0, BadRequest_1.badRequest)("There are no data!"));
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    /* shikha  */
    return { getAll, getAllDropdown, getById, create, update, destroy };
}
exports.MasterController = MasterController;
