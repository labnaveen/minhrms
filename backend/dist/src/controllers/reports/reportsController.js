"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeaveRequestLogs = exports.leaveRequestLogs = exports.exportDailyLogs = exports.dailyLogs = void 0;
const InternalServerError_1 = require("../../services/error/InternalServerError");
const models_1 = require("../../models");
const getMasterPolicy_1 = require("../../services/masterPolicy/getMasterPolicy");
const attendancePolicy_1 = __importDefault(require("../../models/attendancePolicy"));
const shiftPolicy_1 = __importDefault(require("../../models/shiftPolicy"));
const regularizationRecord_1 = __importDefault(require("../../models/regularizationRecord"));
const moment_1 = __importDefault(require("moment"));
const response_1 = require("../../services/response/response");
const sequelize_1 = require("sequelize");
const plainjs_1 = require("@json2csv/plainjs");
const helpers_1 = require("../../helpers");
const approvalFlow_1 = __importDefault(require("../../models/approvalFlow"));
const approval_1 = __importDefault(require("../../models/dropdown/status/approval"));
const halfDayType_1 = __importDefault(require("../../models/dropdown/dayType/halfDayType"));
const dayType_1 = __importDefault(require("../../models/dropdown/dayType/dayType"));
const reportingRole_1 = __importDefault(require("../../models/reportingRole"));
const reportingManagers_1 = __importDefault(require("../../models/reportingManagers"));
const approvalFlowType_1 = __importDefault(require("../../models/dropdown/type/approvalFlowType"));
const leaveRequest_1 = __importDefault(require("../../models/leaveRequest"));
const punchLocation_1 = __importDefault(require("../../models/punchLocation"));
const dailyLogs = async (req, res, next) => {
    try {
        const { month, year, employee_id } = req.query;
        const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = (0, moment_1.default)(startDate).endOf('month').toDate();
        let whereOptions = {
            date: {
                [sequelize_1.Op.between]: [startDate, endDate]
            }
        };
        if (employee_id) {
            whereOptions.user_id = employee_id;
        }
        const page = req.query.page ? req.query.page : 1;
        const records = req.query.records ? req.query.records : 10;
        const pageNumber = parseInt(page);
        const recordsPerPage = parseInt(records);
        const offset = (pageNumber - 1) * recordsPerPage;
        const attendanceLogs = await models_1.Attendance.findAndCountAll({
            where: whereOptions,
            include: [
                {
                    model: models_1.AttendanceStatus,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'is_deleted']
                    }
                }
            ],
            order: [['employee_generated_id', 'DESC']],
            offset: offset,
            limit: recordsPerPage,
            paranoid: false
        });
        // const processedRows = await Promise.all(attendanceLogs.rows.map(async(row) => {
        let processedRows = [];
        for (const row of attendanceLogs.rows) {
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(row.user_id);
            const attendancePolicy = await attendancePolicy_1.default.findByPk(masterPolicy?.attendance_policy_id);
            const shiftPolicy = await shiftPolicy_1.default.findByPk(masterPolicy?.shift_policy_id);
            const user = await models_1.User.findByPk(row.user_id, {
                attributes: ['id', 'employee_generated_id', 'employee_name'],
                paranoid: false
            });
            const getHoursWorked = (start, end) => {
                if (!start || !end) {
                    return '---';
                }
                const startMoment = (0, moment_1.default)(start, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 });
                const endMoment = (0, moment_1.default)(end, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 });
                if (startMoment.isAfter(endMoment)) {
                    endMoment.add(24, 'hours');
                }
                const duration = moment_1.default.duration(endMoment.diff(startMoment));
                const formattedDuration = moment_1.default.utc(duration.asMilliseconds()).format('HH:mm');
                return formattedDuration;
            };
            // const baseWorkingHours, actualWorkingHours = calculateWorkingHours(shiftPolicy, row.punch_in_time, row.punch_out_time )
            const baseWorkingHours = (0, helpers_1.calculateWorkingHours)(shiftPolicy, row?.punch_in_time, row.punch_out_tie) || '00:00';
            const actualWorkingHours = (0, helpers_1.calculateWorkingHours)(shiftPolicy, row.punch_in_time, row.punch_out_time)?.actualWorkingHours || '00:00';
            const { overtime_hours, deficit_hours } = (0, helpers_1.calculateOvertimeDeficit)(actualWorkingHours, baseWorkingHours);
            const isRegularise = await regularizationRecord_1.default.findAll({
                where: {
                    date: row.date
                }
            });
            const calculateLateInorEarlyOut = () => {
                if (shiftPolicy?.shift_type_id == 1) {
                    let late_in;
                    let early_out;
                    if ((0, moment_1.default)(row.punch_in_time).isAfter((0, moment_1.default)(shiftPolicy?.shift_start_time))) {
                        late_in = true;
                    }
                    if ((0, moment_1.default)(row.punch_out_time).isBefore((0, moment_1.default)(shiftPolicy?.shift))) {
                        early_out = true;
                    }
                    if ((0, moment_1.default)(row.punch_in_time).isAfter((0, moment_1.default)(shiftPolicy?.shift_start_time) && (0, moment_1.default)(row.punch_out_time).isBefore((0, moment_1.default)(shiftPolicy?.shift)))) {
                        late_in = true;
                        early_out = true;
                    }
                    let status;
                    if (late_in) {
                        status = 'L';
                    }
                    if (early_out) {
                        status = 'E';
                    }
                    if (late_in && early_out) {
                        status = 'L + E';
                    }
                    return status;
                }
            };
            const calculateStatusRemark = () => {
                let status;
                let flexi;
                let grace;
                let grace_exceeded;
                let flexi_exceeded;
                if (row.flexi_used) {
                    flexi = true;
                }
                if (row.grace_used) {
                    grace = true;
                }
                if (row.grace_counter >= shiftPolicy?.number_of_days_grace_allowed) {
                    grace_exceeded = true;
                }
                if (row.flexi_counter >= shiftPolicy?.number_of_days_flexi_allowed) {
                    flexi_exceeded = true;
                }
                if (flexi) {
                    status = 'F';
                }
                if (grace) {
                    status = 'G';
                }
                if (flexi && grace) {
                    status = 'F + G';
                }
                if (flexi_exceeded) {
                    status = 'F*';
                }
                if (grace_exceeded) {
                    status = 'G*';
                }
                if (flexi_exceeded && grace_exceeded) {
                    status = 'F* + G*';
                }
                return status;
            };
            const hours_worked = getHoursWorked(row?.punch_in_time, row?.punch_out_time);
            const startOfDate = (0, moment_1.default)(row?.date).startOf('day');
            const endOfDate = (0, moment_1.default)(row?.date).endOf('day');
            let punchInLocation;
            let punchOutLocation;
            const punchInLatLon = await punchLocation_1.default.findAll({
                where: {
                    attendance_log_id: row.id,
                    punch_time: {
                        [sequelize_1.Op.between]: [startOfDate, endOfDate]
                    }
                },
                order: [['punch_time', 'ASC']]
            });
            punchInLocation = punchInLatLon[0]?.location;
            if (punchInLatLon.length > 1) {
                punchOutLocation = punchInLatLon[punchInLatLon.length - 1]?.location;
            }
            else {
                punchOutLocation = null;
            }
            const response = {
                employee_id: row.employee_generated_id,
                employee_name: user?.employee_name,
                date: row.date,
                first_in: row.punch_in_time,
                last_out: row.punch_out_time,
                hours_worked: hours_worked,
                late_in_early_out: calculateLateInorEarlyOut() ? calculateLateInorEarlyOut() : null,
                overtime_hours: overtime_hours,
                deficit_hours: deficit_hours,
                status_remark: calculateStatusRemark() ? calculateStatusRemark() : null,
                status: row.attendance_status.name,
                regularise: isRegularise.length > 0 ? 'yes' : 'no',
                punch_in_location: punchInLocation ? punchInLocation : null,
                punch_out_location: punchOutLocation ? punchOutLocation : null
            };
            processedRows.push(response);
            // return response
        }
        // })) : []
        const totalPages = Math.ceil(attendanceLogs.count / recordsPerPage);
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;
        const meta = {
            totalCount: attendanceLogs.count,
            pageCount: totalPages,
            currentPage: page,
            perPage: recordsPerPage,
            hasNextPage,
            hasPrevPage
        };
        const response = (0, response_1.generateResponse)(200, true, "Data Fetched succesfully!", processedRows, meta);
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.dailyLogs = dailyLogs;
const exportDailyLogs = async (req, res, next) => {
    try {
        const { month, year, employee_id } = req.query;
        const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = (0, moment_1.default)(startDate).endOf('month').toDate();
        const whereOptions = {
            date: {
                [sequelize_1.Op.between]: [startDate, endDate]
            }
        };
        if (employee_id) {
            whereOptions.user_id = employee_id;
        }
        const attendanceLogs = await models_1.Attendance.findAll({
            where: whereOptions,
            include: [
                {
                    model: models_1.AttendanceStatus,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'is_deleted']
                    }
                }
            ],
            order: [
                ['user_id', 'ASC'],
                ['date', 'DESC']
            ],
            paranoid: false
        });
        const processedRows = await Promise.all(attendanceLogs.map(async (row) => {
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(row.user_id);
            const attendancePolicy = await attendancePolicy_1.default.findByPk(masterPolicy?.attendance_policy_id);
            const shiftPolicy = await shiftPolicy_1.default.findByPk(masterPolicy?.shift_policy_id);
            const user = await models_1.User.findByPk(row.user_id, {
                attributes: ['id', 'employee_generated_id', 'employee_name'],
                paranoid: false
            });
            // const {baseWorkingHours, actualWorkingHours} = calculateWorkingHours(shiftPolicy, row.punch_in_time, row.punch_out_time )
            const baseWorkingHours = (0, helpers_1.calculateWorkingHours)(shiftPolicy, row?.punch_in_time, row?.punch_out_time) || '00:00';
            const actualWorkingHours = (0, helpers_1.calculateWorkingHours)(shiftPolicy, row?.punch_in_time, row?.punch_out_time) || '00:00';
            const { overtime_hours, deficit_hours } = (0, helpers_1.calculateOvertimeDeficit)(actualWorkingHours, baseWorkingHours);
            const isRegularise = await regularizationRecord_1.default.findAll({
                where: {
                    date: row.date
                }
            });
            const calculateLateInorEarlyOut = () => {
                if (shiftPolicy?.shift_type_id == 1) {
                    let late_in;
                    let early_out;
                    if ((0, moment_1.default)(row.punch_in_time).isAfter((0, moment_1.default)(shiftPolicy?.shift_start_time))) {
                        late_in = true;
                    }
                    if ((0, moment_1.default)(row.punch_out_time).isBefore((0, moment_1.default)(shiftPolicy?.shift))) {
                        early_out = true;
                    }
                    if ((0, moment_1.default)(row.punch_in_time).isAfter((0, moment_1.default)(shiftPolicy?.shift_start_time) && (0, moment_1.default)(row.punch_out_time).isBefore((0, moment_1.default)(shiftPolicy?.shift)))) {
                        late_in = true;
                        early_out = true;
                    }
                    let status;
                    if (late_in) {
                        status = 'L';
                    }
                    if (early_out) {
                        status = 'E';
                    }
                    if (late_in && early_out) {
                        status = 'L + E';
                    }
                    return status;
                }
            };
            const calculateStatusRemark = () => {
                let status;
                let flexi;
                let grace;
                let grace_exceeded;
                let flexi_exceeded;
                if (row.flexi_used) {
                    flexi = true;
                }
                if (row.grace_used) {
                    grace = true;
                }
                if (row.grace_counter >= shiftPolicy?.number_of_days_grace_allowed) {
                    grace_exceeded = true;
                }
                if (row.flexi_counter >= shiftPolicy?.number_of_days_flexi_allowed) {
                    flexi_exceeded = true;
                }
                if (flexi) {
                    status = 'F';
                }
                if (grace) {
                    status = 'G';
                }
                if (flexi && grace) {
                    status = 'F + G';
                }
                if (flexi_exceeded) {
                    status = 'F*';
                }
                if (grace_exceeded) {
                    status = 'G*';
                }
                if (flexi_exceeded && grace_exceeded) {
                    status = 'F* + G*';
                }
                return status;
            };
            const getHoursWorked = (start, end) => {
                if (!start || !end) {
                    return '---';
                }
                const startMoment = (0, moment_1.default)(start, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 });
                const endMoment = (0, moment_1.default)(end, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 });
                if (startMoment.isAfter(endMoment)) {
                    endMoment.add(24, 'hours');
                }
                const duration = moment_1.default.duration(endMoment.diff(startMoment));
                const formattedDuration = moment_1.default.utc(duration.asMilliseconds()).format('HH:mm');
                return formattedDuration;
            };
            const hours_worked = getHoursWorked(row.punch_in_time, row.punch_out_time);
            const response = {
                'employee Id': row.employee_generated_id,
                'employee Name': user?.employee_name,
                date: row.date,
                'first in': row.punch_in_time,
                'last out': row.punch_out_time,
                'hours worked': hours_worked,
                'late in/early out': calculateLateInorEarlyOut() ? calculateLateInorEarlyOut() : null,
                'overtime hours': overtime_hours,
                'deficit hours': deficit_hours,
                'status remark': calculateStatusRemark() ? calculateStatusRemark() : null,
                'status': row.attendance_status.name,
                'regularise': isRegularise.length > 0 ? 'yes' : 'no'
            };
            return response;
        }));
        const fields = [
            'employee Id',
            'employee Name',
            'date',
            'first in',
            'last out',
            'hours worked',
            'late in/early out',
            'overtime hours',
            'deficit hours',
            'status remark',
            'status',
            'regularise'
        ];
        console.log(processedRows);
        const parser = new plainjs_1.Parser({ fields });
        const csv = parser.parse(processedRows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'atteachment; filename=daily_logs.csv');
        res.status(200).send(csv);
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.exportDailyLogs = exportDailyLogs;
const leaveRequestLogs = async (req, res, next) => {
    try {
        const { month, year, employee_id } = req.query;
        const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = (0, moment_1.default)(startDate).endOf('month').toDate();
        let whereOptions = {
            start_date: {
                [sequelize_1.Op.gte]: startDate
            },
            end_date: {
                [sequelize_1.Op.lte]: endDate
            }
        };
        if (employee_id) {
            whereOptions.user_id = employee_id;
        }
        const page = req.query.page ? req.query.page : 1;
        const records = req.query.records ? req.query.records : 10;
        const pageNumber = parseInt(page);
        const recordsPerPage = parseInt(records);
        const offset = (pageNumber - 1) * recordsPerPage;
        const leaveRecords = await models_1.LeaveRecord.findAndCountAll({
            where: whereOptions,
            include: [
                { model: approval_1.default, attributes: ['id', 'name'] },
                { model: models_1.LeaveType, attributes: ['id', 'leave_type_name'] },
                { model: models_1.User, as: 'requester', attributes: ['id', 'employee_generated_id', 'employee_name'] },
                { model: dayType_1.default, attributes: ['id', 'name'] },
                { model: halfDayType_1.default, attributes: ['id', 'name'] }
            ],
            offset: offset,
            limit: recordsPerPage
        });
        // const processedRows = await Promise.all(leaveRecords.rows.map(async(row) => {
        let processedRows = [];
        for (const row of leaveRecords?.rows) {
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(row?.requester?.id);
            const user = await models_1.User.findByPk(row?.user_id, {
                include: [{ model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] }, { model: reportingRole_1.default }] }],
                attributes: ['id', 'employee_generated_id'],
                paranoid: false
            });
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
            const reportingManager = user?.Manager;
            const filteredManagers = reportingManager?.filter(manager => { return approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id); });
            const approverList = filteredManagers?.map(item => item?.manager?.employee_name);
            const leaveRequest = await leaveRequest_1.default?.findAll({
                where: {
                    leave_record_id: row?.id
                },
                include: [
                    {
                        model: approval_1.default, attributes: ['id', 'name']
                    },
                    {
                        model: reportingManagers_1.default,
                        include: [
                            { model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] }
                        ]
                    }
                ]
            });
            const statusStrings = leaveRequest.map(item => {
                const managerName = item.reporting_manager.manager.employee_name;
                const approvalStatus = item.approval_status.name;
                return `${managerName} - ${approvalStatus}`;
            });
            const startDate = (0, moment_1.default)(row?.start_date, "YYYY-MM-DD");
            const endDate = (0, moment_1.default)(row?.end_date, "YYYY-MM-DD");
            const duration = moment_1.default.duration(endDate.diff(startDate)).asDays() + 1;
            const response = {
                'employee_id': row?.requester?.employee_generated_id,
                'employee_name': row?.requester?.employee_name,
                'applied_on': (0, moment_1.default)(row?.createdAt),
                'start_date': row?.start_date,
                'end_date': row?.end_date,
                'leave_applied_for': row?.leave_type?.leave_type_name,
                'number_of_days': duration,
                'supporting': row?.reason,
                'request_status': row?.approval_status?.name,
                'approver_list': approverList,
                'actioned_by': statusStrings,
                'action_date': leaveRequest[leaveRequest.length - 1]?.updatedAt
            };
            processedRows.push(response);
        }
        const totalPages = Math.ceil(leaveRecords.count / recordsPerPage);
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;
        const meta = {
            totalCount: leaveRecords.count,
            pageCount: totalPages,
            currentPage: page,
            perPage: recordsPerPage,
            hasNextPage,
            hasPrevPage
        };
        const response = (0, response_1.generateResponse)(200, true, "Reports fetched succesfully!", processedRows, meta);
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.leaveRequestLogs = leaveRequestLogs;
const exportLeaveRequestLogs = async (req, res, next) => {
    try {
        const { month, year, employee_id } = req.query;
        const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = (0, moment_1.default)(startDate).endOf('month').toDate();
        let whereOptions = {
            start_date: {
                [sequelize_1.Op.gte]: startDate
            },
            end_date: {
                [sequelize_1.Op.lte]: endDate
            }
        };
        if (employee_id) {
            whereOptions.user_id = employee_id;
        }
        const leaveRecords = await models_1.LeaveRecord.findAll({
            where: whereOptions,
            include: [
                { model: approval_1.default, attributes: ['id', 'name'] },
                { model: models_1.LeaveType, attributes: ['id', 'leave_type_name'] },
                { model: models_1.User, as: 'requester', attributes: ['id', 'employee_generated_id', 'employee_name'] },
                { model: dayType_1.default, attributes: ['id', 'name'] },
                { model: halfDayType_1.default, attributes: ['id', 'name'] }
            ],
        });
        // const processedRows = await Promise.all(leaveRecords.map(async(row) => {
        let processedRows = [];
        for (const row of leaveRecords) {
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(row?.requester?.id);
            const user = await models_1.User.findByPk(row?.user_id, {
                include: [{ model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] }, { model: reportingRole_1.default }] }],
                attributes: ['id', 'employee_generated_id'],
                paranoid: false
            });
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
            const reportingManager = user?.Manager;
            const filteredManagers = reportingManager?.filter(manager => { return approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id); });
            const approverList = filteredManagers?.map(item => item?.manager?.employee_name);
            const leaveRequest = await leaveRequest_1.default?.findAll({
                where: {
                    leave_record_id: row?.id
                },
                include: [
                    {
                        model: approval_1.default, attributes: ['id', 'name']
                    },
                    {
                        model: reportingManagers_1.default,
                        include: [
                            { model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] }
                        ]
                    }
                ]
            });
            const statusStrings = leaveRequest.map(item => {
                const managerName = item.reporting_manager.manager.employee_name;
                const approvalStatus = item.approval_status.name;
                return `${managerName} - ${approvalStatus}`;
            });
            const startDate = (0, moment_1.default)(row?.start_date, "YYYY-MM-DD");
            const endDate = (0, moment_1.default)(row?.end_date, "YYYY-MM-DD");
            const duration = moment_1.default.duration(endDate.diff(startDate)).asDays() + 1;
            const response = {
                'employee Id': row?.requester?.employee_generated_id,
                'employee name': row?.requester?.employee_name,
                'applied on': (0, moment_1.default)(row?.createdAt),
                'start date': row?.start_date,
                'end date': row?.end_date,
                'leave applied for': row?.leave_type?.leave_type_name,
                'number of days': duration,
                'supporting': row?.reason,
                'request status': row?.approval_status?.name,
                'approver list': approverList,
                'actioned by': statusStrings,
                'action date': leaveRequest[leaveRequest.length - 1]?.updatedAt
            };
            processedRows.push(response);
        }
        // }))
        const fields = [
            'employee Id',
            'employee name',
            'applied on',
            'start date',
            'end date',
            'leave applied for',
            'number of days',
            'supporting',
            'request status',
            'approver list',
            'actioned by',
            'action date'
        ];
        const parser = new plainjs_1.Parser({ fields });
        const csv = parser.parse(processedRows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'atteachment; filename=leave_records_logs.csv');
        res.status(200).send(csv);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
        // next(internalServerError("Something went wrong!"))
    }
};
exports.exportLeaveRequestLogs = exportLeaveRequestLogs;
