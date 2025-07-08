"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceLog = void 0;
const moment_1 = __importDefault(require("moment"));
const models_1 = require("../models");
const shiftPolicy_1 = __importDefault(require("../models/shiftPolicy"));
const getMasterPolicy_1 = require("../services/masterPolicy/getMasterPolicy");
const weeklyOffPolicy_1 = __importDefault(require("../models/weeklyOffPolicy"));
const weeklyOffAssociation_1 = __importDefault(require("../models/weeklyOffAssociation"));
const sequelize_1 = require("sequelize");
const holidayCalendar_1 = __importDefault(require("../models/holidayCalendar"));
const holidayDatabase_1 = __importDefault(require("../models/holidayDatabase"));
const attendancePolicy_1 = __importDefault(require("../models/attendancePolicy"));
const helpers_1 = require("../helpers");
const AttendanceLog = async () => {
    try {
        const activeUsers = await models_1.User.findAll({
            where: {
                status: true
            },
            attributes: ['id', 'employee_generated_id'],
            raw: true
        });
        const currentDate = (0, moment_1.default)();
        console.log(currentDate);
        for (const user of activeUsers) {
            const user_id = user.id;
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(user_id);
            const shiftPolicyId = masterPolicy.shift_policy_id;
            const shiftPolicy = await shiftPolicy_1.default.findByPk(shiftPolicyId);
            const attendancePolicy = await attendancePolicy_1.default?.findByPk(masterPolicy?.attendance_policy_id);
            console.log(">>>>>>>>>>>>", attendancePolicy);
            const existingRecord = await models_1.Attendance.findOne({
                where: {
                    user_id: user_id,
                    date: currentDate.format('YYYY-MM-DD'),
                }
            });
            console.log("AHAHAHA", currentDate.clone().subtract(1, 'days').format('YYYY-MM-DD'));
            const previousDayRecord = await models_1.Attendance.findOne({
                where: {
                    user_id: user_id,
                    date: currentDate.clone().subtract(1, 'days').format('YYYY-MM-DD'),
                },
            });
            const weekDayOffPolicy = await weeklyOffPolicy_1.default.findByPk(masterPolicy?.weekly_off_policy_id, {
                include: [
                    {
                        model: weeklyOffAssociation_1.default,
                        attributes: ['id', 'week_name', 'week_number'],
                        required: false
                    },
                ]
            });
            const leaveRecords = await models_1.LeaveRecord.findAll({
                where: {
                    user_id: user_id,
                    status: 2,
                    start_date: {
                        [sequelize_1.Op.lte]: currentDate.format('YYYY-MM-DD')
                    },
                    end_date: {
                        [sequelize_1.Op.gte]: currentDate.format('YYYY-MM-DD')
                    }
                }
            });
            const holidayCalendar = await holidayCalendar_1.default.findByPk(masterPolicy?.holiday_calendar_id, {
                include: [
                    {
                        model: holidayDatabase_1.default,
                        attributes: ['id', 'name', 'date']
                    }
                ]
            });
            const isHoliday = await (0, helpers_1.isDateHoliday)(currentDate, holidayCalendar);
            if (!existingRecord) {
                const isWeekdayOff = (0, helpers_1.isWeekdayOffForUser)(user_id, currentDate, weekDayOffPolicy);
                console.log("WEEKDAY OFF", isWeekdayOff, user_id);
                const isFirstDayOfMonth = currentDate.date() === 1;
                console.log(">>>>>>>>>>>>>>>>>", currentDate.format('YYYY-MM-DD HH:mm:ss'));
                const formData = {
                    user_id: user_id,
                    employee_generated_id: user.employee_generated_id,
                    date: currentDate.format('YYYY-MM-DD'),
                    // status: isWeekdayOff ? 4 : 1,  //Mark Absent as default,
                    flexi_counter: isFirstDayOfMonth ? 0 : previousDayRecord?.flexi_counter,
                    grace_counter: isFirstDayOfMonth ? 0 : previousDayRecord?.grace_counter,
                    createdAt: currentDate.format('YYYY-MM-DD HH:mm:ss'),
                    updatedAt: currentDate.format('YYYY-MM-DD HH:mm:ss')
                };
                if (isWeekdayOff) {
                    formData.status = 4;
                }
                else if (isHoliday) {
                    formData.status = 5;
                }
                else if (leaveRecords.length > 0) {
                    formData.status = 6;
                }
                else {
                    formData.status = attendancePolicy?.default_attendance_status;
                }
                await models_1.Attendance.create(formData);
            }
            console.log('Attendance records created for the day.');
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.AttendanceLog = AttendanceLog;
