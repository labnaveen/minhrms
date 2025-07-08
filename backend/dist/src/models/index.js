"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expensesCategoriesForms = exports.expenses = exports.expencesPurpuse = exports.expencesApprovalStatus = exports.expencesCategories = exports.AccrualFrom = exports.LeaveRecord = exports.LeaveBalance = exports.LeaveType = exports.DropdownMarkingStatus = exports.DropdownApprovalStatus = exports.Attendance = exports.AttendanceStatus = exports.Refresh = exports.EmployeeAddress = exports.CompanyAddress = exports.Company = exports.User = exports.Permissions = exports.Roles = void 0;
const roles_1 = __importDefault(require("./roles"));
const permissions_1 = __importDefault(require("./permissions"));
const user_1 = __importDefault(require("./user"));
const company_1 = __importDefault(require("./company"));
const companyAddress_1 = __importDefault(require("./address/companyAddress"));
const employeeAddress_1 = __importDefault(require("./address/employeeAddress"));
const Industry_1 = __importDefault(require("./Industry"));
const country_1 = __importDefault(require("./country"));
const attendanceStatus_1 = __importDefault(require("./attendanceStatus"));
const attendancePolicy_1 = __importDefault(require("./attendancePolicy"));
const attendance_1 = __importDefault(require("./attendance"));
const masterPolicy_1 = __importDefault(require("./masterPolicy"));
const leaveType_1 = __importDefault(require("./leaveType"));
const leaveBalance_1 = __importDefault(require("./leaveBalance"));
const leaveRecord_1 = __importDefault(require("./leaveRecord"));
const approval_1 = __importDefault(require("./dropdown/status/approval"));
const regularisationStatus_1 = __importDefault(require("./regularisationStatus"));
const regularisationStatus_attendancePolicy_1 = __importDefault(require("./regularisationStatus_attendancePolicy"));
const shiftPolicy_1 = __importDefault(require("./shiftPolicy"));
const shift_1 = __importDefault(require("./dropdown/type/shift"));
const division_1 = __importDefault(require("./division"));
const divisionUnits_1 = __importDefault(require("./divisionUnits"));
const accrualFrom_1 = __importDefault(require("./dropdown/chronology/accrualFrom"));
const leaveTypePolicy_1 = __importDefault(require("./leaveTypePolicy"));
const reportingRole_1 = __importDefault(require("./reportingRole"));
const reportingManagers_1 = __importDefault(require("./reportingManagers"));
const announcements_1 = __importDefault(require("./announcements"));
const announcementEmployee_1 = __importDefault(require("./announcementEmployee"));
const announcementDivisionUnit_1 = __importDefault(require("./announcementDivisionUnit"));
const asset_1 = __importDefault(require("./asset"));
const baseLeaveConfiguration_1 = __importDefault(require("./baseLeaveConfiguration"));
const approvalFlow_1 = __importDefault(require("./approvalFlow"));
const approvalFlowReportingRole_1 = __importDefault(require("./approvalFlowReportingRole"));
const approvalFlowSupervisorIndirect_1 = __importDefault(require("./approvalFlowSupervisorIndirect"));
const customHoliday_1 = __importDefault(require("./customHoliday"));
const holidayCalendar_1 = __importDefault(require("./holidayCalendar"));
const holidayDatabase_1 = __importDefault(require("./holidayDatabase"));
const holidayCalendarAssociation_1 = __importDefault(require("./holidayCalendarAssociation"));
const weeklyOffPolicy_1 = __importDefault(require("./weeklyOffPolicy"));
const weeklyOffAssociation_1 = __importDefault(require("./weeklyOffAssociation"));
const week_1 = __importDefault(require("./dropdown/chronology/week"));
const expencesCategories_1 = __importDefault(require("./expencesCategories"));
const expenses_1 = __importDefault(require("./expenses"));
const expencesPurpuse_1 = __importDefault(require("./expencesPurpuse"));
const expencesApprovalStatus_1 = __importDefault(require("./expencesApprovalStatus"));
const expensesCategoriesForms_1 = __importDefault(require("./expensesCategoriesForms"));
const assignedAsset_1 = __importDefault(require("./assignedAsset"));
const gender_1 = __importDefault(require("./dropdown/type/gender"));
const reportingManagerEmployeeAssociation_1 = __importDefault(require("./reportingManagerEmployeeAssociation"));
const approvalFlowType_1 = __importDefault(require("./dropdown/type/approvalFlowType"));
const familyMember_1 = __importDefault(require("./familyMember"));
const relation_1 = __importDefault(require("./dropdown/relation/relation"));
const leaveAllocation_1 = __importDefault(require("./leaveAllocation"));
const experience_1 = __importDefault(require("./experience"));
const employment_1 = __importDefault(require("./dropdown/type/employment"));
const education_1 = __importDefault(require("./education"));
const educationType_1 = __importDefault(require("./dropdown/type/educationType"));
const profileImages_1 = __importDefault(require("./profileImages"));
const regularizationRecord_1 = __importDefault(require("./regularizationRecord"));
const leaveRequest_1 = __importDefault(require("./leaveRequest"));
const dayType_1 = __importDefault(require("./dropdown/dayType/dayType"));
const notification_1 = __importDefault(require("./notification"));
const regularizationRequest_1 = __importDefault(require("./regularizationRequest"));
const profileChangeRecord_1 = __importDefault(require("./profileChangeRecord"));
const profileChangeRequests_1 = __importDefault(require("./profileChangeRequests"));
const halfDayType_1 = __importDefault(require("./dropdown/dayType/halfDayType"));
const documents_1 = __importDefault(require("./documents"));
const letter_1 = __importDefault(require("./letter"));
const letterStatus_1 = __importDefault(require("./letterStatus"));
const expenses_2 = __importDefault(require("./expenses"));
const expenseRequest_1 = __importDefault(require("./expenseRequest"));
const punchLocation_1 = __importDefault(require("./punchLocation"));
// User.hasOne(Roles, { foreignKey: 'id' })
user_1.default.belongsTo(roles_1.default, { foreignKey: 'role_id', as: 'role' });
roles_1.default.hasMany(user_1.default, { foreignKey: 'role_id', as: 'users' });
roles_1.default.belongsToMany(permissions_1.default, {
    as: 'permissions',
    through: 'permissions_roles',
    foreignKey: 'roles_id',
    otherKey: 'permissions_id'
});
permissions_1.default.belongsToMany(roles_1.default, {
    as: 'roles',
    otherKey: 'roles_id',
    foreignKey: 'permissions_id',
    through: 'permissions_roles'
});
//User and Company Relationship
company_1.default.hasMany(user_1.default, { foreignKey: 'company_id' });
user_1.default.belongsTo(company_1.default);
//Company and CompanyAddress Relationship
companyAddress_1.default.belongsTo(company_1.default, { foreignKey: 'companyId' });
company_1.default.hasMany(companyAddress_1.default, { foreignKey: 'companyId' });
//User and UserAddress Relationship
employeeAddress_1.default.belongsTo(user_1.default, { foreignKey: 'userId' });
user_1.default.hasMany(employeeAddress_1.default, { foreignKey: 'userId' });
//Company and Industry relatioship
Industry_1.default.hasMany(company_1.default, {
    foreignKey: 'industryId'
});
company_1.default.belongsTo(Industry_1.default);
//Address and Company Address Relationship
companyAddress_1.default.hasMany(country_1.default, {
    foreignKey: 'company_present_country'
});
companyAddress_1.default.hasMany(country_1.default, {
    foreignKey: 'company_permanent_country'
});
country_1.default.belongsTo(companyAddress_1.default);
//Country and Employee Address Relationship
employeeAddress_1.default.hasMany(country_1.default, {
    foreignKey: 'employee_present_country'
});
employeeAddress_1.default.hasMany(country_1.default, {
    foreignKey: 'employee_permanent_country'
});
country_1.default.belongsTo(employeeAddress_1.default);
//Attendance status and Attendance Relationship
// AttendancePolicy.hasOne(AttendanceStatus, {
//     foreignKey: 'default_attendance_status'
// });
// AttendanceStatus.belongsTo(AttendancePolicy)
//Attendance Data and Employee Relationship
user_1.default.hasMany(attendance_1.default);
// User.belongsTo(Attendance)
//MasterPolicy and Other Policy Relationships
masterPolicy_1.default.hasOne(attendancePolicy_1.default, { sourceKey: 'attendance_policy_id', foreignKey: 'id' });
attendancePolicy_1.default.belongsTo(masterPolicy_1.default, { foreignKey: 'id' });
masterPolicy_1.default.hasOne(baseLeaveConfiguration_1.default, { sourceKey: 'base_leave_configuration_id', foreignKey: 'id' });
masterPolicy_1.default.belongsTo(approvalFlow_1.default, { foreignKey: 'attendance_workflow', as: 'attendanceWorkflow' });
masterPolicy_1.default.belongsTo(approvalFlow_1.default, { foreignKey: 'leave_workflow', as: 'leaveWorkflow' });
masterPolicy_1.default.belongsTo(approvalFlow_1.default, { foreignKey: 'profile_change_workflow', as: 'profileChangeWorkflow' });
masterPolicy_1.default.belongsTo(approvalFlow_1.default, { foreignKey: 'expense_workflow', as: 'expenseWorkflow' });
//Master Policy and Shift Policy relationship
masterPolicy_1.default.hasOne(shiftPolicy_1.default, { sourceKey: 'shift_policy_id', foreignKey: 'id' });
shiftPolicy_1.default.belongsTo(masterPolicy_1.default, { foreignKey: 'id' });
//Master Policy and Weekly Off policy Relationship
masterPolicy_1.default.hasOne(weeklyOffPolicy_1.default, { sourceKey: 'weekly_off_policy_id', foreignKey: 'id' });
weeklyOffPolicy_1.default.belongsTo(masterPolicy_1.default, { foreignKey: 'id' });
//Master Policy and Holiday calendar policy relationship
masterPolicy_1.default.hasOne(holidayCalendar_1.default, { sourceKey: 'holiday_calendar_id', foreignKey: 'id' });
holidayCalendar_1.default.belongsTo(masterPolicy_1.default, { foreignKey: 'id' });
//MasterPolicy and Employee Policy Relationship
// User.hasOne(MasterPolicy, { sourceKey: 'master_policy_id', foreignKey: 'id' })
user_1.default.belongsTo(masterPolicy_1.default, {
    foreignKey: 'master_policy_id',
});
masterPolicy_1.default.hasMany(user_1.default, {
    foreignKey: 'master_policy_id'
});
//Base Leave Configuration and Leave Types Relationship
// LeaveType.hasOne(BaseLeaveConfiguration, {sourceKey: 'base_leave_configuration_id', foreignKey: 'id'})
//Leave Balance Relationship with Leave Type and Employee ID
leaveBalance_1.default.belongsTo(leaveType_1.default, { foreignKey: 'leave_type_id' });
leaveBalance_1.default.belongsTo(user_1.default, { foreignKey: 'user_id' });
leaveType_1.default.hasMany(leaveBalance_1.default, { foreignKey: 'leave_type_id' });
user_1.default.hasMany(leaveBalance_1.default, { foreignKey: 'user_id' });
//Relationship Leave Record with the User
user_1.default.hasOne(leaveRecord_1.default, { foreignKey: 'user_id', as: 'requester' });
leaveRecord_1.default.belongsTo(user_1.default, { foreignKey: 'user_id', as: 'requester' });
//Peers and Leave Record Relationship
user_1.default.belongsToMany(leaveRecord_1.default, { through: 'peers_leave_record' });
leaveRecord_1.default.belongsToMany(user_1.default, { through: 'peers_leave_record' });
//LeaveRecord and Status Record Relationship
leaveRecord_1.default.belongsTo(approval_1.default, { foreignKey: 'status' });
//Leave Record and Leave Type ID Relationship
leaveType_1.default.hasOne(leaveRecord_1.default, { foreignKey: 'leave_type_id' });
leaveRecord_1.default.belongsTo(leaveType_1.default, { foreignKey: 'leave_type_id' });
//Regularisation Status and Attendance Polity Relationship
attendancePolicy_1.default.belongsToMany(attendanceStatus_1.default, {
    through: regularisationStatus_attendancePolicy_1.default,
    foreignKey: 'attendance_policy_id',
});
attendanceStatus_1.default.belongsToMany(attendancePolicy_1.default, {
    through: regularisationStatus_attendancePolicy_1.default,
    foreignKey: 'regularisation_status_id',
});
//Attendance Status and Attendance Policy relationship
attendancePolicy_1.default.hasOne(attendanceStatus_1.default, { sourceKey: 'default_attendance_status', foreignKey: 'id' });
//Attendance Status and Shift Policy
shiftPolicy_1.default.hasOne(shift_1.default, { sourceKey: 'shift_type_id', foreignKey: 'id' });
shiftPolicy_1.default.hasOne(attendanceStatus_1.default, { sourceKey: 'status_grace_exceeded', foreignKey: 'id' });
shiftPolicy_1.default.hasOne(attendanceStatus_1.default, { sourceKey: 'status_flexi_exceeded', foreignKey: 'id' });
shiftPolicy_1.default.hasOne(attendanceStatus_1.default, { sourceKey: 'status_punch_in_time_exceeded', foreignKey: 'id' });
//Division and Units Relationship
divisionUnits_1.default.belongsTo(division_1.default, { foreignKey: 'division_id' });
division_1.default.hasMany(divisionUnits_1.default, { foreignKey: 'division_id', sourceKey: 'id' });
//Division Units and User Relationship
// User.belongsTo(DivisionUnits, { as: 'Designation', foreignKey: 'designation' });
// User.belongsTo(DivisionUnits, { as: 'Department', foreignKey: 'department' });
//Units and Employees Relationship
divisionUnits_1.default.belongsToMany(user_1.default, {
    through: 'user_division',
    foreignKey: 'unit_id',
    otherKey: 'user_id'
});
user_1.default.belongsToMany(divisionUnits_1.default, {
    through: 'user_division',
    foreignKey: 'user_id',
    otherKey: 'unit_id'
});
// DivisionUnits.hasMany(UserDivision, { foreignKey: 'unit_id', sourceKey: 'id',  as: 'user_division' });
// UserDivision.belongsTo(DivisionUnits, { foreignKey: 'unit_id', targetKey: 'id' });
//leave type and leave type policy relationship
leaveTypePolicy_1.default.belongsTo(leaveType_1.default, { foreignKey: 'leave_type_id' });
leaveType_1.default.hasMany(leaveTypePolicy_1.default, { foreignKey: 'leave_type_id', sourceKey: 'id' });
leaveTypePolicy_1.default.hasMany(leaveAllocation_1.default, {
    foreignKey: 'leave_type_policy_id',
    sourceKey: 'id',
    as: 'leaveAllocations'
});
// LeaveAllocation.belongsTo(LeaveTypePolicy, { foreignKey: 'leave_type_policy_id'});
// LeaveAllocation.belongsTo(Months, {foreignKey: 'month_number'})
leaveType_1.default.belongsTo(accrualFrom_1.default, { foreignKey: 'leave_application_after' });
//Reporting Structure and Reporting Managers Relationship
// ReportingRole.hasMany(ReportingManagers, {foreignKey:'reporting_manager_id', sourceKey: 'id' })
reportingManagers_1.default.belongsTo(reportingRole_1.default, { foreignKey: 'reporting_role_id' });
reportingRole_1.default.hasMany(reportingManagers_1.default, { foreignKey: 'reporting_role_id' });
reportingManagers_1.default.belongsTo(user_1.default, { foreignKey: 'user_id' });
// User.belongsTo(ReportingManagers, {foreignKey: 'user_id'})
//Employee and Announcement Relationship
announcements_1.default.belongsToMany(user_1.default, { through: announcementEmployee_1.default, foreignKey: 'announcement_id' });
user_1.default.belongsToMany(announcements_1.default, { through: announcementEmployee_1.default, foreignKey: 'user_id' });
//Announcement and Unit Relationship
announcements_1.default.belongsToMany(divisionUnits_1.default, { through: announcementDivisionUnit_1.default, foreignKey: 'announcement_id', as: 'division_units' });
divisionUnits_1.default.belongsToMany(announcements_1.default, { through: announcementDivisionUnit_1.default, foreignKey: 'division_unit_id' });
// AnnouncementDivisionUnit.hasMany(Announcement)
// Announcement.belongsTo(AnnouncementDivisionUnit)
// AnnouncementDivisionUnit.belongsTo(AnnouncementEmployee, {
//     foreignKey: 'announcement_id',
//     targetKey: 'announcement_id'
//   });
//Appproval Flow and Reporting Role relationship
approvalFlow_1.default.belongsToMany(reportingRole_1.default, { through: approvalFlowReportingRole_1.default, foreignKey: 'approval_flow_id', as: 'direct' });
reportingRole_1.default.belongsToMany(approvalFlow_1.default, { through: approvalFlowReportingRole_1.default, foreignKey: 'reporting_role_id', as: 'direct' });
approvalFlow_1.default.belongsToMany(user_1.default, { through: approvalFlowSupervisorIndirect_1.default, foreignKey: 'approval_flow_id', as: 'indirect' });
user_1.default.belongsToMany(approvalFlow_1.default, { through: approvalFlowSupervisorIndirect_1.default, foreignKey: 'supervisor_role_id', as: 'indirect' });
//Asset and User Relationship
// User.hasMany(Asset, { foreignKey: 'user_id' });
// Asset.belongsTo(User, { foreignKey: 'user_id' });
user_1.default.belongsToMany(asset_1.default, { through: assignedAsset_1.default, foreignKey: 'user_id' });
asset_1.default.belongsToMany(user_1.default, { through: assignedAsset_1.default, foreignKey: 'asset_id' });
assignedAsset_1.default.belongsTo(asset_1.default, { foreignKey: 'asset_id' });
assignedAsset_1.default.belongsTo(user_1.default, { foreignKey: 'user_id' });
//Custom Holiday and Holiday Calendar Association
customHoliday_1.default.belongsTo(holidayCalendar_1.default);
holidayCalendar_1.default.hasMany(customHoliday_1.default);
//Holiday Calendar and Holiday Database Relationship
holidayCalendar_1.default.belongsToMany(holidayDatabase_1.default, { through: holidayCalendarAssociation_1.default, foreignKey: 'holiday_calendar_id' });
holidayDatabase_1.default.belongsToMany(holidayCalendar_1.default, { through: holidayCalendarAssociation_1.default, foreignKey: 'holiday_id' });
//WeeklyOffPolicy Relationship
weeklyOffAssociation_1.default.belongsTo(weeklyOffPolicy_1.default, { foreignKey: 'weekly_off_policy_id' });
// WeeklyOffAssociation.hasMany(Week, { foreignKey: 'week_name' });
weeklyOffPolicy_1.default.hasMany(weeklyOffAssociation_1.default, { foreignKey: 'weekly_off_policy_id' });
weeklyOffAssociation_1.default.belongsTo(week_1.default, { foreignKey: 'week_name', as: 'day' });
/// Expenses Model Relationship
expenses_1.default.belongsTo(expencesCategories_1.default, { foreignKey: 'category_id' });
expenses_1.default.belongsTo(expencesPurpuse_1.default, { foreignKey: 'purpose_id' });
expenses_1.default.belongsTo(expencesApprovalStatus_1.default, { foreignKey: 'status_id' });
///Expenses Category Relationship
expencesCategories_1.default.belongsTo(expensesCategoriesForms_1.default, { foreignKey: 'expense_category_form_id' });
//Gender and User Relationship
user_1.default.belongsTo(gender_1.default, { foreignKey: 'employee_gender_id' });
//User and Reporting Role Relationship
// User.belongsTo(ReportingManagers, {foreignKey: 'reporting_manager_id', as: 'Manager'})
user_1.default.belongsTo(reportingRole_1.default, { foreignKey: 'reporting_role_id' });
reportingManagers_1.default.belongsTo(user_1.default, { foreignKey: 'user_id' });
reportingManagers_1.default.hasMany(user_1.default, { foreignKey: 'reporting_manager_id', as: 'employees' });
reportingManagers_1.default.hasOne(user_1.default, { sourceKey: 'user_id', foreignKey: 'id', as: 'manager' });
user_1.default.belongsToMany(reportingManagers_1.default, { through: reportingManagerEmployeeAssociation_1.default, foreignKey: 'user_id', as: 'Manager' });
reportingManagers_1.default.belongsToMany(user_1.default, { through: reportingManagerEmployeeAssociation_1.default, foreignKey: 'reporting_manager_id' });
// User.hasOne(ReportingManagers, {foreignKey: 'reporting_manager_id', as: 'manager'})
// ReportingManagers.hasMany(ReportingManagerEmployeeAssociation, {sourceKey: 'reporting_manager_id', foreignKey:'id', as: 'AllEmployee'})
//Master Policy and Leave Type policy that are selected relationship
masterPolicy_1.default.belongsToMany(leaveType_1.default, { foreignKey: 'master_policy_id', through: 'master_policy_leave_policy', as: 'LeaveTypes' });
leaveType_1.default.belongsToMany(masterPolicy_1.default, { foreignKey: 'leave_type_id', through: 'master_policy_leave_policy', as: 'MasterPolicies' });
masterPolicy_1.default.belongsToMany(leaveTypePolicy_1.default, { foreignKey: 'master_policy_id', through: 'master_policy_leave_policy', as: 'LeaveTypePolicies' });
leaveTypePolicy_1.default.belongsToMany(masterPolicy_1.default, { foreignKey: 'leave_type_policy_id', through: 'master_policy_leave_policy', as: 'MasterPolicies' });
//User and reporting structure assocition
// User.belongsToMany(ReportingManagers, {through: ReportingManagerEmployeeAssociation, foreignKey: 'user_id', as: 'Employees'})
reportingManagers_1.default.belongsToMany(user_1.default, { through: reportingManagerEmployeeAssociation_1.default, foreignKey: 'reporting_manager_id', as: 'Employees' });
reportingRole_1.default.belongsToMany(user_1.default, { through: reportingManagerEmployeeAssociation_1.default, foreignKey: 'reporting_role_id', as: 'ReportingRole' });
user_1.default.belongsToMany(reportingManagers_1.default, { through: reportingManagerEmployeeAssociation_1.default, foreignKey: 'user_id', as: 'Managers' });
approvalFlow_1.default.belongsTo(approvalFlowType_1.default, { foreignKey: 'approval_flow_type_id' });
approvalFlowType_1.default.hasMany(approvalFlow_1.default, { foreignKey: 'approval_flow_type_id' });
//Relation and Family Member Table association
familyMember_1.default.belongsTo(relation_1.default, { foreignKey: 'relation_id' });
relation_1.default.hasMany(familyMember_1.default, { foreignKey: 'relation_id' });
//Association table between an Employee and the family member details.
user_1.default.hasMany(familyMember_1.default, { foreignKey: 'user_id' });
//Association between an Employee and their Experience Details.
user_1.default.hasMany(experience_1.default, { foreignKey: 'user_id' });
experience_1.default.belongsTo(employment_1.default, { foreignKey: 'employment_type_id' });
employment_1.default.hasMany(experience_1.default, { foreignKey: 'employment_type_id' });
//Education Relationships
user_1.default.hasMany(education_1.default, { foreignKey: 'user_id' });
education_1.default.belongsTo(educationType_1.default, { foreignKey: 'degree_id' });
educationType_1.default.hasMany(education_1.default, { foreignKey: 'degree_id' });
//User and ProfileImage
// ProfileImages.hasOne(User, {foreignKey: 'user_id'})
// User.belongsTo(ProfileImages, {foreignKey: 'user_id'})
user_1.default.hasOne(profileImages_1.default, { foreignKey: 'user_id' });
profileImages_1.default.belongsTo(user_1.default, { foreignKey: 'user_id' });
//User and Regularization Request
user_1.default.hasOne(regularizationRecord_1.default, { foreignKey: 'user_id', as: 'Requester' });
regularizationRecord_1.default.belongsTo(user_1.default, { foreignKey: 'user_id', as: 'Requester' });
leaveRecord_1.default.hasOne(leaveRequest_1.default, { foreignKey: 'leave_record_id' });
leaveRequest_1.default.belongsTo(leaveRecord_1.default, { foreignKey: 'leave_record_id' });
approval_1.default.hasOne(leaveRequest_1.default, { foreignKey: 'status' });
leaveRequest_1.default.belongsTo(approval_1.default, { foreignKey: 'status' });
reportingManagers_1.default.hasOne(leaveRequest_1.default, { foreignKey: 'reporting_manager_id' });
leaveRequest_1.default.belongsTo(reportingManagers_1.default, { foreignKey: 'reporting_manager_id' });
dayType_1.default.hasOne(leaveRecord_1.default, { foreignKey: 'day_type_id' });
leaveRecord_1.default.belongsTo(dayType_1.default, { foreignKey: 'day_type_id' });
halfDayType_1.default.hasOne(leaveRecord_1.default, { foreignKey: 'half_day_type_id' });
leaveRecord_1.default.belongsTo(halfDayType_1.default, { foreignKey: 'half_day_type_id' });
//User and Notification Relationship
user_1.default.hasOne(notification_1.default, { foreignKey: 'user_id' });
notification_1.default.belongsTo(user_1.default, { foreignKey: 'user_id' });
//Regularization Record and Regularization Relationship
regularizationRecord_1.default.hasOne(regularizationRequest_1.default, { foreignKey: 'regularization_record_id' });
regularizationRequest_1.default.belongsTo(regularizationRecord_1.default, { foreignKey: 'regularization_record_id' });
profileChangeRecord_1.default.hasOne(profileChangeRequests_1.default, { foreignKey: 'profile_change_record_id' });
profileChangeRequests_1.default.belongsTo(profileChangeRecord_1.default, { foreignKey: 'profile_change_record_id' });
regularisationStatus_1.default.hasOne(regularizationRecord_1.default, { foreignKey: 'request_status' });
regularizationRecord_1.default.belongsTo(regularisationStatus_1.default, { foreignKey: 'request_status' });
approval_1.default.hasOne(regularizationRecord_1.default, { foreignKey: 'status' });
regularizationRecord_1.default.belongsTo(approval_1.default, { foreignKey: 'status' });
user_1.default.hasOne(profileChangeRecord_1.default, { foreignKey: 'user_id' });
profileChangeRecord_1.default.belongsTo(user_1.default, { foreignKey: 'user_id' });
attendanceStatus_1.default.hasOne(attendance_1.default, { foreignKey: 'status' });
attendance_1.default.belongsTo(attendanceStatus_1.default, { foreignKey: 'status' });
attendanceStatus_1.default.hasOne(regularizationRecord_1.default, { foreignKey: 'request_status', as: 'Request_status' });
regularizationRecord_1.default.belongsTo(attendanceStatus_1.default, { foreignKey: 'request_status', as: 'Request_status' });
approval_1.default.hasOne(profileChangeRecord_1.default, { foreignKey: 'status' });
profileChangeRecord_1.default.belongsTo(approval_1.default, { foreignKey: 'status' });
// LeaveBalance.belongsTo(LeaveType, {foreignKey: 'leave_type_id', as: 'leaveType'})
//Last action by column in leave relationship with a user one to many
user_1.default.hasOne(leaveRecord_1.default, { foreignKey: 'last_action_by' });
leaveRecord_1.default.belongsTo(user_1.default, { foreignKey: 'last_action_by' });
//Relationship between documents and letters
letter_1.default.belongsTo(documents_1.default, { foreignKey: 'document_id' });
documents_1.default.hasOne(letter_1.default, { foreignKey: 'document_id' });
//Relationship between letters and users
user_1.default.hasMany(letter_1.default, { foreignKey: 'user_id' });
letter_1.default.belongsTo(user_1.default, { foreignKey: 'user_id' });
//relationship between letter and the approval
letterStatus_1.default.hasOne(letter_1.default, { foreignKey: 'status' });
letter_1.default.belongsTo(letterStatus_1.default, { foreignKey: 'status' });
documents_1.default.hasOne(expenses_2.default);
expenses_2.default.belongsTo(documents_1.default);
user_1.default.hasOne(expenses_2.default, { foreignKey: 'user_id' });
expenses_2.default.belongsTo(user_1.default, { foreignKey: 'user_id' });
//Expense and Expense Request relationships
expenses_2.default.hasOne(expenseRequest_1.default, { foreignKey: 'expense_id' });
expenseRequest_1.default.belongsTo(expenses_2.default, { foreignKey: 'expense_id' });
approval_1.default.hasOne(expenseRequest_1.default, { foreignKey: 'status' });
expenseRequest_1.default.belongsTo(approval_1.default, { foreignKey: 'status' });
reportingManagers_1.default.hasOne(expenseRequest_1.default, { foreignKey: 'reporting_manager_id' });
expenseRequest_1.default.belongsTo(reportingManagers_1.default, { foreignKey: 'reporting_manager_id' });
expensesCategoriesForms_1.default.hasOne(expencesCategories_1.default, { foreignKey: 'expense_category_form_id' });
expencesCategories_1.default.belongsTo(expensesCategoriesForms_1.default, { foreignKey: 'expense_category_form_id' });
attendance_1.default.hasMany(punchLocation_1.default, { foreignKey: "attendance_log_id" });
punchLocation_1.default.belongsTo(attendance_1.default, { foreignKey: "attendance_log_id" });
var roles_2 = require("./roles");
Object.defineProperty(exports, "Roles", { enumerable: true, get: function () { return __importDefault(roles_2).default; } });
var permissions_2 = require("./permissions");
Object.defineProperty(exports, "Permissions", { enumerable: true, get: function () { return __importDefault(permissions_2).default; } });
var user_2 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(user_2).default; } });
var company_2 = require("./company");
Object.defineProperty(exports, "Company", { enumerable: true, get: function () { return __importDefault(company_2).default; } });
var companyAddress_2 = require("./address/companyAddress");
Object.defineProperty(exports, "CompanyAddress", { enumerable: true, get: function () { return __importDefault(companyAddress_2).default; } });
var employeeAddress_2 = require("./address/employeeAddress");
Object.defineProperty(exports, "EmployeeAddress", { enumerable: true, get: function () { return __importDefault(employeeAddress_2).default; } });
var refresh_1 = require("./refresh");
Object.defineProperty(exports, "Refresh", { enumerable: true, get: function () { return __importDefault(refresh_1).default; } });
var attendanceStatus_2 = require("./attendanceStatus");
Object.defineProperty(exports, "AttendanceStatus", { enumerable: true, get: function () { return __importDefault(attendanceStatus_2).default; } });
var attendance_2 = require("./attendance");
Object.defineProperty(exports, "Attendance", { enumerable: true, get: function () { return __importDefault(attendance_2).default; } });
var approval_2 = require("./dropdown/status/approval");
Object.defineProperty(exports, "DropdownApprovalStatus", { enumerable: true, get: function () { return __importDefault(approval_2).default; } });
var marking_1 = require("./dropdown/status/marking");
Object.defineProperty(exports, "DropdownMarkingStatus", { enumerable: true, get: function () { return __importDefault(marking_1).default; } });
var leaveType_2 = require("./leaveType");
Object.defineProperty(exports, "LeaveType", { enumerable: true, get: function () { return __importDefault(leaveType_2).default; } });
var leaveBalance_2 = require("./leaveBalance");
Object.defineProperty(exports, "LeaveBalance", { enumerable: true, get: function () { return __importDefault(leaveBalance_2).default; } });
var leaveRecord_2 = require("./leaveRecord");
Object.defineProperty(exports, "LeaveRecord", { enumerable: true, get: function () { return __importDefault(leaveRecord_2).default; } });
var accrualFrom_2 = require("./dropdown/chronology/accrualFrom");
Object.defineProperty(exports, "AccrualFrom", { enumerable: true, get: function () { return __importDefault(accrualFrom_2).default; } });
var expencesCategories_2 = require("./expencesCategories");
Object.defineProperty(exports, "expencesCategories", { enumerable: true, get: function () { return __importDefault(expencesCategories_2).default; } });
var expencesApprovalStatus_2 = require("./expencesApprovalStatus");
Object.defineProperty(exports, "expencesApprovalStatus", { enumerable: true, get: function () { return __importDefault(expencesApprovalStatus_2).default; } });
var expencesPurpuse_2 = require("./expencesPurpuse");
Object.defineProperty(exports, "expencesPurpuse", { enumerable: true, get: function () { return __importDefault(expencesPurpuse_2).default; } });
var expenses_3 = require("./expenses");
Object.defineProperty(exports, "expenses", { enumerable: true, get: function () { return __importDefault(expenses_3).default; } });
var expensesCategoriesForms_2 = require("./expensesCategoriesForms");
Object.defineProperty(exports, "expensesCategoriesForms", { enumerable: true, get: function () { return __importDefault(expensesCategoriesForms_2).default; } });
