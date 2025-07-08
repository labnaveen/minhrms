//@ts-nocheck
import { NextFunction, Request, Response } from "express";
import { internalServerError } from "../../services/error/InternalServerError";
import { Attendance, AttendanceStatus, LeaveRecord, LeaveType, User } from "../../models";
import { getMasterPolicy } from "../../services/masterPolicy/getMasterPolicy";
import AttendancePolicy from "../../models/attendancePolicy";
import ShiftPolicy from "../../models/shiftPolicy";
import RegularizationRecord from "../../models/regularizationRecord";
import moment from "moment";
import { generateResponse } from "../../services/response/response";
import { Op } from "sequelize";
import {Parser} from '@json2csv/plainjs'
import { calculateOvertimeDeficit, calculateWorkingHours } from "../../helpers";
import ApprovalFlow from "../../models/approvalFlow";
import Approval from "../../models/dropdown/status/approval";
import HalfDayType from "../../models/dropdown/dayType/halfDayType";
import DayType from "../../models/dropdown/dayType/dayType";
import ReportingRole from "../../models/reportingRole";
import ReportingManagers from "../../models/reportingManagers";
import ApprovalFlowType from "../../models/dropdown/type/approvalFlowType";
import LeaveRequest from "../../models/leaveRequest";
import PunchLocation from "../../models/punchLocation";
import axios from "axios";





