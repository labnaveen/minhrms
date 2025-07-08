//@ts-nocheck
import { NextFunction, Request, Response } from "express";
import { Model } from 'sequelize'
import { MasterController } from "../masterController";
import { expensesCategoriesForms, expencesApprovalStatus, expencesCategories, expencesPurpuse, User, expenses, expenses } from "../../models";
import { sequelize } from "../../utilities/db";
import { Op } from 'sequelize'
import { notFound } from "../../services/mobileErrorHandling/NotFound";
import { internalServerError } from "../../services/mobileErrorHandling/InternalServerError";
import moment from "moment";
import { unauthorized } from "../../services/error/Unauthorized";
import { generateResponse } from "../../services/response/response";
import { badRequest } from '../../services/mobileErrorHandling/BadRequest';
import Documents from "../../models/documents";
import { getMasterPolicy } from "../../services/masterPolicy/getMasterPolicy";
import ApprovalFlow from "../../models/approvalFlow";
import ReportingRole from "../../models/reportingRole";
import ReportingManagers from "../../models/reportingManagers";
import ApprovalFlowType from "../../models/dropdown/type/approvalFlowType";
import { sendPushNotification } from "../../services/pushNotification/notificationService";
import { sendNotification } from "../../services/notification/sendNotification";
import Notification from "../../models/notification";
import ExpenseRequest from "../../models/expenseRequest";
import RegularizationRecord from "../../models/regularizationRecord";
import { forbiddenError } from "../../services/error/Forbidden";
import ApprovalFlowReportingRole from "../../models/approvalFlowReportingRole";
import ExpenseRequestHistory from "../../models/expenseRequestHistory";

