"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const models_1 = require("../../models");
const db_1 = require("../../utilities/db");
const peersLeaveRecord_1 = __importDefault(require("../../models/peersLeaveRecord"));
const response_1 = require("../../services/response/response");
const BadRequest_1 = require("../../services/error/BadRequest");
const approval_1 = __importDefault(require("../../models/dropdown/status/approval"));
const reportingManagers_1 = __importDefault(require("../../models/reportingManagers"));
const getMasterPolicy_1 = require("../../services/masterPolicy/getMasterPolicy");
const approvalFlow_1 = __importDefault(require("../../models/approvalFlow"));
const reportingRole_1 = __importDefault(require("../../models/reportingRole"));
const leaveRequest_1 = __importDefault(require("../../models/leaveRequest"));
const approvalFlowType_1 = __importDefault(require("../../models/dropdown/type/approvalFlowType"));
const Unauthorized_1 = require("../../services/error/Unauthorized");
const moment_1 = __importDefault(require("moment"));
const Forbidden_1 = require("../../services/error/Forbidden");
const dayType_1 = __importDefault(require("../../models/dropdown/dayType/dayType"));
const notification_1 = __importDefault(require("../../models/notification"));
const sendNotification_1 = require("../../services/notification/sendNotification");
const NotFound_1 = require("../../services/error/NotFound");
const holidayCalendar_1 = __importDefault(require("../../models/holidayCalendar"));
const holidayDatabase_1 = __importDefault(require("../../models/holidayDatabase"));
const baseLeaveConfiguration_1 = __importDefault(require("../../models/baseLeaveConfiguration"));
const notificationService_1 = require("../../services/pushNotification/notificationService");
///Function to check if a leave is overlapping or not
const isLeaveRecordOverlap = async (userId, startDate, endDate, recordId) => {
    const whereCondition = {
        user_id: userId,
        status: {
            [sequelize_1.Op.not]: 3
        },
        [sequelize_1.Op.or]: [
            {
                start_date: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
            },
            {
                end_date: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
            },
            {
                // Check if the specified date range falls within existing leave record range
                start_date: startDate,
                end_date: endDate
            }
        ],
    };
    if (recordId) {
        whereCondition.id = {
            [sequelize_1.Op.ne]: recordId
        };
    }
    const overlappingRecord = await models_1.LeaveRecord.findOne({
        where: whereCondition
    });
    return !!overlappingRecord;
};
const LeaveController = (model) => {
    const { create, destroy, update, getAllDropdown, getById } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next) => {
        try {
            const { page, records } = req.query;
            const { status } = req.query;
            if (!page && !records) {
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const { id } = req.credentials;
            let whereOptions = {
                user_id: id
            };
            if (status) {
                const statusFilters = status.split(',');
                whereOptions.status = {
                    [sequelize_1.Op.in]: statusFilters
                };
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const data = await model.findAndCountAll({
                where: whereOptions,
                include: [
                    { model: approval_1.default, attributes: ['id', 'name'] },
                    { model: models_1.LeaveType, attributes: ['id', 'leave_type_name'] },
                    { model: dayType_1.default, attributes: ['id', 'name'] }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                offset: offset,
                limit: recordsPerPage,
                order: [['id', 'DESC']]
            });
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
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something Went Wrong!"));
        }
    };
    const apply = async (req, res, next) => {
        try {
            // const t = await sequelize.transaction()
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            if (user) {
                const employee_id = id;
                const { leave_type_id, day_type_id, half_day_type_id, start_date, end_date, reason, document, contact_number } = req.body;
                const status = 1;
                const user_id = employee_id;
                const leaveRecordBody = {
                    user_id,
                    leave_type_id,
                    day_type_id,
                    half_day_type_id,
                    start_date,
                    end_date,
                    reason,
                    document,
                    contact_number,
                    status
                };
                const user = await models_1.User.findByPk(user_id, {
                    include: [
                        { model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] },
                                { model: reportingRole_1.default }] }
                    ],
                    attributes: ['id', 'employee_name', 'date_of_joining'],
                    plain: true
                });
                const currentStartMonth = (0, moment_1.default)().startOf('month');
                const currentEndMonth = (0, moment_1.default)().endOf('month');
                const leaveRecordsInCurrentMonth = await models_1.LeaveRecord.findAll({
                    where: {
                        user_id: id,
                        status: {
                            [sequelize_1.Op.not]: 3
                        },
                        [sequelize_1.Op.or]: [
                            {
                                start_date: { [sequelize_1.Op.between]: [currentStartMonth, currentEndMonth] }
                            },
                            {
                                end_date: { [sequelize_1.Op.between]: { [sequelize_1.Op.between]: [currentStartMonth, currentEndMonth] } }
                            },
                            {
                                [sequelize_1.Op.and]: [
                                    { start_date: { [sequelize_1.Op.lt]: currentStartMonth } },
                                    { end_date: { [sequelize_1.Op.gt]: currentEndMonth } }
                                ]
                            }
                        ]
                    }
                });
                console.log("LEAVE RECORDSS", leaveRecordsInCurrentMonth);
                const totalLeaveDaysInMonth = leaveRecordsInCurrentMonth.reduce((totalDays, leaveRecord) => {
                    return totalDays + (0, moment_1.default)(leaveRecord.end_date).diff((0, moment_1.default)(leaveRecord.start_date), 'days') + 1;
                }, 0);
                console.log("TOTAL LEAVES DAYS IN MONTH", totalLeaveDaysInMonth);
                const leaveRequestDuration = (0, moment_1.default)(end_date).diff((0, moment_1.default)(start_date), 'days') + 1;
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                const leaveWorkflow = masterPolicy.leave_workflow;
                const leaveType = await models_1.LeaveType.findByPk(leave_type_id);
                const noticeDays = leaveType?.notice_for_application;
                const isAfterNotice = (0, moment_1.default)(start_date).isSameOrAfter((0, moment_1.default)().add(noticeDays, 'days'));
                if (!leaveType?.allow_half_days && day_type_id === 1) {
                    return next((0, BadRequest_1.badRequest)("Half days are not allowed for this leave type!"));
                }
                if (noticeDays && !isAfterNotice) {
                    return next((0, BadRequest_1.badRequest)(`You need to give atleast ${noticeDays} days of notice`));
                }
                const approvalWorkflow = await approvalFlow_1.default.findByPk(leaveWorkflow, {
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
                console.log("APPROVAL WORKFLOW>>>>>>>>>>>>>>>>>>>>", approvalWorkflow);
                const leaveBalance = await models_1.LeaveBalance.findOne({
                    where: {
                        user_id: id,
                        leave_type_id: leave_type_id
                    }
                });
                let startDate;
                let endDate;
                if (day_type_id == 1) {
                    startDate = (0, moment_1.default)(start_date);
                    endDate = (0, moment_1.default)(start_date);
                }
                else {
                    startDate = (0, moment_1.default)(start_date);
                    endDate = (0, moment_1.default)(end_date);
                }
                const maximumDaysOfLeaveAllowed = leaveType?.max_days_per_leave;
                const backDatedDays = leaveType?.limit_back_dated_application;
                const minimumdate = (0, moment_1.default)().subtract(backDatedDays, 'days');
                const leaveStartDate = (0, moment_1.default)(start_date);
                console.log("MINIMUM DATEEE>>>>>>>>>", minimumdate);
                const maximumDaysOfLeaveAllowedInNegative = leaveType?.negative_balance;
                console.log("MAXXXIMUMM DAYS OF LEAVE ALLOWED", maximumDaysOfLeaveAllowed);
                const dateOfJoining = (0, moment_1.default)(user?.date_of_joining);
                const isBeforeDateOfJoining = (0, moment_1.default)(start_date).isSameOrBefore(dateOfJoining);
                console.log(">>>>>>>>>>>>>>>>>", isBeforeDateOfJoining, (0, moment_1.default)(start_date), dateOfJoining, user?.date_of_joining);
                if (isBeforeDateOfJoining) {
                    return next((0, Forbidden_1.forbiddenError)("You cannot apply for leave before your joining date!"));
                }
                let durationInDays;
                if (day_type_id == 1) {
                    durationInDays = 0.5;
                }
                else {
                    console.log("IDHAR GAYA");
                    durationInDays = (0, moment_1.default)(endDate).diff(startDate, 'days') + 1;
                    console.log("HAHSHSADHASKDAS>>>>>>>>>", durationInDays, endDate, startDate);
                }
                console.log("DURATION>>>>>>>>>>>>>>>", durationInDays);
                const overlappingLeave = await isLeaveRecordOverlap(id, start_date, end_date);
                console.log("OVERLAPPING LEAVE", overlappingLeave);
                if (overlappingLeave) {
                    next((0, Forbidden_1.forbiddenError)("A leave for these dates are already applied"));
                }
                let leaveRecord;
                console.log("IS IT?", durationInDays <= leaveBalance?.leave_balance);
                if (leaveBalance && !overlappingLeave) {
                    await db_1.sequelize.transaction(async (t) => {
                        if (totalLeaveDaysInMonth + leaveRequestDuration > leaveType?.max_days_per_month) {
                            return next((0, BadRequest_1.badRequest)("You've used all the leave requests that are allowed in a month!"));
                        }
                        else {
                            if (!leaveStartDate.isAfter(minimumdate.toDate())) {
                                next((0, BadRequest_1.badRequest)(`You cannot apply leaves for any date beyond ${minimumdate.format('YYYY-MM-DD')}`));
                            }
                            else {
                                if (durationInDays > leaveBalance?.leave_balance) {
                                    console.log("THE CODE IS HERE!");
                                    if (leaveType?.negative_balance) {
                                        console.log(">>>>>>>>>>>>>>>>>>>>>>>NEGATIVE BALANCE IS ALLOWED");
                                        if (leaveType?.max_leave_allowed_in_negative_balance >= (durationInDays - leaveBalance?.leave_balance)) {
                                            console.log(">>>>>>>>>>>>>>>>>>>MAX LEAVE IS GREATER THAN THE LEAVE APPLIED FOR!");
                                            leaveRecord = await models_1.LeaveRecord.create(leaveRecordBody, { transaction: t });
                                            console.log("LEAVE RECORD!!!", leaveRecord);
                                            if (leaveRecord) {
                                                const balance = leaveBalance?.leave_balance - durationInDays;
                                                await leaveBalance?.update({
                                                    leave_balance: balance
                                                }, { transaction: t });
                                                // leaveBalance?.leave_balance = leaveBalance?.leave_balance - durationInDays
                                                // await leaveRecord.save({transaction: t})
                                            }
                                        }
                                        else {
                                            console.log(">>>>>>>", leaveType?.max_leave_allowed_in_negative_balance, (durationInDays - leaveBalance?.leave_balance), durationInDays);
                                            next((0, Forbidden_1.forbiddenError)("Insufficient leave balance"));
                                        }
                                    }
                                    else {
                                        next((0, Forbidden_1.forbiddenError)("Insufficient leave balance"));
                                    }
                                }
                                else if (durationInDays <= leaveBalance?.leave_balance) {
                                    if (durationInDays <= maximumDaysOfLeaveAllowed) {
                                        console.log(">>>>>>>>>>>>>>>>>>>>>>>>..IT IS SUFFICIENT!");
                                        leaveRecord = await models_1.LeaveRecord.create(leaveRecordBody, { transaction: t });
                                        console.log("HERHE IS CREATED,", leaveRecord);
                                        if (leaveRecord) {
                                            const balance = leaveBalance.leave_balance - durationInDays;
                                            await leaveBalance.update({
                                                leave_balance: balance
                                            });
                                            // leaveRecord.leave_balance = leaveRecord.leave_balance - durationInDays
                                            // await leaveRecord.save({transaction: t})
                                        }
                                    }
                                    else {
                                        next((0, Forbidden_1.forbiddenError)(`You can only apply for leaves upto, ${maximumDaysOfLeaveAllowed} days`));
                                    }
                                }
                            }
                            if (leaveRecord) {
                                console.log("HAAN DIRECTLY IDHAR AAYA HAIN !");
                                if (user?.Manager && user?.Manager.length > 0) {
                                    console.log("Manager: ", user?.Manager);
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
                                                        const leaveRequest = await leaveRequest_1.default.create({
                                                            leave_record_id: leaveRecord?.id,
                                                            reporting_manager_id: item.id,
                                                            status: 1,
                                                            priority: manager.priority
                                                        }, { transaction: t });
                                                        const notificationData = {
                                                            user_id: item.user_id,
                                                            title: 'Leave Request',
                                                            type: 'leave_request_creation',
                                                            description: `${user?.employee_name} has applied for leave`,
                                                        };
                                                        const notification = await notification_1.default.create(notificationData, { transaction: t });
                                                        await (0, sendNotification_1.sendNotification)(item.user_id, notification);
                                                        let data = {
                                                            user_id: item.user_id,
                                                            type: 'leave_request_creation',
                                                            message: `${user?.employee_name} has applied for leave`,
                                                            path: 'leave_request_creation',
                                                            reference_id: leaveRequest?.id
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
                                            const leaveRequest = await leaveRequest_1.default.create({
                                                leave_record_id: leaveRecord?.id,
                                                reporting_manager_id: manager.id,
                                                status: 1,
                                                priority: 1
                                            }, { transaction: t });
                                            const notificationData = {
                                                user_id: manager.user_id,
                                                title: 'Leave Request',
                                                type: 'leave_request_creation',
                                                description: `${user?.employee_name} has applied for leave`,
                                            };
                                            const notification = await notification_1.default.create(notificationData, { transaction: t });
                                            await (0, sendNotification_1.sendNotification)(manager.id, notification);
                                            let data = {
                                                user_id: manager.user_id,
                                                type: 'leave_request_creation',
                                                message: `${user?.employee_name} has applied for leave`,
                                                path: 'leave_request_creation',
                                                reference_id: leaveRequest?.id
                                            };
                                            console.log("HERE IS THE NOTFICATION PART!!!!");
                                            await (0, notificationService_1.sendPushNotification)(data);
                                        }));
                                    }
                                }
                                const peer_user_id = req.body.peer_user_id || [];
                                const leave_record_id = leaveRecord?.id;
                                if (peer_user_id.length > 0) {
                                    for (const peerUserId of peer_user_id) {
                                        const peerLeaveRecordFormBody = {
                                            leave_record_id,
                                            'peer_user_id': peerUserId
                                        };
                                        const peerLeaveRecordRelationship = await peersLeaveRecord_1.default.create(peerLeaveRecordFormBody, { transaction: t });
                                    }
                                }
                                // await t.commit()
                                const response = (0, response_1.generateResponse)(201, true, "Record created succesfully!", leaveRecord);
                                res.status(201).json(response);
                            }
                        }
                    });
                }
                else {
                    next((0, Forbidden_1.forbiddenError)("Insufficient Leave Balance"));
                }
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find user with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something Went Wrong!"));
        }
    };
    const approve = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.credentials;
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
                const leaveRequest = await leaveRequest_1.default.findByPk(requestId);
                const leaveRecord = await models_1.LeaveRecord.findByPk(leaveRequest?.leave_record_id);
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(leaveRecord?.user_id);
                const leaveWorkflow = masterPolicy.leave_workflow;
                const approvalWorkflow = await approvalFlow_1.default.findByPk(leaveWorkflow, {
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
                const isManager = managerIds.some(id => reportingRoleIds.includes(id));
                if (user && manager && (isManager) && leaveRequest) {
                    console.log("HELLO");
                    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(leaveRecord?.user_id);
                    const leaveWorkflow = masterPolicy.leave_workflow;
                    const approvalWorkflow = await approvalFlow_1.default.findByPk(leaveWorkflow);
                    console.log(approvalWorkflow?.id);
                    if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1) { //Parallel Approval Workflow
                        const leaveRequests = await leaveRequest_1.default.findAll({
                            where: {
                                leave_record_id: leaveRecord?.id,
                            }
                        });
                        await Promise.all(leaveRequests.map(async (request) => {
                            request.status = 2;
                            await request.save({ transaction: t });
                        }));
                        if (leaveRecord) {
                            console.log("LEAVE RECORD FOUND!>>>>>>>>>>>>>>>");
                            // leaveRecord.status = 2
                            // leaveRecord.last_action_by = user?.id
                            await leaveRecord.update({
                                status: 2,
                                last_action_by: user?.id
                            }, { transaction: t });
                            const approverManager = await models_1.User.findByPk(id, {
                                attributes: ['id', 'employee_name']
                            });
                            const notification = await notification_1.default.create({
                                user_id: leaveRecord?.user_id,
                                title: 'Leave Request',
                                type: 'leave_request_approval',
                                description: `${approverManager?.employee_name} has succesfully approved your leave request`
                            }, { transaction: t });
                            await (0, sendNotification_1.sendNotification)(user?.id, notification);
                            let data = {
                                user_id: leaveRecord?.user_id,
                                type: 'leave_request_approval',
                                message: `${user?.employee_name} has succesfully approved your leave request`,
                                path: 'leave_request_approval',
                                reference_id: leaveRecord?.id
                            };
                            console.log("HERE IS THE NOTFICATION PART!!!!");
                            await (0, notificationService_1.sendPushNotification)(data);
                            const response = (0, response_1.generateResponse)(200, true, "Leave Approved succesfully", leaveRequest);
                            res.status(200).json(response);
                        }
                    }
                    else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2) { //Sequential Workflow
                        const leaveRequest = await leaveRequest_1.default.findAll({
                            where: {
                                leave_record_id: leaveRecord?.id
                            }
                        });
                        const user = await models_1.User.findByPk(leaveRecord?.user_id, {
                            include: [{ model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] }, { model: reportingRole_1.default }] }],
                            attributes: ['id', 'employee_generated_id', 'employee_name']
                        });
                        const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(leaveRecord?.user_id);
                        const leaveWorkflow = masterPolicy.leave_workflow;
                        // const leaveType = await LeaveType.findByPk(leave_type_id);
                        const approvalWorkflow = await approvalFlow_1.default.findByPk(leaveWorkflow, {
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
                        const existingRequests = await leaveRequest_1.default.findAll({
                            where: {
                                leave_record_id: leaveRecord?.id,
                            }
                        });
                        if (leaveRecord) {
                            if (existingRequests.length > 0) {
                                const approvedManagerIds = existingRequests.map(request => request.reporting_manager_id);
                                const remainingManagers = filteredManagers.filter(manager => !approvedManagerIds.includes(manager.id));
                                console.log("REMAINING MANAGERSSS", remainingManagers);
                                if (remainingManagers.length > 0) {
                                    const minPriority = Math.max(...remainingManagers.map(manager => manager.reporting_role.priority));
                                    const minPriorityManagers = remainingManagers.filter(manager => manager.reporting_role.priority === minPriority);
                                    console.log("MIN PRIORITY MANAGERSSSS", minPriorityManagers);
                                    leaveRecord.last_action_by = user?.id;
                                    await leaveRecord.save({ transaction: t });
                                    for (const manager of minPriorityManagers) {
                                        await leaveRequest_1.default.create({
                                            leave_record_id: leaveRecord?.id,
                                            reporting_manager_id: manager.id,
                                            status: 1,
                                            priority: manager.reporting_role.priority
                                        }, { transaction: t });
                                    }
                                }
                                else {
                                    await leaveRecord.update({
                                        status: 2,
                                        last_action_by: user?.id
                                    }, { transaction: t });
                                    // await LeaveRecord.update({
                                    //     status: 2
                                    // }, {
                                    //     where: {
                                    //         id: leaveRecord?.id
                                    //     }
                                    // })
                                }
                                await Promise.all(existingRequests.map(async (request) => {
                                    await request.update({
                                        status: 2
                                    }, { transaction: t });
                                }));
                                const approverManager = await models_1.User.findByPk(id, {
                                    attributes: ['id', 'employee_name']
                                });
                                const notification = await notification_1.default.create({
                                    user_id: leaveRecord?.user_id,
                                    title: 'Leave Request',
                                    type: 'leave_request_approval',
                                    description: `${approverManager?.employee_name} has succesfully approved your leave request`
                                }, { transaction: t });
                                await (0, sendNotification_1.sendNotification)(user?.id, notification);
                                let data = {
                                    user_id: leaveRecord?.user_id,
                                    type: 'leave_request_approval',
                                    message: `${approverManager?.employee_name} has succesfully approved your leave request`,
                                    path: 'leave_request_approval',
                                    reference_id: leaveRecord?.id
                                };
                                console.log("HERE IS THE NOTFICATION PART!!!!");
                                await (0, notificationService_1.sendPushNotification)(data);
                                const response = (0, response_1.generateResponse)(200, true, "Leave Approved succesfully", leaveRequest);
                                res.status(200).json(response);
                            }
                        }
                    }
                }
                else {
                    next((0, BadRequest_1.badRequest)("You're not the authorized user to approve the leave!"));
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getRequest = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { page, records, sortBy, sortOrder, search_term, month, year, day_type } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const startOfMonth = (0, moment_1.default)(`${year}-${month}-01`).startOf('month');
            const endOfMonth = (0, moment_1.default)(startOfMonth).endOf('month');
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
                    orderOptions.push([{ model: models_1.LeaveRecord }, { model: models_1.User, as: 'requester' }, 'employee_name', sortOrder]);
                }
                if (sortBy === 'leave_type') {
                    orderOptions.push([{ model: models_1.LeaveRecord }, 'leave_type_id', sortOrder]);
                }
                if (sortBy === 'day_type') {
                    orderOptions.push([{ model: models_1.LeaveRecord }, 'day_type_id', sortOrder]);
                }
                if (sortBy === 'from') {
                    orderOptions.push([{ model: models_1.LeaveRecord }, 'start_date', sortOrder]);
                }
                if (sortBy === 'to') {
                    orderOptions.push([{ model: models_1.LeaveRecord }, 'end_date', sortOrder]);
                }
                // orderOptions.push([sortBy, sortOrder])
            }
            if (manager) {
                const managerIds = manager.map(manager => manager.id); // Extract manager IDs from the array
                let whereOptions = {
                    reporting_manager_id: { [sequelize_1.Op.in]: managerIds },
                    status: 1
                };
                let whereOptions2 = {};
                if (month && year) {
                    whereOptions.createdAt = {
                        [sequelize_1.Op.gte]: startOfMonth.toDate(),
                        [sequelize_1.Op.lte]: endOfMonth.toDate()
                    };
                }
                if (search_term) {
                    whereOptions[sequelize_1.Op.or] = [
                        {
                            '$leave_record.requester.employee_name$': {
                                [sequelize_1.Op.like]: `%${search_term}%`
                            }
                        }
                    ];
                }
                if (day_type) {
                    whereOptions2.day_type_id = day_type;
                }
                let processedRows = [];
                const leaveRequest = await leaveRequest_1.default.findAndCountAll({
                    where: whereOptions,
                    include: [
                        {
                            model: models_1.LeaveRecord,
                            where: whereOptions2,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            },
                            include: [
                                {
                                    model: models_1.LeaveType,
                                    attributes: ['id', 'leave_type_name']
                                },
                                {
                                    model: dayType_1.default,
                                    attributes: ['id', 'name']
                                },
                                {
                                    model: models_1.User,
                                    as: 'requester',
                                    attributes: ['id', 'employee_name']
                                }
                            ]
                        },
                    ],
                    // attributes: {
                    //     exclude: ['createdAt', 'updatedAt']
                    // },
                    offset: offset,
                    limit: recordsPerPage,
                    order: orderOptions,
                });
                for (let row of leaveRequest.rows) {
                    const leaveRecord = await models_1.LeaveRecord?.findByPk(row.leave_record_id);
                    const user = await models_1.User.findByPk(leaveRecord?.user_id);
                    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(user?.id);
                    const baseLeaveConfiguration = await baseLeaveConfiguration_1.default.findByPk(masterPolicy?.base_leave_configuration_id);
                    if (baseLeaveConfiguration?.leave_rejection_reason) {
                        const response = {
                            ...row.toJSON(),
                            rejection_reason_mandatory: true,
                        };
                        processedRows.push(response);
                    }
                    else {
                        const response = {
                            ...row.toJSON(),
                            rejection_reason_mandatory: false,
                        };
                        processedRows.push(response);
                    }
                }
                const totalPages = Math.ceil(leaveRequest.count / recordsPerPage);
                const hasNextPage = pageNumber < totalPages;
                const hasPrevPage = pageNumber > 1;
                const meta = {
                    totalCount: leaveRequest.count,
                    pageCount: totalPages,
                    currentPage: page,
                    perPage: recordsPerPage,
                    hasNextPage,
                    hasPrevPage
                };
                const result = {
                    data: leaveRequest.rows,
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
            next((0, InternalServerError_1.internalServerError)("Something went Wrong!"));
        }
    };
    const getLeaveRequests = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { status } = req.query;
            const whereClause = {
                user_id: id
            };
            if (status) {
                whereClause.status = status;
            }
            const leaveRecord = await models_1.LeaveRecord.findAll({
                where: whereClause,
                include: [
                    {
                        model: models_1.LeaveType,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: dayType_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: models_1.User,
                        attributes: ['id', 'employee_name']
                    }
                ]
            });
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", leaveRecord);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const reject = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            // const t = await sequelize.transaction()
            const { reject_reason } = req.body;
            const requestId = req.params.id;
            const user = await models_1.User.findByPk(id);
            const manager = await reportingManagers_1.default.findAll({
                where: {
                    user_id: id
                }
            });
            const leaveRequest = await leaveRequest_1.default.findByPk(requestId);
            const leaveRecord = await models_1.LeaveRecord.findByPk(leaveRequest?.leave_record_id);
            const managerIds = manager?.map((item) => item.reporting_role_id);
            const managerUser = await models_1.User.findByPk(id);
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(leaveRecord?.user_id);
            const attendanceWorkflow = masterPolicy.leave_workflow;
            const baseLeaveConfiguration = await baseLeaveConfiguration_1.default.findByPk(masterPolicy?.base_leave_configuration_id);
            if (baseLeaveConfiguration?.leave_rejection_reason && !req.body.reject_reason) {
                return next((0, BadRequest_1.badRequest)("A reason for rejection is mandatory!"));
            }
            const approvalWorkflow = await approvalFlow_1.default.findByPk(attendanceWorkflow, {
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
            const isManager = managerIds.some(id => reportingRoleIds.includes(id));
            let startDate;
            let endDate;
            if (leaveRecord?.day_type_id == 1) {
                startDate = (0, moment_1.default)(leaveRecord?.start_date);
                endDate = (0, moment_1.default)(leaveRecord?.start_date);
            }
            else {
                startDate = (0, moment_1.default)(leaveRecord?.start_date);
                endDate = (0, moment_1.default)(leaveRecord?.end_date);
            }
            let durationInDays;
            if (leaveRecord?.day_type_id == 1) {
                durationInDays = 0.5;
            }
            else {
                durationInDays = (0, moment_1.default)(endDate).diff(startDate, 'days') + 1;
            }
            const leaveBalance = await models_1.LeaveBalance.findOne({
                where: {
                    user_id: leaveRecord?.user_id,
                    leave_type_id: leaveRecord?.leave_type_id
                }
            });
            if (user && manager && (isManager) && leaveRequest) {
                await db_1.sequelize.transaction(async (t) => {
                    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(leaveRecord?.user_id);
                    const leaveWorkflow = masterPolicy.leave_workflow;
                    const approvalWorkflow = await approvalFlow_1.default.findByPk(leaveWorkflow);
                    if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1) { //Parallel Workflow
                        const leaveRequests = await leaveRequest_1.default.findAll({
                            where: {
                                leave_record_id: leaveRecord?.id,
                            }
                        });
                        await Promise.all(leaveRequests.map(async (request) => {
                            request.status = 3;
                            await request.save({ transaction: t });
                        }));
                        if (leaveRecord) {
                            leaveRecord.status = 3;
                            if (baseLeaveConfiguration?.leave_rejection_reason) {
                                leaveRecord.reject_reason = reject_reason;
                            }
                            leaveRecord.last_action_by = user.id;
                            await leaveBalance?.update({
                                leave_balance: leaveBalance?.leave_balance + durationInDays
                            });
                            await leaveRecord.save({ transaction: t });
                            const response = (0, response_1.generateResponse)(200, true, "Leave Rejected succesfully", leaveRequest);
                            res.status(200).json(response);
                        }
                        const notification = await notification_1.default.create({
                            user_id: leaveRecord?.user_id,
                            title: 'Leave Request',
                            type: 'leave_request_rejection',
                            description: `${managerUser?.employee_name} has rejected your leave request`
                        }, { transaction: t });
                        await (0, sendNotification_1.sendNotification)(leaveRecord?.id, notification);
                        let data = {
                            user_id: leaveRecord?.user_id,
                            type: 'leave_request_rejection',
                            message: `${managerUser?.employee_name} has rejected your leave request`,
                            path: 'leave_request_rejection',
                            reference_id: leaveRecord?.id
                        };
                        await (0, notificationService_1.sendPushNotification)(data);
                    }
                    else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2) { //Sequential Workflow
                        const leaveRequests = await leaveRequest_1.default.findAll({
                            where: {
                                leave_record_id: leaveRecord?.id,
                            }
                        });
                        await Promise.all(leaveRequests.map(async (request) => {
                            request.status = 3;
                            await request.save({ transaction: t });
                        }));
                        if (leaveRecord) {
                            leaveRecord.status = 3;
                            await leaveBalance?.update({
                                leave_balance: leaveBalance?.leave_balance + durationInDays
                            });
                            if (baseLeaveConfiguration?.leave_rejection_reason) {
                                leaveRecord.reject_reason = reject_reason;
                            }
                            leaveRecord.last_action_by = user.id;
                            await leaveRecord.save({ transaction: t });
                            const notification = await notification_1.default.create({
                                user_id: leaveRecord?.user_id,
                                title: 'Leave Change',
                                type: 'leave_change_rejection',
                                description: `${managerUser?.employee_name} has rejected your leave request`
                            }, { transaction: t });
                            await (0, sendNotification_1.sendNotification)(leaveRecord?.id, notification);
                            let data = {
                                user_id: leaveRecord?.user_id,
                                type: 'leave_request_rejection',
                                message: `${managerUser?.employee_name} has rejected your leave request`,
                                path: 'leave_request_rejection',
                                reference_id: leaveRecord?.id
                            };
                            await (0, notificationService_1.sendPushNotification)(data);
                            const response = (0, response_1.generateResponse)(200, true, "Leave Rejected succesfully", leaveRequest);
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
    const cancelRequest = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.credentials;
                const recordId = req.params.id;
                const leaveRecord = await models_1.LeaveRecord.findByPk(recordId);
                if (leaveRecord) {
                    await leaveRecord.destroy({ transaction: t });
                    await leaveRequest_1.default.destroy({
                        where: {
                            leave_record_id: recordId
                        },
                        transaction: t
                    });
                }
                else {
                    next((0, NotFound_1.notFound)("Cannot find leave record for this id!"));
                }
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const leaveHolidaySummary = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { month, year } = req.query;
            const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
            const endDate = (0, moment_1.default)(startDate).endOf('month').toDate();
            const user = await models_1.User.findByPk(id);
            if (user) {
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                const holidayCalendar = await holidayCalendar_1.default.findByPk(masterPolicy?.holiday_calendar_id, {
                    include: [
                        {
                            model: holidayDatabase_1.default,
                            attributes: ['name', 'date'],
                            through: { attributes: [] },
                            where: {
                                date: {
                                    [sequelize_1.Op.gte]: (0, moment_1.default)().toDate()
                                },
                            }
                        }
                    ],
                    attributes: []
                });
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", holidayCalendar);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find employee with that id"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getSingleRecord = async (req, res, next) => {
        try {
            const { id } = req.params;
            const leaveRecord = await models_1.LeaveRecord.findByPk(id, {
                include: [
                    { model: approval_1.default, attributes: ['id', 'name'] },
                    { model: models_1.LeaveType, attributes: ['id', 'leave_type_name'] }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });
            if (leaveRecord) {
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", leaveRecord);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find leave record for that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getLeaveRequestedSummary = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            if (user) {
                const leaveRecordSummary = await models_1.LeaveRecord.findAll({
                    where: {
                        user_id: id
                    },
                    attributes: [
                        [db_1.sequelize.fn('COUNT', db_1.sequelize.col('id')), 'total_leave_records'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.literal('CASE WHEN status = 1 THEN 1 ELSE 0 END')), 'pending_count'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.literal('CASE WHEN status = 2 THEN 1 ELSE 0 END')), 'approved_count'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.literal('CASE WHEN status = 3 THEN 1 ELSE 0 END')), 'rejected_count'],
                    ],
                    group: ['user_id']
                });
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", leaveRecordSummary);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find an employee with that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const editLeaveRecord = async (req, res, next) => {
        try {
            const leaveRecordId = req.params.id;
            const { id } = req.credentials;
            const leaveRecord = await models_1.LeaveRecord.findByPk(leaveRecordId);
            const user = await models_1.User.findByPk(id);
            if (!user) {
                next((0, NotFound_1.notFound)("Cannot find employee with that id!"));
            }
            if (!leaveRecord) {
                next((0, NotFound_1.notFound)("Cannot find a leave record with that id!"));
            }
            if (user?.id !== leaveRecord?.user_id) {
                next((0, Forbidden_1.forbiddenError)("This leave record is not yours!"));
            }
            if (leaveRecord?.status !== 1) {
                next((0, Forbidden_1.forbiddenError)("Cannot edit already approved/rejected leave record!"));
            }
            await db_1.sequelize.transaction(async (t) => {
                const { leave_type_id, day_type_id, half_day_type_id, start_date, end_date, reason, document, contact_number } = req.body;
                const leaveType = await models_1.LeaveType.findByPk(leave_type_id);
                const leaveBalance = await models_1.LeaveBalance.findOne({
                    where: {
                        user_id: id,
                        leave_type_id: leave_type_id
                    }
                });
                let startDate;
                let endDate;
                if (day_type_id == 1) {
                    startDate = (0, moment_1.default)(start_date);
                    endDate = (0, moment_1.default)(start_date);
                }
                else {
                    startDate = (0, moment_1.default)(start_date);
                    endDate = (0, moment_1.default)(end_date);
                }
                const maximumDaysOfLeaveAllowed = leaveType?.max_days_per_leave;
                const maximumDaysOfLeaveAllowedInNegative = leaveType?.negative_balance;
                let durationInDays;
                let previousDurationInDays;
                if (leaveRecord?.day_type_id == 1) {
                    previousDurationInDays = 0.5;
                    console.log("Previous duration when day is half", previousDurationInDays);
                }
                else {
                    previousDurationInDays = (0, moment_1.default)(leaveRecord?.end_date).diff(leaveRecord?.start_date, 'days') + 1;
                    console.log("Previous duration when day is full", previousDurationInDays);
                }
                const recoveredBalance = leaveBalance?.leave_balance + previousDurationInDays;
                if (day_type_id == 1) {
                    durationInDays = 0.5;
                }
                else {
                    console.log("IDHAR GAYA");
                    durationInDays = (0, moment_1.default)(endDate).diff(startDate, 'days') + 1;
                    console.log("HAHSHSADHASKDAS>>>>>>>>>", durationInDays, endDate, startDate);
                }
                console.log("DURATION>>>>>>>>>>>>>>>", durationInDays);
                const overlappingLeave = await isLeaveRecordOverlap(id, start_date, end_date, leaveRecord?.id);
                if (overlappingLeave) {
                    next((0, Forbidden_1.forbiddenError)("A leave for these dates are already applied"));
                }
                let newUpdatedRecord;
                if (durationInDays > recoveredBalance) {
                    console.log("THE CODE IS HERE!");
                    if (leaveType?.negative_balance) {
                        console.log(">>>>>>>>>>>>>>>>>>>>>>>NEGATIVE BALANCE IS ALLOWED");
                        if (leaveType?.max_leave_allowed_in_negative_balance >= (durationInDays - recoveredBalance)) {
                            console.log(">>>>>>>>>>>>>>>>>>>MAX LEAVE IS GREATER THAN THE LEAVE APPLIED FOR!");
                            newUpdatedRecord = await leaveRecord?.update(req.body, { transaction: t });
                            console.log("LEAVE RECORD!!!", leaveRecord);
                            if (newUpdatedRecord) {
                                const balance = recoveredBalance - durationInDays;
                                await leaveBalance?.update({
                                    leave_balance: balance
                                }, { transaction: t });
                                // leaveBalance?.leave_balance = leaveBalance?.leave_balance - durationInDays
                                // await leaveRecord.save({transaction: t})
                            }
                            const response = (0, response_1.generateResponse)(200, true, "Leave Record updated succesfully!", newUpdatedRecord);
                            res.status(200).json(response);
                        }
                        else {
                            next((0, Forbidden_1.forbiddenError)("Insufficient leave balance"));
                        }
                    }
                    else {
                        next((0, Forbidden_1.forbiddenError)("Insufficient leave balance"));
                    }
                }
                else if (durationInDays <= recoveredBalance) {
                    if (durationInDays <= maximumDaysOfLeaveAllowed) {
                        console.log(">>>>>>>>>>>>>>>>>>>>>>>>..IT IS SUFFICIENT!");
                        newUpdatedRecord = await leaveRecord?.update(req.body, { transaction: t });
                        console.log("HERHE IS CREATED,", newUpdatedRecord);
                        if (newUpdatedRecord) {
                            const balance = recoveredBalance - durationInDays;
                            await leaveBalance?.update({
                                leave_balance: balance
                            });
                            // leaveRecord.leave_balance = leaveRecord.leave_balance - durationInDays
                            // await leaveRecord.save({transaction: t})
                        }
                        const response = (0, response_1.generateResponse)(200, true, "Leave Record updated succesfully!", newUpdatedRecord);
                        res.status(200).json(response);
                    }
                    else {
                        next((0, Forbidden_1.forbiddenError)(`You can only apply for leaves upto, ${maximumDaysOfLeaveAllowed} days`));
                    }
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const deleteLeaveRecord = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const recordId = req.params.id;
            const user = await models_1.User.findByPk(id);
            const leaveRecord = await models_1.LeaveRecord.findByPk(recordId);
            if (!user) {
                next((0, NotFound_1.notFound)("Cannot find employee with that id!"));
            }
            if (!leaveRecord) {
                next((0, NotFound_1.notFound)("Cannot find a leave record with that id!"));
            }
            if (user?.id !== leaveRecord?.user_id) {
                next((0, Forbidden_1.forbiddenError)("This leave record is not yours!"));
            }
            if (leaveRecord?.status !== 1) {
                next((0, Forbidden_1.forbiddenError)("Cannot edit already approved/rejected leave record!"));
            }
            await db_1.sequelize.transaction(async (t) => {
                const leaveType = await models_1.LeaveType.findByPk(leaveRecord?.leave_type_id);
                const leaveBalance = await models_1.LeaveBalance.findOne({
                    where: {
                        user_id: id,
                        leave_type_id: leaveRecord?.leave_type_id
                    }
                });
                let startDate;
                let endDate;
                if (leaveRecord?.day_type_id == 1) {
                    startDate = (0, moment_1.default)(leaveRecord?.start_date);
                    endDate = (0, moment_1.default)(leaveRecord?.start_date);
                }
                else {
                    startDate = (0, moment_1.default)(leaveRecord?.start_date);
                    endDate = (0, moment_1.default)(leaveRecord?.end_date);
                }
                let durationInDays;
                if (leaveRecord?.day_type_id == 1) {
                    durationInDays = 0.5;
                }
                else {
                    durationInDays = (0, moment_1.default)(endDate).diff(startDate, 'days') + 1;
                }
                await leaveRequest_1.default.destroy({
                    where: {
                        leave_record_id: recordId
                    },
                    transaction: t
                });
                await leaveRecord?.destroy({ transaction: t });
                const newBalance = leaveBalance?.leave_balance + durationInDays;
                await leaveBalance?.update({
                    leave_balance: newBalance
                }, { transaction: t });
                const response = (0, response_1.generateResponse)(200, true, "Leave Requests deleted succesfully!");
                res.status(200).json(response);
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { getAll, create, destroy, update, getAllDropdown, getById, apply, approve, getRequest, getLeaveRequests, reject, cancelRequest, leaveHolidaySummary, getSingleRecord, getLeaveRequestedSummary, editLeaveRecord, deleteLeaveRecord };
};
exports.LeaveController = LeaveController;