export const dailyLogs = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        
        const { month, year, employee_id } = req.query

        const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = moment(startDate).endOf('month').toDate();

        let whereOptions = {
            date: {
                [Op.between]: [startDate, endDate]
            }
        }

        if(employee_id){
            whereOptions.user_id = employee_id
        }

        const page = req.query.page? req.query.page : 1
        const records = req.query.records? req.query.records : 10


        const pageNumber = parseInt(page as string)
        const recordsPerPage = parseInt(records as string)

        const offset = (pageNumber - 1) * recordsPerPage;

        const attendanceLogs = await Attendance.findAndCountAll({
            where: whereOptions,
            include: [
                {
                    model: AttendanceStatus,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'is_deleted']
                    }
                }
            ],
            order: [['employee_generated_id', 'DESC']],
            offset: offset,
            limit: recordsPerPage,
            paranoid: false
        })

        // const processedRows = await Promise.all(attendanceLogs.rows.map(async(row) => {
            
        let processedRows = [];
        for(const row of attendanceLogs.rows){
            const masterPolicy = await getMasterPolicy(row.user_id)

            const attendancePolicy = await AttendancePolicy.findByPk(masterPolicy?.attendance_policy_id)

            const shiftPolicy = await ShiftPolicy.findByPk(masterPolicy?.shift_policy_id)

            const user = await User.findByPk(row.user_id, {
                attributes: ['id', 'employee_generated_id', 'employee_name'],
                paranoid: false
            })

            const getHoursWorked = (start, end) => {

                if (!start || !end) {
                    return '---'
                }
                const startMoment = moment(start, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 })

                const endMoment = moment(end, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 })

                if (startMoment.isAfter(endMoment)) {

                    endMoment.add(24, 'hours')

                }
        
                const duration = moment.duration(endMoment.diff(startMoment))

                const formattedDuration = moment.utc(duration.asMilliseconds()).format('HH:mm')
        
                return formattedDuration
            }

            // const baseWorkingHours, actualWorkingHours = calculateWorkingHours(shiftPolicy, row.punch_in_time, row.punch_out_time )
            const baseWorkingHours = calculateWorkingHours(shiftPolicy, row?.punch_in_time, row.punch_out_tie) || '00:00'
            const actualWorkingHours = calculateWorkingHours(shiftPolicy, row.punch_in_time, row.punch_out_time)?.actualWorkingHours || '00:00'

            const{overtime_hours, deficit_hours} = calculateOvertimeDeficit(actualWorkingHours, baseWorkingHours)

            const isRegularise = await RegularizationRecord.findAll({
                where: {
                    date: row.date
                }
            })

            const calculateLateInorEarlyOut = () => {
                if(shiftPolicy?.shift_type_id == 1){
                    let late_in;
                    let early_out;

                    if(moment(row.punch_in_time).isAfter(moment(shiftPolicy?.shift_start_time))){
                        late_in = true
                    }

                    if(moment(row.punch_out_time).isBefore(moment(shiftPolicy?.shift))){
                        early_out = true
                    }

                    if(moment(row.punch_in_time).isAfter(moment(shiftPolicy?.shift_start_time) && moment(row.punch_out_time).isBefore(moment(shiftPolicy?.shift)))){
                        late_in = true
                        early_out = true
                    }

                    let status;

                    if(late_in){
                        status = 'L'
                    }

                    if(early_out){
                        status = 'E'
                    }

                    if(late_in && early_out){
                        status = 'L + E'
                    }

                    return status
                    
                }
            }

            const calculateStatusRemark = () => {
                let status
                let flexi
                let grace
                let grace_exceeded
                let flexi_exceeded

                if(row.flexi_used){
                    flexi = true
                }

                if(row.grace_used){
                    grace = true
                }

                if(row.grace_counter >= shiftPolicy?.number_of_days_grace_allowed){
                    grace_exceeded = true
                }

                if(row.flexi_counter >= shiftPolicy?.number_of_days_flexi_allowed){
                    flexi_exceeded = true
                }

                if(flexi){
                    status = 'F'
                }

                if(grace){
                    status = 'G'
                }

                if(flexi && grace){
                    status = 'F + G'
                }

                if(flexi_exceeded){
                    status = 'F*'
                }
                
                if(grace_exceeded){
                    status = 'G*'
                }

                if(flexi_exceeded && grace_exceeded){
                    status = 'F* + G*'
                }

                return status

            }

            const hours_worked = getHoursWorked(row?.punch_in_time, row?.punch_out_time)

            const startOfDate = moment(row?.date).startOf('day')
            const endOfDate = moment(row?.date).endOf('day')

            let punchInLocation;
            let punchOutLocation;

            const punchInLatLon = await PunchLocation.findAll({
				where: {
                    attendance_log_id: row.id,
					punch_time: {
						[Op.between]: [startOfDate, endOfDate]
					}
				},
				order: [['punch_time', 'ASC']]
			});


            punchInLocation = punchInLatLon[0]?.location

            if(punchInLatLon.length > 1){
                punchOutLocation = punchInLatLon[punchInLatLon.length - 1]?.location
            }else{
                punchOutLocation = null;
            }

            const response = {
                employee_id: row.employee_generated_id,
                employee_name: user?.employee_name,
                date: row.date,
                first_in: row.punch_in_time,
                last_out: row.punch_out_time,
                hours_worked: hours_worked,
                late_in_early_out :  calculateLateInorEarlyOut()? calculateLateInorEarlyOut() : null,
                overtime_hours: overtime_hours,
                deficit_hours: deficit_hours,
                status_remark: calculateStatusRemark()? calculateStatusRemark() : null,
                status: row.attendance_status.name,
                regularise: isRegularise.length > 0 ? 'yes' : 'no',
                punch_in_location: punchInLocation? punchInLocation : null,
                punch_out_location: punchOutLocation? punchOutLocation : null
            }

            processedRows.push(response)
            // return response
        }
        // })) : []

        const totalPages = Math.ceil(attendanceLogs.count / recordsPerPage)
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;

        const meta = {
            totalCount: attendanceLogs.count,
            pageCount: totalPages,
            currentPage: page,
            perPage: recordsPerPage,
            hasNextPage,
            hasPrevPage
        }

        const response = generateResponse(200, true, "Data Fetched succesfully!", processedRows, meta)
        res.status(200).json(response)

    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong!"))
    }
}

