"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDivisionSummary = exports.getManagerRequestsSummary = exports.getManagerEvents = exports.getEmployeeAttendanceSummary = exports.getMyTeam = exports.getTodayEvents = exports.getManagerSpecificLeaveData = exports.getManagerSpecificAttendanceData = exports.getAdminSpecificAttendanceData = exports.getAdminSpecificLeaveData = exports.getSelfLeaveStatus = exports.getEmployeeMetaData = exports.getTimeSheet = exports.getAnnouncementsForDashboard = void 0;
const InternalServerError_1 = require("../../services/error/InternalServerError");
const announcements_1 = __importDefault(require("../../models/announcements"));
const response_1 = require("../../services/response/response");
const models_1 = require("../../models");
const divisionUnits_1 = __importDefault(require("../../models/divisionUnits"));
const sequelize_1 = require("sequelize");
const BadRequest_1 = require("../../services/error/BadRequest");
const db_1 = require("../../utilities/db");
const getMasterPolicy_1 = require("../../services/masterPolicy/getMasterPolicy");
const shiftPolicy_1 = __importDefault(require("../../models/shiftPolicy"));
const helpers_1 = require("../../helpers");
const moment_1 = __importDefault(require("moment"));
const NotFound_1 = require("../../services/error/NotFound");
const approval_1 = __importDefault(require("../../models/dropdown/status/approval"));
const holidayCalendar_1 = __importDefault(require("../../models/holidayCalendar"));
const holidayDatabase_1 = __importDefault(require("../../models/holidayDatabase"));
const dayType_1 = __importDefault(require("../../models/dropdown/dayType/dayType"));
const profileImages_1 = __importDefault(require("../../models/profileImages"));
const reportingManagers_1 = __importDefault(require("../../models/reportingManagers"));
const regularizationRecord_1 = __importDefault(require("../../models/regularizationRecord"));
const Forbidden_1 = require("../../services/error/Forbidden");
const division_1 = __importDefault(require("../../models/division"));
const getAnnouncementsForDashboard = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const { page, records } = req.query;
        if (!page && !records) {
            // res.status(400).json({message: "No request parameters are present!"})
            next((0, BadRequest_1.badRequest)("No request parameters are present!"));
            return;
        }
        const pageNumber = parseInt(page);
        const recordsPerPage = parseInt(records);
        const offset = (pageNumber - 1) * recordsPerPage;
        const employee = await models_1.User.findByPk(id, {
            include: [
                {
                    model: divisionUnits_1.default,
                }
            ]
        });
        const divisionUnit = employee?.division_units?.map((unit) => unit.id);
        console.log(">>>>>>>>>", (0, moment_1.default)().format("YYYY-MM-DD"));
        const _announcement = await announcements_1.default.findAll({
            attributes: ['id'],
            where: {
                [sequelize_1.Op.or]: [
                    {
                        group_specific: false,
                    },
                    {
                        group_specific: true,
                        '$division_units.id$': {
                            [sequelize_1.Op.in]: divisionUnit
                        }
                    },
                ]
            },
            include: [
                {
                    model: divisionUnits_1.default,
                    through: { attributes: [] },
                    as: 'division_units',
                    attributes: ['id'],
                    where: {
                        id: {
                            [sequelize_1.Op.in]: divisionUnit
                        }
                    }
                }
            ]
        });
        const announcementIdsArray = _announcement.map(item => item.id);
        const announcements = await announcements_1.default.findAndCountAll({
            where: {
                [sequelize_1.Op.or]: [
                    {
                        [sequelize_1.Op.and]: [
                            {
                                id: {
                                    [sequelize_1.Op.in]: announcementIdsArray
                                },
                                suspendable: false,
                            }
                        ]
                    },
                    {
                        group_specific: false,
                        suspendable: false
                    },
                    // {
                    //     [Op.and]: [
                    //         {suspendable: false},
                    //         {start_date: null},
                    //         {end_date: null}
                    //     ]
                    // },
                    {
                        [sequelize_1.Op.and]: [
                            { suspendable: true },
                            { start_date: { [sequelize_1.Op.lte]: (0, moment_1.default)().format("YYYY-MM-DD") } },
                            { end_date: { [sequelize_1.Op.gte]: (0, moment_1.default)().format('YYYY-MM-DD') } }
                        ]
                    }
                ]
            },
            include: [
                {
                    model: divisionUnits_1.default,
                    as: 'division_units',
                    through: {
                        attributes: [],
                    },
                    // where:{
                    //     id: {
                    //         [Op.in]: divisionUnit
                    //     }
                    // },
                    attributes: []
                }
            ],
            limit: recordsPerPage,
            offset: offset,
            order: [['id', 'DESC']]
        });
        const totalPages = Math.ceil(announcements.count / recordsPerPage);
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;
        const meta = {
            totalCount: announcements.count,
            pageCount: totalPages,
            currentPage: page,
            perPage: recordsPerPage,
            hasNextPage,
            hasPrevPage
        };
        const result = {
            data: announcements.rows,
            meta
        };
        const response = (0, response_1.generateResponse)(200, true, "Announcements fetched succesfully!", result.data, meta);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json(err);
        // next(internalServerError("Something went wrong!"))
    }
};
exports.getAnnouncementsForDashboard = getAnnouncementsForDashboard;
const getTimeSheet = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const employee = await models_1.User.findByPk(id);
        const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
        const shiftPolicy = await shiftPolicy_1.default.findByPk(masterPolicy?.shift_policy_id);
        const workingHours = (0, helpers_1.calculateBaseWorkingHours)(shiftPolicy?.shift_start_time, shiftPolicy?.shift_end_time);
        const baseWorkingHours = shiftPolicy?.base_working_hours;
        const date = (0, moment_1.default)().format('YYYY-MM-DD');
        const attendance = await models_1.Attendance.findAll({
            attributes: ['id', 'user_id', 'employee_generated_id', 'date', 'punch_in_time', 'punch_out_time', 'status']
        });
        const responseBody = {
            attendance_data: attendance,
            shift_time: workingHours ? workingHours : baseWorkingHours
        };
        const response = (0, response_1.generateResponse)(200, true, "Attendance Data fetched succesfully!", responseBody);
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.getTimeSheet = getTimeSheet;
const getEmployeeMetaData = async (req, res, next) => {
    try {
        const todayStart = (0, moment_1.default)().startOf('day');
        const todayEnd = (0, moment_1.default)().endOf('day');
        const today = (0, moment_1.default)().startOf('day');
        const todayDate = today.format('MM-DD');
        const totalEmployee = await models_1.User.count();
        const attendance = await models_1.Attendance.findAndCountAll({
            where: {
                date: {
                    [sequelize_1.Op.between]: [todayStart, todayEnd]
                },
                is_deleted: false,
                punch_in_time: {
                    [sequelize_1.Op.not]: null
                }
            },
            order: [['id', 'DESC']]
        });
        const absent_employees = totalEmployee - attendance?.count;
        const birthdays = await models_1.User.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    {
                        dob_celebrated: {
                            [sequelize_1.Op.and]: [
                                db_1.sequelize.where(db_1.sequelize.fn('MONTH', db_1.sequelize.col('dob_celebrated')), today.month() + 1),
                                db_1.sequelize.where(db_1.sequelize.fn('DAY', db_1.sequelize.col('dob_celebrated')), { [sequelize_1.Op.gt]: today.date() })
                            ]
                        }
                    },
                    {
                        dob_celebrated: null,
                        [sequelize_1.Op.and]: [
                            db_1.sequelize.where(db_1.sequelize.fn('MONTH', db_1.sequelize.col('dob_adhaar')), today.month() + 1),
                            db_1.sequelize.where(db_1.sequelize.fn('DAY', db_1.sequelize.col('dob_adhaar')), { [sequelize_1.Op.gt]: today.date() })
                        ]
                    },
                ]
            },
            include: [
                {
                    model: profileImages_1.default,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'dob_celebrated'],
        });
        const birthday = await models_1.User.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    db_1.sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`),
                    {
                        dob_celebrated: null,
                        dob_adhaar: db_1.sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`)
                    }
                ]
            },
            include: [
                {
                    model: profileImages_1.default,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'dob_celebrated']
        });
        const upcomingAnniversary = await models_1.User.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    db_1.sequelize.where(db_1.sequelize.fn('MONTH', db_1.sequelize.col('date_of_joining')), today.month() + 1),
                    db_1.sequelize.where(db_1.sequelize.fn('DAY', db_1.sequelize.col('date_of_joining')), { [sequelize_1.Op.gt]: today.date() })
                ]
            },
            include: [
                {
                    model: profileImages_1.default,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'date_of_joining']
        });
        const anniversary = await models_1.User.findAll({
            where: {
                date_of_joining: db_1.sequelize.literal(`DATE_FORMAT(date_of_joining, '%m-%d') = '${todayDate}'`)
            },
            include: [
                {
                    model: profileImages_1.default,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'date_of_joining']
        });
        const responseBody = {
            total_employees: totalEmployee,
            present_employees: attendance.count,
            absent_employees: absent_employees,
            upcoming_birthdays: birthdays,
            birthday: birthday,
            upcoming_anniversary: upcomingAnniversary,
            anniversary: anniversary
        };
        const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", responseBody);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.getEmployeeMetaData = getEmployeeMetaData;
const getSelfLeaveStatus = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const user = await models_1.User.findByPk(id);
        const { month } = req.query;
        const { year } = req.query;
        const getDatesOfMonth = (year, month) => {
            const startDate = (0, moment_1.default)(`${year}-${month}-01`, "YYYY-MM-DD");
            const endDate = (0, moment_1.default)(startDate).endOf('month');
            console.log("Start Date: ", startDate);
            const datesArray = [];
            while (startDate.isSameOrBefore(endDate)) {
                datesArray.push(startDate.format('YYYY-MM-DD'));
                startDate.add(1, 'days');
            }
            return datesArray;
        };
        const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
        const shiftPolicy = await shiftPolicy_1.default.findByPk(masterPolicy?.shift_policy_id);
        const calculateWorkingHours = (shiftPolicy, punchInTime, punchOutTime) => {
            const punchIn = (0, moment_1.default)(punchInTime, 'HH:mm:ss');
            const punchOut = (0, moment_1.default)(punchOutTime, 'HH:mm:ss');
            if (punchIn.isAfter(punchOut)) {
                punchOut.add(24, 'hours');
            }
            if (shiftPolicy?.shift_type_id === 1) {
                const shiftStart = (0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm:ss');
                const shiftEnd = (0, moment_1.default)(shiftPolicy?.shift_end_time, 'HH:mm:ss');
                if (shiftStart.isAfter(shiftEnd)) {
                    shiftEnd.add(24, 'hours');
                }
                const baseWorkingHours = moment_1.default.duration(shiftEnd.diff(shiftStart)).asMinutes();
                const actualWorkingHours = moment_1.default.duration(punchOut.diff(punchIn)).asMinutes();
                return {
                    baseWorkingHours,
                    actualWorkingHours,
                };
            }
            else if (shiftPolicy?.shift_type_id === 2) {
                const baseWorkingHours = moment_1.default.duration(shiftPolicy?.base_working_hours, 'minutes').asMinutes();
                const actualWorkingHours = moment_1.default.duration(punchOut.diff(punchIn)).asMinutes();
                return {
                    baseWorkingHours,
                    actualWorkingHours,
                };
            }
            return null;
        };
        const calculateOvertimeDeficit = (actualWorkingHours, baseWorkingHours) => {
            const minutesDifference = actualWorkingHours - baseWorkingHours;
            if (minutesDifference > 0) {
                const overtimeHoursInt = Math.floor(minutesDifference / 60);
                const overtimeMinutesRemainder = Math.floor(minutesDifference % 60);
                const overtime_hours = `${overtimeHoursInt.toString().padStart(2, '0')}:${overtimeMinutesRemainder.toString().padStart(2, '0')}`;
                return {
                    overtime_hours,
                    deficit_hours: '00:00',
                };
            }
            else if (minutesDifference < 0) {
                const deficitHoursInt = Math.floor(Math.abs(minutesDifference) / 60);
                const deficitMinutesRemainder = Math.floor(Math.abs(minutesDifference) % 60);
                const deficit_hours = `${deficitHoursInt.toString().padStart(2, '0')}:${deficitMinutesRemainder.toString().padStart(2, '0')}`;
                return {
                    overtime_hours: '00:00',
                    deficit_hours,
                };
            }
            else {
                return {
                    overtime_hours: '00:00',
                    deficit_hours: '00:00',
                };
            }
        };
        if (user) {
            const startOfMonth = (0, moment_1.default)(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month');
            const endOfMonth = (0, moment_1.default)(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month');
            const startDate = (0, moment_1.default)(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month').set({ seconds: 0, minutes: 0, hours: 0 });
            const endDate = (0, moment_1.default)(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').set({ seconds: 0, minutes: 0, hours: 0 });
            const attendanceDetails = {};
            const attendanceRecords = await models_1.Attendance.findAll({
                where: {
                    user_id: id,
                    date: {
                        [sequelize_1.Op.and]: [
                            { [sequelize_1.Op.gte]: startOfMonth },
                            { [sequelize_1.Op.lte]: endOfMonth }
                        ]
                    }
                },
                include: [
                    {
                        model: models_1.AttendanceStatus,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'is_deleted']
                        }
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });
            // const leaveRecord = await LeaveRecord.findAll({
            //     where: {
            //         user_id: id,
            //         status: 2, //Approved
            //         start_date: {[Op.gte]: startOfMonth.format('YYYY-MM-DD HH:mm:ss')},
            //         end_date: {[Op.lte]: endOfMonth.format('YYYY-MM-DD HH:mm:ss')}
            //     }
            // })
            const leaveRecord = await models_1.LeaveRecord.findAll({
                where: {
                    user_id: id,
                    status: 2,
                    [sequelize_1.Op.or]: [
                        {
                            start_date: {
                                [sequelize_1.Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                            },
                            end_date: {
                                [sequelize_1.Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                            }
                        },
                        {
                            start_date: {
                                [sequelize_1.Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                            },
                            end_date: {
                                [sequelize_1.Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                            }
                        }
                    ],
                },
                include: [
                    {
                        model: models_1.LeaveType,
                        attributes: ['id', 'leave_type_name']
                    },
                    {
                        model: approval_1.default,
                        attributes: ['id', 'name']
                    },
                    {
                        model: dayType_1.default,
                        attributes: ['id', 'name']
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
            const holidayCalendar = await holidayCalendar_1.default.findByPk(masterPolicy?.holiday_calendar_id, {
                include: [
                    {
                        model: holidayDatabase_1.default,
                        attributes: ['name', 'date'],
                        through: { attributes: [] }
                    }
                ],
                attributes: ['id', 'name', 'year']
            });
            const holidays = holidayCalendar?.holiday_databases?.reduce((acc, holiday) => {
                acc[holiday.date] = holiday;
                return acc;
            }, {});
            const dates = getDatesOfMonth(year, month);
            const leaveDetails = {};
            dates.forEach(date => {
                const attendanceRecord = attendanceRecords.find(record => record.date === date);
                const holidayForDate = holidays[date];
                const employeeOnLeave = leaveRecord.filter(leave => {
                    // return moment(date).isBetween(moment(leave.start_date), leave.end_date, null, '[]') || moment(date).isSame(leave.start_date)                    
                    return ((0, moment_1.default)(date).isBetween((0, moment_1.default)(leave.start_date).format('YYYY-MM-DD'), (0, moment_1.default)(leave.end_date).format('YYYY-MM-DD'), null, '[]'));
                });
                const leaveTypeCounts = {};
                employeeOnLeave.forEach(leave => {
                    const leaveTypeName = leave.leave_type.leave_type_name;
                    leaveTypeCounts.id = leave.id;
                });
                leaveDetails[date] = {
                    total_employees: employeeOnLeave.length ? employeeOnLeave.length : null,
                    leave_types: leaveTypeCounts ? leaveTypeCounts : null
                };
                const { baseWorkingHours, actualWorkingHours } = calculateWorkingHours(shiftPolicy, attendanceRecord?.punch_in_time, attendanceRecord?.punch_out_time);
                const { overtime_hours, deficit_hours } = calculateOvertimeDeficit(actualWorkingHours, baseWorkingHours);
                const detailsForDate = {
                    attendace_record: attendanceRecord
                        ? {
                            id: attendanceRecord.id,
                            user_id: attendanceRecord.user_id,
                            employee_generated_id: attendanceRecord.employee_generated_id,
                            date: attendanceRecord.date,
                            punch_in_time: attendanceRecord?.punch_in_time,
                            punch_out_time: attendanceRecord?.punch_out_time,
                            status: attendanceRecord?.attendance_status,
                            flexi_used: attendanceRecord?.flexi_used,
                            grace_used: attendanceRecord?.grace_used,
                            overtime_hours: overtime_hours,
                            deficit_hours: deficit_hours
                        } : null,
                    leave_record: employeeOnLeave
                        ? employeeOnLeave : null,
                    holiday: holidayForDate
                        ? {
                            name: holidayForDate?.name,
                            date: holidayForDate?.date
                        } : null
                };
                attendanceDetails[date] = detailsForDate;
            });
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", attendanceDetails);
            res.status(200).json(response);
        }
        else {
            next((0, NotFound_1.notFound)("No user found with that id!"));
        }
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.getSelfLeaveStatus = getSelfLeaveStatus;
const getAdminSpecificLeaveData = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const user = await models_1.User.findByPk(id);
        const { month } = req.query;
        const { year } = req.query;
        const getDatesOfMonth = (year, month) => {
            const startDate = (0, moment_1.default)(`${year}-${month}-01`, "YYYY-MM-DD");
            const endDate = (0, moment_1.default)(startDate).endOf('month');
            console.log("Start Date: ", startDate);
            const datesArray = [];
            while (startDate.isSameOrBefore(endDate)) {
                datesArray.push(startDate.format('YYYY-MM-DD'));
                startDate.add(1, 'days');
            }
            return datesArray;
        };
        const record = {};
        const startDate = (0, moment_1.default)(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month').set({ seconds: 0, minutes: 0, hours: 0 });
        const endDate = (0, moment_1.default)(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').set({ seconds: 0, minutes: 0, hours: 0 });
        if (user && user.role_id === 1 && month && year) {
            const leaveRecord = await models_1.LeaveRecord.findAll({
                where: {
                    status: 2,
                    [sequelize_1.Op.or]: [
                        {
                            start_date: {
                                [sequelize_1.Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                            },
                            end_date: {
                                [sequelize_1.Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                            }
                        },
                        {
                            start_date: {
                                [sequelize_1.Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                            },
                            end_date: {
                                [sequelize_1.Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: models_1.LeaveType,
                        attributes: ['id', 'leave_type_name']
                    }
                ]
            });
            const dates = getDatesOfMonth(year, month);
            const leaveDetails = {};
            dates.forEach(date => {
                const employeeOnLeave = leaveRecord.filter(leave => (0, moment_1.default)(date).isBetween(leave.start_date, leave.end_date, null, '[]'));
                const leaveTypeCounts = {};
                employeeOnLeave.forEach(leave => {
                    const leaveTypeName = leave.leave_type.leave_type_name;
                    leaveTypeCounts[leaveTypeName] = (leaveTypeCounts[leaveTypeName] || 0) + 1;
                });
                leaveDetails[date] = {
                    total_employees: employeeOnLeave.length ? employeeOnLeave.length : null,
                    leave_types: leaveTypeCounts ? leaveTypeCounts : null
                };
            });
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", leaveDetails);
            res.status(200).json(response);
        }
        else {
            next((0, NotFound_1.notFound)("Cannot find employee"));
        }
    }
    catch (err) {
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.getAdminSpecificLeaveData = getAdminSpecificLeaveData;
const getAdminSpecificAttendanceData = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const user = await models_1.User.findByPk(id);
        const { month, year } = req.query;
        const startOfMonth = (0, moment_1.default)(`${year}-${month}-01`).startOf('month');
        // const endOfMonth = moment(startOfMonth).endOf('month')
        let endOfMonth;
        if (parseInt(month) === (0, moment_1.default)().get('months') + 1 && parseInt(year) === (0, moment_1.default)().get('years')) {
            endOfMonth = (0, moment_1.default)().subtract(1, 'day');
        }
        else {
            endOfMonth = (0, moment_1.default)(startOfMonth).endOf('month');
        }
        console.log("END OF MONTHHH", endOfMonth);
        const allDates = [];
        let currentDate = (0, moment_1.default)(startOfMonth);
        let currentDateofMonth = (0, moment_1.default)().date();
        // while (currentDate.isSameOrBefore(endOfMonth)) {
        //     allDates.push(currentDate.format('YYYY-MM-DD'));
        //     currentDate.add(1, 'day');
        // }
        // if(currentDateofMonth !== 1){
        //     while (currentDate.date() < currentDateofMonth){
        //         allDates.push(currentDate.format('YYYY-MM-DD'));
        //         currentDate.add(1, 'day');
        //     }
        // }
        while (currentDate.isSameOrBefore(endOfMonth)) {
            allDates.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'day');
        }
        if (user && user.role_id === 1) {
            if (month && year) {
                const totalEmployeesQuery = await models_1.User.count({
                    where: {
                        status: 1
                    }
                });
                const attendanceRecord = await models_1.Attendance.findAll({
                    attributes: [
                        [db_1.sequelize.fn('DATE', db_1.sequelize.col('date')), 'date'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN status = 3 THEN 1 ELSE 0 END")), 'present_count'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN status = 1 THEN 1 ELSE 0 END")), 'absent_count'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN status = 2 THEN 1 ELSE 0 END")), 'halfday_count'],
                    ],
                    where: {
                        date: {
                            [sequelize_1.Op.between]: [startOfMonth.toDate(), endOfMonth],
                        },
                    },
                    group: ['date'],
                    order: [['date', 'ASC']],
                    raw: true,
                });
                console.log(startOfMonth.toDate(), endOfMonth);
                const formattedAttendanceDate = allDates.reduce((result, date) => {
                    const matchingRecord = attendanceRecord.filter((entry) => entry.date === date);
                    result[date] = {
                        present_employees: matchingRecord.reduce((sum, record) => sum + parseInt(record.present_count), 0),
                        absent_employees: matchingRecord.reduce((sum, record) => sum + parseInt(record.absent_count), 0),
                        halfday_employees: matchingRecord.reduce((sum, record) => sum + parseInt(record.halfday_count), 0),
                    };
                    return result;
                }, {});
                let dataForToday;
                if (parseInt(month) === (0, moment_1.default)().month() + 1 && parseInt(year) === (0, moment_1.default)().year()) {
                    dataForToday = await models_1.Attendance.findOne({
                        attributes: [
                            [db_1.sequelize.fn('DATE', db_1.sequelize.col('date')), 'date'],
                            [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN punch_in_time IS NOT NULL THEN 1 END")), 'present_count'],
                            [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN punch_in_time IS NULL THEN 1 END")), 'absent_count'],
                            [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN status = 2 THEN 1 ELSE 0 END")), 'halfday_count'],
                        ],
                        where: {
                            date: (0, moment_1.default)().format('YYYY-MM-DD')
                        },
                        group: ['date'],
                        order: [['date', 'ASC']],
                        raw: true,
                    });
                    formattedAttendanceDate[(0, moment_1.default)().format('YYYY-MM-DD')] = {
                        present_employees: parseInt(dataForToday?.present_count) ? parseInt(dataForToday?.present_count) : 0,
                        absent_employees: parseInt(dataForToday?.absent_count) ? parseInt(dataForToday?.absent_count) : 0,
                        halfday_employees: parseInt(dataForToday?.halfday_count) ? parseInt(dataForToday?.halfday_count) : 0,
                    };
                }
                console.log(":::::::::::::::::::::", formattedAttendanceDate);
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully", formattedAttendanceDate);
                res.status(200).json(response);
            }
            else {
                next((0, BadRequest_1.badRequest)("Month and year are missing from query parameters!"));
            }
        }
        else {
            next((0, NotFound_1.notFound)("There is no admin with that id!"));
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
        // next(internalServerError("Something went wrong!"))
    }
};
exports.getAdminSpecificAttendanceData = getAdminSpecificAttendanceData;
const getManagerSpecificAttendanceData = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const user = await models_1.User.findByPk(id);
        const { month, year } = req.query;
        const startOfMonth = (0, moment_1.default)(`${year}-${month}-01`, "YYYY-MM-DD").startOf('month');
        // const endOfMonth = moment(startOfMonth).endOf('month')
        let endOfMonth;
        if (parseInt(month) === (0, moment_1.default)().month() + 1 && parseInt(year) === (0, moment_1.default)().year()) {
            endOfMonth = (0, moment_1.default)().subtract(1, 'day');
        }
        else {
            endOfMonth = (0, moment_1.default)(startOfMonth).endOf('month');
        }
        const allDates = [];
        let currentDate = (0, moment_1.default)(startOfMonth);
        let currentDateofMonth = (0, moment_1.default)().date();
        // while (currentDate.isSameOrBefore(endOfMonth)) {
        //     allDates.push(currentDate.format('YYYY-MM-DD'));
        //     currentDate.add(1, 'day');
        // }
        while (currentDate.isSameOrBefore(endOfMonth)) {
            allDates.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'day');
        }
        const reportingManager = await reportingManagers_1.default.findOne({
            where: {
                user_id: id
            },
            include: [
                {
                    model: models_1.User, as: 'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false
                },
            ]
        });
        if (reportingManager) {
            if (month && year) {
                const employeeIds = reportingManager?.Employees.map(employee => employee.id);
                const attendanceRecord = await models_1.Attendance.findAll({
                    attributes: [
                        [db_1.sequelize.fn('DATE', db_1.sequelize.col('date')), 'date'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN status = 3 THEN 1 ELSE 0 END")), 'present_count'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN status = 1 THEN 1 ELSE 0 END")), 'absent_count'],
                        [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN status = 2 THEN 1 ELSE 0 END")), 'halfday_count'],
                    ],
                    where: {
                        date: {
                            [sequelize_1.Op.between]: [startOfMonth.toDate(), endOfMonth],
                        },
                        user_id: {
                            [sequelize_1.Op.in]: employeeIds
                        }
                    },
                    group: ['date'],
                    order: [['date', 'ASC']],
                    raw: true,
                });
                const formattedAttendanceDate = allDates.reduce((result, date) => {
                    const matchingRecord = attendanceRecord.filter((entry) => entry.date === date);
                    result[date] = {
                        present_employees: matchingRecord.reduce((sum, record) => sum + parseInt(record.present_count), 0),
                        absent_employees: matchingRecord.reduce((sum, record) => sum + parseInt(record.absent_count), 0),
                        halfday_employees: matchingRecord.reduce((sum, record) => sum + parseInt(record.halfday_count), 0),
                    };
                    return result;
                }, {});
                let dataForToday;
                if (parseInt(month) === (0, moment_1.default)().month() + 1 && parseInt(year) === (0, moment_1.default)().year()) {
                    dataForToday = await models_1.Attendance.findOne({
                        attributes: [
                            [db_1.sequelize.fn('DATE', db_1.sequelize.col('date')), 'date'],
                            [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN punch_in_time IS NOT NULL THEN 1 END")), 'present_count'],
                            [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN punch_in_time IS NULL THEN 1 END")), 'absent_count'],
                            [db_1.sequelize.fn('SUM', db_1.sequelize.literal("CASE WHEN status = 2 THEN 1 ELSE 0 END")), 'halfday_count'],
                        ],
                        where: {
                            date: (0, moment_1.default)().format('YYYY-MM-DD'),
                            user_id: {
                                [sequelize_1.Op.in]: employeeIds
                            }
                        },
                        group: ['date'],
                        order: [['date', 'ASC']],
                        raw: true,
                    });
                    formattedAttendanceDate[(0, moment_1.default)().format('YYYY-MM-DD')] = {
                        present_employees: parseInt(dataForToday?.present_count) ? parseInt(dataForToday?.present_count) : 0,
                        absent_employees: parseInt(dataForToday?.absent_count) ? parseInt(dataForToday?.absent_count) : 0,
                        halfday_employees: parseInt(dataForToday?.halfday_count) ? parseInt(dataForToday?.halfday_count) : 0,
                    };
                }
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully", formattedAttendanceDate);
                res.status(200).json(response);
            }
            else {
                next((0, BadRequest_1.badRequest)("Month and year are missing from query parameters!"));
            }
        }
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.getManagerSpecificAttendanceData = getManagerSpecificAttendanceData;
const getManagerSpecificLeaveData = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const user = await models_1.User.findByPk(id);
        const reportingManager = await reportingManagers_1.default.findOne({
            where: {
                user_id: id
            },
            include: [
                {
                    model: models_1.User, as: 'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false
                },
            ]
        });
        const { month, year } = req.query;
        const getDatesOfMonth = (year, month) => {
            const startDate = (0, moment_1.default)(`${year}-${month}-01`, "YYYY-MM-DD");
            const endDate = (0, moment_1.default)(startDate).endOf('month');
            console.log("Start Date: ", startDate);
            const datesArray = [];
            while (startDate.isSameOrBefore(endDate)) {
                datesArray.push(startDate.format('YYYY-MM-DD'));
                startDate.add(1, 'days');
            }
            return datesArray;
        };
        const record = {};
        const startDate = (0, moment_1.default)(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month').set({ seconds: 0, minutes: 0, hours: 0 });
        const endDate = (0, moment_1.default)(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').set({ seconds: 0, minutes: 0, hours: 0 });
        if (reportingManager) {
            if (month && year) {
                const employeeIds = reportingManager?.Employees.map(employee => employee.id);
                const leaveRecord = await models_1.LeaveRecord.findAll({
                    where: {
                        status: 2,
                        [sequelize_1.Op.or]: [
                            {
                                start_date: {
                                    [sequelize_1.Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                                },
                                end_date: {
                                    [sequelize_1.Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                                }
                            },
                            {
                                start_date: {
                                    [sequelize_1.Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                                },
                                end_date: {
                                    [sequelize_1.Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                                }
                            }
                        ],
                        user_id: {
                            [sequelize_1.Op.in]: employeeIds
                        }
                    },
                    include: [
                        {
                            model: models_1.LeaveType,
                            attributes: ['id', 'leave_type_name']
                        }
                    ]
                });
                const dates = getDatesOfMonth(year, month);
                const leaveDetails = {};
                dates.forEach(date => {
                    const employeeOnLeave = leaveRecord.filter(leave => (0, moment_1.default)(date).isBetween(leave.start_date, leave.end_date, null, '[]'));
                    const leaveTypeCounts = {};
                    employeeOnLeave.forEach(leave => {
                        const leaveTypeName = leave.leave_type.leave_type_name;
                        leaveTypeCounts[leaveTypeName] = (leaveTypeCounts[leaveTypeName] || 0) + 1;
                    });
                    leaveDetails[date] = {
                        total_employees: employeeOnLeave.length ? employeeOnLeave.length : null,
                        leave_types: leaveTypeCounts ? leaveTypeCounts : null
                    };
                });
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", leaveDetails);
                res.status(200).json(response);
            }
            else {
                next((0, BadRequest_1.badRequest)("Month and year are not provided in query parameters."));
            }
        }
        else {
            next((0, NotFound_1.notFound)("Cannot find employee"));
        }
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)('Something went wrong!'));
    }
};
exports.getManagerSpecificLeaveData = getManagerSpecificLeaveData;
const getTodayEvents = async (req, res, next) => {
    try {
        const today = (0, moment_1.default)().startOf('day');
        const todayDate = today.format('MM-DD');
        const birthdays = await models_1.User.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    {
                        dob_celebrated: {
                            [sequelize_1.Op.and]: [
                                db_1.sequelize.where(db_1.sequelize.fn('MONTH', db_1.sequelize.col('dob_celebrated')), today.month() + 1),
                                db_1.sequelize.where(db_1.sequelize.fn('DAY', db_1.sequelize.col('dob_celebrated')), { [sequelize_1.Op.gt]: today.date() })
                            ]
                        }
                    },
                    {
                        dob_celebrated: null,
                        [sequelize_1.Op.and]: [
                            db_1.sequelize.where(db_1.sequelize.fn('MONTH', db_1.sequelize.col('dob_adhaar')), today.month() + 1),
                            db_1.sequelize.where(db_1.sequelize.fn('DAY', db_1.sequelize.col('dob_adhaar')), { [sequelize_1.Op.gt]: today.date() })
                        ]
                    },
                ]
            },
            include: [
                {
                    model: profileImages_1.default,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'dob_celebrated'],
        });
        const birthday = await models_1.User.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    db_1.sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`),
                    {
                        dob_celebrated: null,
                        dob_adhaar: db_1.sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`)
                    }
                ]
            },
            include: [
                {
                    model: profileImages_1.default,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'dob_celebrated']
        });
        const upcomingAnniversary = await models_1.User.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    db_1.sequelize.where(db_1.sequelize.fn('MONTH', db_1.sequelize.col('date_of_joining')), today.month() + 1),
                    db_1.sequelize.where(db_1.sequelize.fn('DAY', db_1.sequelize.col('date_of_joining')), { [sequelize_1.Op.gt]: today.date() })
                ]
            },
            include: [
                {
                    model: profileImages_1.default,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'date_of_joining']
        });
        const anniversary = await models_1.User.findAll({
            where: {
                date_of_joining: db_1.sequelize.literal(`DATE_FORMAT(date_of_joining, '%m-%d') = '${todayDate}'`)
            },
            include: [
                {
                    model: profileImages_1.default,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'date_of_joining']
        });
        const responseBody = {
            upcoming_birthdays: birthdays,
            birthday: birthday,
            upcoming_anniversary: upcomingAnniversary,
            anniversary: anniversary
        };
        const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", responseBody);
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.getTodayEvents = getTodayEvents;
const getMyTeam = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        // const user = await User.findByPk(id, {
        //     include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']}, {model: ReportingRole}]}],
        //     attributes:['id', 'employee_name']
        // })
        const user = await models_1.User.findByPk(id, {
            include: [
                {
                    model: reportingManagers_1.default,
                    as: 'Managers',
                    include: [
                        { model: models_1.User, attributes: ['id', 'employee_generated_id', 'employee_name'] }
                    ],
                    attributes: ['id', 'user_id', 'reporting_role_id'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        const reportingManager = await reportingManagers_1.default.findByPk(user?.Managers[0]?.id, {
            include: [
                {
                    model: models_1.User, as: 'manager', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false
                },
                {
                    model: models_1.User, as: 'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false,
                    include: [
                        { model: profileImages_1.default, attributes: { exclude: ['createdAt', 'updatedAt'] } }
                    ]
                },
            ]
        });
        if (user) {
            if (reportingManager?.Employees.length > 0) {
                // const reportingManagers = user?.Manager as any[]
                // const minPriority = Math.max(...reportingManagers.map(manager => manager.reporting_role.priority))
                // const minPriorityManagers = reportingManagers.filter(manager => manager.reporting_role.priority === minPriority)
                // const reportingManager = await ReportingManagers.findByPk(minPriorityManagers[0].reporting_role_id, {
                //     include: [
                //         {
                //             model: User, as:'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], include: [{model: ProfileImages, attributes: {exclude: ['createdAt', 'updatedAt']}}], required: false, through: {attributes: []}
                //         }
                //     ],
                //     attributes: []
                // })
                const members = reportingManager?.Employees.filter(employee => employee.id !== id);
                const team = members.length > 0 ? members : [];
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", team);
                res.status(200).json(response);
            }
            else {
                const data = [];
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", data);
                res.status(200).json(response);
            }
        }
        else {
            next((0, NotFound_1.notFound)("Cannot find user with that id!"));
        }
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong"));
    }
};
exports.getMyTeam = getMyTeam;
const getEmployeeAttendanceSummary = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const user = await models_1.User.findByPk(id);
        // const currentMonthStartDate = moment().startOf('month').toDate();
        // const currentMonthEndDate = moment().endOf('month').toDate();
        const currentMonthStartDate = (0, moment_1.default)().startOf('month').toDate();
        const currentMonthEndDate = (0, moment_1.default)().endOf('month').toDate();
        function secondsToTime(seconds) {
            return (0, moment_1.default)(seconds * 1000).format('HH:mm:ss');
        }
        if (user) {
            const result = await models_1.Attendance.findOne({
                where: {
                    user_id: id,
                    date: {
                        [sequelize_1.Op.between]: [currentMonthStartDate, currentMonthEndDate],
                    },
                    punch_in_time: { [sequelize_1.Op.not]: null },
                    punch_out_time: { [sequelize_1.Op.not]: null },
                },
                attributes: [
                    [
                        db_1.sequelize.fn('TIME_FORMAT', db_1.sequelize.fn('SEC_TO_TIME', db_1.sequelize.fn('AVG', db_1.sequelize.fn('TIME_TO_SEC', db_1.sequelize.col('punch_in_time')))), '%H:%i:%s'),
                        'avg_in_time'
                    ],
                    [
                        db_1.sequelize.fn('TIME_FORMAT', db_1.sequelize.fn('SEC_TO_TIME', db_1.sequelize.fn('AVG', db_1.sequelize.fn('TIME_TO_SEC', db_1.sequelize.col('punch_out_time')))), '%H:%i:%s'),
                        'avg_out_time'
                    ],
                ],
            });
            const avgInTime = result?.getDataValue('avg_in_time');
            const avgOutTime = result?.getDataValue('avg_out_time');
            const averageWorkDuration = await models_1.Attendance.findOne({
                where: {
                    user_id: id,
                    date: {
                        [sequelize_1.Op.between]: [currentMonthStartDate, currentMonthEndDate],
                    },
                },
                attributes: [
                    [db_1.sequelize.fn('AVG', db_1.sequelize.literal('TIME_TO_SEC(TIMEDIFF(punch_out_time, punch_in_time))')), 'avg_work_duration'],
                ],
            });
            const avgWorkDurationInSeconds = averageWorkDuration?.getDataValue('avg_work_duration');
            const avgWorkDurationInMinutes = avgWorkDurationInSeconds / 60;
            const responseBody = {
                average_in_time: avgInTime,
                average_out_time: avgOutTime,
                avgWorkDurationInMinutes: avgWorkDurationInMinutes
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", responseBody);
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
exports.getEmployeeAttendanceSummary = getEmployeeAttendanceSummary;
const getManagerEvents = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const user = await models_1.User.findByPk(id);
        const reportingManager = await reportingManagers_1.default.findOne({
            where: {
                user_id: id
            },
            include: [
                {
                    model: models_1.User, as: 'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false, through: { attributes: [] }
                },
            ]
        });
        const today = (0, moment_1.default)().startOf('day');
        const todayDate = today.format('MM-DD');
        if (reportingManager) {
            const managedEmployeeIds = reportingManager.Employees.map((employee) => employee.id);
            const birthdays = await models_1.User.findAll({
                where: {
                    id: managedEmployeeIds,
                    [sequelize_1.Op.or]: [
                        {
                            dob_celebrated: {
                                [sequelize_1.Op.and]: [
                                    db_1.sequelize.where(db_1.sequelize.fn('MONTH', db_1.sequelize.col('dob_celebrated')), today.month() + 1),
                                    db_1.sequelize.where(db_1.sequelize.fn('DAY', db_1.sequelize.col('dob_celebrated')), { [sequelize_1.Op.gt]: today.date() })
                                ]
                            }
                        },
                        {
                            dob_celebrated: null,
                            [sequelize_1.Op.and]: [
                                db_1.sequelize.where(db_1.sequelize.fn('MONTH', db_1.sequelize.col('dob_adhaar')), today.month() + 1),
                                db_1.sequelize.where(db_1.sequelize.fn('DAY', db_1.sequelize.col('dob_adhaar')), { [sequelize_1.Op.gt]: today.date() })
                            ]
                        },
                    ]
                },
                include: [
                    {
                        model: profileImages_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                attributes: ['id', 'employee_name', 'employee_generated_id', 'dob_celebrated'],
            });
            const birthday = await models_1.User.findAll({
                where: {
                    id: managedEmployeeIds,
                    [sequelize_1.Op.or]: [
                        db_1.sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`),
                        {
                            dob_celebrated: null,
                            dob_adhaar: db_1.sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`)
                        }
                    ]
                },
                include: [
                    {
                        model: profileImages_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                attributes: ['id', 'employee_name', 'employee_generated_id', 'dob_celebrated']
            });
            const upcomingAnniversary = await models_1.User.findAll({
                where: {
                    id: managedEmployeeIds,
                    [sequelize_1.Op.and]: [
                        db_1.sequelize.where(db_1.sequelize.fn('MONTH', db_1.sequelize.col('date_of_joining')), today.month() + 1),
                        db_1.sequelize.where(db_1.sequelize.fn('DAY', db_1.sequelize.col('date_of_joining')), { [sequelize_1.Op.gt]: today.date() })
                    ]
                },
                include: [
                    {
                        model: profileImages_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                attributes: ['id', 'employee_name', 'employee_generated_id', 'date_of_joining']
            });
            const anniversary = await models_1.User.findAll({
                where: {
                    id: managedEmployeeIds,
                    date_of_joining: db_1.sequelize.literal(`DATE_FORMAT(date_of_joining, '%m-%d') = '${todayDate}'`)
                },
                include: [
                    {
                        model: profileImages_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                attributes: ['id', 'employee_name', 'employee_generated_id', 'date_of_joining']
            });
            const responseBody = {
                upcoming_birthdays: birthdays,
                birthday: birthday,
                upcoming_anniversary: upcomingAnniversary,
                anniversary: anniversary
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", responseBody);
            res.status(200).json(response);
        }
        else {
            next((0, NotFound_1.notFound)("Reporting Manager for this is not found!"));
        }
    }
    catch (err) {
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.getManagerEvents = getManagerEvents;
const getManagerRequestsSummary = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const user = await models_1.User.findByPk(id);
        const { year, month } = req.query;
        const startDate = (0, moment_1.default)().startOf('month');
        const endDate = (0, moment_1.default)(startDate).endOf('month');
        const reportingManager = await reportingManagers_1.default.findOne({
            where: {
                user_id: id
            },
            include: [
                {
                    model: models_1.User, as: 'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false, through: { attributes: [] }
                },
            ]
        });
        if (reportingManager) {
            const managedEmployeeIds = reportingManager.Employees.map((employee) => employee.id);
            const totalRequests = await regularizationRecord_1.default.count({
                where: {
                    user_id: managedEmployeeIds,
                    createdAt: {
                        [sequelize_1.Op.between]: [startDate.toDate(), endDate.toDate()],
                    },
                },
            });
            const approvedRequests = await regularizationRecord_1.default.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 2,
                    createdAt: {
                        [sequelize_1.Op.between]: [startDate.toDate(), endDate.toDate()]
                    }
                }
            });
            const pendingRequests = await regularizationRecord_1.default.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 1,
                    createdAt: {
                        [sequelize_1.Op.between]: [startDate.toDate(), endDate.toDate()],
                    },
                },
            });
            const rejectedRequests = await regularizationRecord_1.default.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 3,
                    createdAt: {
                        [sequelize_1.Op.between]: [startDate.toDate(), endDate.toDate()],
                    },
                },
            });
            const totalLeaveRequests = await models_1.LeaveRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    createdAt: {
                        [sequelize_1.Op.between]: [startDate.toDate(), endDate.toDate()]
                    }
                }
            });
            const totalPendingLeaveRequests = await models_1.LeaveRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 1,
                    createdAt: {
                        [sequelize_1.Op.between]: [startDate.toDate(), endDate.toDate()]
                    }
                }
            });
            const totalApprovedLeaveRequests = await models_1.LeaveRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 2,
                    createdAt: {
                        [sequelize_1.Op.between]: [startDate.toDate(), endDate.toDate()]
                    }
                }
            });
            const totalRejectedLeaveRequests = await models_1.LeaveRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 3,
                    createdAt: {
                        [sequelize_1.Op.between]: [startDate.toDate(), endDate.toDate()]
                    }
                }
            });
            const responseBody = {
                total_regularization_requests: totalRequests,
                approved_regularization_requests: approvedRequests,
                pending_regularization_requests: pendingRequests,
                rejected_regularization_requests: rejectedRequests,
                total_leave_requests: totalLeaveRequests,
                pending_leave_requests: totalPendingLeaveRequests,
                approved_leave_requests: totalApprovedLeaveRequests,
                rejected_leave_requests: totalRejectedLeaveRequests
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", responseBody);
            res.status(200).jsonp(response);
        }
        else {
            next((0, NotFound_1.notFound)("There is no reporting manager with that id!"));
        }
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.getManagerRequestsSummary = getManagerRequestsSummary;
const getAdminDivisionSummary = async (req, res, next) => {
    try {
        const { id } = req.credentials;
        const user = await models_1.User.findByPk(id);
        const { divisionId } = req.query;
        if (!user) {
            next((0, NotFound_1.notFound)("Cannot find an employee with that id!"));
        }
        if (user?.role_id !== 1) {
            next((0, Forbidden_1.forbiddenError)("The employee is not an admin!"));
        }
        if (!divisionId) {
            next((0, BadRequest_1.badRequest)("Division id is missing from query params"));
        }
        const division = await division_1.default.findByPk(divisionId, {
            include: [
                {
                    model: divisionUnits_1.default,
                    attributes: {
                        include: [
                            [sequelize_1.Sequelize.literal('(SELECT COUNT(*) FROM user_division WHERE user_division.unit_id = division_units.id)'), 'user_count'],
                            [
                                sequelize_1.Sequelize.literal('FORMAT((SELECT COUNT(*) FROM user_division WHERE user_division.unit_id = division_units.id) / (SELECT COUNT(*) FROM user WHERE deleted_at IS NULL AND status = true) * 100, 2)'),
                                'strength_percentage'
                            ]
                        ],
                        exclude: ['createdAt', 'updatedAt']
                    },
                    include: [
                        {
                            model: models_1.User,
                            attributes: [],
                            through: { attributes: [] }, // Include this to avoid retrieving the user_division junction table attributes
                        },
                    ]
                }
            ],
            attributes: ['id', 'division_name', 'system_generated']
        });
        if (!division) {
            next((0, NotFound_1.notFound)("Cannot find any division with that id!"));
        }
        res.status(200).json(division);
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
    }
};
exports.getAdminDivisionSummary = getAdminDivisionSummary;
