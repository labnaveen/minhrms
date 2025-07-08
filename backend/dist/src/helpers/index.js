"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getISOWeekNumber = exports.getMonthWeekNumber = exports.isWeekdayOffForUser = exports.isDateHoliday = exports.compareObjects = exports.calculateAveragePunchInTime = exports.calcualteOvertimeHours = exports.getTotalCompletedHoursForWeek = exports.getTotalCompletedHoursForMonth = exports.getTotalWorkingDaysInCurrentWeek = exports.getWorkingDaysInAMonth = exports.calculateOvertimeDeficit = exports.calculateWorkingHours = exports.calculateBaseWorkingHours = void 0;
const moment_1 = __importDefault(require("moment"));
const weeklyOffAssociation_1 = __importDefault(require("../models/weeklyOffAssociation"));
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const calculateBaseWorkingHours = (shift_start_time, shift_end_time) => {
    const startTimeArray = shift_start_time.split(':');
    const endTimeArray = shift_end_time.split(':');
    const startMinutes = parseInt(startTimeArray[0]) * 60 + parseInt(startTimeArray[1]);
    const endMinutes = parseInt(endTimeArray[0]) * 60 + parseInt(endTimeArray[1]);
    let timeDifference = endMinutes - startMinutes;
    if (timeDifference < 0) {
        timeDifference += 24 * 60;
    }
    const hours = Math.floor(timeDifference / 60);
    const minutes = timeDifference % 60;
    return `${hours}:${minutes}`;
    // return {
    //     hours: hours,
    //     minutes: minutes
    // };
};
exports.calculateBaseWorkingHours = calculateBaseWorkingHours;
//Helper Functions
const calculateWorkingHours = (shiftPolicy, punchInTime, punchOutTime) => {
    if (!punchInTime || !punchOutTime) {
        return {
            baseWorkingHours: '00:00',
            actualWorkingHours: '00:00',
        };
    }
    const punchIn = (0, moment_1.default)(punchInTime, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 });
    const punchOut = (0, moment_1.default)(punchOutTime, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 });
    if (punchIn.isAfter(punchOut)) {
        punchOut.add(1440, 'minutes');
    }
    if (shiftPolicy?.shift_type_id === 1) {
        const shiftStart = (0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 });
        const shiftEnd = (0, moment_1.default)(shiftPolicy?.shift_end_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 });
        if (shiftStart.isAfter(shiftEnd)) {
            shiftEnd.add(1440, 'minutes');
        }
        const baseWorkingHours = moment_1.default.duration((0, moment_1.default)(shiftPolicy?.shift_end_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 }).diff((0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 }))).asMinutes();
        const actualWorkingHours = moment_1.default.duration((0, moment_1.default)(punchOutTime, 'HH:mm').set({ seconds: 0, milliseconds: 0 }).diff((0, moment_1.default)(punchInTime, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 }))).asMinutes();
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
exports.calculateWorkingHours = calculateWorkingHours;
const calculateOvertimeDeficit = (actualWorkingHours, baseWorkingHours) => {
    //@ts-ignore
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
exports.calculateOvertimeDeficit = calculateOvertimeDeficit;
function weeksInMonth(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const remainingDays = daysInMonth - (7 - firstDayOfWeek);
    return Math.ceil(remainingDays / 7) + 1;
}
//This function gives the total working days in a month of an employee based on their weekly off policy that has been assigned to them
const getWorkingDaysInAMonth = async (weeklyOffPolicyId) => {
    const totalDaysInAMonth = (0, moment_1.default)().daysInMonth();
    let totalWorkingDays = totalDaysInAMonth;
    const weeklyOffAssociations = await weeklyOffAssociation_1.default.findAll({
        where: {
            weekly_off_policy_id: weeklyOffPolicyId
        }
    });
    totalWorkingDays = totalDaysInAMonth - weeklyOffAssociations.length;
    return totalWorkingDays;
};
exports.getWorkingDaysInAMonth = getWorkingDaysInAMonth;
async function getTotalWorkingDaysInCurrentWeek(weeklyOffPolicyId) {
    // Get the current date
    const currentDate = (0, moment_1.default)();
    function getWeekNumberInMonth(date) {
        const dayNumber = (0, moment_1.default)(date).format('D');
        return Math.ceil(parseInt(dayNumber, 10) / 7);
    }
    const currentWeek = getWeekNumberInMonth(currentDate);
    // Query the database to get the associations for the current week
    const associations = await weeklyOffAssociation_1.default.findAll({
        where: {
            weekly_off_policy_id: weeklyOffPolicyId,
            week_number: currentWeek,
        }
    });
    // Calculate the total number of days in the week
    const totalDaysInWeek = 7;
    // Subtract the number of weekly offs from the total days to get the working days
    const workingDaysInWeek = totalDaysInWeek - associations.length;
    return workingDaysInWeek;
}
exports.getTotalWorkingDaysInCurrentWeek = getTotalWorkingDaysInCurrentWeek;
async function getTotalCompletedHoursForMonth(year, month, userId) {
    const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD');
    const endDate = (0, moment_1.default)(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD');
    console.log(startDate, endDate);
    const attendances = await models_1.Attendance.findAll({
        where: {
            user_id: userId,
            date: {
                [sequelize_1.Op.gte]: startDate,
                [sequelize_1.Op.lte]: endDate
            }
        }
    });
    let totalHours = 0;
    //@ts-ignore
    attendances.forEach(attendance => {
        if (attendance?.punch_in_time && attendance?.punch_out_time) {
            const punchInTime = (0, moment_1.default)(attendance.punch_in_time, 'HH:mm:ss');
            const punchOutTime = (0, moment_1.default)(attendance.punch_out_time, 'HH:mm:ss');
            const duration = moment_1.default.duration(punchOutTime.diff(punchInTime));
            totalHours += duration.asHours();
        }
    });
    return totalHours;
}
exports.getTotalCompletedHoursForMonth = getTotalCompletedHoursForMonth;
async function getTotalCompletedHoursForWeek(year, month, userId) {
    const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = (0, moment_1.default)(`${year}-${month}-01`).endOf('month').toDate();
    const currentDate = (0, moment_1.default)();
    function getWeekNumberInMonth(date) {
        const dayNumber = (0, moment_1.default)(date).format('D');
        return Math.ceil(parseInt(dayNumber, 10) / 7);
    }
    const weekNumber = getWeekNumberInMonth(currentDate);
    const startOfWeek = (0, moment_1.default)(startDate).add(weekNumber - 1, 'weeks').startOf('week').toDate();
    const endOfWeek = (0, moment_1.default)(startDate).add(weekNumber - 1, 'weeks').endOf('week').toDate();
    const attendances = await models_1.Attendance.findAll({
        where: {
            user_id: userId,
            date: {
                [sequelize_1.Op.between]: [startOfWeek, endOfWeek]
            }
        }
    });
    let totalHours = 0;
    attendances.forEach((attendance) => {
        if (attendance.punch_in_time && attendance.punch_out_time) {
            const punchInTime = (0, moment_1.default)(attendance.punch_in_time, 'HH:mm:ss');
            const punchOutTime = (0, moment_1.default)(attendance.punch_out_time, 'HH:mm:ss');
            const duration = moment_1.default.duration(punchOutTime.diff(punchInTime));
            totalHours += duration.asHours();
        }
    });
    return totalHours;
}
exports.getTotalCompletedHoursForWeek = getTotalCompletedHoursForWeek;
async function calcualteOvertimeHours(attendanceLogs, totalRegularHours) {
    let totalWorkedHours = 0;
    attendanceLogs.forEach(log => {
        const punchInTime = (0, moment_1.default)(log.punch_in_time, 'HH:mm:ss');
        const punchOutTime = (0, moment_1.default)(log.punch_out_time, 'HH:mm:ss');
        const workedHours = moment_1.default.duration(punchOutTime.diff(punchInTime)).asHours();
        totalWorkedHours += workedHours;
    });
    const overtimeHours = Math.max(0, totalWorkedHours - totalRegularHours);
    return overtimeHours;
}
exports.calcualteOvertimeHours = calcualteOvertimeHours;
function calculateAveragePunchInTime(punchInTimes) {
    if (!punchInTimes || punchInTimes.length === 0) {
        return null; // Return null if no punch-in times are provided
    }
    // Convert punch-in times to total seconds
    const totalSeconds = punchInTimes.reduce((total, time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return total + hours * 3600 + minutes * 60 + seconds;
    }, 0);
    // Calculate average seconds
    const averageSeconds = totalSeconds / punchInTimes.length;
    // Convert average seconds back to HH:mm:ss format
    const averageHours = Math.floor(averageSeconds / 3600);
    const averageMinutes = Math.floor((averageSeconds % 3600) / 60);
    const averageSecondsRemainder = averageSeconds % 60;
    const formattedAverageTime = `${String(averageHours).padStart(2, '0')}:${String(averageMinutes).padStart(2, '0')}:${String(averageSecondsRemainder).padStart(2, '0')}`;
    return formattedAverageTime;
}
exports.calculateAveragePunchInTime = calculateAveragePunchInTime;
function compareObjects(obj1, obj2) {
    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    // If the number of keys is different, objects are different
    if (keys1.length !== keys2.length) {
        return false;
    }
    // Iterate through the keys of obj1 and compare values with obj2
    for (const key of keys1) {
        // Check if the value of the current key is different in both objects
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    // If all key-value pairs match, objects are identical
    return true;
}
exports.compareObjects = compareObjects;
const isDateHoliday = async (date, holidayCalendar) => {
    const inputDate = (0, moment_1.default)(date);
    for (const holidayDatabase of holidayCalendar.holiday_databases) {
        const holidayDate = (0, moment_1.default)(holidayDatabase.date);
        if (inputDate.isSame(holidayDate, 'day') && inputDate.isSame(holidayDate, 'year')) {
            return true;
        }
    }
    return false;
};
exports.isDateHoliday = isDateHoliday;
// Function to check if a given date is a weekday off for a specific employee
function isWeekdayOffForUser(employeeId, currentDate, weekDayOffPolicy) {
    // const weekNumber = getISOWeekNumber(currentDate);
    const weekNumber = getMonthWeekNumber(currentDate);
    const dayNumber = currentDate.isoWeekday();
    console.log("Week Number, day Number", weekNumber, dayNumber);
    return weekDayOffPolicy?.weekly_off_associations.some((association) => association.week_number === weekNumber && association.week_name === dayNumber);
}
exports.isWeekdayOffForUser = isWeekdayOffForUser;
//Function to get week number
function getMonthWeekNumber(date) {
    const startOfMonth = (0, moment_1.default)(date).startOf('month');
    const startOfWeek = startOfMonth.clone().startOf('week');
    const diff = (0, moment_1.default)(date).diff(startOfWeek, 'weeks');
    return diff + 1;
}
exports.getMonthWeekNumber = getMonthWeekNumber;
// Function to get ISO week number
function getISOWeekNumber(date) {
    console.log((0, moment_1.default)(date).isoWeek());
    return (0, moment_1.default)(date).isoWeek();
}
exports.getISOWeekNumber = getISOWeekNumber;
