"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const masterController_1 = require("../masterController");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const BadRequest_1 = require("../../services/error/BadRequest");
const response_1 = require("../../services/response/response");
const notification_1 = __importDefault(require("../../models/notification"));
const NotFound_1 = require("../../services/error/NotFound");
const NotificationController = (model) => {
    const { create, destroy, update, getById, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const { read } = req.query;
            const { sortOrder, sortBy } = req.query;
            const { page, records } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const where = {
                user_id: id
            };
            if (read) {
                where.read = read;
            }
            const orderClause = [];
            if (sortOrder && sortBy) {
                orderClause.push([sortBy, sortOrder]);
            }
            const notification = await notification_1.default.findAndCountAll({
                where,
                offset: offset,
                limit: recordsPerPage,
                order: orderClause
            });
            const totalPages = Math.ceil(notification.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: notification.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", notification.rows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const markAllRead = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const notifications = await notification_1.default.findAll({
                where: {
                    user_id: id
                }
            });
            await Promise.all(notifications.map(async (notification) => {
                await notification.update({
                    read: 1
                });
            }));
            const response = (0, response_1.generateResponse)(200, true, "Mark all notifications as read succesfully!");
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const markSingleRead = async (req, res, next) => {
        try {
            const { id } = req.params;
            const notification = await notification_1.default.findByPk(id);
            if (notification) {
                await notification.update({
                    read: 1
                });
                const response = (0, response_1.generateResponse)(200, true, "Notification updated succesfully!");
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("There is no notification with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, destroy, update, getById, markAllRead, markSingleRead, getAllDropdown };
};
exports.NotificationController = NotificationController;
