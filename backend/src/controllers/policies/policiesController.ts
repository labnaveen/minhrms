import { NextFunction, Request, Response } from "express";
import {Model, Op} from 'sequelize'
import { IMasterControllerOptions, MasterController } from "../masterController";
import { LeaveType, User } from "../../models";
import BaseLeaveConfiguration from "../../models/baseLeaveConfiguration";
import MasterPolicy from "../../models/masterPolicy";
import { conflict } from "../../services/error/Conflict";
import { generateResponse } from "../../services/response/response";
import { internalServerError } from "../../services/error/InternalServerError";
import { badRequest } from "../../services/error/BadRequest";
import { EmployeeAttributes } from "../employee/employeeController";
import { MasterPolicyControllerAttributes } from "../masterPolicy/masterPolicyController";
import AttendancePolicy from "../../models/attendancePolicy";
import WeeklyOffPolicy from "../../models/weeklyOffPolicy";
import HolidayCalendar from "../../models/holidayCalendar";
import WeeklyOffAssociation from "../../models/weeklyOffAssociation";
import Week from "../../models/dropdown/chronology/week";
import ShiftPolicy from "../../models/shiftPolicy";
import Division from "../../models/division";
import DivisionUnits from "../../models/divisionUnits";
import ReportingRole from "../../models/reportingRole";
import ApprovalFlow from "../../models/approvalFlow";
import ReportingManagers from "../../models/reportingManagers";
import LeaveTypePolicy from "../../models/leaveTypePolicy";


