"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const masterController_1 = require("../masterController");
const models_1 = require("../../models");
const db_1 = require("../../utilities/db");
const sequelize_1 = require("sequelize");
const NotFound_1 = require("../../services/mobileErrorHandling/NotFound");
const InternalServerError_1 = require("../../services/mobileErrorHandling/InternalServerError");
const moment_1 = __importDefault(require("moment"));
const Unauthorized_1 = require("../../services/error/Unauthorized");
const response_1 = require("../../services/response/response");
const BadRequest_1 = require("../../services/mobileErrorHandling/BadRequest");
const documents_1 = __importDefault(require("../../models/documents"));
const getMasterPolicy_1 = require("../../services/masterPolicy/getMasterPolicy");
const approvalFlow_1 = __importDefault(require("../../models/approvalFlow"));
const reportingRole_1 = __importDefault(require("../../models/reportingRole"));
const reportingManagers_1 = __importDefault(require("../../models/reportingManagers"));
const approvalFlowType_1 = __importDefault(require("../../models/dropdown/type/approvalFlowType"));
const notificationService_1 = require("../../services/pushNotification/notificationService");
const sendNotification_1 = require("../../services/notification/sendNotification");
const notification_1 = __importDefault(require("../../models/notification"));
const expenseRequest_1 = __importDefault(require("../../models/expenseRequest"));
const regularizationRecord_1 = __importDefault(require("../../models/regularizationRecord"));
const Forbidden_1 = require("../../services/error/Forbidden");
const ExpensesController = (model) => {
    const { getAll, getById, destroy, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const create = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { category_id, purpose_id, transaction_date, billing_status, bill_no, from_location, to_location, from_latitude, from_longitude, to_latitude, to_longitude, total_distance, merchant_name, amount, note, purpose_text, supporting_doc_url, stay_from_date, stay_to_date, document_id, status_id } = req.body;
                const { id } = req.credentials;
                const categoryIsExists = await models_1.expencesCategories.findOne({ where: { id: category_id } });
                if (!categoryIsExists) {
                    return next((0, NotFound_1.notFound)(false, 'Invalid category id!'));
                }
                const purposeIsExists = await models_1.expencesPurpuse.findOne({ where: { id: purpose_id } });
                if (!purposeIsExists) {
                    return next((0, NotFound_1.notFound)(false, 'Invalid category id!'));
                }
                const expensesData = {
                    user_id: id,
                    category_id: category_id,
                    status_id: status_id ? status_id : 1,
                    purpose_id: purpose_id,
                    transaction_date: transaction_date,
                    billing_status: billing_status,
                    bill_no: bill_no,
                    from_location: from_location,
                    to_location: to_location,
                    from_latitude: from_latitude,
                    from_longitude: from_longitude,
                    to_latitude: to_latitude,
                    to_longitude: to_longitude,
                    total_distance: total_distance,
                    merchant_name: merchant_name,
                    amount: amount,
                    note: note,
                    purpose_text: purpose_text,
                    supporting_doc_url: supporting_doc_url,
                    stay_from_date: stay_from_date,
                    stay_to_date: stay_to_date,
                    document_id: document_id
                };
                console.log("EXPENSES DATA1222>>>>>", expensesData);
                const expense = await models_1.expenses.create(expensesData, { transaction: t });
                const user = await models_1.User.findByPk(id, {
                    include: [
                        {
                            model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] },
                                { model: reportingRole_1.default }]
                        }
                    ],
                    attributes: ['id', 'employee_name', 'date_of_joining'],
                    plain: true
                });
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                const expenseWorkflow = masterPolicy.expense_workflow;
                const approvalWorkflow = await approvalFlow_1.default.findByPk(expenseWorkflow, {
                    include: [
                        {
                            model: reportingRole_1.default,
                            as: 'direct',
                            through: { attributes: [] },
                            include: [{
                                    model: reportingManagers_1.default,
                                    // attributes: ['id', 'employee_name']
                                }]
                        },
                        {
                            model: approvalFlowType_1.default,
                        }
                    ]
                });
                if (expense && status_id == 2) {
                    if (user?.Manager && user?.Manager.length > 0) {
                        if (approvalWorkflow?.approval_flow_type?.id === 2) { //Sequential
                            console.log("SEQUENTIAL MEIN GAYA HAIN YEH");
                            const reportingManagers = user?.Manager;
                            const sortedManagers = approvalWorkflow?.direct?.sort((a, b) => b.priority - a.priority);
                            const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
                            const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);
                            console.log("MIN PRIORITY MANAAGERSSS", minPriorityManagers);
                            console.log("MIN PRIORITYYYY", minPriority);
                            for (const manager of minPriorityManagers) {
                                await Promise.all(manager?.reporting_managers.map(async (item) => {
                                    try {
                                        if (reportingManagers.some(manager => manager.id === item.id)) {
                                            const expenseRequest = await expenseRequest_1.default.create({
                                                expense_id: expense.id,
                                                reporting_manager_id: item.id,
                                                status: 1,
                                                priority: manager.priority
                                            }, { transaction: t });
                                            const notificationData = {
                                                user_id: item.user_id,
                                                title: 'Expense Request',
                                                type: 'expense_request_creation',
                                                description: `${user?.employee_name} has added an expense`,
                                            };
                                            const notification = await notification_1.default.create(notificationData, { transaction: t });
                                            await (0, sendNotification_1.sendNotification)(item.user_id, notification);
                                            let data = {
                                                user_id: item.user_id,
                                                type: 'expense_request_creation',
                                                message: `${user?.employee_name} has added an expense`,
                                                path: 'expense_request_creation',
                                                reference_id: expenseRequest?.id
                                            };
                                            console.log("HERE IS THE NOTFICATION PART!!!!");
                                            await (0, notificationService_1.sendPushNotification)(data);
                                        }
                                    }
                                    catch (err) {
                                        console.log(err);
                                    }
                                }));
                            }
                        }
                        else if (approvalWorkflow?.approval_flow_type?.id === 1) { //Parallel
                            console.log("PARALLEL MEIN GAYA HAIN YEH!");
                            const reportingManagers = user?.Manager;
                            const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id));
                            await Promise.all(filteredManagers.map(async (manager) => {
                                const expenseRequest = await expenseRequest_1.default.create({
                                    expense_id: expense?.id,
                                    reporting_manager_id: manager.id,
                                    status: 1,
                                    priority: 1
                                }, { transaction: t });
                                const notificationData = {
                                    user_id: manager.user_id,
                                    title: 'Expense Request',
                                    type: 'expense_request_creation',
                                    description: `${user?.employee_name} has added an expense`,
                                };
                                const notification = await notification_1.default.create(notificationData, { transaction: t });
                                await (0, sendNotification_1.sendNotification)(manager.id, notification);
                                let data = {
                                    user_id: manager.user_id,
                                    type: 'expense_request_creation',
                                    message: `${user?.employee_name} has added an expense`,
                                    path: 'leave_request_creation',
                                    reference_id: expenseRequest?.id
                                };
                                console.log("HERE IS THE NOTFICATION PART!!!!");
                                await (0, notificationService_1.sendPushNotification)(data);
                            }));
                        }
                    }
                }
                const response = (0, response_1.generateResponse)(200, true, "Expense drafted Succesfully", expense);
                res.status(200).json(response);
            });
        }
        catch (err) {
            console.log(err);
            return next((0, InternalServerError_1.internalServerError)(false, "Something Went Wrong!"));
        }
    };
    const getDropDowns = async (req, res, next) => {
        try {
            const category = await models_1.expencesCategories.findAll({
                attributes: ['id', 'category_name'],
                include: [{
                        model: models_1.expensesCategoriesForms,
                        attributes: ['id', 'category_form_name'],
                        required: false
                    }
                ]
            });
            const purpose = await models_1.expencesPurpuse.findAll({ attributes: ['id', 'name'], raw: true });
            const purposeWithTextFieldFlag = purpose.map(obj => {
                if (obj.name.toLowerCase() === "other") {
                    return { ...obj, showCommentBox: true };
                }
                return { ...obj, showCommentBox: false };
            });
            const data = { categoriesList: category, purposesList: purposeWithTextFieldFlag };
            const response = (0, response_1.generateResponse)(200, true, "Drop down data fetched Succesfully", data);
            res.status(200).json(response);
        }
        catch (err) {
            return next((0, InternalServerError_1.internalServerError)(false, "Something Went Wrong!"));
        }
    };
    const getExpensesList = async (req, res, next) => {
        try {
            const { page, records, filter, category_id, sortBy, sortOrder } = req.query;
            if (!page && !records) {
                next((0, BadRequest_1.badRequest)(false, "No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const limit = recordsPerPage;
            const { id } = req.credentials;
            /// filters
            const orderWhere = {};
            if (category_id) {
                orderWhere.category_id = category_id;
            }
            if (filter) {
                console.log("FILTER", filter);
                Object.keys(filter).forEach((field) => {
                    console.log(">>>>>", typeof (field));
                    if (field === 'status') {
                        orderWhere.status_id = filter[field];
                    }
                    if (field === "startdate") {
                        console.log("TRUEEEEE");
                        orderWhere.created_at = {
                            [sequelize_1.Op.gte]: (0, moment_1.default)(filter[field]).startOf('day').toDate(),
                        };
                    }
                    if (field === "enddate") {
                        orderWhere.created_at = {
                            ...(orderWhere.created_at || {}),
                            [sequelize_1.Op.lte]: (0, moment_1.default)(filter[field]).endOf('day').toDate()
                        };
                    }
                });
            }
            const orderOptions = [];
            if (sortBy && sortOrder) {
                if (sortBy == 'request_date') {
                    orderOptions.push(['created_at', sortOrder]);
                }
                if (sortBy == 'bill_number') {
                    orderOptions.push(['bill_no', sortOrder]);
                }
                if (sortBy == 'purpose') {
                    orderOptions.push([{ model: models_1.expencesPurpuse }, 'name', sortOrder]);
                }
                if (sortBy == 'merchant_name') {
                    orderOptions.push(['merchant_name', sortOrder]);
                }
                if (sortBy == 'status') {
                    orderOptions.push([{ model: models_1.expencesApprovalStatus }, sortOrder]);
                }
                if (sortBy == 'amount' || sortBy == 'note') {
                    orderOptions.push([sortBy, sortOrder]);
                }
            }
            console.log(">>>", orderWhere);
            const data = await models_1.expenses.findAll({
                offset,
                limit,
                where: {
                    ...orderWhere,
                    user_id: id,
                },
                attributes: [
                    'id',
                    'created_at',
                    'transaction_date',
                    'amount',
                    'user_id',
                    'merchant_name',
                    'billing_status',
                    'bill_no',
                    'note',
                    'comment',
                    'stay_from_date',
                    'stay_to_date',
                    'from_location',
                    'to_location',
                    'total_distance'
                ],
                include: [
                    {
                        model: models_1.expencesCategories,
                        attributes: ['id', 'category_name'],
                        required: false
                    },
                    {
                        model: models_1.expencesPurpuse,
                        attributes: ['id', 'name'],
                        required: false
                    },
                    {
                        model: models_1.expencesApprovalStatus,
                        attributes: ['id', 'name', 'border_hex_color', 'button_hex_color'],
                        required: false
                    },
                    {
                        model: documents_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                order: orderOptions
                // raw: true
            });
            const dataCount = await models_1.expenses.count({
                where: {
                    ...orderWhere,
                    user_id: id
                }
            });
            const totalPages = Math.ceil(dataCount / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: dataCount,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const finalData = data.map(obj => {
                if (obj.expencesApprovalStatus.dataValues.id == 1) {
                    return { ...obj.dataValues, isEditable: true, isDeletable: true };
                }
                return { ...obj.dataValues, isEditable: false, isDeletable: false };
            });
            const response = (0, response_1.generateResponse)(200, true, "Expenses List fetched Succesfully", finalData, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            return next((0, InternalServerError_1.internalServerError)(false, "Something Went Wrong!"));
        }
    };
    const updateExpenses = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { category_id, purpose_id, transaction_date, billing_status, bill_no, from_location, to_location, from_latitude, from_longitude, to_latitude, to_longitude, total_distance, merchant_name, amount, note, purpose_text, supporting_doc_url, stay_from_date, stay_to_date, status_id, document_id } = req.body;
                const { expense_id } = req.query;
                const { id } = req.credentials;
                const isExists = await models_1.expenses.findOne({ where: { id: expense_id, status_id: 1, user_id: id } });
                if (!isExists) {
                    console.log("EXISTS!!!", expense_id);
                    return next((0, NotFound_1.notFound)(false, 'Invalid expense id/you cannot update it after final submition!'));
                }
                const categoryIsExists = await models_1.expencesCategories.findOne({ where: { id: category_id } });
                if (!categoryIsExists) {
                    return next((0, NotFound_1.notFound)(false, 'Invalid category id!'));
                }
                const purposeIsExists = await models_1.expencesPurpuse.findOne({ where: { id: purpose_id } });
                if (!purposeIsExists) {
                    return next((0, NotFound_1.notFound)(false, 'Invalid purpose id/unable to update this expense because its approved/rejected by admin!'));
                }
                const expensesData = {
                    category_id: category_id,
                    purpose_id: purpose_id,
                    transaction_date: transaction_date,
                    billing_status: billing_status,
                    bill_no: bill_no,
                    from_location: from_location,
                    to_location: to_location,
                    from_latitude: from_latitude,
                    from_longitude: from_longitude,
                    to_latitude: to_latitude,
                    to_longitude: to_longitude,
                    total_distance: total_distance,
                    merchant_name: merchant_name,
                    amount: amount,
                    note: note,
                    purpose_text: purpose_text,
                    supporting_doc_url: supporting_doc_url,
                    stay_from_date: stay_from_date,
                    stay_to_date: stay_to_date,
                    status_id: status_id,
                    document_id: document_id
                };
                console.log("EXPENSE DATA>>>>>>>>>>", expensesData);
                const updatedExpense = await models_1.expenses.update(expensesData, { where: { id: expense_id }, transaction: t });
                const expense = await models_1.expenses.findByPk(parseInt(expense_id));
                const user = await models_1.User.findByPk(id, {
                    include: [
                        {
                            model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] },
                                { model: reportingRole_1.default }]
                        }
                    ],
                    attributes: ['id', 'employee_name', 'date_of_joining'],
                    plain: true
                });
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                const expenseWorkflow = masterPolicy.expense_workflow;
                const approvalWorkflow = await approvalFlow_1.default.findByPk(expenseWorkflow, {
                    include: [
                        {
                            model: reportingRole_1.default,
                            as: 'direct',
                            through: { attributes: [] },
                            include: [{
                                    model: reportingManagers_1.default,
                                    // attributes: ['id', 'employee_name']
                                }]
                        },
                        {
                            model: approvalFlowType_1.default,
                        }
                    ]
                });
                console.log("STATUS ID", status_id);
                if (status_id == 2) {
                    if (expense) {
                        console.log("EXPENSE", expense);
                        if (user?.Manager && user?.Manager.length > 0) {
                            if (approvalWorkflow?.approval_flow_type?.id === 2) { //Sequential
                                console.log("SEQUENTIAL MEIN GAYA HAIN YEH");
                                const reportingManagers = user?.Manager;
                                const sortedManagers = approvalWorkflow?.direct?.sort((a, b) => b.priority - a.priority);
                                const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
                                const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);
                                console.log("MIN PRIORITY MANAAGERSSS", minPriorityManagers);
                                console.log("MIN PRIORITYYYY", minPriority);
                                for (const manager of minPriorityManagers) {
                                    await Promise.all(manager?.reporting_managers.map(async (item) => {
                                        try {
                                            if (reportingManagers.some(manager => manager.id === item.id)) {
                                                const expenseRequest = await expenseRequest_1.default.create({
                                                    expense_id: expense.id,
                                                    reporting_manager_id: item.id,
                                                    status: 1,
                                                    priority: manager.priority
                                                }, { transaction: t });
                                                const notificationData = {
                                                    user_id: item.user_id,
                                                    title: 'Expense Request',
                                                    type: 'expense_request_creation',
                                                    description: `${user?.employee_name} has added an expense`,
                                                };
                                                const notification = await notification_1.default.create(notificationData, { transaction: t });
                                                await (0, sendNotification_1.sendNotification)(item.user_id, notification);
                                                let data = {
                                                    user_id: item.user_id,
                                                    type: 'expense_request_creation',
                                                    message: `${user?.employee_name} has added an expense`,
                                                    path: 'expense_request_creation',
                                                    reference_id: expenseRequest?.id
                                                };
                                                console.log("HERE IS THE NOTFICATION PART!!!!");
                                                await (0, notificationService_1.sendPushNotification)(data);
                                            }
                                        }
                                        catch (err) {
                                            console.log(err);
                                        }
                                    }));
                                }
                            }
                            else if (approvalWorkflow?.approval_flow_type?.id === 1) { //Parallel
                                console.log("PARALLEL MEIN GAYA HAIN YEH!");
                                const reportingManagers = user?.Manager;
                                const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id));
                                await Promise.all(filteredManagers.map(async (manager) => {
                                    const expenseRequest = await expenseRequest_1.default.create({
                                        expense_id: expense?.id,
                                        reporting_manager_id: manager.id,
                                        status: 1,
                                        priority: 1
                                    }, { transaction: t });
                                    const notificationData = {
                                        user_id: manager.user_id,
                                        title: 'Expense Request',
                                        type: 'expense_request_creation',
                                        description: `${user?.employee_name} has added an expense`,
                                    };
                                    const notification = await notification_1.default.create(notificationData, { transaction: t });
                                    await (0, sendNotification_1.sendNotification)(manager.id, notification);
                                    let data = {
                                        user_id: manager.user_id,
                                        type: 'expense_request_creation',
                                        message: `${user?.employee_name} has added an expense`,
                                        path: 'expense_request_creation',
                                        reference_id: expenseRequest?.id
                                    };
                                    await (0, notificationService_1.sendPushNotification)(data);
                                }));
                            }
                        }
                    }
                }
                const response = (0, response_1.generateResponse)(200, true, "Expense updated Succesfully", updatedExpense);
                res.status(200).json(response);
                return;
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)(false, "Something Went Wrong!"));
        }
    };
    const deleteExpenses = async (req, res, next) => {
        try {
            const { category_id, purpose_id, transaction_date, billing_status, bill_no, from_location, to_location, from_latitude, from_longitude, to_latitude, to_longitude, total_distance, merchant_name, amount, note, purpose_text, supporting_doc_url, stay_from_date, stay_to_date } = req.body;
            const { expense_id } = req.query;
            const { id } = req.credentials;
            const isExists = await models_1.expenses.findOne({ where: { id: expense_id, status_id: 1, user_id: id } });
            if (!isExists) {
                return next((0, NotFound_1.notFound)(false, 'Invalid expense id or it\'s not in draft state!'));
            }
            const expense = await models_1.expenses.destroy({ where: { id: expense_id } });
            const response = (0, response_1.generateResponse)(200, true, "Expense deleted Succesfully", expense);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)(false, "Something Went Wrong!"));
        }
    };
    const getExpenseDetails = async (req, res, next) => {
        try {
            const { expense_id } = req.query;
            const { id } = req.credentials;
            const isExists = await models_1.expenses.findOne({
                where: { id: expense_id, user_id: id },
                include: [
                    {
                        model: models_1.expencesCategories,
                        attributes: ['id', 'category_name'],
                        required: false,
                        include: [{
                                model: models_1.expensesCategoriesForms,
                                attributes: ['id', 'category_form_name'],
                                required: false
                            }
                        ]
                    },
                    {
                        model: models_1.expencesPurpuse,
                        attributes: ['id', 'name'],
                        required: false
                    },
                    {
                        model: models_1.expencesApprovalStatus,
                        attributes: ['id', 'name', 'border_hex_color', 'button_hex_color'],
                        required: false
                    },
                    {
                        model: documents_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ]
            });
            if (!isExists) {
                return next((0, NotFound_1.notFound)(false, 'Invalid expense id!'));
            }
            switch (isExists.dataValues.status_id) {
                case 1:
                    isExists.dataValues.isEditable = true;
                    isExists.dataValues.isDeletable = true;
                    break;
                default:
                    isExists.dataValues.isEditable = false;
                    isExists.dataValues.isDeletable = false;
                    break;
            }
            const response = (0, response_1.generateResponse)(200, true, "Expense details fetched Succesfully", isExists);
            res.status(200).json(response);
        }
        catch (err) {
            return next((0, InternalServerError_1.internalServerError)(false, "Something Went Wrong!"));
        }
    };
    const getExpensesDashboard = async (req, res, next) => {
        try {
            const { from_date, to_date } = req.query;
            const { id } = req.credentials;
            const data = await models_1.expenses.findAll({
                attributes: [
                    [db_1.sequelize.fn('SUM', db_1.sequelize.col('amount')), 'amount'],
                    [db_1.sequelize.col('expencesApprovalStatus.id'), 'status_id'],
                    [db_1.sequelize.col('expencesApprovalStatus.name'), 'name'],
                ],
                include: [
                    {
                        model: models_1.expencesApprovalStatus,
                        attributes: [], // To exclude other fields from ExpenseApprovalStatus
                    },
                ],
                where: {
                    user_id: id,
                    transaction_date: {
                        [sequelize_1.Op.and]: [
                            { [sequelize_1.Op.gte]: from_date },
                            { [sequelize_1.Op.lte]: to_date }
                        ],
                    },
                },
                group: ['status_id'],
            });
            if (!data) {
                return next((0, NotFound_1.notFound)(false, 'Invalid expense id!'));
            }
            const totalExpense = data.reduce((accumulator, item) => {
                const amount = parseInt(item.dataValues.amount);
                return isNaN(amount) ? accumulator : accumulator + amount;
            }, 0);
            const meta = {
                totalExpenses: totalExpense
            };
            const response = (0, response_1.generateResponse)(200, true, "Expense details fetched Succesfully", data, meta);
            res.status(200).json(response);
        }
        catch (err) {
            return next((0, InternalServerError_1.internalServerError)(false, "Something Went Wrong!"));
        }
    };
    const updateApprovalStatus = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { expense_id } = req.query;
                const { id } = req.credentials;
                const isExists = await models_1.expenses.findOne({ where: { id: expense_id, status_id: 1, user_id: id } });
                if (!isExists) {
                    return next((0, NotFound_1.notFound)(false, 'Invalid expense id/already submited!'));
                }
                const expensesData = {
                    status_id: 2
                };
                const updatedExpense = await models_1.expenses.update(expensesData, { where: { id: expense_id } });
                const expense = await models_1.expenses.findByPk(parseInt(expense_id));
                const user = await models_1.User.findByPk(id, {
                    include: [
                        {
                            model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] },
                                { model: reportingRole_1.default }]
                        }
                    ],
                    attributes: ['id', 'employee_name', 'date_of_joining'],
                    plain: true
                });
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                const expenseWorkflow = masterPolicy.expense_workflow;
                const approvalWorkflow = await approvalFlow_1.default.findByPk(expenseWorkflow, {
                    include: [
                        {
                            model: reportingRole_1.default,
                            as: 'direct',
                            through: { attributes: [] },
                            include: [{
                                    model: reportingManagers_1.default,
                                    // attributes: ['id', 'employee_name']
                                }]
                        },
                        {
                            model: approvalFlowType_1.default,
                        }
                    ]
                });
                console.log("STATUS ID", expense);
                // if(status_id == 2){
                if (expense) {
                    console.log("EXPENSE", expense);
                    if (user?.Manager && user?.Manager.length > 0) {
                        if (approvalWorkflow?.approval_flow_type?.id === 2) { //Sequential
                            console.log("SEQUENTIAL MEIN GAYA HAIN YEH");
                            const reportingManagers = user?.Manager;
                            const sortedManagers = approvalWorkflow?.direct?.sort((a, b) => b.priority - a.priority);
                            const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
                            const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);
                            console.log("MIN PRIORITY MANAAGERSSS", minPriorityManagers);
                            console.log("MIN PRIORITYYYY", minPriority);
                            for (const manager of minPriorityManagers) {
                                await Promise.all(manager?.reporting_managers.map(async (item) => {
                                    try {
                                        if (reportingManagers.some(manager => manager.id === item.id)) {
                                            const expenseRequest = await expenseRequest_1.default.create({
                                                expense_id: expense.id,
                                                reporting_manager_id: item.id,
                                                status: 1,
                                                priority: manager.priority
                                            }, { transaction: t });
                                            const notificationData = {
                                                user_id: item.user_id,
                                                title: 'Expense Request',
                                                type: 'expense_request_creation',
                                                description: `${user?.employee_name} has added an expense`,
                                            };
                                            const notification = await notification_1.default.create(notificationData, { transaction: t });
                                            await (0, sendNotification_1.sendNotification)(item.user_id, notification);
                                            let data = {
                                                user_id: item.user_id,
                                                type: 'expense_request_creation',
                                                message: `${user?.employee_name} has added an expense`,
                                                path: 'expense_request_creation',
                                                reference_id: expenseRequest?.id
                                            };
                                            console.log("HERE IS THE NOTFICATION PART!!!!");
                                            await (0, notificationService_1.sendPushNotification)(data);
                                        }
                                    }
                                    catch (err) {
                                        console.log(err);
                                    }
                                }));
                            }
                        }
                        else if (approvalWorkflow?.approval_flow_type?.id === 1) { //Parallel
                            console.log("PARALLEL MEIN GAYA HAIN YEH!");
                            const reportingManagers = user?.Manager;
                            const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id));
                            await Promise.all(filteredManagers.map(async (manager) => {
                                const expenseRequest = await expenseRequest_1.default.create({
                                    expense_id: expense?.id,
                                    reporting_manager_id: manager.id,
                                    status: 1,
                                    priority: 1
                                }, { transaction: t });
                                const notificationData = {
                                    user_id: manager.user_id,
                                    title: 'Expense Request',
                                    type: 'expense_request_creation',
                                    description: `${user?.employee_name} has added an expense`,
                                };
                                const notification = await notification_1.default.create(notificationData, { transaction: t });
                                await (0, sendNotification_1.sendNotification)(manager.id, notification);
                                let data = {
                                    user_id: manager.user_id,
                                    type: 'expense_request_creation',
                                    message: `${user?.employee_name} has added an expense`,
                                    path: 'expense_request_creation',
                                    reference_id: expenseRequest?.id
                                };
                                await (0, notificationService_1.sendPushNotification)(data);
                            }));
                        }
                    }
                }
                // }
                const response = (0, response_1.generateResponse)(200, true, "Expense Submited Succesfully!", updatedExpense);
                res.status(200).json(response);
                return;
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)(false, "Something Went Wrong!"));
        }
    };
    const employeeSummary = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            if (user) {
                const approvedExpense = await models_1.expenses.findOne({
                    attributes: [
                        [db_1.sequelize.fn('SUM', db_1.sequelize.col('amount')), 'total_approved_amount']
                    ],
                    where: {
                        user_id: id,
                        status_id: 3 //Status id for approved expenses
                    }
                });
                const rejectedExpense = await models_1.expenses.findOne({
                    attributes: [
                        [db_1.sequelize.fn('SUM', db_1.sequelize.col('amount')), 'total_rejected_amount']
                    ],
                    where: {
                        user_id: id,
                        status_id: 5 //Status id for rejected expenses
                    }
                });
                const pendingExpense = await models_1.expenses.findOne({
                    attributes: [
                        [db_1.sequelize.fn('SUM', db_1.sequelize.col('amount')), 'total_pending_amount']
                    ],
                    where: {
                        user_id: id,
                        status_id: 2 //Status id for pending expenses.
                    }
                });
                const data = {
                    approvedExpense,
                    rejectedExpense,
                    pendingExpense
                };
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", data);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find user with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getTotalExpensesByMonth = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { year } = req.query;
            const startDate = (0, moment_1.default)(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
            const endDate = (0, moment_1.default)(startDate).endOf('year').format('YYYY-MM-DD');
            console.log(">>>>>>>>>", startDate, endDate);
            const user = await models_1.User.findByPk(id);
            const months = Array.from({ length: 12 }, (_, index) => index + 1);
            if (user) {
                const results = await models_1.expenses.findAll({
                    attributes: [
                        [db_1.sequelize.fn('MONTH', db_1.sequelize.col('transaction_date')), 'month'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.col('amount')), 'total_amount']
                    ],
                    where: {
                        user_id: id,
                        status_id: 3,
                        transaction_date: {
                            [sequelize_1.Op.gte]: startDate,
                            [sequelize_1.Op.lte]: endDate
                        }
                    },
                    group: [db_1.sequelize.fn('MONTH', db_1.sequelize.col('transaction_date')), db_1.sequelize.fn('YEAR', db_1.sequelize.col('transaction_date'))]
                });
                // const data = results.map(result => ({
                //   month: result.dataValues.month,
                //   year: result.dataValues.year,
                //   total_amount: result.dataValues.totalAmount || 0
                // }));
                // Map over months array and populate with total amount for each month
                const data = months.map(month => {
                    const result = results.find(res => res.dataValues.month === month);
                    return {
                        month,
                        total_amount: result ? result.dataValues.total_amount : 0
                    };
                });
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", data);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find a user with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getManagerExpenseList = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { page, records, sortBy, sortOrder, search_term, month, year } = req.query;
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
            const startOfMonth = (0, moment_1.default)(`${year}-${month}-01`).startOf('month');
            const endOfMonth = (0, moment_1.default)(startOfMonth).endOf('month');
            let orderOptions = [];
            if (sortBy && sortOrder) {
                if (sortBy === 'employee_name') {
                    orderOptions.push([{ model: regularizationRecord_1.default }, { model: models_1.User, as: 'Requester' }, 'employee_name', sortOrder]);
                }
                if (sortBy === 'date') {
                    orderOptions.push([{ model: regularizationRecord_1.default }, 'date', sortOrder]);
                }
                if (sortBy === 'request_status') {
                    orderOptions.push([{ model: regularizationRecord_1.default }, 'request_status', sortOrder]);
                }
            }
            if (manager.length > 0) {
                const managerIds = manager.map(manager => manager.id); // Extract manager IDs from the array
                let whereOptions = {
                    reporting_manager_id: { [sequelize_1.Op.in]: managerIds },
                    status: 1
                };
                if (search_term) {
                    whereOptions[sequelize_1.Op.or] = [
                        {
                            '$regularization_record.Requester.employee_name$': {
                                [sequelize_1.Op.like]: `%${search_term}%`
                            }
                        }
                    ];
                }
                let whereOptions2 = {};
                if (month && year) {
                    whereOptions2.date = {
                        [sequelize_1.Op.between]: [startOfMonth, endOfMonth]
                    };
                }
                const expenseRequest = await expenseRequest_1.default.findAndCountAll({
                    where: whereOptions,
                    include: [
                        {
                            model: models_1.expenses,
                            where: whereOptions2,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            },
                            include: [
                                {
                                    model: models_1.expencesApprovalStatus,
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    }
                                },
                                {
                                    model: models_1.User,
                                    attributes: ['id', 'employee_name'],
                                },
                                {
                                    model: models_1.expencesPurpuse,
                                    attributes: ['id', 'name']
                                },
                                {
                                    model: documents_1.default,
                                },
                                {
                                    model: models_1.expencesCategories,
                                    include: [
                                        {
                                            model: models_1.expensesCategoriesForms
                                        }
                                    ]
                                },
                                {
                                    model: models_1.expencesPurpuse
                                },
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
                const processedRows = expenseRequest.rows.length > 0 ?
                    expenseRequest.rows
                    : [];
                const totalPages = Math.ceil(expenseRequest.count / recordsPerPage);
                const hasNextPage = pageNumber < totalPages;
                const hasPrevPage = pageNumber > 1;
                const meta = {
                    totalCount: expenseRequest.count,
                    pageCount: totalPages,
                    currentPage: page,
                    perPage: recordsPerPage,
                    hasNextPage,
                    hasPrevPage
                };
                const result = {
                    data: expenseRequest.rows,
                    meta
                };
                const response = (0, response_1.generateResponse)(200, true, "Requests fetched succesfully!", processedRows, result.meta);
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
    const approveExpenseRequest = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const t = await db_1.sequelize.transaction();
            const requestId = req.params.id;
            const user = await models_1.User.findByPk(id);
            const manager = await reportingManagers_1.default.findAll({
                where: {
                    user_id: id
                }
            });
            const managerIds = manager.map((item) => item.reporting_role_id);
            const managerUser = await models_1.User.findByPk(id);
            console.log("MANAGER USERRR", managerUser);
            const expenseRequest = await expenseRequest_1.default.findByPk(requestId);
            const expense = await models_1.expenses.findByPk(expenseRequest?.expense_id);
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(expense?.user_id);
            const expenseWorkflow = masterPolicy.expense_workflow;
            const approvalWorkflow = await approvalFlow_1.default.findByPk(expenseWorkflow, {
                include: [
                    {
                        model: reportingRole_1.default,
                        as: 'direct',
                        through: { attributes: [] },
                        include: [{
                                model: reportingManagers_1.default,
                            }]
                    },
                    {
                        model: approvalFlowType_1.default,
                    }
                ]
            });
            console.log("APPROVAL FLOW", approvalWorkflow);
            const reportingRoleIds = approvalWorkflow?.direct.map(item => item.id);
            const isManager = managerIds.some(id => reportingRoleIds.includes(id));
            if (user && manager && (isManager) && expenseRequest) {
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(expense?.user_id);
                const expenseWorkflow = masterPolicy.expense_workflow;
                const approvalWorkflow = await approvalFlow_1.default.findByPk(expenseWorkflow);
                console.log(approvalWorkflow?.id);
                if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1) { //Parallel Approval Workflow
                    const expenseRequests = await expenseRequest_1.default.findAll({
                        where: {
                            expense_id: expense?.id,
                        }
                    });
                    await Promise.all(expenseRequests.map(async (request) => {
                        request.status = 2;
                        await request.save({ transaction: t });
                    }));
                    if (expense) {
                        expense.status_id = 3; //Approved
                        // expense.last_action_by = user?.id
                        await expense.save({ transaction: t });
                        const notification = await notification_1.default.create({
                            user_id: expense?.user_id,
                            title: 'Expense Request',
                            type: 'expense_request_approval',
                            description: `${user?.employee_name} has succesfully approved your expense request`
                        }, { transaction: t });
                        await (0, sendNotification_1.sendNotification)(expense?.user_id, notification);
                        let data = {
                            user_id: expense?.user_id,
                            type: 'expense_request_approval',
                            message: `${user?.employee_name} has succesfully approved your expense request`,
                            path: 'expense_request_approval',
                            reference_id: expense?.id
                        };
                        await (0, notificationService_1.sendPushNotification)(data);
                        await t.commit();
                        const response = (0, response_1.generateResponse)(200, true, "Expense Approved succesfully", expenseRequest);
                        res.status(200).json(response);
                    }
                }
                else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2) { //Sequential Workflow
                    const expenseRequest = await expenseRequest_1.default.findAll({
                        where: {
                            expense_id: expense?.id
                        }
                    });
                    const user = await models_1.User.findByPk(expense?.user_id, {
                        include: [{ model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] }, { model: reportingRole_1.default }] }],
                        attributes: ['id', 'employee_generated_id']
                    });
                    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(expense?.user_id);
                    const expenseWorkflow = masterPolicy.expense_workflow;
                    // const leaveType = await LeaveType.findByPk(leave_type_id);
                    const approvalWorkflow = await approvalFlow_1.default.findByPk(expenseWorkflow, {
                        include: [
                            {
                                model: reportingRole_1.default,
                                as: 'direct',
                                through: { attributes: [] },
                                include: [{
                                        model: reportingManagers_1.default,
                                    }]
                            },
                            {
                                model: approvalFlowType_1.default,
                            }
                        ]
                    });
                    const reportingManager = user?.Manager;
                    const filteredManagers = reportingManager.filter(manager => { return approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id); });
                    console.log("APPROVAL FLOW MANAGERSSS", approvalWorkflow?.direct);
                    console.log("FILTERED MANAGERSSSS", filteredManagers);
                    console.log("REPORTING MANAGERSSS", reportingManager);
                    const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
                    const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);
                    const existingRequests = await expenseRequest_1.default.findAll({
                        where: {
                            expense_id: expense?.id,
                        }
                    });
                    if (expense) {
                        if (existingRequests.length > 0) {
                            const approvedManagerIds = existingRequests.map(request => request.reporting_manager_id);
                            const remainingManagers = filteredManagers.filter(manager => !approvedManagerIds.includes(manager.id));
                            console.log("REMAINING MANAGERSSS", remainingManagers);
                            if (remainingManagers.length > 0) {
                                const minPriority = Math.max(...remainingManagers.map(manager => manager.reporting_role.priority));
                                const minPriorityManagers = remainingManagers.filter(manager => manager.reporting_role.priority === minPriority);
                                console.log("MIN PRIORITY MANAGERSSSS", minPriorityManagers);
                                // expense.last_action_by = user?.id
                                await expense.save({ transaction: t });
                                for (const manager of minPriorityManagers) {
                                    await expenseRequest_1.default.create({
                                        expense_id: expense?.id,
                                        reporting_manager_id: manager.id,
                                        status: 1,
                                        priority: manager.reporting_role.priority
                                    });
                                }
                            }
                            else {
                                // await expense.update({
                                //     last_action_by: user?.id
                                // }, {transaction: t})
                                console.log("FINAL APPROVAL!");
                                await expense.update({
                                    status_id: 3
                                }, {
                                    where: {
                                        id: expense?.id
                                    }
                                });
                            }
                            await Promise.all(existingRequests.map(async (request) => {
                                await request.update({
                                    status: 2
                                }, { transaction: t });
                            }));
                            const notification = await notification_1.default.create({
                                user_id: expense?.user_id,
                                title: 'Expense Request',
                                type: 'expense_request_approval',
                                description: `${user?.employee_name} has succesfully approved your expense request`
                            }, { transaction: t });
                            await (0, sendNotification_1.sendNotification)(expense?.user_id, notification);
                            let data = {
                                user_id: expense?.user_id,
                                type: 'expense_request_approval',
                                message: `${user?.employee_name} has succesfully approved your expense request`,
                                path: 'expense_request_approval',
                                reference_id: expense?.id
                            };
                            console.log("HERE IS THE NOTFICATION PART!!!!");
                            await (0, notificationService_1.sendPushNotification)(data);
                            await t.commit();
                            const response = (0, response_1.generateResponse)(200, true, "Expense Approved succesfully", expenseRequest);
                            res.status(200).json(response);
                        }
                    }
                }
            }
            else {
                next((0, BadRequest_1.badRequest)("You're not the authorized user to approve the leave!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const rejectExpenseRequest = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            // const t = await sequelize.transaction()
            // const {reject_reason} = req.body
            const requestId = req.params.id;
            const { comment } = req.body;
            if (!comment) {
                return next((0, BadRequest_1.badRequest)("Please provide a reason for the rejection"));
            }
            const user = await models_1.User.findByPk(id);
            const manager = await reportingManagers_1.default.findAll({
                where: {
                    user_id: id
                }
            });
            const expenseRequest = await expenseRequest_1.default.findByPk(requestId);
            const expense = await models_1.expenses.findByPk(expenseRequest?.expense_id);
            const managerIds = manager?.map((item) => item.reporting_role_id);
            const managerUser = await models_1.User.findByPk(id);
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(expense?.user_id);
            const expenseWorkflow = masterPolicy.expense_workflow;
            // const baseLeaveConfiguration = await BaseLeaveConfiguration.findByPk(masterPolicy?.base_leave_configuration_id)
            // if(baseLeaveConfiguration?.leave_rejection_reason && !req.body.reject_reason){
            //     return next(badRequest("A reason for rejection is mandatory!"))
            // }
            const approvalWorkflow = await approvalFlow_1.default.findByPk(expenseWorkflow, {
                include: [
                    {
                        model: reportingRole_1.default,
                        as: 'direct',
                        through: { attributes: [] },
                        include: [{
                                model: reportingManagers_1.default,
                            }]
                    },
                    {
                        model: approvalFlowType_1.default,
                    }
                ]
            });
            const reportingRoleIds = approvalWorkflow?.direct.map(item => item.id);
            console.log(">>>>>>>>>", requestId);
            const isManager = managerIds.some(id => reportingRoleIds.includes(id));
            if (user && manager && (isManager) && expenseRequest) {
                await db_1.sequelize.transaction(async (t) => {
                    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(expense?.user_id);
                    const expenseWorkflow = masterPolicy.expense_workflow;
                    const approvalWorkflow = await approvalFlow_1.default.findByPk(expenseWorkflow);
                    if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1) { //Parallel Workflow
                        const expenseRequests = await expenseRequest_1.default.findAll({
                            where: {
                                expense_id: expense?.id,
                            }
                        });
                        await Promise.all(expenseRequests.map(async (request) => {
                            request.status = 3; //Rejected
                            await request.save({ transaction: t });
                        }));
                        if (expense) {
                            expense.status_id = 5; //Rejection
                            expense.comment = comment;
                            // leaveRecord.last_action_by = user.id
                            await expense.save({ transaction: t });
                            const response = (0, response_1.generateResponse)(200, true, "Leave Rejected succesfully", expenseRequest);
                            res.status(200).json(response);
                        }
                        const notification = await notification_1.default.create({
                            user_id: expense?.user_id,
                            title: 'Expense Request',
                            type: 'expense_request_rejection',
                            description: `${managerUser?.employee_name} has rejected your expense request`
                        }, { transaction: t });
                        await (0, sendNotification_1.sendNotification)(expense?.id, notification);
                        let data = {
                            user_id: expense?.user_id,
                            type: 'expense_request_rejection',
                            message: `${managerUser?.employee_name} has rejected your expense request`,
                            path: 'expense_request_rejection',
                            reference_id: expense?.id
                        };
                        await (0, notificationService_1.sendPushNotification)(data);
                    }
                    else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2) { //Sequential Workflow
                        const expenseRequests = await expenseRequest_1.default.findAll({
                            where: {
                                expense_id: expense?.id,
                            }
                        });
                        await Promise.all(expenseRequests.map(async (request) => {
                            request.status = 3; //Rejection
                            await request.save({ transaction: t });
                        }));
                        if (expense) {
                            expense.status_id = 5; //Rejection
                            expense.comment = comment;
                            // leaveRecord.last_action_by = user.id
                            await expense.save({ transaction: t });
                            const notification = await notification_1.default.create({
                                user_id: expense?.user_id,
                                title: 'Expense Request',
                                type: 'expense_request_rejection',
                                description: `${managerUser?.employee_name} has rejected your expense request`
                            }, { transaction: t });
                            await (0, sendNotification_1.sendNotification)(expense?.id, notification);
                            let data = {
                                user_id: expense?.user_id,
                                type: 'expense_request_rejection',
                                message: `${managerUser?.employee_name} has rejected your expense request`,
                                path: 'expense_request_rejection',
                                reference_id: expense?.id
                            };
                            await (0, notificationService_1.sendPushNotification)(data);
                            const response = (0, response_1.generateResponse)(200, true, "Leave Rejected succesfully", expenseRequest);
                            res.status(200).json(response);
                        }
                    }
                });
            }
            else {
                next((0, Unauthorized_1.unauthorized)("You don't have the access role to view this resource!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getManagerExpensesSummary = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const months = Array.from({ length: 12 }, (_, index) => index + 1);
            const year = (0, moment_1.default)().year();
            const startDate = (0, moment_1.default)(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
            const endDate = (0, moment_1.default)(startDate).endOf('year').format('YYYY-MM-DD');
            const manager = await reportingManagers_1.default.findAll({
                where: {
                    user_id: id
                },
                include: [
                    {
                        model: models_1.User,
                        as: 'Employees',
                        attributes: ['id', 'employee_name'],
                        through: { attributes: [] }
                    }
                ]
            });
            if (manager && manager.length > 0) {
                const managerIds = manager.map((item) => item.id);
                const expensesList = await expenseRequest_1.default.findAll({
                    where: {
                        reporting_manager_id: {
                            [sequelize_1.Op.in]: managerIds
                        }
                    },
                    include: [
                        {
                            model: models_1.expenses
                        }
                    ]
                });
                let approved = 0;
                let rejected = 0;
                let pending = 0;
                for (const expense of expensesList) {
                    const amount = expense.expense.amount;
                    if (expense.status == 2) { //Status for Approval
                        approved += amount;
                    }
                    else if (expense.status == 3) {
                        rejected += amount;
                    }
                    else if (expense.status == 1) {
                        pending += amount;
                    }
                }
                const flattenedEmployees = manager.reduce((acc, curr) => {
                    return acc.concat(curr.Employees);
                }, []);
                let array = [];
                for (const user of flattenedEmployees) {
                    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(user.id);
                    const expenseWorkflow = await approvalFlow_1.default.findByPk(masterPolicy?.expense_workflow, {
                        include: [
                            {
                                model: reportingRole_1.default,
                                as: 'direct',
                                include: [
                                    {
                                        model: reportingManagers_1.default,
                                        where: {
                                            user_id: id
                                        },
                                        required: true,
                                    }
                                ]
                            }
                        ]
                    });
                    if (expenseWorkflow && expenseWorkflow.direct.some(role => role.reporting_managers.length > 0)) {
                        array.push(user);
                    }
                }
                const ids = array.map(obj => obj.id);
                // const results = await expenses.findAll({
                //     attributes: [
                //         [sequelize.fn('MONTH', sequelize.col('transaction_date')), 'month'],
                //         [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
                //     ],
                //     where: {
                //         user_id: {
                //             [Op.in]: ids
                //         },
                //         status_id: 3,
                //         transaction_date: {
                //             [Op.gte]: startDate,
                //             [Op.lte]: endDate
                //         }
                //     },
                //     group: [sequelize.fn('MONTH', sequelize.col('transaction_date')), sequelize.fn('YEAR', sequelize.col('transaction_date'))]
                // })
                const results = await expenseRequest_1.default.findAll({
                    where: {
                        status: 2,
                        reporting_manager_id: managerIds
                    },
                    attributes: [
                        [db_1.sequelize.fn('MONTH', db_1.sequelize.col('transaction_date')), 'month'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.col('expense.amount')), 'total_amount'],
                    ],
                    include: [{
                            model: models_1.expenses,
                            attributes: [],
                            where: {
                                transaction_date: { [sequelize_1.Op.between]: [startDate, endDate] },
                            }, // Filter by approved expenses,
                        }],
                    group: [db_1.sequelize.fn('MONTH', db_1.sequelize.col('transaction_date')), db_1.sequelize.fn('YEAR', db_1.sequelize.col('transaction_date'))],
                });
                // Map over months array and populate with total amount for each month
                const data = months.map(month => {
                    const result = results.find(res => res.dataValues.month === month);
                    return {
                        month,
                        total_amount: result ? result.dataValues.total_amount : 0
                    };
                });
                const responseBody = {
                    data,
                    approved,
                    pending,
                    rejected
                };
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", responseBody);
                res.status(200).json(response);
            }
            else {
                next((0, BadRequest_1.badRequest)("There is no reprting manager with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return {
        getAll,
        getById,
        destroy,
        getAllDropdown,
        create,
        getDropDowns,
        getExpensesList,
        updateExpenses,
        deleteExpenses,
        getExpenseDetails,
        getExpensesDashboard,
        updateApprovalStatus,
        employeeSummary,
        getTotalExpensesByMonth,
        getManagerExpenseList,
        approveExpenseRequest,
        rejectExpenseRequest,
        getManagerExpensesSummary
    };
};
exports.ExpensesController = ExpensesController;
