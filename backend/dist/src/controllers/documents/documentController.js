"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InternalServerError_1 = require("../../services/error/InternalServerError");
const letter_1 = __importDefault(require("../../models/letter"));
const documents_1 = __importDefault(require("../../models/documents"));
const models_1 = require("../../models");
const response_1 = require("../../services/response/response");
const BadRequest_1 = require("../../services/error/BadRequest");
const sequelize_1 = require("sequelize");
const moment_1 = __importDefault(require("moment"));
const db_1 = require("../../utilities/db");
const NotFound_1 = require("../../services/error/NotFound");
const approval_1 = __importDefault(require("../../models/dropdown/status/approval"));
const letterStatus_1 = __importDefault(require("../../models/letterStatus"));
class DocumentController {
    async getDocuments(req, res, next) {
        try {
            const { page, records, year, month, employee_id, sortBy, sortOrder, status } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const year_int = parseInt(year, 10);
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            let whereOptions = {};
            let whereOptions2 = {};
            if (year) {
                const startDate = (0, moment_1.default)(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
                const endDate = (0, moment_1.default)(`${year}-12-31`).endOf('year').format('YYYY-MM-DD');
                whereOptions.date = {
                    [sequelize_1.Op.gte]: startDate,
                    [sequelize_1.Op.lte]: endDate
                };
            }
            if (month) {
                const startDate = (0, moment_1.default)(`${month}-01`, 'MM').startOf('month').format('YYYY-MM-DD');
                const endDate = (0, moment_1.default)(`${month}-01`, 'MM').endOf('month').format('YYYY-MM-DD');
                whereOptions.date = {
                    [sequelize_1.Op.gte]: startDate,
                    [sequelize_1.Op.lte]: endDate
                };
            }
            if (year && month) {
                console.log("BOTH ARE PROVIDED");
                const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD');
                const endDate = (0, moment_1.default)(`${year}-${month}-31`).startOf('month').format('YYYY-MM-DD');
                whereOptions.date = {
                    [sequelize_1.Op.gte]: startDate,
                    [sequelize_1.Op.lte]: endDate
                };
            }
            if (employee_id) {
                whereOptions2.employee_generated_id = employee_id;
            }
            if (status) {
                whereOptions.status = status;
            }
            const orderOptions = [];
            if (sortBy && sortOrder) {
                if (sortBy === 'employee_id') {
                    orderOptions.push([{ model: models_1.User }, 'employee_generated_id', sortOrder]);
                }
                if (sortBy === 'letter_type') {
                    orderOptions.push([sortBy, sortOrder]);
                }
                if (sortBy === 'name') {
                    orderOptions.push([{ model: models_1.User }, 'employee_name', sortOrder]);
                }
                if (sortBy === 'status') {
                    orderOptions.push([{ model: approval_1.default }, 'status', sortOrder]);
                }
                if (sortBy === 'date') {
                    orderOptions.push([sortBy, sortOrder]);
                }
            }
            const list = await letter_1.default.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: documents_1.default
                    },
                    {
                        model: models_1.User,
                        where: whereOptions2,
                        attributes: ['id', 'employee_name', 'employee_generated_id'],
                    },
                    {
                        model: letterStatus_1.default,
                        attributes: ['id', 'name']
                    }
                ],
                limit: recordsPerPage,
                offset: offset,
                order: orderOptions
            });
            const totalPages = Math.ceil(list.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: list.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", list.rows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    }
    async deleteDocuments(req, res, next) {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.params;
                const letter = await letter_1.default.findByPk(id);
                if (letter) {
                    const document = await documents_1.default.findByPk(letter.document_id);
                    await letter.destroy({ transaction: t });
                    await document?.destroy({ transaction: t });
                    const response = (0, response_1.generateResponse)(200, true, "Letter deleted succesfully!");
                    res.status(200).json(response);
                }
                else {
                    return next((0, NotFound_1.notFound)("There is no letter with that id!"));
                }
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    }
    async getEmployeeLetters(req, res, next) {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            const { page, records, year, month, sortBy, sortOrder, status, search_term } = req.query;
            if (!page && !records) {
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const currentDate = (0, moment_1.default)().date();
            const currentMonth = (0, moment_1.default)().month() + 1;
            const currentYear = (0, moment_1.default)().year();
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            if (user) {
                const orderOptions = [];
                if (sortBy && sortOrder) {
                    if (sortBy === 'employee_id') {
                        orderOptions.push([{ model: models_1.User }, 'employee_generated_id', sortOrder]);
                    }
                    if (sortBy === 'letter_type') {
                        orderOptions.push([sortBy, sortOrder]);
                    }
                    if (sortBy === 'name') {
                        orderOptions.push([{ model: models_1.User }, 'employee_name', sortOrder]);
                    }
                }
                const whereOptions = {
                    user_id: id,
                    date: {
                        [sequelize_1.Op.lte]: (0, moment_1.default)().format('YYYY-MM-DD')
                    }
                };
                if (search_term) {
                    whereOptions.letter_type = {
                        [sequelize_1.Op.like]: `%${search_term}%`
                    };
                }
                if (year) {
                    //@ts-ignore
                    if (year == currentYear) {
                        const startDate = (0, moment_1.default)(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
                        const endDate = (0, moment_1.default)().format('YYYY-MM-DD');
                        whereOptions.date = {
                            [sequelize_1.Op.gte]: startDate,
                            [sequelize_1.Op.lte]: endDate
                        };
                    }
                    else {
                        const startDate = (0, moment_1.default)(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
                        const endDate = (0, moment_1.default)(`${year}-12-31`).endOf('year').format('YYYY-MM-DD');
                        whereOptions.date = {
                            [sequelize_1.Op.gte]: startDate,
                            [sequelize_1.Op.lte]: endDate
                        };
                    }
                }
                if (status) {
                    whereOptions.status = status;
                }
                const letters = await letter_1.default.findAndCountAll({
                    where: whereOptions,
                    include: [
                        {
                            model: documents_1.default
                        },
                        {
                            model: models_1.User,
                            attributes: ['id', 'employee_name', 'employee_generated_id'],
                        },
                        {
                            model: letterStatus_1.default,
                            attributes: ['id', 'name']
                        }
                    ],
                    offset: offset,
                    limit: recordsPerPage,
                    order: orderOptions
                });
                const totalPages = Math.ceil(letters.count / recordsPerPage);
                const hasNextPage = pageNumber < totalPages;
                const hasPrevPage = pageNumber > 1;
                const meta = {
                    totalCount: letters.count,
                    pageCount: totalPages,
                    currentPage: page,
                    perPage: recordsPerPage,
                    hasNextPage,
                    hasPrevPage
                };
                const result = {
                    data: letters.rows,
                    meta
                };
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", result.data, meta);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find a user with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    }
    async acceptLetter(req, res, next) {
        try {
            const { id } = req.params;
            const letter = await letter_1.default.findByPk(id);
            if (letter) {
                if (letter.status == 2 || letter.status == 1) {
                    next((0, BadRequest_1.badRequest)("This letter has already been accepted/rejected"));
                }
                else {
                    await letter.update({
                        status: 1
                    });
                    const response = (0, response_1.generateResponse)(200, true, "Letter accepted succesfully!");
                    res.status(200).json(response);
                }
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find a letter with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    }
    async rejectLetter(req, res, next) {
        try {
            const { id } = req.params;
            const letter = await letter_1.default.findByPk(id);
            if (letter) {
                if (letter.status == 1 || letter.status == 2) {
                    next((0, BadRequest_1.badRequest)("This letter has already been accepted/rejected"));
                }
                else {
                    await letter.update({
                        status: 2
                    });
                    const response = (0, response_1.generateResponse)(200, true, "Letter succesfully accepted!");
                    res.status(200).json(response);
                }
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find a letter with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    }
}
const documentController = new DocumentController();
exports.default = documentController;