type ExpenseAttributes = {
    id: number,
    user_id: number,
    category_id: number,
    status_id: number,
    purpose_id: number,
    transaction_date: Date,
    billing_status: string,
    bill_no: string,
    from_location: string,
    to_location: string,
    from_latitude: number,
    from_longitude: number,
    to_latitude: number,
    to_longitude: number,
    total_distance: number,
    merchant_name: string,
    amount: number,
    note: string,
    purpose_text: string
}
type ExpensesCreationAttributes = Omit<ExpenseAttributes, 'id'>;
type ExpensesModel = Model<ExpenseAttributes, ExpensesCreationAttributes>;
type ExpensesController = MasterController<ExpensesModel> & {
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDropDowns: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getExpensesList: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateExpenses: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteExpenses: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getExpenseDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getExpensesDashboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateApprovalStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    employeeSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTotalExpensesByMonth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getManagerExpenseList: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approveExpenseRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    rejectExpenseRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getManagerExpensesSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAdminExpensesRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAdminExpensesRecords: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    adminExpenseRequestApproval: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    adminExpenseRequestRejection: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const ExpensesController = (
    model: typeof Model & {
        new(): ExpensesModel;
    }
): ExpensesController => {

    const { getAll, getById, destroy, getAllDropdown } = MasterController<expenses>(model);

    const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await sequelize.transaction(async(t) => {
                const {
                    category_id,
                    purpose_id,
                    transaction_date,
                    billing_status,
                    bill_no,
                    from_location,
                    to_location,
                    from_latitude,
                    from_longitude,
                    to_latitude,
                    to_longitude,
                    total_distance,
                    merchant_name,
                    amount,
                    note,
                    purpose_text,
                    supporting_doc_url,
                    stay_from_date,
                    stay_to_date,
                    document_id,
                    status_id
                } = req.body
                const { id } = req.credentials
                const categoryIsExists = await expencesCategories.findOne({ where: { id: category_id } })
                if (!categoryIsExists) {
                    return next(notFound(false, 'Invalid category id!'))
                }
                const purposeIsExists = await expencesPurpuse.findOne({ where: { id: purpose_id } })
                if (!purposeIsExists) {
                    return next(notFound(false, 'Invalid category id!'))
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
                }

                console.log("EXPENSES DATA1222>>>>>", expensesData)

                const expense = await expenses.create(expensesData, {transaction: t})

    
                const user = await User.findByPk(id, {
                    include: [
                        {
                            model: ReportingManagers, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: User, as: 'manager', attributes: ['id', 'employee_name'] },
                            { model: ReportingRole }]
                        }
                    ],
                    attributes: ['id', 'employee_name', 'date_of_joining'],
                    plain: true
                })
    
                const masterPolicy = await getMasterPolicy(id);
    
                const expenseWorkflow = masterPolicy.expense_workflow;
    
                const approvalWorkflow = await ApprovalFlow.findByPk(expenseWorkflow,
                    {
                        include: [
                            {
                                model: ReportingRole,
                                as: 'direct',
                                through: { attributes: [] },
                                include: [{
                                    model: ReportingManagers,
                                    // attributes: ['id', 'employee_name']
                                }]
                            },
                            {
                                model: ApprovalFlowType,
                            }
                        ]
                    }
                )

                const administrators = await User.findAll({
					where: {
						role_id: 1 //admin
					}
				})
                
                if(expense && status_id == 2){
                    if (user?.Manager && user?.Manager.length > 0) {
                        if (approvalWorkflow?.approval_flow_type?.id === 2) {  //Sequential
                            console.log("SEQUENTIAL MEIN GAYA HAIN YEH")
                            const reportingManagers = user?.Manager as any[]
        
                            const sortedManagers = approvalWorkflow?.direct?.sort((a, b) => b.priority - a.priority);
                            const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
        
                            const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);
        
                            console.log("MIN PRIORITY MANAAGERSSS", minPriorityManagers)
                            console.log("MIN PRIORITYYYY", minPriority)
        
                            for (const manager of minPriorityManagers) {
                                await Promise.all(
                                    manager?.reporting_managers.map(async (item) => {
                                        try {
                                            if (reportingManagers.some(manager => manager.id === item.id)) {
                                                const expenseRequest = await ExpenseRequest.create({
                                                    expense_id: expense.id,
                                                    user_id: item?.user_id,
                                                    status: 1,
                                                    priority: manager.priority
                                                }, { transaction: t })
        
                                                const notificationData = {
                                                    user_id: item.user_id,
                                                    title: 'Expense Request',
                                                    type: 'expense_request_creation',
                                                    description: `${user?.employee_name} has added an expense`,
                                                }
        
                                                const notification = await Notification.create(notificationData, { transaction: t })
        
                                                await sendNotification(item.user_id, notification)
        
                                                let data = {
                                                    user_id: item.user_id,
                                                    type: 'expense_request_creation',
                                                    message: `${user?.employee_name} has added an expense`,
                                                    path: 'expense_request_creation',
                                                    reference_id: expenseRequest?.id
                                                }
        
                                                console.log("HERE IS THE NOTFICATION PART!!!!")
                                                await sendPushNotification(data)
                                            }
                                        } catch (err) {
                                            console.log(err)
                                        }
                                    })
                                )
                                for(let admin of administrators){
                                    const AdminRegularizationRequest = await ExpenseRequest.create({
                                        expense_id: expense?.id,
                                        user_id: admin.id,
                                        status: 1,
                                        priority: 0 //Admin Priority
                                    }, {transaction: t})
                                }
                            }
                        } else if (approvalWorkflow?.approval_flow_type?.id === 1) { //Parallel
        
                            console.log("PARALLEL MEIN GAYA HAIN YEH!")
        
                            const reportingManagers = user?.Manager as any[]
        
                            const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id))
        
                            await Promise.all(
                                filteredManagers.map(async (manager) => {
                                    const expenseRequest = await ExpenseRequest.create({
                                        expense_id: expense?.id,
                                        user_id: manager?.user_id,
                                        status: 1,
                                        priority: 1
                                    }, { transaction: t })
                                    const notificationData = {
                                        user_id: manager.user_id,
                                        title: 'Expense Request',
                                        type: 'expense_request_creation',
                                        description: `${user?.employee_name} has added an expense`,
                                    }
        
                                    const notification = await Notification.create(notificationData, { transaction: t })
                                    await sendNotification(manager.id, notification)
        
                                    let data = {
                                        user_id: manager.user_id,
                                        type: 'expense_request_creation',
                                        message: `${user?.employee_name} has added an expense`,
                                        path: 'leave_request_creation',
                                        reference_id: expenseRequest?.id
                                    }
        
                                    console.log("HERE IS THE NOTFICATION PART!!!!")
                                    await sendPushNotification(data)
                                })
                            )
                            for(let admin of administrators){
                                const AdminRegularizationRequest = await ExpenseRequest.create({
                                    expense_id: expense?.id,
                                    user_id: admin.id,
                                    status: 1,
                                    priority: 0 //Admin Priority
                                }, {transaction: t})
                            }
                        }
                    }
                }
                const response = generateResponse(200, true, "Expense drafted Succesfully", expense)
                res.status(200).json(response)
            })
        } catch (err) {
            console.log(err)
            return next(internalServerError(false, "Something Went Wrong!"))
        }
    }
    const getDropDowns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const category = await expencesCategories.findAll({
                attributes: ['id', 'category_name'],
                include: [{
                    model: expensesCategoriesForms,
                    attributes: ['id', 'category_form_name'],
                    required: false
                }
                ]
            })
            const purpose = await expencesPurpuse.findAll({ attributes: ['id', 'name'], raw: true })
            const purposeWithTextFieldFlag = purpose.map(obj => {
                if (obj.name.toLowerCase() === "other") {
                    return { ...obj, showCommentBox: true };
                }
                return { ...obj, showCommentBox: false };
            })
            const data = { categoriesList: category, purposesList: purposeWithTextFieldFlag }
            const response = generateResponse(200, true, "Drop down data fetched Succesfully", data)
            res.status(200).json(response)
        } catch (err) {
            return next(internalServerError(false, "Something Went Wrong!"))
        }
    }
    const getExpensesList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { page, records, filter, category_id, sortBy, sortOrder } = req.query as { page: string, records: string, filter: string, category_id: string, sortBy: string, sortOrder: string }
            if (!page && !records) {
                next(badRequest(false, "No request parameters are present!"))
                return
            }


            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
            const offset = (pageNumber - 1) * recordsPerPage;
            const limit = recordsPerPage
            const { id } = req.credentials
            /// filters
            const orderWhere = {
            }

            if (category_id) {
                orderWhere.category_id = category_id
            }

            if (filter) {
                console.log("FILTER", filter)
                Object.keys(filter).forEach((field) => {
                    console.log(">>>>>", typeof(field))
                    if (field === 'status') {
                        orderWhere.status_id = filter[field]
                    }
                    if(field === "startdate"){
                        console.log("TRUEEEEE")
                        orderWhere.created_at = {
                            [Op.gte]: moment(filter[field]).startOf('day').toDate(),
                        }
                    }
                    if(field === "enddate"){
                        orderWhere.created_at = {
                            ...(orderWhere.created_at || {}),
                            [Op.lte]: moment(filter[field]).endOf('day').toDate()
                        }
                    }
                })
            }

            const orderOptions = []

            if (sortBy && sortOrder) {
                if (sortBy == 'request_date') {
                    orderOptions.push(['created_at', sortOrder])
                }
                if (sortBy == 'bill_number') {
                    orderOptions.push(['bill_no', sortOrder])
                }
                if (sortBy == 'purpose') {
                    orderOptions.push([{ model: expencesPurpuse }, 'name', sortOrder])
                }
                if (sortBy == 'merchant_name') {
                    orderOptions.push(['merchant_name', sortOrder])
                }
                if (sortBy == 'status') {
                    orderOptions.push([{ model: expencesApprovalStatus }, sortOrder])
                }
                if (sortBy == 'amount' || sortBy == 'note') {
                    orderOptions.push([sortBy, sortOrder])
                }
            }

            console.log(">>>", orderWhere)

            const data = await expenses.findAll({
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
                        model: expencesCategories,
                        attributes: ['id', 'category_name'],
                        required: false
                    },
                    {
                        model: expencesPurpuse,
                        attributes: ['id', 'name'],
                        required: false
                    },
                    {
                        model: expencesApprovalStatus,
                        attributes: ['id', 'name', 'border_hex_color', 'button_hex_color'],
                        required: false
                    },
                    {
                        model: Documents,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                order: orderOptions
                // raw: true
            })
            const dataCount = await expenses.count({
                where: {
                    ...orderWhere,
                    user_id: id
                }
            })
            const totalPages = Math.ceil(dataCount / recordsPerPage)
            const hasNextPage = pageNumber < totalPages
            const hasPrevPage = pageNumber > 1
            const meta = {
                totalCount: dataCount,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }
            const finalData = data.map(obj => {
                if (obj.expencesApprovalStatus.dataValues.id == 1) {
                    return { ...obj.dataValues, isEditable: true, isDeletable: true }
                }
                return { ...obj.dataValues, isEditable: false, isDeletable: false }
            })
            const response = generateResponse(200, true, "Expenses List fetched Succesfully", finalData, meta)
            res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return next(internalServerError(false, "Something Went Wrong!"))
        }
    }
    const updateExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await sequelize.transaction(async(t) => {
                const { 
                    category_id, 
                    purpose_id, 
                    transaction_date, 
                    billing_status, 
                    bill_no, 
                    from_location, 
                    to_location, 
                    from_latitude, 
                    from_longitude, 
                    to_latitude, 
                    to_longitude, 
                    total_distance, 
                    merchant_name, 
                    amount, 
                    note, 
                    purpose_text, 
                    supporting_doc_url, 
                    stay_from_date, 
                    stay_to_date,
                    status_id,
                    document_id 
                } = req.body
                const { expense_id } = req.query
                const { id } = req.credentials
                const isExists = await expenses.findOne({ where: { id: expense_id, status_id: 1, user_id: id } })
                if (!isExists) {
                    console.log("EXISTS!!!", expense_id)
                    return next(notFound(false, 'Invalid expense id/you cannot update it after final submition!'))
                }
                const categoryIsExists = await expencesCategories.findOne({ where: { id: category_id } })
                if (!categoryIsExists) {
                    return next(notFound(false, 'Invalid category id!'))
                }
                const purposeIsExists = await expencesPurpuse.findOne({ where: { id: purpose_id } })
                if (!purposeIsExists) {
                    return next(notFound(false, 'Invalid purpose id/unable to update this expense because its approved/rejected by admin!'))
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
                }
                console.log("EXPENSE DATA>>>>>>>>>>", expensesData)

                const updatedExpense = await expenses.update(expensesData, { where: { id: expense_id }, transaction: t })

                const expense = await expenses.findByPk(parseInt(expense_id))

                const user = await User.findByPk(id, {
                    include: [
                        {
                            model: ReportingManagers, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: User, as: 'manager', attributes: ['id', 'employee_name'] },
                            { model: ReportingRole }]
                        }
                    ],
                    attributes: ['id', 'employee_name', 'date_of_joining'],
                    plain: true
                })

                const masterPolicy = await getMasterPolicy(id);

                const expenseWorkflow = masterPolicy.expense_workflow;

                const approvalWorkflow = await ApprovalFlow.findByPk(expenseWorkflow,
                    {
                        include: [
                            {
                                model: ReportingRole,
                                as: 'direct',
                                through: { attributes: [] },
                                include: [{
                                    model: ReportingManagers,
                                    // attributes: ['id', 'employee_name']
                                }]
                            },
                            {
                                model: ApprovalFlowType,
                            }
                        ]
                    }
                )

                console.log("STATUS ID", status_id)

                if(status_id == 2){
                    if(expense){
                        console.log("EXPENSE", expense)
                        if (user?.Manager && user?.Manager.length > 0) {
                            if (approvalWorkflow?.approval_flow_type?.id === 2) {  //Sequential
                                console.log("SEQUENTIAL MEIN GAYA HAIN YEH")
                                const reportingManagers = user?.Manager as any[]
            
                                const sortedManagers = approvalWorkflow?.direct?.sort((a, b) => b.priority - a.priority);
                                const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
            
                                const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);
            
                                console.log("MIN PRIORITY MANAAGERSSS", minPriorityManagers)
                                console.log("MIN PRIORITYYYY", minPriority)
            
                                for (const manager of minPriorityManagers) {
                                    await Promise.all(
                                        manager?.reporting_managers.map(async (item) => {
                                            try {
                                                if (reportingManagers.some(manager => manager.id === item.id)) {
                                                    const expenseRequest = await ExpenseRequest.create({
                                                        expense_id: expense.id,
                                                        reporting_manager_id: item.id,
                                                        status: 1,
                                                        priority: manager.priority
                                                    }, { transaction: t })
            
                                                    const notificationData = {
                                                        user_id: item.user_id,
                                                        title: 'Expense Request',
                                                        type: 'expense_request_creation',
                                                        description: `${user?.employee_name} has added an expense`,
                                                    }
            
                                                    const notification = await Notification.create(notificationData, { transaction: t })
            
                                                    await sendNotification(item.user_id, notification)
            
                                                    let data = {
                                                        user_id: item.user_id,
                                                        type: 'expense_request_creation',
                                                        message: `${user?.employee_name} has added an expense`,
                                                        path: 'expense_request_creation',
                                                        reference_id: expenseRequest?.id
                                                    }
            
                                                    console.log("HERE IS THE NOTFICATION PART!!!!")
                                                    await sendPushNotification(data)
                                                }
                                            } catch (err) {
                                                console.log(err)
                                            }
                                        })
                                    )
                                }
                            } else if (approvalWorkflow?.approval_flow_type?.id === 1) { //Parallel
            
                                console.log("PARALLEL MEIN GAYA HAIN YEH!")
            
                                const reportingManagers = user?.Manager as any[]
            
                                const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id))
            
                                await Promise.all(
                                    filteredManagers.map(async (manager) => {
                                        const expenseRequest = await ExpenseRequest.create({
                                            expense_id: expense?.id,
                                            reporting_manager_id: manager.id,
                                            status: 1,
                                            priority: 1
                                        }, { transaction: t })
                                        const notificationData = {
                                            user_id: manager.user_id,
                                            title: 'Expense Request',
                                            type: 'expense_request_creation',
                                            description: `${user?.employee_name} has added an expense`,
                                        }
            
                                        const notification = await Notification.create(notificationData, { transaction: t })
                                        await sendNotification(manager.id, notification)
            
                                        let data = {
                                            user_id: manager.user_id,
                                            type: 'expense_request_creation',
                                            message: `${user?.employee_name} has added an expense`,
                                            path: 'expense_request_creation',
                                            reference_id: expenseRequest?.id
                                        }
            
                                        await sendPushNotification(data)
                                    })
                                )
                            }
                        }
                    }
                }

                const response = generateResponse(200, true, "Expense updated Succesfully", updatedExpense)
                res.status(200).json(response)
                return
            })
        } catch (err) {
            console.log(err)
            next(internalServerError(false, "Something Went Wrong!"))
        }
    }
    const deleteExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { 
                category_id, 
                purpose_id, 
                transaction_date, 
                billing_status, 
                bill_no, 
                from_location, 
                to_location, 
                from_latitude, 
                from_longitude, 
                to_latitude, 
                to_longitude, 
                total_distance, 
                merchant_name, 
                amount, 
                note, 
                purpose_text, 
                supporting_doc_url, 
                stay_from_date, 
                stay_to_date 
            } = req.body
            const { expense_id } = req.query
            const { id } = req.credentials
            const isExists = await expenses.findOne({ where: { id: expense_id, status_id: 1, user_id: id } })
            if (!isExists) {
                return next(notFound(false, 'Invalid expense id or it\'s not in draft state!'))
            }
            const expense = await expenses.destroy({ where: { id: expense_id } })
            const response = generateResponse(200, true, "Expense deleted Succesfully", expense)
            res.status(200).json(response)
        } catch (err) {
            console.log(err)
            next(internalServerError(false, "Something Went Wrong!"))
        }
    }
    const getExpenseDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { expense_id } = req.query
            const { id } = req.credentials
            const isExists = await expenses.findOne({
                where: { id: expense_id, user_id: id },
                include: [
                    {
                        model: expencesCategories,
                        attributes: ['id', 'category_name'],
                        required: false,
                        include: [{
                            model: expensesCategoriesForms,
                            attributes: ['id', 'category_form_name'],
                            required: false
                        }
                        ]
                    },
                    {
                        model: expencesPurpuse,
                        attributes: ['id', 'name'],
                        required: false
                    },
                    {
                        model: expencesApprovalStatus,
                        attributes: ['id', 'name', 'border_hex_color', 'button_hex_color'],
                        required: false
                    },
                    {
                        model: Documents,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ]
            })
            if (!isExists) {
                return next(notFound(false, 'Invalid expense id!'))
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
            const response = generateResponse(200, true, "Expense details fetched Succesfully", isExists)
            res.status(200).json(response)
        } catch (err) {
            return next(internalServerError(false, "Something Went Wrong!"))
        }
    }
    const getExpensesDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { from_date, to_date } = req.query
            const { id } = req.credentials
            const data = await expenses.findAll({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
                    [sequelize.col('expencesApprovalStatus.id'), 'status_id'],
                    [sequelize.col('expencesApprovalStatus.name'), 'name'],
                ],
                include: [
                    {
                        model: expencesApprovalStatus,
                        attributes: [], // To exclude other fields from ExpenseApprovalStatus
                    },
                ],
                where: {
                    user_id: id,
                    transaction_date: {
                        [Op.and]: [
                            { [Op.gte]: from_date },
                            { [Op.lte]: to_date }
                        ],
                    },
                },
                group: ['status_id'],
            })
            if (!data) {
                return next(notFound(false, 'Invalid expense id!'))
            }
            const totalExpense = data.reduce((accumulator, item) => {
                const amount = parseInt(item.dataValues.amount);
                return isNaN(amount) ? accumulator : accumulator + amount;
            }, 0);
            const meta = {
                totalExpenses: totalExpense
            }
            const response = generateResponse(200, true, "Expense details fetched Succesfully", data, meta)

            res.status(200).json(response)
        } catch (err) {
            return next(internalServerError(false, "Something Went Wrong!"))
        }
    }
    const updateApprovalStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await sequelize.transaction(async(t) => {

                const { expense_id } = req.query
                const { id } = req.credentials
                const isExists = await expenses.findOne({ where: { id: expense_id, status_id: 1, user_id: id } })
                if (!isExists) {
                    return next(notFound(false, 'Invalid expense id/already submited!'))
                }

                const expensesData = {
                    status_id: 2
                }

                const updatedExpense = await expenses.update(expensesData, { where: { id: expense_id } })


                const expense = await expenses.findByPk(parseInt(expense_id))

                const user = await User.findByPk(id, {
                    include: [
                        {
                            model: ReportingManagers, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: User, as: 'manager', attributes: ['id', 'employee_name'] },
                            { model: ReportingRole }]
                        }
                    ],
                    attributes: ['id', 'employee_name', 'date_of_joining'],
                    plain: true
                })

                const masterPolicy = await getMasterPolicy(id);

                const expenseWorkflow = masterPolicy.expense_workflow;

                const approvalWorkflow = await ApprovalFlow.findByPk(expenseWorkflow,
                    {
                        include: [
                            {
                                model: ReportingRole,
                                as: 'direct',
                                through: { attributes: [] },
                                include: [{
                                    model: ReportingManagers,
                                    // attributes: ['id', 'employee_name']
                                }]
                            },
                            {
                                model: ApprovalFlowType,
                            }
                        ]
                    }
                )

                const administrators = await User.findAll({
					where: {
						role_id: 1 //admin
					}
				})

                console.log("STATUS ID", expense)

                // if(status_id == 2){
                    if(expense){
                        console.log("EXPENSE", expense)
                        if (user?.Manager && user?.Manager.length > 0) {
                            if (approvalWorkflow?.approval_flow_type?.id === 2) {  //Sequential
                                console.log("SEQUENTIAL MEIN GAYA HAIN YEH")
                                const reportingManagers = user?.Manager as any[]
            
                                const sortedManagers = approvalWorkflow?.direct?.sort((a, b) => b.priority - a.priority);
                                const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
            
                                const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);
            
                                console.log("MIN PRIORITY MANAAGERSSS", minPriorityManagers)
                                console.log("MIN PRIORITYYYY", minPriority)
            
                                for (const manager of minPriorityManagers) {
                                    await Promise.all(
                                        manager?.reporting_managers.map(async (item) => {
                                            try {
                                                if (reportingManagers.some(manager => manager.id === item.id)) {
                                                    const expenseRequest = await ExpenseRequest.create({
                                                        expense_id: expense.id,
                                                        user_id: item.user_id,
                                                        status: 1,
                                                        priority: manager.priority
                                                    }, { transaction: t })
            
                                                    const notificationData = {
                                                        user_id: item.user_id,
                                                        title: 'Expense Request',
                                                        type: 'expense_request_creation',
                                                        description: `${user?.employee_name} has added an expense`,
                                                    }
            
                                                    const notification = await Notification.create(notificationData, { transaction: t })
            
                                                    await sendNotification(item.user_id, notification)
            
                                                    let data = {
                                                        user_id: item.user_id,
                                                        type: 'expense_request_creation',
                                                        message: `${user?.employee_name} has added an expense`,
                                                        path: 'expense_request_creation',
                                                        reference_id: expenseRequest?.id
                                                    }
            
                                                    console.log("HERE IS THE NOTFICATION PART!!!!")
                                                    await sendPushNotification(data)
                                                }
                                            } catch (err) {
                                                console.log(err)
                                            }
                                        })
                                    )
                                }
                                for(let admin of administrators){
                                    const AdminRegularizationRequest = await ExpenseRequest.create({
                                        expense_id: expense?.id,
                                        user_id: admin.id,
                                        status: 1,
                                        priority: 0 //Admin Priority
                                    }, {transaction: t})
                                }
                            } else if (approvalWorkflow?.approval_flow_type?.id === 1) { //Parallel
            
                                console.log("PARALLEL MEIN GAYA HAIN YEH!")
            
                                const reportingManagers = user?.Manager as any[]
            
                                const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id))
            
                                await Promise.all(
                                    filteredManagers.map(async (manager) => {
                                        const expenseRequest = await ExpenseRequest.create({
                                            expense_id: expense?.id,
                                            user_id: manager.user_id,
                                            status: 1,
                                            priority: 1
                                        }, { transaction: t })
                                        const notificationData = {
                                            user_id: manager.user_id,
                                            title: 'Expense Request',
                                            type: 'expense_request_creation',
                                            description: `${user?.employee_name} has added an expense`,
                                        }
            
                                        const notification = await Notification.create(notificationData, { transaction: t })
                                        await sendNotification(manager.id, notification)
            
                                        let data = {
                                            user_id: manager.user_id,
                                            type: 'expense_request_creation',
                                            message: `${user?.employee_name} has added an expense`,
                                            path: 'expense_request_creation',
                                            reference_id: expenseRequest?.id
                                        }
            
                                        await sendPushNotification(data)
                                    })
                                )
                                for(let admin of administrators){
                                    const AdminRegularizationRequest = await ExpenseRequest.create({
                                        expense_id: expense?.id,
                                        user_id: admin.id,
                                        status: 1,
                                        priority: 0 //Admin Priority
                                    }, {transaction: t})
                                }
                            }
                        }
                    }
                // }

                const response = generateResponse(200, true, "Expense Submited Succesfully!", updatedExpense)
                res.status(200).json(response)
                return
            })
        } catch (err) {
            next(internalServerError(false, "Something Went Wrong!"))
        }
    }

    const employeeSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { id } = req.credentials

            const user = await User.findByPk(id)

            if (user) {
                const approvedExpense = await expenses.findOne({
                    attributes: [
                        [sequelize.fn('SUM', sequelize.col('amount')), 'total_approved_amount']
                    ],
                    where: {
                        user_id: id,
                        status_id: 3 //Status id for approved expenses
                    }
                })

                const rejectedExpense = await expenses.findOne({
                    attributes: [
                        [sequelize.fn('SUM', sequelize.col('amount')), 'total_rejected_amount']
                    ],
                    where: {
                        user_id: id,
                        status_id: 5 //Status id for rejected expenses
                    }
                })

                const pendingExpense = await expenses.findOne({
                    attributes: [
                        [sequelize.fn('SUM', sequelize.col('amount')), 'total_pending_amount']
                    ],
                    where: {
                        user_id: id,
                        status_id: 2 //Status id for pending expenses.
                    }
                })

                const data = {
                    approvedExpense,
                    rejectedExpense,
                    pendingExpense
                }

                const response = generateResponse(200, true, "Data fetched succesfully!", data)
                res.status(200).json(response)
            } else {
                next(notFound("Cannot find user with that id!"))
            }
        } catch (err) {
            console.log("err: ", err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getTotalExpensesByMonth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.credentials
            const { year } = req.query;
            const startDate = moment(`${year}-01-01`).startOf('year').format('YYYY-MM-DD')
            const endDate = moment(startDate).endOf('year').format('YYYY-MM-DD')

            console.log(">>>>>>>>>", startDate, endDate)

            const user = await User.findByPk(id)

            const months = Array.from({ length: 12 }, (_, index) => index + 1);


            if (user) {

                const results = await expenses.findAll({
                    attributes: [
                        [sequelize.fn('MONTH', sequelize.col('transaction_date')), 'month'],
                        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
                    ],
                    where: {
                        user_id: id,
                        status_id: 3,
                        transaction_date: {
                            [Op.gte]: startDate,
                            [Op.lte]: endDate
                        }
                    },
                    group: [sequelize.fn('MONTH', sequelize.col('transaction_date')), sequelize.fn('YEAR', sequelize.col('transaction_date'))]
                })

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

                const response = generateResponse(200, true, "Data fetched succesfully!", data)
                res.status(200).json(response)

            } else {
                next(notFound("Cannot find a user with that id!"))
            }

        } catch (err) {
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getManagerExpenseList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
			const {id} = req.credentials
            const { page, records, sortBy, sortOrder, search_term, month, year } = req.query as { page: string, records: string, sortBy: string, sortOrder: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

			const manager = await ReportingManagers.findAll({
                where:{
                    user_id: id
                }
            })

			const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')

			let orderOptions = []

			if(sortBy && sortOrder){
				if(sortBy === 'employee_name'){
					orderOptions.push([{model: RegularizationRecord}, {model: User, as: 'Requester'}, 'employee_name', sortOrder]);
				}

				if(sortBy === 'date'){
					orderOptions.push([{model: RegularizationRecord}, 'date', sortOrder])
				}

				if(sortBy === 'request_status'){
					orderOptions.push([{model: RegularizationRecord}, 'request_status', sortOrder])
				}
			}


			// if(manager.length > 0){
				// const managerIds = manager.map(manager => manager.id); // Extract manager IDs from the array

            let whereOptions = {
                // reporting_manager_id: {[Op.in]: managerIds},
                user_id: id,
                status: 1
            }

            if(search_term){
                whereOptions[Op.or] = [
                    {
                        '$regularization_record.Requester.employee_name$': {
                            [Op.like]: `%${search_term}%`
                        }
                    }
                ];
            }

            let whereOptions2 = {}

            if(month && year){
                whereOptions2.date = {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }

            const expenseRequest = await ExpenseRequest.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: expenses,
                        where: whereOptions2,
                        attributes:{
                            exclude: ['createdAt', 'updatedAt']
                        },
                        include: [
                            {
                                model: expencesApprovalStatus,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            },
                            {
                                model: User,
                                attributes: ['id', 'employee_name'],
                            },
                            {
                                model: expencesPurpuse,
                                attributes: ['id', 'name']
                            },
                            {
                                model: Documents,
                            },
                            {
                                model: expencesCategories,
                                include: [
                                    {
                                        model: expensesCategoriesForms
                                    }
                                ]
                            },
                            {
                                model: expencesPurpuse
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
            })


            const processedRows = expenseRequest.rows.length > 0? 
            expenseRequest.rows
            : []

            const totalPages = Math.ceil(expenseRequest.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;


            const meta = {
                totalCount: expenseRequest.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: expenseRequest.rows,
                meta
            }

            const response = generateResponse(200, true, "Requests fetched succesfully!", processedRows, result.meta);
            res.status(200).json(response)
		}catch(err){
			console.log(err)
			next(internalServerError("Something went wrong!"))
		}
    }

    const approveExpenseRequest = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials

            const t = await sequelize.transaction()

            const requestId = req.params.id

            const user  = await User.findByPk(id);

            const manager = await ReportingManagers.findAll({
                where:{
                    user_id: id
                }
            })

            const managerIds = manager.map((item) => item.reporting_role_id)

            const managerUser = await User.findByPk(id)

            console.log("MANAGER USERRR", managerUser)
            
            const expenseRequest = await ExpenseRequest.findByPk(requestId);

            const expense = await expenses.findByPk(expenseRequest?.expense_id);
            
            const masterPolicy = await getMasterPolicy(expense?.user_id)

            const expenseWorkflow = masterPolicy.expense_workflow

            const approvalWorkflow = await ApprovalFlow.findByPk(expenseWorkflow, 
                {
                    include:[
                        {
                            model: ReportingRole,
                            as: 'direct',
                            through:{attributes:[]},
                            include: [{
                                model: ReportingManagers,
                            }]
                        },
                        {
                            model: ApprovalFlowType,
                        }
                    ]
                }
            )

            console.log("APPROVAL FLOW", approvalWorkflow)

            const reportingRoleIds = approvalWorkflow?.direct.map(item => item.id);

            const isManager = managerIds.some(id => reportingRoleIds.includes(id));

            if(user && manager && (isManager) && expenseRequest){

                const masterPolicy = await getMasterPolicy(expense?.user_id)

                const expenseWorkflow = masterPolicy.expense_workflow

                const approvalWorkflow = await ApprovalFlow.findByPk(expenseWorkflow)

                console.log(approvalWorkflow?.id)


                if(approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1){ //Parallel Approval Workflow

                    const expenseRequests = await ExpenseRequest.findAll({
                        where: {
                            expense_id: expense?.id,   
                        }
                    })

                    await Promise.all(
                        expenseRequests.map(async(request) => {
                            request.status = 2
                            await request.save({transaction: t})
                        })   
                    )

                    if(expense){
                        expense.status_id = 3 //Approved

                        // expense.last_action_by = user?.id

                        await expense.save({transaction: t})

                        await ExpenseRequestHistory.create({
                            expense_record_id: expense?.id,
                            user_id: id,
                            action: 'approved',
                            status_before: 2,
                            status_after: 3
                        })

                        const notification = await Notification.create({
                            user_id: expense?.user_id,
                            title: 'Expense Request',
                            type: 'expense_request_approval',
                            description: `${user?.employee_name} has succesfully approved your expense request`
                        }, {transaction: t})

                        await sendNotification(expense?.user_id, notification)

                        let data = {
                            user_id: expense?.user_id,
                            type: 'expense_request_approval',
                            message: `${user?.employee_name} has succesfully approved your expense request`,
                            path: 'expense_request_approval',
                            reference_id: expense?.id
                        }

                        await sendPushNotification(data)

                        await t.commit();

                        const response = generateResponse(200, true, "Expense Approved succesfully", expenseRequest);
                        res.status(200).json(response)
                    }

                }else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2){ //Sequential Workflow


                    const expenseRequest = await ExpenseRequest.findAll({
                        where:{
                            expense_id: expense?.id
                        }
                    })
                    
                    const user = await User.findByPk(expense?.user_id, {
                        include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']}, {model: ReportingRole}]}],
                        attributes:['id', 'employee_generated_id']
                    })
    
                    const masterPolicy = await getMasterPolicy(expense?.user_id);
    
                    const expenseWorkflow = masterPolicy.expense_workflow;
    
                    // const leaveType = await LeaveType.findByPk(leave_type_id);
    
                    const approvalWorkflow = await ApprovalFlow.findByPk(expenseWorkflow, 
                        {
                            include:[
                                {
                                    model: ReportingRole,
                                    as: 'direct',
                                    through:{attributes:[]},
                                    include: [{
                                        model: ReportingManagers,
                                    }]
                                },
                                {
                                    model: ApprovalFlowType,
                                }
                            ]
                        }
                    )
                    
                    const reportingManager = user?.Manager as any[]

                    const filteredManagers = reportingManager.filter(manager => {return approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id)})

                    console.log("APPROVAL FLOW MANAGERSSS", approvalWorkflow?.direct)

                    console.log("FILTERED MANAGERSSSS", filteredManagers)

                    console.log("REPORTING MANAGERSSS", reportingManager)

                    const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));

                    const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority)
    
                    const existingRequests = await ExpenseRequest.findAll({
                        where: {
                            expense_id: expense?.id,
                            priority: {
                                [Op.not]: 0
                            }
                        }
                    })

                    if(expense){
                        if(existingRequests.length > 0){
                            
                            const approvedManagerIds = existingRequests.map(request => request.user_id);
                            const remainingManagers = filteredManagers.filter(manager => !approvedManagerIds.includes(manager.user_id))

                            console.log("REMAINING MANAGERSSS", remainingManagers)

                            if(remainingManagers.length > 0){
                                const minPriority = Math.max(...remainingManagers.map(manager => manager.reporting_role.priority));
                                const minPriorityManagers = remainingManagers.filter(manager => manager.reporting_role.priority === minPriority);

                                console.log("MIN PRIORITY MANAGERSSSS", minPriorityManagers)


                                // expense.last_action_by = user?.id

                                await expense.save({transaction: t})

                                for(const manager of minPriorityManagers){
                                    await ExpenseRequest.create({
                                        expense_id: expense?.id,
                                        user_id: manager.id,
                                        status: 1,
                                        priority: manager.reporting_role.priority
                                    })
                                }
                                
                            }else{

                                // await expense.update({
                                //     last_action_by: user?.id
                                // }, {transaction: t})

                                console.log("FINAL APPROVAL!")
                                
                                await expense.update({
                                    status_id: 3
                                }, {
                                    where: {
                                        id: expense?.id
                                    }
                                })
                            }

                            await Promise.all(
                                existingRequests.map(async(request) => {
                                    await request.update({
                                        status: 2
                                    }, {transaction: t})
                                })
                            )

                            await ExpenseRequestHistory.create({
                                expense_record_id: expense?.id,
                                user_id: id,
                                action: 'approved',
                                status_before: 1,
                                status_after: 2
                            })

                            const notification = await Notification.create({
                                user_id: expense?.user_id,
                                title: 'Expense Request',
                                type: 'expense_request_approval',
                                description: `${user?.employee_name} has succesfully approved your expense request`
                            }, {transaction: t})

                            await sendNotification(expense?.user_id, notification)

                            let data = {
                                user_id: expense?.user_id,
                                type: 'expense_request_approval',
                                message: `${user?.employee_name} has succesfully approved your expense request`,
                                path: 'expense_request_approval',
                                reference_id: expense?.id
                            }
    
                            console.log("HERE IS THE NOTFICATION PART!!!!")
                            await sendPushNotification(data)

                            await t.commit();

                            const response = generateResponse(200, true, "Expense Approved succesfully", expenseRequest);
                            res.status(200).json(response)
                        }
                    }
                }
            }else{
                next(badRequest("You're not the authorized user to approve the leave!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const rejectExpenseRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials

            // const t = await sequelize.transaction()

            // const {reject_reason} = req.body

            const requestId = req.params.id

            const {comment} = req.body

            if(!comment){
                return next(badRequest("Please provide a reason for the rejection"))
            }

            const user  = await User.findByPk(id);

            const manager = await ReportingManagers.findAll({
                where:{
                    user_id: id
                }
            })
            
            const expenseRequest = await ExpenseRequest.findByPk(requestId);

            const expense = await expenses.findByPk(expenseRequest?.expense_id);

            const managerIds = manager?.map((item) => item.reporting_role_id)
            const managerUser = await User.findByPk(id)

            const masterPolicy = await getMasterPolicy(expense?.user_id)

            const expenseWorkflow = masterPolicy.expense_workflow

            // const baseLeaveConfiguration = await BaseLeaveConfiguration.findByPk(masterPolicy?.base_leave_configuration_id)

            // if(baseLeaveConfiguration?.leave_rejection_reason && !req.body.reject_reason){
            //     return next(badRequest("A reason for rejection is mandatory!"))
            // }


            const approvalWorkflow = await ApprovalFlow.findByPk(expenseWorkflow, 
                {
                    include:[
                        {
                            model: ReportingRole,
                            as: 'direct',
                            through:{attributes:[]},
                            include: [{
                                model: ReportingManagers,
                            }]
                        },
                        {
                            model: ApprovalFlowType,
                        }
                    ]
                }
            )

            const reportingRoleIds = approvalWorkflow?.direct.map(item => item.id);

            console.log(">>>>>>>>>", requestId)

			const isManager = managerIds.some(id => reportingRoleIds.includes(id));


            if(user && manager && (isManager) && expenseRequest){
                await sequelize.transaction(async(t) => {

                    const masterPolicy = await getMasterPolicy(expense?.user_id)

                    const expenseWorkflow = masterPolicy.expense_workflow

                    const approvalWorkflow = await ApprovalFlow.findByPk(expenseWorkflow)

                    if(approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1){ //Parallel Workflow

                        const expenseRequests = await ExpenseRequest.findAll({
                            where: {
                                expense_id: expense?.id,   
                            }
                        })

                        await Promise.all(
                            expenseRequests.map(async(request) => {
                                request.status = 3 //Rejected
                                await request.save({transaction: t})
                            })   
                        )

                        if(expense){

                            expense.status_id = 5 //Rejection
                            expense.comment = comment
                            // leaveRecord.last_action_by = user.id

                            await expense.save({transaction: t})
                            const response = generateResponse(200, true, "Leave Rejected succesfully", expenseRequest);
                            res.status(200).json(response)
                        }

                        const notification = await Notification.create({
                            user_id: expense?.user_id,
                            title: 'Expense Request',
                            type: 'expense_request_rejection',
                            description: `${managerUser?.employee_name} has rejected your expense request`
                        }, {transaction: t})
    
                        await sendNotification(expense?.id, notification)

                        let data = {
                            user_id: expense?.user_id,
                            type: 'expense_request_rejection',
                            message: `${managerUser?.employee_name} has rejected your expense request`,
                            path: 'expense_request_rejection',
                            reference_id: expense?.id
                        }

                        await sendPushNotification(data)

                    }else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2){ //Sequential Workflow
                        const expenseRequests = await ExpenseRequest.findAll({
                            where: {
                                expense_id: expense?.id,   
                            }
                        })

                        await Promise.all(
                            expenseRequests.map(async(request) => {
                                request.status = 3 //Rejection
                                await request.save({transaction: t})
                            })   
                        )

                        if(expense){

                            expense.status_id = 5 //Rejection
                            expense.comment = comment

                            // leaveRecord.last_action_by = user.id

                            await expense.save({transaction: t})

                            const notification = await Notification.create({
                                user_id: expense?.user_id,
                                title: 'Expense Request',
                                type: 'expense_request_rejection',
                                description: `${managerUser?.employee_name} has rejected your expense request`
                            }, {transaction: t})
        
                            await sendNotification(expense?.id, notification)

                            let data = {
                                user_id: expense?.user_id,
                                type: 'expense_request_rejection',
                                message: `${managerUser?.employee_name} has rejected your expense request`,
                                path: 'expense_request_rejection',
                                reference_id: expense?.id
                            }
    
                            await sendPushNotification(data)

                            const response = generateResponse(200, true, "Leave Rejected succesfully", expenseRequest);
                            res.status(200).json(response)
                        }   
                    }
                })
            }else{
                next(unauthorized("You don't have the access role to view this resource!"))
            }
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getManagerExpensesSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            
            const {id} = req.credentials

            const months = Array.from({ length: 12 }, (_, index) => index + 1);

            const year = moment().year()

            const startDate = moment(`${year}-01-01`).startOf('year').format('YYYY-MM-DD')
            const endDate = moment(startDate).endOf('year').format('YYYY-MM-DD')

            const manager = await ReportingManagers.findAll({
                where: {
                    user_id: id
                },
                include: [
                    {
                        model: User,
                        as: 'Employees',
                        attributes: ['id', 'employee_name'],
                        through: {attributes: []}
                    }
                ]
            })


            if(manager && manager.length > 0){

                const managerIds = manager.map((item) => item.user_id)


                const expensesList = await ExpenseRequest.findAll({
                    where: {
                        user_id: {
                            [Op.in]: managerIds
                        }
                    },
                    include: [
                        {
                            model: expenses
                        }
                    ]
                })
                
                let approved = 0
                let rejected = 0
                let pending = 0
    
                for(const expense of expensesList){
                    const amount = expense.expense.amount;
                    if(expense.status == 2){  //Status for Approval
                        approved += amount;
                    }else if(expense.status == 3){
                        rejected += amount;
                    }else if(expense.status == 1){
                        pending += amount;
                    }
                }
    

                const flattenedEmployees = manager.reduce((acc, curr) => {
                    return acc.concat(curr.Employees);
                }, []);

                let array = []

                for(const user of flattenedEmployees){
                    const masterPolicy = await getMasterPolicy(user.id)
                    const expenseWorkflow = await ApprovalFlow.findByPk(masterPolicy?.expense_workflow, {
                        include: [
                            {
                                model: ReportingRole,
                                as: 'direct',
                                include: [
                                    {
                                        model: ReportingManagers,
                                        where: {
                                            user_id: id
                                        },
                                        required: true,
                                    }
                                ]
                            }
                        ]
                    })
                    if(expenseWorkflow && expenseWorkflow.direct.some(role => role.reporting_managers.length > 0 )){
                        array.push(user)
                    }
                }


                const ids = array.map(obj => obj.id)

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

                const results = await ExpenseRequest.findAll({
                    where: {
                        status: 2,
                        user_id: managerIds
                    },
                    attributes: [
                        [sequelize.fn('MONTH', sequelize.col('transaction_date')), 'month'],
                        [sequelize.fn('SUM', sequelize.col('expense.amount')), 'total_amount'],
                    ],
                    include: [{
                        model: expenses,
                        attributes: [],
                        where: { 
                            transaction_date: { [Op.between]: [startDate, endDate] },
                        }, // Filter by approved expenses,
                    }],
                    group: [sequelize.fn('MONTH', sequelize.col('transaction_date')), sequelize.fn('YEAR', sequelize.col('transaction_date'))],
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
                }

                const response = generateResponse(200, true, "Data fetched succesfully!", responseBody)
                res.status(200).json(response)

            }else{
                next(badRequest("There is no reprting manager with that id!"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getAdminExpensesRequests = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{
            const {id} = req.credentials
            const { page, records, sortBy, sortOrder, search_term, month, year, status } = req.query as { page: string, records: string, sortBy: string, sortOrder: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

			// const manager = await ReportingManagers.findAll({
            //     where:{
            //         user_id: id
            //     }
            // })

			const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')

			let orderOptions = []

			if(sortBy && sortOrder){
				if(sortBy === 'employee_name'){
					orderOptions.push([{model: RegularizationRecord}, {model: User, as: 'Requester'}, 'employee_name', sortOrder]);
				}

				if(sortBy === 'date'){
					orderOptions.push([{model: RegularizationRecord}, 'date', sortOrder])
				}

				if(sortBy === 'request_status'){
					orderOptions.push([{model: RegularizationRecord}, 'request_status', sortOrder])
				}
			}



            let whereOptions = {
                // reporting_manager_id: {[Op.in]: managerIds},
                // user_id: id,
                // status: 1
            }

            if(search_term){
                whereOptions[Op.or] = [
                    {
                        '$expense.expense_requester.employee_name$': {
                            [Op.like]: `%${search_term}%`
                        }
                    }
                ];
            }

            let whereOptions2 = {}

            if(month && year){
                whereOptions2.date = {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }

            if(status && status !== "null"){
                whereOptions.status_id = status
            }

            const expenseRequest = await expenses.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: expencesApprovalStatus,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: User,
                        attributes: ['id', 'employee_name'],
                    },
                    {
                        model: expencesPurpuse,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Documents,
                    },
                    {
                        model: expencesCategories,
                        include: [
                            {
                                model: expensesCategoriesForms
                            }
                        ]
                    },
                    {
                        model: expencesPurpuse
                    },
                    {
                        model: ExpenseRequestHistory,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'employee_name'],
                                required: false
                            }
                        ]
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                offset: offset,
                limit: recordsPerPage,
                order: orderOptions
            })


            const processedRows = expenseRequest.rows.length > 0? 
            expenseRequest.rows
            : []

            const totalPages = Math.ceil(expenseRequest.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;


            const meta = {
                totalCount: expenseRequest.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: expenseRequest.rows,
                meta
            }

            const response = generateResponse(200, true, "Requests fetched succesfully!", processedRows, result.meta);
            res.status(200).json(response)
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getAdminExpensesRecords = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const {id} = req.credentials

            const user = await User.findByPk(id)

            if(!user){
                next(notFound("User not found with that id!"))
            }

            if(user.role_id !== 1){
                next(forbiddenError("You don't have administrator rights to access this resource"))
            }

            const { page, records, sortBy, sortOrder, search_term, month, year, status } = req.query as { page: string, records: string, sortBy: string, sortOrder: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

			// const manager = await ReportingManagers.findAll({
            //     where:{
            //         user_id: id
            //     }
            // })

			const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')

			let orderOptions = []

			if(sortBy && sortOrder){
				if(sortBy === 'employee_name'){
					orderOptions.push([{model: RegularizationRecord}, {model: User, as: 'Requester'}, 'employee_name', sortOrder]);
				}

				if(sortBy === 'date'){
					orderOptions.push([{model: RegularizationRecord}, 'date', sortOrder])
				}

				if(sortBy === 'request_status'){
					orderOptions.push([{model: RegularizationRecord}, 'request_status', sortOrder])
				}
			}



            let whereOptions = {
            }

            if(search_term){
                whereOptions[Op.or] = [
                    {
                        '$regularization_record.Requester.employee_name$': {
                            [Op.like]: `%${search_term}%`
                        }
                    }
                ];
            }

            let whereOptions2 = {}

            if(month && year){
                whereOptions2.date = {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }

            if(status && status !== "null"){
                whereOptions.status = status
            }

            const expenseRequest = await expenses.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: expencesApprovalStatus,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: User,
                        attributes: ['id', 'employee_name'],
                    },
                    {
                        model: expencesPurpuse,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Documents,
                    },
                    {
                        model: expencesCategories,
                        include: [
                            {
                                model: expensesCategoriesForms
                            }
                        ]
                    },
                    {
                        model: expencesPurpuse
                    },
                    {
                        model: ExpenseRequestHistory,
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                offset: offset,
                limit: recordsPerPage,
                order: orderOptions
            })


            const processedRows = expenseRequest.rows.length > 0? 
            expenseRequest.rows
            : []

            const totalPages = Math.ceil(expenseRequest.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;


            const meta = {
                totalCount: expenseRequest.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: expenseRequest.rows,
                meta
            }

            const response = generateResponse(200, true, "Requests fetched succesfully!", processedRows, result.meta);
            res.status(200).json(response)

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const adminExpenseRequestApproval = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const {id} = req.credentials

            const requestId = req.params.id

            console.log("Request Id: ", requestId)

            const user = await User.findByPk(id)

            if(!user){
                next(notFound("User not found with that id!"))
            }

            if(user.role_id !== 1){
                next(forbiddenError("You don't have administrator rights to access this resource"))
            }

            const expenseRecord = await expenses.findByPk(requestId)

			const expenseRequest = await ExpenseRequest.findOne({
                where: {
                    expense_id: expenseRecord.id,
                    user_id: id,
                    status: 1
                }
            })

			if(!expenseRecord){
				next(notFound("Cannot find expense record"))
			}

            if(!expenseRequest){
                next(notFound("Cannot find request with that id!"))
            }

			const expenseRequests = await ExpenseRequest.findAll({
				where: {
					expense_id: expenseRecord?.id,   
				}
			})

			await sequelize.transaction(async(t) => {

				// await Promise.all(
				// 	expenseRequests.map(async(request) => {
				// 		// await ExpenseRequest.destroy({
                //         //     where: {
                //         //         id: request?.expense_id,
                //         //         priority: {
                //         //             [Op.ne]: 0
                //         //         }
                //         //     },
                //         //     transaction: t
                //         // })
				// 		request.status = 2
				// 		await request.save({transaction: t})
				// 	})   
				// )

                expenseRequest.status = 2
                await expenseRequest?.save({transaction: t})

				if(expenseRecord){

                    expenseRecord.status_id = 3 //Approved

                    expenseRecord.last_action_by = user?.id

                    await expenseRecord.save({transaction: t})

                    await ExpenseRequestHistory.create({
                        expense_record_id: expenseRecord?.id,
                        user_id: id,
                        action: 'approved',
                        status_before: 2,
                        status_after: 3
                    }, {transaction: t})

					const notification = await Notification.create({
						user_id: expenseRecord?.user_id,
						title: 'Expense Request',
						type: 'expense_request_approval',
						description: `${user?.employee_name} has approved your expense request`
					}, {transaction: t})

					await sendNotification(expenseRecord?.user_id, notification)

					let data = {
						user_id: expenseRecord?.user_id,
						type: 'expense_request_approval',
						message:`${user?.employee_name} has approved your expense request`,
						path: 'expense_request_approval',
						reference_id: expenseRecord?.id
					}

					await sendPushNotification(data)

					const response = generateResponse(200, true, "Expense Approved succesfully", expenseRequest);
					res.status(200).json(response)
				}
			})
            
        }catch(err){
            console.log("err: ", err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const adminExpenseRequestRejection = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const {id} = req.credentials

            const requestId = req.params.id

            const user = await User.findByPk(id)

            if(!user){
                next(notFound("User not found with that id!"))
            }

            if(user.role_id !== 1){
                next(forbiddenError("You don't have administrator rights to access this resource"))
            }

            const expenseRequest = await ExpenseRequest.findByPk(requestId)

			const expenseRecord = await expenses.findByPk(expenseRequest.expense_id)

			if(!expenseRecord){
				next(notFound("Cannot find expense request"))
			}

			const expenseRequests = await ExpenseRequest.findAll({
				where: {
					expense_id: expenseRecord?.id,   
				}
			})

			await sequelize.transaction(async(t) => {

				// await Promise.all(
				// 	expenseRequests.map(async(request) => {
				// 		await expenses.destroy({
                //             where: {
                //                 id: request?.expense_id,
                //                 priority: {
                //                     [Op.ne]: 0
                //                 }
                //             },
                //             transaction: t
                //         })
				// 		// request.status = 2
				// 		// await request.save({transaction: t})
				// 	})   
				// )

                expenseRequest.status = 3
                await expenseRequest?.save({transaction: t})

				if(expenseRecord){

                    expenseRecord.status_id = 5 //Rejected

                    expenseRecord.last_action_by = user?.id

                    await expense.save({transaction: t})

                    await ExpenseRequestHistory.create({
                        expense_record_id: expense?.id,
                        user_id: id,
                        action: 'rejected',
                        status_before: 2,
                        status_after: 5
                    })

					const notification = await Notification.create({
						user_id: expenseRecord?.user_id,
						title: 'Expense Request',
						type: 'expense_request_rejection',
						description: `${user?.employee_name} has rejected your expense request`
					}, {transaction: t})

					await sendNotification(regularisationRecord?.user_id, notification)

					let data = {
						user_id: expenseRecord?.user_id,
						type: 'expense_request_rejection',
						message:`${user?.employee_name} has rejected your expense request`,
						path: 'expense_request_rejected',
						reference_id: expenseRecord?.id
					}

					await sendPushNotification(data)

					const response = generateResponse(200, true, "Expense Rejected succesfully", expenseRequest);
					res.status(200).json(response)
				}
			})
           
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

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
        getManagerExpensesSummary,
        getAdminExpensesRequests,
        getAdminExpensesRecords,
        adminExpenseRequestApproval,
        adminExpenseRequestRejection
    }
}