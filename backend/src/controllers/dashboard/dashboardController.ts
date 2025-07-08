//@ts-nocheck
import { NextFunction, Request, Response, response } from "express";
import { internalServerError } from "../../services/error/InternalServerError";
import Announcement from "../../models/announcements";
import { generateResponse } from "../../services/response/response";
import { Attendance, AttendanceStatus, LeaveRecord, LeaveType, User } from "../../models";
import DivisionUnits from "../../models/divisionUnits";
import { EmployeeResponseType } from "../../interface/employee";
import { Op, Sequelize } from "sequelize";
import { badRequest } from "../../services/error/BadRequest";
import { sequelize } from "../../utilities/db";
import { getMasterPolicy } from "../../services/masterPolicy/getMasterPolicy";
import ShiftPolicy from "../../models/shiftPolicy";
import { calculateBaseWorkingHours } from "../../helpers";
import { ShiftPolicyAttributes } from "../shiftPolicy/shiftPolicyController";
import moment from "moment";
import { notFound } from "../../services/error/NotFound";
import Approval from "../../models/dropdown/status/approval";
import HolidayCalendar from "../../models/holidayCalendar";
import HolidayDatabase from "../../models/holidayDatabase";
import DayType from "../../models/dropdown/dayType/dayType";
import ProfileImages from "../../models/profileImages";
import ReportingManagers from "../../models/reportingManagers";
import ReportingRole from "../../models/reportingRole";
import { getLeastPriorityManager } from "../../utilities/getLeastPriorityManager";
import RegularizationRequest from "../../models/regularizationRequest";
import RegularizationRecord from "../../models/regularizationRecord";
import { forbiddenError } from "../../services/error/Forbidden";
import Division from "../../models/division";



export const getAnnouncementsForDashboard = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        
        const {id} = req.credentials
        const { page, records } = req.query as { page: string, records: string };

        if (!page && !records) {
            // res.status(400).json({message: "No request parameters are present!"})
            next(badRequest("No request parameters are present!"))
            return
        }

        const pageNumber = parseInt(page)
        const recordsPerPage = parseInt(records)

        const offset = (pageNumber - 1) * recordsPerPage;

        const employee = await User.findByPk(id, {
            include: [
                {
                    model: DivisionUnits,
                }
            ]
        }) as EmployeeResponseType | null

        const divisionUnit = employee?.division_units?.map((unit) => unit.id)

        console.log(">>>>>>>>>", moment().format("YYYY-MM-DD"))
        

        const _announcement = await Announcement.findAll({
            attributes: ['id'],
            where: {
                [Op.or]: [
                    {
                        group_specific: false,
                    },
                    {
                        group_specific: true,
                        '$division_units.id$':{
                            [Op.in]: divisionUnit
                        }
                    },
                ]
            },
            include: [
                {
                    model: DivisionUnits,
                    through: { attributes: [] },
                    as: 'division_units',
                    attributes: ['id'],
                    where: {
                        id: {
                            [Op.in]: divisionUnit
                        }
                    }
                }
            ]
        })

        const announcementIdsArray = _announcement.map(item => item.id );

        const announcements = await Announcement.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            {
                                id:{
                                    [Op.in]: announcementIdsArray
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
                        [Op.and]: [
                            { suspendable: true },
                            { start_date: { [Op.lte]: moment().format("YYYY-MM-DD") } },
                            { end_date: { [Op.gte]: moment().format('YYYY-MM-DD')} }
                        ]
                    }
                ]
                
            },
            include:[
                {
                    model: DivisionUnits,
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
        })


        const totalPages = Math.ceil(announcements.count / recordsPerPage)
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;

        const meta = {
            totalCount: announcements.count,
            pageCount: totalPages,
            currentPage: page,
            perPage: recordsPerPage,
            hasNextPage,
            hasPrevPage
          }
  
          const result = {
            data: announcements.rows,
            meta
          }

        const response = generateResponse(200, true, "Announcements fetched succesfully!", result.data, meta)

        res.status(200).json(response)
        
    }catch(err){
        res.status(500).json(err)
        // next(internalServerError("Something went wrong!"))
    }
}

export const getTimeSheet = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{

        const {id} = req.credentials

        const employee = await User.findByPk(id);

        const masterPolicy = await getMasterPolicy(id);

        const shiftPolicy = await ShiftPolicy.findByPk(masterPolicy?.shift_policy_id) as ShiftPolicyAttributes | null;

        const workingHours = calculateBaseWorkingHours(shiftPolicy?.shift_start_time, shiftPolicy?.shift_end_time)

        const baseWorkingHours = shiftPolicy?.base_working_hours

        const date = moment().format('YYYY-MM-DD')

        const attendance = await Attendance.findAll({
            attributes:['id', 'user_id', 'employee_generated_id', 'date', 'punch_in_time', 'punch_out_time', 'status']
        })


        const responseBody = {
            attendance_data: attendance,
            shift_time: workingHours? workingHours : baseWorkingHours
        }

        const response =  generateResponse(200, true, "Attendance Data fetched succesfully!", responseBody)

        res.status(200).json(response)
        
    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong!"))
    }
}