type PolicyController = MasterController<Model> & {
    getPolicySummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    employeePolicies: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    attendancePolicies: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    leavePolicies: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    holidayPolicies: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const PolicyController= (
    model: typeof Model & {
        new (): User;
    }
):PolicyController => {

    const { getAll, getById, create, update, destroy, getAllDropdown} = MasterController<Model>(model);


    const getPolicySummary = async(req: Request, res: Response, next:NextFunction): Promise<void> => {
        try{
            //@ts-ignore
            const {id} = req.credentials

            const user = await User.findByPk(id) as EmployeeAttributes | null;

            if(user?.master_policy_id){

                const masterPolicy = await MasterPolicy.findByPk(user.master_policy_id) as MasterPolicyControllerAttributes | null

                if(masterPolicy){

                    const attendance_policy = await AttendancePolicy.findByPk(masterPolicy.attendance_policy_id, {
                        attributes: ['id', 'half_day', 'min_hours_for_half_day']
                    })

                    const baseLeaveConfiguration = await BaseLeaveConfiguration.findByPk(masterPolicy.base_leave_configuration_id, {
                        attributes: ['id', 'policy_name', 'policy_description', 'proxy_leave_application', 'leave_calendar_from']
                    })

                    const shiftPolicy  = await ShiftPolicy.findByPk(masterPolicy.shift_policy_id, {
                        attributes: ['id', 'shift_name', 'shift_description', 'shift_start_time', 'shift_end_time', 'grace_duration_allowed']
                    });

                    const Attendance_Policy = {
                        attendance_policy,
                        shiftPolicy
                    }

                    const weeklyOffPolicy = await WeeklyOffPolicy.findByPk(masterPolicy.weekly_off_policy_id, {
                        include: [
                            {model: WeeklyOffAssociation, attributes:['id', 'week_number'], include:[{model: Week, as:'day', attributes:['id', 'name']}]}
                        ],
                        attributes:['id', 'name', 'description']
                    })

                    const holidayCalendar = await HolidayCalendar.findByPk(masterPolicy.holiday_calendar_id, {
                        attributes:['id', 'name', 'year']
                    })

                    const responseFormat = {
                        Attendance_Policy,
                        baseLeaveConfiguration,
                        weeklyOffPolicy,
                        holidayCalendar
                    }


                    const response = generateResponse(200, true, "Policy Summary fetched succesfully!", responseFormat)

                    res.status(200).json(response)

                }else{
                    next(badRequest("There is no master policy with that id!"))
                }

            }else{
                next(badRequest("There is no master policy assigned to this user"))
            }

        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError('Something went wrong!'))
        }
    }

    const employeePolicies = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const totalEmployees = await User.count({
                where: {
                    status: true
                }
            })

            const totalOrganizationDivision = await Division.count()

            // const employee_with_organization_division = await User.count({
            //     where: {
            //         status: true
            //     },
            //     include: [
            //         {
            //             model: DivisionUnits,
            //             through: { attributes: [] },
            //             required: true
            //         }
            //     ]
            // })

            const pending_organization_division = await User.count({
                where: {
                    status: true,
                    '$division_units.id$': {
                        [Op.eq]: null
                    }
                },
                include: [
                    {
                        model: DivisionUnits,
                        through: { attributes: [] },
                        required: false
                    }
                ],
            })

            const totalReportingStructure = await ReportingRole.count()

            const employeesWithoutReportingStructure = await User.count({
                where: {
                    status: true,
                    '$Manager.id$': null
                },
                include: [
                    {
                        model: ReportingManagers,
                        as: 'Manager',
                        through: { attributes: [] },
                        required: false
                    }
                ],
            })

            const totalApprovalFlows = await ApprovalFlow.count()

            const ReportingRolesWithoutApprovalFlow = await ApprovalFlow.count({
                where: {
                    '$direct.id$': null
                },
                include: [
                    {
                        model: ReportingRole,
                        as: 'direct',
                        through: {attributes: []},
                        required: false
                    }
                ]
            })

            const totalMasterPolicy = await MasterPolicy.count()

            const employeesWithoutMasterPolicy = await User.count({
                where: {
                    '$master_policy.id$': null
                },
                include: [
                    {
                        model: MasterPolicy,
                        required: false
                    }
                ]
            })

            const responseBody = {
                totalEmployees, 
                organizationDivision: {
                    totalOrganizationDivision, 
                    pending_organization_division, 
                    // employee_with_organization_division
                }, 
                reportingStructure: {
                    totalReportingStructure,
                    employeesWithoutReportingStructure
                },
                approvalWorkFlows: {
                    totalApprovalFlows,
                    ReportingRolesWithoutApprovalFlow
                },
                masterPolicy: {
                    totalMasterPolicy,
                    employeesWithoutMasterPolicy   
                }
            }

            const response = generateResponse(200, true, "Policy Summary fetched succesfully!", responseBody)

            res.status(200).json(response)
            

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const attendancePolicies = async(req: Request, res: Response, next:  NextFunction) : Promise<void> => {
        try{

            const attendancePolicies = await AttendancePolicy.count()

            const remaingAttendancePolicies = await AttendancePolicy.count({
                where: {
                    '$master_policy.id$': null
                },
                include: [
                    {
                        model: MasterPolicy,
                    }
                ]
            })

            const totalShiftPolicies = await ShiftPolicy.count()

            const remainingShiftPolicies = await ShiftPolicy.count({
                where: {
                    '$master_policy.id$': null
                },
                include: [
                    {
                        model: MasterPolicy,
                    }
                ]
            })

            const responseBody = {
                attendance_policies: {
                    attendancePolicies,
                    remaingAttendancePolicies
                },
                shift_policy: {
                    totalShiftPolicies,
                    remainingShiftPolicies
                }
            }

            const response = generateResponse(200, true, "Policy summary for attendance module fetched succesfully", responseBody)

            res.status(200).json(response)
            

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const leavePolicies = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const totalLeavePolicies = await LeaveTypePolicy.count()

            const remainingLeavePolicies = await LeaveTypePolicy.count({
                where: {
                    '$MasterPolicies.id$': {
                        [Op.eq]: null
                    }
                },
                include: [
                    {
                        model: MasterPolicy,
                        as: 'MasterPolicies',
                        required: false,
                        through: {attributes: []}
                    }
                ]
            })

            const totalLeaveTypes = await LeaveType.count()

            const remainginTotalLeaveTypes = await LeaveType.count({
                where: {
                   '$MasterPolicies.id$': {
                    [Op.eq]: null
                   }
                },
                include: [
                    {
                        model: MasterPolicy,
                        as: 'MasterPolicies',
                        through: {attributes: []}
                    }
                ]
            })

            const totalWeeklyOffs = await WeeklyOffPolicy.count()

            const remainingWeeklyOff = await WeeklyOffPolicy.count({
                where: {
                    '$master_policy.id$': null
                },
                include: [
                    {
                        model: MasterPolicy
                    }
                ]
            })

            let responseBody = {
                leave_type_policies: {
                    totalLeavePolicies,
                    remainingLeavePolicies,
                },
                leave_type: {
                    totalLeaveTypes,
                    remainginTotalLeaveTypes,
                },
                weekly_off: {
                    totalWeeklyOffs,
                    remainingWeeklyOff
                }
            }

            let response = generateResponse(200, true, "Policy Summar for leave module fetched succesfully!", responseBody)
            res.status(200).json(response)

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const holidayPolicies = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const totalNumberOfHolidayCalenders = await HolidayCalendar.count()

            const remainingHolidayCalendars = await HolidayCalendar.count({
                where: {
                    '$master_policy.id$': null
                },
                include: [
                    {
                        model: MasterPolicy,
                    }
                ]
            })

            let responseBody = {
                holiday_calendar: {
                    totalNumberOfHolidayCalenders,
                    remainingHolidayCalendars
                }
            }

            const response = generateResponse(200, true, "Holiday calendar fetched succesfully!", responseBody)
            res.status(200).json(response)

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }


    
    return { 
        getAll, 
        getById, 
        update, 
        destroy, 
        create, 
        getAllDropdown, 
        getPolicySummary, 
        employeePolicies,
        attendancePolicies,
        leavePolicies,
        holidayPolicies 
    }
}