import moment, { Moment } from "moment";
import WeeklyOffAssociation from "../models/weeklyOffAssociation";
import { Op } from "sequelize";
import { Attendance } from "../models";
import ShiftPolicy from "../models/shiftPolicy";


export const calculateBaseWorkingHours = (shift_start_time: string | any, shift_end_time: string | any) => {
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

    return `${hours}:${minutes}`

    // return {
    //     hours: hours,
    //     minutes: minutes
    // };
}


//Helper Functions
export const calculateWorkingHours = (shiftPolicy: ShiftPolicy | null | any, punchInTime: moment.MomentInput, punchOutTime: moment.MomentInput) => {

    if(!punchInTime || !punchOutTime){
        return{
            baseWorkingHours: '00:00',
            actualWorkingHours: '00:00',   
        }
    }

    const punchIn = moment(punchInTime, 'HH:mm:ss').set({seconds: 0, milliseconds: 0});
    const punchOut = moment(punchOutTime, 'HH:mm:ss').set({seconds: 0, milliseconds: 0});

    if (punchIn.isAfter(punchOut)) {
        punchOut.add(1440, 'minutes');
    }

    if (shiftPolicy?.shift_type_id === 1) {
        const shiftStart = moment(shiftPolicy?.shift_start_time, 'HH:mm').set({seconds: 0, milliseconds: 0});
        const shiftEnd = moment(shiftPolicy?.shift_end_time, 'HH:mm').set({seconds: 0, milliseconds: 0});

        if (shiftStart.isAfter(shiftEnd)) {
            shiftEnd.add(1440, 'minutes');
        }

        const baseWorkingHours = moment.duration(moment(shiftPolicy?.shift_end_time, 'HH:mm').set({seconds: 0, milliseconds: 0}).diff(moment(shiftPolicy?.shift_start_time, 'HH:mm:ss').set({seconds: 0, milliseconds: 0}))).asMinutes();
        const actualWorkingHours = moment.duration(moment(punchOutTime, 'HH:mm').set({seconds: 0, milliseconds: 0}).diff(moment(punchInTime, 'HH:mm:ss').set({seconds: 0, milliseconds: 0}))).asMinutes();

        return {
            baseWorkingHours,
            actualWorkingHours,
        };
    } else if (shiftPolicy?.shift_type_id === 2) {
        const baseWorkingHours = moment.duration(shiftPolicy?.base_working_hours, 'minutes').asMinutes();
        const actualWorkingHours = moment.duration(punchOut.diff(punchIn)).asMinutes();

        return {
            baseWorkingHours,
            actualWorkingHours,
        };
    }

    return null;
};

export const calculateOvertimeDeficit = (actualWorkingHours: string | number | { baseWorkingHours: string; actualWorkingHours: string; } | { baseWorkingHours: number; actualWorkingHours: number; }, baseWorkingHours: string | number | { baseWorkingHours: string; actualWorkingHours: string; } | { baseWorkingHours: number; actualWorkingHours: number; }) => {
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
    } else if (minutesDifference < 0) {
        const deficitHoursInt = Math.floor(Math.abs(minutesDifference) / 60);
        const deficitMinutesRemainder = Math.floor(Math.abs(minutesDifference) % 60);
        const deficit_hours = `${deficitHoursInt.toString().padStart(2, '0')}:${deficitMinutesRemainder.toString().padStart(2, '0')}`;
        return {
            overtime_hours: '00:00',
            deficit_hours,
        };
    } else {
        return {
            overtime_hours: '00:00',
            deficit_hours: '00:00',
        };
    }
};


function weeksInMonth(year: number, month: number) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const remainingDays = daysInMonth - (7 - firstDayOfWeek);
    return Math.ceil(remainingDays / 7) + 1;
}

//This function gives the total working days in a month of an employee based on their weekly off policy that has been assigned to them
export const getWorkingDaysInAMonth = async(weeklyOffPolicyId: string | number) => {
    const totalDaysInAMonth = moment().daysInMonth();

    let totalWorkingDays = totalDaysInAMonth;

    const weeklyOffAssociations = await WeeklyOffAssociation.findAll({
        where: {
            weekly_off_policy_id: weeklyOffPolicyId
        }
    })

    totalWorkingDays = totalDaysInAMonth - weeklyOffAssociations.length

    return totalWorkingDays

}