export const getEmployeeMetaData = async(req: Request, res:Response, next: NextFunction): Promise<void> => {
    try{

        const todayStart = moment().startOf('day');
        const todayEnd = moment().endOf('day');

        const today = moment().startOf('day');
        
        const todayDate = today.format('MM-DD')

        const totalEmployee = await User.count()
        const attendance = await Attendance.findAndCountAll({
            where:{
                date: {
                    [Op.between]: [todayStart, todayEnd]
                },
                is_deleted: false,
                punch_in_time: {
                    [Op.not]: null
                }
            },
            order: [['id', 'DESC']]
        });
        
        const absent_employees = totalEmployee - attendance?.count

        const birthdays = await User.findAll({
            where:{
                [Op.or]: [
                    {
                        dob_celebrated: {
                            [Op.and]: [
                                sequelize.where(sequelize.fn('MONTH', sequelize.col('dob_celebrated')), today.month() + 1),
                                sequelize.where(sequelize.fn('DAY', sequelize.col('dob_celebrated')), { [Op.gt]: today.date() })
                            ]
                        }
                    },
                    {
                        dob_celebrated: null,
                        [Op.and]: [
                            sequelize.where(sequelize.fn('MONTH', sequelize.col('dob_adhaar')), today.month() + 1),
                            sequelize.where(sequelize.fn('DAY', sequelize.col('dob_adhaar')), { [Op.gt]: today.date()} )
                        ]
                    },
                ]
            },
            include: [
                {
                    model: ProfileImages,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes:['id', 'employee_name', 'employee_generated_id', 'dob_celebrated'],
        });

        const birthday = await User.findAll({
            where:{
                [Op.or]: [
                    sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`),
                    {
                        dob_celebrated: null,
                        dob_adhaar: sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`)
                    }
                ]
            },
            include: [
                {
                    model: ProfileImages,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'dob_celebrated']
        })

        const upcomingAnniversary = await User.findAll({
            where:{
                [Op.and]: [
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('date_of_joining')), today.month() + 1),
                    sequelize.where(sequelize.fn('DAY', sequelize.col('date_of_joining')), { [Op.gt]: today.date()})
                ]
            },
            include: [
                {
                    model: ProfileImages,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'date_of_joining']
        })


        const anniversary = await User.findAll({
            where: {
                date_of_joining: sequelize.literal(`DATE_FORMAT(date_of_joining, '%m-%d') = '${todayDate}'`)
            },
            include: [
                {
                    model: ProfileImages,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'date_of_joining']
        });


        const responseBody = {
            total_employees: totalEmployee,
            present_employees:attendance.count,
            absent_employees: absent_employees,
            upcoming_birthdays: birthdays,
            birthday: birthday,
            upcoming_anniversary: upcomingAnniversary,
            anniversary: anniversary
        }

        const response = generateResponse(200, true, "Data fetched succesfully!", responseBody)

        res.status(200).json(response)

    }catch(err){
        res.status(500).json(err)
        next(internalServerError("Something went wrong!"))
    }
}


export const getSelfLeaveStatus = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try{
        const {id} = req.credentials

        const user = await User.findByPk(id)

        const {month} = req.query
        const {year} = req.query

        

        const getDatesOfMonth = (year, month) => {
            const startDate = moment(`${year}-${month}-01`, "YYYY-MM-DD");
            const endDate = moment(startDate).endOf('month')

            console.log("Start Date: ", startDate)
            const datesArray = [];

            while(startDate.isSameOrBefore(endDate)){
                datesArray.push(startDate.format('YYYY-MM-DD'));
                startDate.add(1, 'days');
            }

            return datesArray;
        }

        const masterPolicy = await getMasterPolicy(id)

        const shiftPolicy = await ShiftPolicy.findByPk(masterPolicy?.shift_policy_id)

        const calculateWorkingHours = (shiftPolicy, punchInTime, punchOutTime) => {
            const punchIn = moment(punchInTime, 'HH:mm:ss');
            const punchOut = moment(punchOutTime, 'HH:mm:ss');
        
            if (punchIn.isAfter(punchOut)) {
                punchOut.add(24, 'hours');
            }
        
            if (shiftPolicy?.shift_type_id === 1) {
                const shiftStart = moment(shiftPolicy?.shift_start_time, 'HH:mm:ss');
                const shiftEnd = moment(shiftPolicy?.shift_end_time, 'HH:mm:ss');
        
                if (shiftStart.isAfter(shiftEnd)) {
                    shiftEnd.add(24, 'hours');
                }
        
                const baseWorkingHours = moment.duration(shiftEnd.diff(shiftStart)).asMinutes();
                const actualWorkingHours = moment.duration(punchOut.diff(punchIn)).asMinutes();
        
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


        if(user){


            const startOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month');
            const endOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month');

            const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month').set({seconds: 0, minutes: 0, hours:0});
            const endDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').set({seconds: 0, minutes: 0, hours:0});

            const attendanceDetails = {} as any;

            const attendanceRecords = await Attendance.findAll({
                where: {
                    user_id: id,
                    date: {                
                        [Op.and]: [
                            { [Op.gte]: startOfMonth},
                            { [Op.lte]: endOfMonth }
                        ]
                    }
                },
                include:[
                    {
                        model: AttendanceStatus,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'is_deleted']
                        }
                    }
                ],
                attributes:{
                    exclude: ['createdAt', 'updatedAt']
                }
            })



            // const leaveRecord = await LeaveRecord.findAll({
            //     where: {
            //         user_id: id,
            //         status: 2, //Approved
            //         start_date: {[Op.gte]: startOfMonth.format('YYYY-MM-DD HH:mm:ss')},
            //         end_date: {[Op.lte]: endOfMonth.format('YYYY-MM-DD HH:mm:ss')}
            //     }
            // })



            const leaveRecord = await LeaveRecord.findAll({
                where: {
                    user_id: id,
                    status: 2,
                    [Op.or]: [
                      {
                        start_date: {
                          [Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                        },
                        end_date: {
                            [Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                        }
                      },
                      {
                        start_date: {
                          [Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                        },
                        end_date: {
                          [Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                        }
                      }
                    ],
                },
                include: [
                    {
                        model: LeaveType,
                        attributes: ['id', 'leave_type_name']
                    },
                    {
                        model: Approval,
                        attributes: ['id', 'name']
                    },
                    {
                        model: DayType,
                        attributes: ['id', 'name']
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })

            const masterPolicy = await getMasterPolicy(id)

            const holidayCalendar = await HolidayCalendar.findByPk(masterPolicy?.holiday_calendar_id, {
                include: [
                    {
                        model: HolidayDatabase,
                        attributes: ['name', 'date'],
                        through: {attributes: []}
                    }
                ],
                attributes: ['id', 'name', 'year']
            })
            

            const holidays = holidayCalendar?.holiday_databases?.reduce((acc: any, holiday: any) => {
                acc[holiday.date] = holiday;
                return acc;
            }, {})

            const dates = getDatesOfMonth(year, month)

            const leaveDetails: any = {};

            dates.forEach(date => {

                const attendanceRecord = attendanceRecords.find(record => record.date === date);

                const holidayForDate = holidays[date];
                
                const employeeOnLeave = leaveRecord.filter(leave => {
                    // return moment(date).isBetween(moment(leave.start_date), leave.end_date, null, '[]') || moment(date).isSame(leave.start_date)                    
                    return(
                        moment(date).isBetween(moment(leave.start_date).format('YYYY-MM-DD'), moment(leave.end_date).format('YYYY-MM-DD'), null, '[]')
                    )
                });

                const leaveTypeCounts: any = {};

                employeeOnLeave.forEach(leave => {
                    const leaveTypeName = leave.leave_type.leave_type_name;
                    leaveTypeCounts.id = leave.id 
                })

                leaveDetails[date] = {
                    total_employees: employeeOnLeave.length ? employeeOnLeave.length : null,
                    leave_types: leaveTypeCounts? leaveTypeCounts : null
                }


                const result = calculateWorkingHours(shiftPolicy, attendanceRecord?.punch_in_time, attendanceRecord?.punch_out_time )

                const baseWorkingHours = result?.baseWorkingHours ?? 0;
                const actualWorkingHours = result?.actualWorkingHours ?? 0;

                const{overtime_hours, deficit_hours} = calculateOvertimeDeficit(actualWorkingHours, baseWorkingHours)

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
                    }: null,
                    leave_record: employeeOnLeave
                    ? employeeOnLeave: null,
                    holiday: holidayForDate
                    ?{
                        name: holidayForDate?.name,
                        date: holidayForDate?.date
                    }: null
                }
                
                attendanceDetails[date] = detailsForDate;
            })

            const response = generateResponse(200, true, "Data fetched succesfully!", attendanceDetails)

            res.status(200).json(response)

        }else{
            next(notFound("No user found with that id!"))
        }

    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong!"))
    }
}

export const getAdminSpecificLeaveData =  async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try{
        const{id} = req.credentials

        const user = await User.findByPk(id)

        const {month} = req.query
        const {year} = req.query

        const getDatesOfMonth = (year, month) => {
            const startDate = moment(`${year}-${month}-01`, "YYYY-MM-DD");
            const endDate = moment(startDate).endOf('month')

            console.log("Start Date: ", startDate)
            const datesArray = [];

            while(startDate.isSameOrBefore(endDate)){
                datesArray.push(startDate.format('YYYY-MM-DD'));
                startDate.add(1, 'days');
            }

            return datesArray;
        }

        const record = {} as any;

        const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month').set({seconds: 0, minutes: 0, hours:0});
        const endDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').set({seconds: 0, minutes: 0, hours:0});

        if(user && user.role_id === 1 && month && year){

            const leaveRecord = await LeaveRecord.findAll({
                where: {
                    status: 2,
                    [Op.or]: [
                      {
                        start_date: {
                          [Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                        },
                        end_date: {
                            [Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                        }
                      },
                      {
                        start_date: {
                          [Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                        },
                        end_date: {
                          [Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                        }
                      }
                    ]
                },
                include: [
                    {
                        model: LeaveType,
                        attributes: ['id', 'leave_type_name']
                    }
                ]
            })

            const dates = getDatesOfMonth(year, month)

            const leaveDetails: any = {};

            dates.forEach(date => {
                const employeeOnLeave = leaveRecord.filter(leave =>
                    moment(date).isBetween(leave.start_date, leave.end_date, null, '[]')    
                );

                const leaveTypeCounts: any = {};

                employeeOnLeave.forEach(leave => {
                    const leaveTypeName = leave.leave_type.leave_type_name;
                    leaveTypeCounts[leaveTypeName] = (leaveTypeCounts[leaveTypeName] || 0) + 1
                })

                leaveDetails[date] = {
                    total_employees: employeeOnLeave.length ? employeeOnLeave.length : null,
                    leave_types: leaveTypeCounts? leaveTypeCounts : null
                }
                                
            })

            const response = generateResponse(200, true, "Data fetched succesfully!", leaveDetails)

            res.status(200).json(response)

            
        }else{
            next(notFound("Cannot find employee"))
        }

    }catch(err){
        next(internalServerError("Something went wrong!"))
    }
}

export const getAdminSpecificAttendanceData = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{

        const {id} = req.credentials

        const user = await User.findByPk(id)

        const {month, year} = req.query

        const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
        // const endOfMonth = moment(startOfMonth).endOf('month')
        let endOfMonth;

        if(parseInt(month) === moment().get('months') + 1 && parseInt(year) === moment().get('years')){
            endOfMonth = moment().subtract(1, 'day')
        }else{
            endOfMonth = moment(startOfMonth).endOf('month')
        }

        console.log("END OF MONTHHH", endOfMonth)

        const allDates = [];
        let currentDate = moment(startOfMonth);
        let currentDateofMonth = moment().date();

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

        while(currentDate.isSameOrBefore(endOfMonth)){
            allDates.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'day')
        }

        if(user && user.role_id === 1){

            if(month && year){

                const totalEmployeesQuery = await User.count({
                    where: {
                        status: 1
                    }
                })

                const attendanceRecord = await Attendance.findAll({
                    attributes: [
                        [sequelize.fn('DATE', sequelize.col('date')), 'date'],
                        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 3 THEN 1 ELSE 0 END")), 'present_count'],
                        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 1 THEN 1 ELSE 0 END")), 'absent_count'],
                        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 2 THEN 1 ELSE 0 END")), 'halfday_count'],
                    ],
                    where: {
                        date: {
                            [Op.between]: [startOfMonth.toDate(), endOfMonth],
                        },
                    },
                    group: ['date'],
                    order: [['date', 'ASC']],
                    raw: true,
                })

                console.log(startOfMonth.toDate(), endOfMonth)

                const formattedAttendanceDate = allDates.reduce((result, date) => {
                    const matchingRecord = attendanceRecord.filter((entry) => entry.date === date);
                    result[date] = {
                        present_employees: matchingRecord.reduce((sum, record) => sum + parseInt(record.present_count), 0),
                        absent_employees: matchingRecord.reduce((sum, record) => sum + parseInt(record.absent_count), 0),
                        halfday_employees: matchingRecord.reduce((sum, record) => sum + parseInt(record.halfday_count), 0),
                    };
                    return result;

                }, {});

                let dataForToday

                if(parseInt(month) === moment().month() + 1 && parseInt(year) === moment().year()){
                    dataForToday = await Attendance.findOne({
                        attributes: [
                            [sequelize.fn('DATE', sequelize.col('date')), 'date'],
                            [sequelize.fn('SUM', sequelize.literal("CASE WHEN punch_in_time IS NOT NULL THEN 1 END")), 'present_count'],
                            [sequelize.fn('SUM', sequelize.literal("CASE WHEN punch_in_time IS NULL THEN 1 END")), 'absent_count'],
                            [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 2 THEN 1 ELSE 0 END")), 'halfday_count'],
                        ],
                        where: {
                            date: moment().format('YYYY-MM-DD')
                        },
                        group: ['date'],
                        order: [['date', 'ASC']],
                        raw: true,
                    })

                    formattedAttendanceDate[moment().format('YYYY-MM-DD')] = {
                        present_employees: parseInt(dataForToday?.present_count)? parseInt(dataForToday?.present_count) : 0,
                        absent_employees: parseInt(dataForToday?.absent_count)? parseInt(dataForToday?.absent_count) : 0,
                        halfday_employees: parseInt(dataForToday?.halfday_count)? parseInt(dataForToday?.halfday_count) : 0,
                    }
    
                }

                console.log(":::::::::::::::::::::", formattedAttendanceDate)

                const response = generateResponse(200, true, "Data fetched succesfully", formattedAttendanceDate)

                res.status(200).json(response)

            }else{
                next(badRequest("Month and year are missing from query parameters!"))
            }

        }else{
            next(notFound("There is no admin with that id!"))
        }

    }catch(err){
        console.log(err)
        res.status(500).json(err)
        // next(internalServerError("Something went wrong!"))
    }
}

export const getManagerSpecificAttendanceData = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const {id} = req.credentials

        const user = await User.findByPk(id)
        
        const {month, year} = req.query

        const startOfMonth = moment(`${year}-${month}-01`, "YYYY-MM-DD").startOf('month')
        // const endOfMonth = moment(startOfMonth).endOf('month')
        let endOfMonth;

        if(parseInt(month) === moment().month() + 1 && parseInt(year) === moment().year()){
            endOfMonth = moment().subtract(1, 'day')
        }else{
            endOfMonth = moment(startOfMonth).endOf('month')
        }

        const allDates = [];
        let currentDate = moment(startOfMonth);
        let currentDateofMonth = moment().date();
        // while (currentDate.isSameOrBefore(endOfMonth)) {
        //     allDates.push(currentDate.format('YYYY-MM-DD'));
        //     currentDate.add(1, 'day');
        // }

        while(currentDate.isSameOrBefore(endOfMonth)){
            allDates.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'day')
        }


        const reportingManager = await ReportingManagers.findOne({
            where: {
                user_id: id
            },
            include: [
                {
                    model: User, as:'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false
                },
            ]
        })

        if(reportingManager){
            if(month && year){

                const employeeIds = reportingManager?.Employees.map(employee => employee.id)

                const attendanceRecord = await Attendance.findAll({
                    attributes: [
                        [sequelize.fn('DATE', sequelize.col('date')), 'date'],
                        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 3 THEN 1 ELSE 0 END")), 'present_count'],
                        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 1 THEN 1 ELSE 0 END")), 'absent_count'],
                        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 2 THEN 1 ELSE 0 END")), 'halfday_count'],
                    ],
                    where: {
                        date: {
                            [Op.between]: [startOfMonth.toDate(), endOfMonth],
                        },
                        user_id: {
                            [Op.in]: employeeIds
                        }
                    },
                    group: ['date'],
                    order: [['date', 'ASC']],
                    raw: true,
                })

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

                if(parseInt(month) === moment().month() + 1 && parseInt(year) === moment().year()){

                    dataForToday = await Attendance.findOne({
                        attributes: [
                            [sequelize.fn('DATE', sequelize.col('date')), 'date'],
                            [sequelize.fn('SUM', sequelize.literal("CASE WHEN punch_in_time IS NOT NULL THEN 1 END")), 'present_count'],
                            [sequelize.fn('SUM', sequelize.literal("CASE WHEN punch_in_time IS NULL THEN 1 END")), 'absent_count'],
                            [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 2 THEN 1 ELSE 0 END")), 'halfday_count'],
                        ],
                        where: {
                            date: moment().format('YYYY-MM-DD'),
                            user_id: {
                                [Op.in]: employeeIds
                            }
                        },
                        group: ['date'],
                        order: [['date', 'ASC']],
                        raw: true,
                    })

                    formattedAttendanceDate[moment().format('YYYY-MM-DD')] = {
                        present_employees: parseInt(dataForToday?.present_count)? parseInt(dataForToday?.present_count) : 0,
                        absent_employees: parseInt(dataForToday?.absent_count)? parseInt(dataForToday?.absent_count) : 0,
                        halfday_employees: parseInt(dataForToday?.halfday_count)? parseInt(dataForToday?.halfday_count) : 0,
                    }
                }

                const response = generateResponse(200, true, "Data fetched succesfully", formattedAttendanceDate)

                res.status(200).json(response)

            }else{
                next(badRequest("Month and year are missing from query parameters!"))
            }
        }

    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong!"))
    }
} 


export const getManagerSpecificLeaveData = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{

        const {id} = req.credentials

        const user = await User.findByPk(id)

        const reportingManager = await ReportingManagers.findOne({
            where: {
                user_id: id
            },
            include: [
                {
                    model: User, as:'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false
                },
            ]
        })

        const {month, year} = req.query

        const getDatesOfMonth = (year, month) => {
            const startDate = moment(`${year}-${month}-01`, "YYYY-MM-DD");
            const endDate = moment(startDate).endOf('month')

            console.log("Start Date: ", startDate)
            const datesArray = [];

            while(startDate.isSameOrBefore(endDate)){
                datesArray.push(startDate.format('YYYY-MM-DD'));
                startDate.add(1, 'days');
            }

            return datesArray;
        }

        const record = {} as any;

        const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month').set({seconds: 0, minutes: 0, hours:0});
        const endDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').set({seconds: 0, minutes: 0, hours:0});

        if(reportingManager){
            if(month && year){

                const employeeIds = reportingManager?.Employees.map(employee => employee.id)

                const leaveRecord = await LeaveRecord.findAll({
                    where: {
                        status: 2,
                        [Op.or]: [
                            {
                                start_date: {
                                [Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                                },
                                end_date: {
                                    [Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                                }
                            },
                            {
                                start_date: {
                                [Op.lte]: endDate.format('YYYY-MM-DD HH:mm:ss')
                                },
                                end_date: {
                                [Op.gte]: startDate.format('YYYY-MM-DD HH:mm:ss')
                                }
                            }
                        ],
                        user_id: {
                            [Op.in]: employeeIds
                        }
                    },
                    include: [
                        {
                            model: LeaveType,
                            attributes: ['id', 'leave_type_name']
                        }
                    ]
                })

                const dates = getDatesOfMonth(year, month)

                const leaveDetails: any = {};

                dates.forEach(date => {
                    const employeeOnLeave = leaveRecord.filter(leave =>
                        moment(date).isBetween(leave.start_date, leave.end_date, null, '[]')    
                    );

                    const leaveTypeCounts: any = {};

                    employeeOnLeave.forEach(leave => {
                        const leaveTypeName = leave.leave_type.leave_type_name;
                        leaveTypeCounts[leaveTypeName] = (leaveTypeCounts[leaveTypeName] || 0) + 1
                    })

                    leaveDetails[date] = {
                        total_employees: employeeOnLeave.length ? employeeOnLeave.length : null,
                        leave_types: leaveTypeCounts? leaveTypeCounts : null
                    }
                                    
                })


                const response = generateResponse(200, true, "Data fetched succesfully!", leaveDetails)

                res.status(200).json(response)

            }else{
                next(badRequest("Month and year are not provided in query parameters."))
            }
        }else{
            const response = generateResponse(200, false, "This employee doesn't have any employees assigned", {})
            res.status(200).json(response)
            // next(notFound("Cannot find employee"))
        }

    }catch(err){
        console.log(err)
        next(internalServerError('Something went wrong!'))
    }
}


export const getTodayEvents = async(req: Request, res: Response, next:NextFunction): Promise<void> => {
    try{
        const today = moment().startOf('day');
        
        const todayDate = today.format('MM-DD')

        const birthdays = await User.findAll({
            where:{
                [Op.or]: [
                    {
                        dob_celebrated: {
                            [Op.and]: [
                                sequelize.where(sequelize.fn('MONTH', sequelize.col('dob_celebrated')), today.month() + 1),
                                sequelize.where(sequelize.fn('DAY', sequelize.col('dob_celebrated')), { [Op.gt]: today.date() })
                            ]
                        }
                    },
                    {
                        dob_celebrated: null,
                        [Op.and]: [
                            sequelize.where(sequelize.fn('MONTH', sequelize.col('dob_adhaar')), today.month() + 1),
                            sequelize.where(sequelize.fn('DAY', sequelize.col('dob_adhaar')), { [Op.gt]: today.date()} )
                        ]
                    },
                ]
            },
            include: [
                {
                    model: ProfileImages,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes:['id', 'employee_name', 'employee_generated_id', 'dob_celebrated'],
        });

        const birthday = await User.findAll({
            where:{
                [Op.or]: [
                    sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`),
                    {
                        dob_celebrated: null,
                        dob_adhaar: sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`)
                    }
                ]
            },
            include: [
                {
                    model: ProfileImages,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'dob_celebrated']
        })

        const upcomingAnniversary = await User.findAll({
            where:{
                [Op.and]: [
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('date_of_joining')), today.month() + 1),
                    sequelize.where(sequelize.fn('DAY', sequelize.col('date_of_joining')), { [Op.gt]: today.date()})
                ]
            },
            include: [
                {
                    model: ProfileImages,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: ['id', 'employee_name', 'employee_generated_id', 'date_of_joining']
        })


        const anniversary = await User.findAll({
            where: {
                date_of_joining: sequelize.literal(`DATE_FORMAT(date_of_joining, '%m-%d') = '${todayDate}'`)
            },
            include: [
                {
                    model: ProfileImages,
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
        }

        const response = generateResponse(200, true, "Data fetched succesfully!", responseBody)

        res.status(200).json(response)

    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong!"))
    }
}

export const getMyTeam = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{

        const {id} = req.credentials

        // const user = await User.findByPk(id, {
        //     include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']}, {model: ReportingRole}]}],
        //     attributes:['id', 'employee_name']
        // })

        const user = await User.findByPk(id, {
            include: [
                {
                    model: ReportingManagers,
                    as:'Managers',
                    include:[
                        {model: User, attributes: ['id', 'employee_generated_id', 'employee_name']}
                    ],
                    attributes:['id', 'user_id', 'reporting_role_id'],
                    through:{
                        attributes:[]
                    }
                }
            ]
        })

        const reportingManager = await ReportingManagers.findByPk(user?.Managers[0]?.id, {
            include: [
                {
                    model: User, as:'manager', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false
                },
                {
                    model: User, as:'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false,
                    include: [
                        {model: ProfileImages, attributes: {exclude: ['createdAt', 'updatedAt']}}
                    ]
                },
            ]
        })

        if(user){
            if(reportingManager?.Employees.length > 0){
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

                const members = reportingManager?.Employees.filter(employee => employee.id !== id)

                const team = members.length > 0? members : []

                const response = generateResponse(200, true, "Data fetched succesfully!", team)
                res.status(200).json(response)
            }else{
                const data: any[] = []
                const response = generateResponse(200, true, "Data fetched succesfully!", data)
                res.status(200).json(response)
            }
        }else{
            next(notFound("Cannot find user with that id!"))
        }

    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong"))
    }
}

export const getEmployeeAttendanceSummary = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{

        const {id} = req.credentials

        const user = await User.findByPk(id)

        // const currentMonthStartDate = moment().startOf('month').toDate();
        // const currentMonthEndDate = moment().endOf('month').toDate();

        const currentMonthStartDate = moment().startOf('month').toDate();
        const currentMonthEndDate = moment().endOf('month').toDate();

        function secondsToTime(seconds) {
            return moment(seconds * 1000).format('HH:mm:ss');
        }

        if(user){

            const result = await Attendance.findOne({
                where: {
                    user_id: id,
                    date: {
                        [Op.between]: [currentMonthStartDate, currentMonthEndDate],
                    },
                    punch_in_time: { [Op.not]: null },
                    punch_out_time: { [Op.not]: null },
                },
                attributes: [
                    [
                        sequelize.fn(
                            'TIME_FORMAT',
                            sequelize.fn('SEC_TO_TIME', sequelize.fn('AVG', sequelize.fn('TIME_TO_SEC', sequelize.col('punch_in_time')))),
                            '%H:%i:%s'
                        ),
                        'avg_in_time'
                    ],
                    [
                        sequelize.fn(
                            'TIME_FORMAT',
                            sequelize.fn('SEC_TO_TIME', sequelize.fn('AVG', sequelize.fn('TIME_TO_SEC', sequelize.col('punch_out_time')))),
                            '%H:%i:%s'
                        ),
                        'avg_out_time'
                    ],
                ],
            })

            const avgInTime = result?.getDataValue('avg_in_time')
            const avgOutTime = result?.getDataValue('avg_out_time')
            

            const averageWorkDuration = await Attendance.findOne({
                where: {
                    user_id: id,
                    date: {
                        [Op.between]: [currentMonthStartDate, currentMonthEndDate],
                    },
                },
                attributes: [
                  [sequelize.fn('AVG', sequelize.literal('TIME_TO_SEC(TIMEDIFF(punch_out_time, punch_in_time))')), 'avg_work_duration'],
                ],
            });
            
            const avgWorkDurationInSeconds = averageWorkDuration?.getDataValue('avg_work_duration');
            const avgWorkDurationInMinutes = avgWorkDurationInSeconds / 60;


            const responseBody = {
                average_in_time: avgInTime,
                average_out_time: avgOutTime,
                avgWorkDurationInMinutes: avgWorkDurationInMinutes
            }

            const response = generateResponse(200, true, "Data fetched succesfully!", responseBody)

            res.status(200).json(response)
            

        }else{
            next(notFound("Cannot find an employee with that id!"))
        }

    }catch(err){
        next(internalServerError("Something went wrong!"))
    }
}

export const getManagerEvents = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{ 
    try{

        const {id} = req.credentials

        const user = await User.findByPk(id)

        const reportingManager = await ReportingManagers.findOne({
            where: {
                user_id: id
            },
            include: [
                {
                    model: User, as:'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false, through:{attributes: []}
                },
            ]
        })

        const today = moment().startOf('day');
        const todayDate = today.format('MM-DD');

        if(reportingManager){

            const managedEmployeeIds = reportingManager.Employees.map((employee) => employee.id);

            const birthdays = await User.findAll({
                where:{
                    id: managedEmployeeIds,
                    [Op.or]: [
                        {
                            dob_celebrated: {
                                [Op.and]: [
                                    sequelize.where(sequelize.fn('MONTH', sequelize.col('dob_celebrated')), today.month() + 1),
                                    sequelize.where(sequelize.fn('DAY', sequelize.col('dob_celebrated')), { [Op.gt]: today.date() })
                                ]
                            }
                        },
                        {
                            dob_celebrated: null,
                            [Op.and]: [
                                sequelize.where(sequelize.fn('MONTH', sequelize.col('dob_adhaar')), today.month() + 1),
                                sequelize.where(sequelize.fn('DAY', sequelize.col('dob_adhaar')), { [Op.gt]: today.date()} )
                            ]
                        },
                    ]
                },
                include: [
                    {
                        model: ProfileImages,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                attributes:['id', 'employee_name', 'employee_generated_id', 'dob_celebrated'],
            });
    
            const birthday = await User.findAll({
                where:{
                    id: managedEmployeeIds,
                    [Op.or]: [
                        sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`),
                        {
                            dob_celebrated: null,
                            dob_adhaar: sequelize.literal(`DATE_FORMAT(dob_celebrated, '%m-%d') = '${todayDate}'`)
                        }
                    ]
                },
                include: [
                    {
                        model: ProfileImages,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                attributes: ['id', 'employee_name', 'employee_generated_id', 'dob_celebrated']
            })
    
            const upcomingAnniversary = await User.findAll({
                where:{
                    id: managedEmployeeIds,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('date_of_joining')), today.month() + 1),
                        sequelize.where(sequelize.fn('DAY', sequelize.col('date_of_joining')), { [Op.gt]: today.date()})
                    ]
                },
                include: [
                    {
                        model: ProfileImages,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                attributes: ['id', 'employee_name', 'employee_generated_id', 'date_of_joining']
            })
    
    
            const anniversary = await User.findAll({
                where: {
                    id: managedEmployeeIds,
                    date_of_joining: sequelize.literal(`DATE_FORMAT(date_of_joining, '%m-%d') = '${todayDate}'`)
                },
                include: [
                    {
                        model: ProfileImages,
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
            }
    
            const response = generateResponse(200, true, "Data fetched succesfully!", responseBody)
    
            res.status(200).json(response)
        }else{
            const responseBody = {
                upcoming_birthdays: [],
                birthday: [],
                upcoming_anniversary: [],
                anniversary: []
            }
            const response = generateResponse(200, false, "This manager has not been assigned any employees!", responseBody)
            res.status(200).json(response)
            // next(notFound("Reporting Manager for this is not found!"))
        }

    }catch(err){
        next(internalServerError("Something went wrong!"))
    }
}

export const getManagerRequestsSummary = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{

        const {id} = req.credentials

        const user = await User.findByPk(id)

        const {year, month} = req.query

        const startDate = moment().startOf('month');
        const endDate = moment(startDate).endOf('month');

        const reportingManager = await ReportingManagers.findOne({
            where: {
                user_id: id
            },
            include: [
                {
                    model: User, as:'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false, through:{attributes: []}
                },
            ]
        })

        if(reportingManager){

            const managedEmployeeIds = reportingManager.Employees.map((employee) => employee.id);

            const totalRequests = await RegularizationRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    createdAt: {
                        [Op.between]: [startDate.toDate(), endDate.toDate()],
                    },
                },
            });

            const approvedRequests = await RegularizationRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 2,
                    createdAt: {
                        [Op.between]: [startDate.toDate(), endDate.toDate()]
                    }
                }
            })
            
            const pendingRequests = await RegularizationRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 1,
                    createdAt: {
                        [Op.between]: [startDate.toDate(), endDate.toDate()],
                    },
                },
            });

            const rejectedRequests = await RegularizationRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 3,
                    createdAt: {
                        [Op.between]: [startDate.toDate(), endDate.toDate()],
                    },
                },
            });

            const totalLeaveRequests = await LeaveRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    createdAt: {
                        [Op.between]: [startDate.toDate(), endDate.toDate()]
                    }
                }
            })

            const totalPendingLeaveRequests = await LeaveRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 1,
                    createdAt: {
                        [Op.between]: [startDate.toDate(), endDate.toDate()]
                    }
                }
            })

            const totalApprovedLeaveRequests = await LeaveRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 2,
                    createdAt: {
                        [Op.between]: [startDate.toDate(), endDate.toDate()]
                    }
                }
            })

            const totalRejectedLeaveRequests = await LeaveRecord.count({
                where: {
                    user_id: managedEmployeeIds,
                    status: 3,
                    createdAt: {
                        [Op.between]: [startDate.toDate(), endDate.toDate()]
                    }
                }
            })

            const responseBody = {
                total_regularization_requests: totalRequests,
                approved_regularization_requests: approvedRequests,
                pending_regularization_requests: pendingRequests,
                rejected_regularization_requests: rejectedRequests,
                total_leave_requests: totalLeaveRequests,
                pending_leave_requests: totalPendingLeaveRequests,
                approved_leave_requests: totalApprovedLeaveRequests,
                rejected_leave_requests: totalRejectedLeaveRequests
            }
            const response = generateResponse(200, true, "Data fetched succesfully!", responseBody)

            res.status(200).jsonp(response)
        }else{
            const responseBody = {
                total_regularization_requests: 0,
                approved_regularization_requests: 0,
                pending_regularization_requests: 0,
                rejected_regularization_requests: 0,
                total_leave_requests: 0,
                pending_leave_requests: 0,
                approved_leave_requests: 0,
                rejected_leave_requests: 0
            }
            const response = generateResponse(200, false, "The manager has not been assigned any employee!", responseBody)
            res.status(200).json(response)
            // next(notFound("There is no reporting manager with that id!"))
        }

    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong!"))
    }
}

export const getAdminDivisionSummary = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{

        const {id} = req.credentials
        
        const user = await User.findByPk(id)

        const {divisionId} = req.query 

        if(!user){
            next(notFound("Cannot find an employee with that id!"))
        }

        if(user?.role_id !== 1){
            next(forbiddenError("The employee is not an admin!"))
        }
        

        if(!divisionId){
            next(badRequest("Division id is missing from query params"))
        }

        const division = await Division.findByPk(divisionId, {
            include: [
                {
                    model: DivisionUnits,
                    attributes: {
                        include:[
                            [Sequelize.literal('(SELECT COUNT(*) FROM user_division WHERE user_division.unit_id = division_units.id)'), 'user_count'],
                            [
                                Sequelize.literal('FORMAT((SELECT COUNT(*) FROM user_division WHERE user_division.unit_id = division_units.id) / (SELECT COUNT(*) FROM user WHERE deleted_at IS NULL AND status = true) * 100, 2)'),
                                'strength_percentage'
                            ]
                        ],
                        exclude:['createdAt', 'updatedAt']
                    },
                    include: [
                        {
                          model: User,
                          attributes: [], // Include this to avoid retrieving User attributes
                          through: { attributes: [] }, // Include this to avoid retrieving the user_division junction table attributes
                        },
                    ]
                }
            ],
            attributes: ['id', 'division_name', 'system_generated']
        });

        if(!division){
            next(notFound("Cannot find any division with that id!"))
        }

        res.status(200).json(division)

    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong!"))
    }
}