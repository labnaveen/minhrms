import moment, { Moment } from "moment";
import { Attendance, LeaveRecord, User } from "../models"
import Shift from "../models/dropdown/type/shift";
import ShiftPolicy from "../models/shiftPolicy";
import { getMasterPolicy } from "../services/masterPolicy/getMasterPolicy";
import WeeklyOffPolicy from "../models/weeklyOffPolicy";
import WeeklyOffAssociation from "../models/weeklyOffAssociation";
import { Op } from "sequelize";
import HolidayCalendar from "../models/holidayCalendar";
import HolidayDatabase from "../models/holidayDatabase";
import AttendancePolicy from "../models/attendancePolicy";
import Announcement from "../models/announcements";
import DivisionUnits from "../models/divisionUnits";
import { EmployeeResponseType } from "../interface/employee";
import { isDateHoliday, isWeekdayOffForUser } from "../helpers";




export const AttendanceLog = async(): Promise<void> => {
    try{

        const activeUsers = await User.findAll({
            where: {
                status: true
            },
            attributes: ['id', 'employee_generated_id'],
            raw: true
        }) as any;

        const currentDate = moment()

        console.log(currentDate)

        for (const user of activeUsers){
            const user_id = user.id

            const masterPolicy = await getMasterPolicy(user_id) as any

            const shiftPolicyId = masterPolicy.shift_policy_id

            const shiftPolicy = await ShiftPolicy.findByPk(shiftPolicyId)

            const attendancePolicy = await AttendancePolicy?.findByPk(masterPolicy?.attendance_policy_id) as any;

            console.log(">>>>>>>>>>>>", attendancePolicy)

            const existingRecord = await Attendance.findOne({
                where: {
                    user_id: user_id,
                    date: currentDate.format('YYYY-MM-DD'),
                }
            })

            console.log("AHAHAHA", currentDate.clone().subtract(1, 'days').format('YYYY-MM-DD'))

            const previousDayRecord = await Attendance.findOne({
                where: {
                  user_id: user_id,
                  date: currentDate.clone().subtract(1, 'days').format('YYYY-MM-DD'),
                },
            }) as any;
            
            const weekDayOffPolicy = await WeeklyOffPolicy.findByPk(masterPolicy?.weekly_off_policy_id, {
                include: [
                    {
                        model: WeeklyOffAssociation,
                        attributes: ['id', 'week_name', 'week_number'],
                        required: false
                    },
                    
                ]
            })

            const leaveRecords = await LeaveRecord.findAll({
                where: {
                    user_id: user_id,
                    status: 2,
                    start_date: {
                        [Op.lte]: currentDate.format('YYYY-MM-DD')
                    },
                    end_date: {
                        [Op.gte]: currentDate.format('YYYY-MM-DD')
                    }
                }
            })

            const holidayCalendar = await HolidayCalendar.findByPk(masterPolicy?.holiday_calendar_id, {
                include: [
                    {
                        model: HolidayDatabase,
                        attributes: ['id', 'name', 'date']
                    }
                ]
            })

            const isHoliday = await isDateHoliday(currentDate, holidayCalendar);

            if(!existingRecord){

                const isWeekdayOff = isWeekdayOffForUser(user_id, currentDate, weekDayOffPolicy);

                console.log("WEEKDAY OFF", isWeekdayOff, user_id)

                const isFirstDayOfMonth = currentDate.date() === 1;

                console.log(">>>>>>>>>>>>>>>>>", currentDate.format('YYYY-MM-DD HH:mm:ss'))

                const formData = {
                    user_id: user_id,
                    employee_generated_id: user.employee_generated_id,
                    date: currentDate.format('YYYY-MM-DD'),
                    // status: isWeekdayOff ? 4 : 1,  //Mark Absent as default,
                    flexi_counter: isFirstDayOfMonth? 0 : previousDayRecord?.flexi_counter,
                    grace_counter: isFirstDayOfMonth? 0 : previousDayRecord?.grace_counter,
                    createdAt: currentDate.format('YYYY-MM-DD HH:mm:ss'),
                    updatedAt: currentDate.format('YYYY-MM-DD HH:mm:ss')
                } as any;

                if(isWeekdayOff){
                    formData.status = 4;
                } else if (isHoliday){
                    formData.status = 5;
                }else if (leaveRecords.length > 0){
                    formData.status = 6;
                }else{
                    formData.status = attendancePolicy?.default_attendance_status;
                }

                await Attendance.create(formData)
            }

            console.log('Attendance records created for the day.');
        }
    }catch(err){
        console.error(err)
    }
}