export const exportDailyLogs = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try{
        
        const{month, year, employee_id} = req.query

        const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = moment(startDate).endOf('month').toDate();

        const whereOptions = {
            date: {
                [Op.between]: [startDate, endDate]
            }
        }

        if(employee_id){
            whereOptions.user_id = employee_id
        }


        const attendanceLogs = await Attendance.findAll({
            where: whereOptions,
            include: [
                {
                    model: AttendanceStatus,
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
        })

        const processedRows = await Promise.all(attendanceLogs.map(async(row) => {
            const masterPolicy = await getMasterPolicy(row.user_id)

            const attendancePolicy = await AttendancePolicy.findByPk(masterPolicy?.attendance_policy_id)

            const shiftPolicy = await ShiftPolicy.findByPk(masterPolicy?.shift_policy_id)

            const user = await User.findByPk(row.user_id, {
                attributes: ['id', 'employee_generated_id', 'employee_name'],
                paranoid: false
            })

            // const {baseWorkingHours, actualWorkingHours} = calculateWorkingHours(shiftPolicy, row.punch_in_time, row.punch_out_time )

            const baseWorkingHours = calculateWorkingHours(shiftPolicy, row?.punch_in_time, row?.punch_out_time) || '00:00'
            const actualWorkingHours = calculateWorkingHours(shiftPolicy, row?.punch_in_time, row?.punch_out_time) || '00:00'

			const{overtime_hours, deficit_hours} = calculateOvertimeDeficit(actualWorkingHours, baseWorkingHours)

            const isRegularise = await RegularizationRecord.findAll({
                where: {
                    date: row.date
                }
            })

            const calculateLateInorEarlyOut = () => {
                if(shiftPolicy?.shift_type_id == 1){
                    let late_in;
                    let early_out;

                    if(moment(row.punch_in_time).isAfter(moment(shiftPolicy?.shift_start_time))){
                        late_in = true
                    }

                    if(moment(row.punch_out_time).isBefore(moment(shiftPolicy?.shift))){
                        early_out = true
                    }

                    if(moment(row.punch_in_time).isAfter(moment(shiftPolicy?.shift_start_time) && moment(row.punch_out_time).isBefore(moment(shiftPolicy?.shift)))){
                        late_in = true
                        early_out = true
                    }

                    let status;

                    if(late_in){
                        status = 'L'
                    }

                    if(early_out){
                        status = 'E'
                    }

                    if(late_in && early_out){
                        status = 'L + E'
                    }

                    return status
                    
                }
            }

            const calculateStatusRemark = () => {
                let status
                let flexi
                let grace
                let grace_exceeded
                let flexi_exceeded

                if(row.flexi_used){
                    flexi = true
                }

                if(row.grace_used){
                    grace = true
                }

                if(row.grace_counter >= shiftPolicy?.number_of_days_grace_allowed){
                    grace_exceeded = true
                }

                if(row.flexi_counter >= shiftPolicy?.number_of_days_flexi_allowed){
                    flexi_exceeded = true
                }

                if(flexi){
                    status = 'F'
                }

                if(grace){
                    status = 'G'
                }

                if(flexi && grace){
                    status = 'F + G'
                }

                if(flexi_exceeded){
                    status = 'F*'
                }
                
                if(grace_exceeded){
                    status = 'G*'
                }

                if(flexi_exceeded && grace_exceeded){
                    status = 'F* + G*'
                }

                return status

            }

            const getHoursWorked = (start, end) => {

                if (!start || !end) {
                    return '---'
                }
                const startMoment = moment(start, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 })

                const endMoment = moment(end, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 })

                if (startMoment.isAfter(endMoment)) {

                    endMoment.add(24, 'hours')

                }
        
                const duration = moment.duration(endMoment.diff(startMoment))

                const formattedDuration = moment.utc(duration.asMilliseconds()).format('HH:mm')
        
                return formattedDuration
            }

            const hours_worked = getHoursWorked(row.punch_in_time, row.punch_out_time)

            const response = {
                'employee Id': row.employee_generated_id,
                'employee Name': user?.employee_name,
                date: row.date,
                'first in': row.punch_in_time,
                'last out': row.punch_out_time,
                'hours worked': hours_worked,
                'late in/early out' :  calculateLateInorEarlyOut()? calculateLateInorEarlyOut() : null,
                'overtime hours': overtime_hours,
                'deficit hours': deficit_hours,
                'status remark': calculateStatusRemark()? calculateStatusRemark() : null,
                'status': row.attendance_status.name,
                'regularise': isRegularise.length > 0 ? 'yes' : 'no'
            }

            return response

        }))


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
        ]

        console.log(processedRows)


        const parser = new Parser({ fields })

        const csv = parser.parse(processedRows)

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'atteachment; filename=daily_logs.csv')

        res.status(200).send(csv);

    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong!"))
    }
}