export async function getTotalWorkingDaysInCurrentWeek(weeklyOffPolicyId: string | number) {
    // Get the current date
    const currentDate = moment();

    function getWeekNumberInMonth(date: string | number | Moment) {
        const dayNumber = moment(date).format('D');
        return Math.ceil(parseInt(dayNumber, 10) / 7);
    }

    const currentWeek = getWeekNumberInMonth(currentDate)

    // Query the database to get the associations for the current week
    const associations = await WeeklyOffAssociation.findAll({
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

export async function getTotalCompletedHoursForMonth(year: string | number, month: string | number, userId: string | number) {

    const startDate = moment(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD')
    const endDate = moment(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD')

    console.log(startDate, endDate)

    const attendances = await Attendance.findAll({
        where: {
            user_id: userId,
            date: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        }
    }) as any;

    let totalHours = 0;
    //@ts-ignore
    attendances.forEach(attendance => {
        if (attendance?.punch_in_time && attendance?.punch_out_time) {
            const punchInTime = moment(attendance.punch_in_time, 'HH:mm:ss');
            const punchOutTime = moment(attendance.punch_out_time, 'HH:mm:ss');
            const duration = moment.duration(punchOutTime.diff(punchInTime));
            totalHours += duration.asHours();
        }
    });

    return totalHours;
}

export async function getTotalCompletedHoursForWeek(year: string | number, month: string | number, userId: string | number) {
    const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = moment(`${year}-${month}-01`).endOf('month').toDate();

    const currentDate = moment()

    function getWeekNumberInMonth(date: string | number | Moment) {
        const dayNumber = moment(date).format('D');
        return Math.ceil(parseInt(dayNumber, 10) / 7);
    }

    const weekNumber = getWeekNumberInMonth(currentDate);

    const startOfWeek = moment(startDate).add(weekNumber - 1, 'weeks').startOf('week').toDate();
    const endOfWeek = moment(startDate).add(weekNumber - 1, 'weeks').endOf('week').toDate();

    const attendances = await Attendance.findAll({
        where: {
            user_id: userId,
            date: {
                [Op.between]: [startOfWeek, endOfWeek]
            }
        }
    });
    

    let totalHours = 0;
    attendances.forEach((attendance : any) => {
        if (attendance.punch_in_time && attendance.punch_out_time) {
            const punchInTime = moment(attendance.punch_in_time, 'HH:mm:ss');
            const punchOutTime = moment(attendance.punch_out_time, 'HH:mm:ss');
            const duration = moment.duration(punchOutTime.diff(punchInTime));
            totalHours += duration.asHours();
        }
    });

    return totalHours;
}

export async function calcualteOvertimeHours (attendanceLogs: any[], totalRegularHours: number){
    let totalWorkedHours = 0;

    attendanceLogs.forEach(log => {
        const punchInTime = moment(log.punch_in_time, 'HH:mm:ss')
        const punchOutTime = moment(log.punch_out_time, 'HH:mm:ss')
        const workedHours = moment.duration(punchOutTime.diff(punchInTime)).asHours()
        totalWorkedHours += workedHours
    })

    const overtimeHours = Math.max(0, totalWorkedHours - totalRegularHours);
    return overtimeHours
}


export function calculateAveragePunchInTime(punchInTimes: string[]) {
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


export function compareObjects(obj1: any, obj2: any): boolean {
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

export const isDateHoliday = async (date: Moment, holidayCalendar: any): Promise<boolean> => {
    const inputDate = moment(date)

    for (const holidayDatabase of holidayCalendar.holiday_databases){
        const holidayDate = moment(holidayDatabase.date);

        if(inputDate.isSame(holidayDate, 'day') && inputDate.isSame(holidayDate, 'year')){
            return true;
        }
    }

    return false;
};

// Function to check if a given date is a weekday off for a specific employee
export function isWeekdayOffForUser(employeeId: any, currentDate: any, weekDayOffPolicy: any) {
    // const weekNumber = getISOWeekNumber(currentDate);
    const weekNumber = getMonthWeekNumber(currentDate);
    const dayNumber = currentDate.isoWeekday();

    console.log("Week Number, day Number", weekNumber, dayNumber)

    return weekDayOffPolicy?.weekly_off_associations.some(
        (association: { week_number: number; week_name: any; }) => association.week_number === weekNumber && association.week_name === dayNumber
    );
}

//Function to get week number
export function getMonthWeekNumber(date: any) {
    const startOfMonth = moment(date).startOf('month');
    const startOfWeek = startOfMonth.clone().startOf('week');
    const diff = moment(date).diff(startOfWeek, 'weeks');
    return diff + 1;
}

// Function to get ISO week number
export function getISOWeekNumber(date: any) {
    console.log(moment(date).isoWeek())
    return moment(date).isoWeek();
}

