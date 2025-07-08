"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const models_1 = require("../../models");
const baseLeaveConfiguration_1 = __importDefault(require("../../models/baseLeaveConfiguration"));
const masterPolicy_1 = __importDefault(require("../../models/masterPolicy"));
const response_1 = require("../../services/response/response");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const BadRequest_1 = require("../../services/error/BadRequest");
const attendancePolicy_1 = __importDefault(require("../../models/attendancePolicy"));
const weeklyOffPolicy_1 = __importDefault(require("../../models/weeklyOffPolicy"));
const holidayCalendar_1 = __importDefault(require("../../models/holidayCalendar"));
const weeklyOffAssociation_1 = __importDefault(require("../../models/weeklyOffAssociation"));
const week_1 = __importDefault(require("../../models/dropdown/chronology/week"));
const shiftPolicy_1 = __importDefault(require("../../models/shiftPolicy"));
const division_1 = __importDefault(require("../../models/division"));
const divisionUnits_1 = __importDefault(require("../../models/divisionUnits"));
const reportingRole_1 = __importDefault(require("../../models/reportingRole"));
const approvalFlow_1 = __importDefault(require("../../models/approvalFlow"));
const reportingManagers_1 = __importDefault(require("../../models/reportingManagers"));
const leaveTypePolicy_1 = __importDefault(require("../../models/leaveTypePolicy"));
const PolicyController = (model) => {
    const { getAll, getById, create, update, destroy, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const getPolicySummary = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            if (user?.master_policy_id) {
                const masterPolicy = await masterPolicy_1.default.findByPk(user.master_policy_id);
                if (masterPolicy) {
                    const attendance_policy = await attendancePolicy_1.default.findByPk(masterPolicy.attendance_policy_id, {
                        attributes: ['id', 'half_day', 'min_hours_for_half_day']
                    });
                    const baseLeaveConfiguration = await baseLeaveConfiguration_1.default.findByPk(masterPolicy.base_leave_configuration_id, {
                        attributes: ['id', 'policy_name', 'policy_description', 'proxy_leave_application', 'leave_calendar_from']
                    });
                    const shiftPolicy = await shiftPolicy_1.default.findByPk(masterPolicy.shift_policy_id, {
                        attributes: ['id', 'shift_name', 'shift_description', 'shift_start_time', 'shift_end_time', 'grace_duration_allowed']
                    });
                    const Attendance_Policy = {
                        attendance_policy,
                        shiftPolicy
                    };
                    const weeklyOffPolicy = await weeklyOffPolicy_1.default.findByPk(masterPolicy.weekly_off_policy_id, {
                        include: [
                            { model: weeklyOffAssociation_1.default, attributes: ['id', 'week_number'], include: [{ model: week_1.default, as: 'day', attributes: ['id', 'name'] }] }
                        ],
                        attributes: ['id', 'name', 'description']
                    });
                    const holidayCalendar = await holidayCalendar_1.default.findByPk(masterPolicy.holiday_calendar_id, {
                        attributes: ['id', 'name', 'year']
                    });
                    const responseFormat = {
                        Attendance_Policy,
                        baseLeaveConfiguration,
                        weeklyOffPolicy,
                        holidayCalendar
                    };
                    const response = (0, response_1.generateResponse)(200, true, "Policy Summary fetched succesfully!", responseFormat);
                    res.status(200).json(response);
                }
                else {
                    next((0, BadRequest_1.badRequest)("There is no master policy with that id!"));
                }
            }
            else {
                next((0, BadRequest_1.badRequest)("There is no master policy assigned to this user"));
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError('Something went wrong!'))
        }
    };
    const employeePolicies = async (req, res, next) => {
        try {
            const totalEmployees = await models_1.User.count({
                where: {
                    status: true
                }
            });
            const totalOrganizationDivision = await division_1.default.count();
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
            const pending_organization_division = await models_1.User.count({
                where: {
                    status: true,
                    '$division_units.id$': {
                        [sequelize_1.Op.eq]: null
                    }
                },
                include: [
                    {
                        model: divisionUnits_1.default,
                        through: { attributes: [] },
                        required: false
                    }
                ],
            });
            const totalReportingStructure = await reportingRole_1.default.count();
            const employeesWithoutReportingStructure = await models_1.User.count({
                where: {
                    status: true,
                    '$Manager.id$': null
                },
                include: [
                    {
                        model: reportingManagers_1.default,
                        as: 'Manager',
                        through: { attributes: [] },
                        required: false
                    }
                ],
            });
            const totalApprovalFlows = await approvalFlow_1.default.count();
            const ReportingRolesWithoutApprovalFlow = await approvalFlow_1.default.count({
                where: {
                    '$direct.id$': null
                },
                include: [
                    {
                        model: reportingRole_1.default,
                        as: 'direct',
                        through: { attributes: [] },
                        required: false
                    }
                ]
            });
            const totalMasterPolicy = await masterPolicy_1.default.count();
            const employeesWithoutMasterPolicy = await models_1.User.count({
                where: {
                    '$master_policy.id$': null
                },
                include: [
                    {
                        model: masterPolicy_1.default,
                        required: false
                    }
                ]
            });
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
            };
            const response = (0, response_1.generateResponse)(200, true, "Policy Summary fetched succesfully!", responseBody);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const attendancePolicies = async (req, res, next) => {
        try {
            const attendancePolicies = await attendancePolicy_1.default.count();
            const remaingAttendancePolicies = await attendancePolicy_1.default.count({
                where: {
                    '$master_policy.id$': null
                },
                include: [
                    {
                        model: masterPolicy_1.default,
                    }
                ]
            });
            const totalShiftPolicies = await shiftPolicy_1.default.count();
            const remainingShiftPolicies = await shiftPolicy_1.default.count({
                where: {
                    '$master_policy.id$': null
                },
                include: [
                    {
                        model: masterPolicy_1.default,
                    }
                ]
            });
            const responseBody = {
                attendance_policies: {
                    attendancePolicies,
                    remaingAttendancePolicies
                },
                shift_policy: {
                    totalShiftPolicies,
                    remainingShiftPolicies
                }
            };
            const response = (0, response_1.generateResponse)(200, true, "Policy summary for attendance module fetched succesfully", responseBody);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const leavePolicies = async (req, res, next) => {
        try {
            const totalLeavePolicies = await leaveTypePolicy_1.default.count();
            const remainingLeavePolicies = await leaveTypePolicy_1.default.count({
                where: {
                    '$MasterPolicies.id$': {
                        [sequelize_1.Op.eq]: null
                    }
                },
                include: [
                    {
                        model: masterPolicy_1.default,
                        as: 'MasterPolicies',
                        required: false,
                        through: { attributes: [] }
                    }
                ]
            });
            const totalLeaveTypes = await models_1.LeaveType.count();
            const remainginTotalLeaveTypes = await models_1.LeaveType.count({
                where: {
                    '$MasterPolicies.id$': {
                        [sequelize_1.Op.eq]: null
                    }
                },
                include: [
                    {
                        model: masterPolicy_1.default,
                        as: 'MasterPolicies',
                        through: { attributes: [] }
                    }
                ]
            });
            const totalWeeklyOffs = await weeklyOffPolicy_1.default.count();
            const remainingWeeklyOff = await weeklyOffPolicy_1.default.count({
                where: {
                    '$master_policy.id$': null
                },
                include: [
                    {
                        model: masterPolicy_1.default
                    }
                ]
            });
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
            };
            let response = (0, response_1.generateResponse)(200, true, "Policy Summar for leave module fetched succesfully!", responseBody);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const holidayPolicies = async (req, res, next) => {
        try {
            const totalNumberOfHolidayCalenders = await holidayCalendar_1.default.count();
            const remainingHolidayCalendars = await holidayCalendar_1.default.count({
                where: {
                    '$master_policy.id$': null
                },
                include: [
                    {
                        model: masterPolicy_1.default,
                    }
                ]
            });
            let responseBody = {
                holiday_calendar: {
                    totalNumberOfHolidayCalenders,
                    remainingHolidayCalendars
                }
            };
            const response = (0, response_1.generateResponse)(200, true, "Holiday calendar fetched succesfully!", responseBody);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
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
    };
};
exports.PolicyController = PolicyController;