export const leaveRequestLogs = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{

        const {month, year, employee_id} = req.query

        const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = moment(startDate).endOf('month').toDate();

        let whereOptions = {
            start_date: {
                [Op.gte]: startDate
            },
            end_date: {
                [Op.lte]: endDate
            }
        }

        if(employee_id){
            whereOptions.user_id = employee_id
        }

        const page = req.query.page? req.query.page : 1
        const records = req.query.records? req.query.records : 10


        const pageNumber = parseInt(page)
        const recordsPerPage = parseInt(records)

        const offset = (pageNumber - 1) * recordsPerPage;

        const leaveRecords = await LeaveRecord.findAndCountAll({
            where: whereOptions,
            include: [
                {model: Approval, attributes:['id', 'name']},
                {model: LeaveType, attributes:['id', 'leave_type_name']},
                {model: User, as: 'requester', attributes: ['id', 'employee_generated_id', 'employee_name']},
                {model: DayType, attributes: ['id', 'name']},
                {model: HalfDayType, attributes: ['id', 'name']}
            ],
            offset: offset,
            limit: recordsPerPage
        })

        // const processedRows = await Promise.all(leaveRecords.rows.map(async(row) => {

        let processedRows = [];

        for(const row of leaveRecords?.rows){
            const masterPolicy = await getMasterPolicy(row?.requester?.id)


            const user = await User.findByPk(row?.user_id, {
                include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']}, {model: ReportingRole}]}],
                attributes:['id', 'employee_generated_id'],
                paranoid: false
            })

            const leaveWorkflow = masterPolicy.leave_workflow

            const approvalWorkflow = await ApprovalFlow.findByPk(leaveWorkflow, 
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

            const filteredManagers = reportingManager?.filter(manager => {return approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id)})

            const approverList = filteredManagers?.map(item => item?.manager?.employee_name)

            const leaveRequest = await LeaveRequest?.findAll({
                where: {
                    leave_record_id: row?.id
                },
                include: [
                    {
                        model: Approval, attributes: ['id', 'name']
                    },
                    {
                        model: ReportingManagers,
                        include: [
                            {model: User, as: 'manager', attributes: ['id', 'employee_name']}
                        ]
                    }
                ]
            })

            const statusStrings = leaveRequest.map(item => {
                const managerName = item.reporting_manager.manager.employee_name
                const approvalStatus = item.approval_status.name;
                return `${managerName} - ${approvalStatus}`
            })

            const startDate = moment(row?.start_date, "YYYY-MM-DD")
            const endDate = moment(row?.end_date, "YYYY-MM-DD")

            const duration = moment.duration(endDate.diff(startDate)).asDays() + 1

            const response = {
                'employee_id': row?.requester?.employee_generated_id,
                'employee_name': row?.requester?.employee_name,
                'applied_on': moment(row?.createdAt),
                'start_date': row?.start_date,
                'end_date': row?.end_date,
                'leave_applied_for': row?.leave_type?.leave_type_name,
                'number_of_days': duration,
                'supporting': row?.reason,
                'request_status': row?.approval_status?.name,
                'approver_list': approverList,
                'actioned_by': statusStrings,
                'action_date': leaveRequest[leaveRequest.length - 1]?.updatedAt
            }
            processedRows.push(response)
        }



        const totalPages = Math.ceil(leaveRecords.count / recordsPerPage)
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;

        const meta = {
            totalCount: leaveRecords.count,
            pageCount: totalPages,
            currentPage: page,
            perPage: recordsPerPage,
            hasNextPage,
            hasPrevPage
        }

        const response = generateResponse(200, true, "Reports fetched succesfully!", processedRows, meta)
        res.status(200).json(response)

    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong!"))
    }
}


export const exportLeaveRequestLogs = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        
        
        const {month, year, employee_id} = req.query

        const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = moment(startDate).endOf('month').toDate();

        let whereOptions = {
            start_date: {
                [Op.gte]: startDate
            },
            end_date: {
                [Op.lte]: endDate
            }
        }

        if(employee_id){
            whereOptions.user_id = employee_id
        }

        const leaveRecords = await LeaveRecord.findAll({
            where: whereOptions,
            include: [
                {model: Approval, attributes:['id', 'name']},
                {model: LeaveType, attributes:['id', 'leave_type_name']},
                {model: User, as: 'requester', attributes: ['id', 'employee_generated_id', 'employee_name']},
                {model: DayType, attributes: ['id', 'name']},
                {model: HalfDayType, attributes: ['id', 'name']}
            ],
        })

        // const processedRows = await Promise.all(leaveRecords.map(async(row) => {

            let processedRows = [];

            for(const row of leaveRecords){
                const masterPolicy = await getMasterPolicy(row?.requester?.id)


                const user = await User.findByPk(row?.user_id, {
                    include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']}, {model: ReportingRole}]}],
                    attributes:['id', 'employee_generated_id'],
                    paranoid: false
                })

                const leaveWorkflow = masterPolicy.leave_workflow

                const approvalWorkflow = await ApprovalFlow.findByPk(leaveWorkflow, 
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

                const filteredManagers = reportingManager?.filter(manager => {return approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id)})

                const approverList = filteredManagers?.map(item => item?.manager?.employee_name)

                const leaveRequest = await LeaveRequest?.findAll({
                    where: {
                        leave_record_id: row?.id
                    },
                    include: [
                        {
                            model: Approval, attributes: ['id', 'name']
                        },
                        {
                            model: ReportingManagers,
                            include: [
                                {model: User, as: 'manager', attributes: ['id', 'employee_name']}
                            ]
                        }
                    ]
                })

                const statusStrings = leaveRequest.map(item => {
                    const managerName = item.reporting_manager.manager.employee_name
                    const approvalStatus = item.approval_status.name;
                    return `${managerName} - ${approvalStatus}`
                })

                const startDate = moment(row?.start_date, "YYYY-MM-DD")
                const endDate = moment(row?.end_date, "YYYY-MM-DD")

                const duration = moment.duration(endDate.diff(startDate)).asDays() + 1

                const response = {
                    'employee Id': row?.requester?.employee_generated_id,
                    'employee name': row?.requester?.employee_name,
                    'applied on': moment(row?.createdAt),
                    'start date': row?.start_date,
                    'end date': row?.end_date,
                    'leave applied for': row?.leave_type?.leave_type_name,
                    'number of days': duration,
                    'supporting': row?.reason,
                    'request status': row?.approval_status?.name,
                    'approver list': approverList,
                    'actioned by': statusStrings,
                    'action date': leaveRequest[leaveRequest.length - 1]?.updatedAt
                }
                processedRows.push(response)
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
        ]

        const parser = new Parser({ fields })

        const csv = parser.parse(processedRows)

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'atteachment; filename=leave_records_logs.csv')

        res.status(200).send(csv);

    }catch(err){
        console.log(err)
        res.status(500).json(err)
        // next(internalServerError("Something went wrong!"))
    }
}