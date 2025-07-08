import Roles from "./roles";
import Permissions from "./permissions";
import User from "./user";
import Company from "./company";
import CompanyAddress from "./address/companyAddress";
import EmployeeAddress from "./address/employeeAddress";
import Industry from "./Industry";
import Country from "./country";
import AttendanceStatus from './attendanceStatus'
import AttendancePolicy from "./attendancePolicy";
import Attendance from "./attendance";
import MasterPolicy from "./masterPolicy";
import LeaveType from "./leaveType";
import LeaveBalance from "./leaveBalance";
import LeaveRecord from "./leaveRecord";
import Approval from "./dropdown/status/approval";
import RegularisationStatus from "./regularisationStatus";
import RegularisationStatusAttendancePolicy from "./regularisationStatus_attendancePolicy";
import ShiftPolicy from "./shiftPolicy";
import Shift from "./dropdown/type/shift";
import Division from "./division";
import DivisionUnits from "./divisionUnits";
import AccrualFrom from "./dropdown/chronology/accrualFrom";
import LeaveTypePolicy from "./leaveTypePolicy";
import ReportingRole from "./reportingRole";
import ReportingManagers from "./reportingManagers";
import Announcement from "./announcements";
import AnnouncementEmployee from "./announcementEmployee";
import AnnouncementDivisionUnit from "./announcementDivisionUnit";
import Asset from "./asset";
import BaseLeaveConfiguration from "./baseLeaveConfiguration";
import ApprovalFlow from "./approvalFlow";
import ApprovalFlowReportingRole from "./approvalFlowReportingRole";
import ApprovalFlowSupervisorIndirect from "./approvalFlowSupervisorIndirect";
import CustomHoliday from "./customHoliday";
import HolidayCalendar from "./holidayCalendar";
import HolidayDatabase from "./holidayDatabase";
import HolidayCalendarAssociation from "./holidayCalendarAssociation";
import WeeklyOffPolicy from "./weeklyOffPolicy";
import WeeklyOffAssociation from "./weeklyOffAssociation";
import Week from "./dropdown/chronology/week";
import expencesCategories from "./expencesCategories"
import expences from "./expenses"
import expencesPurpuse from "./expencesPurpuse";
import expencesApprovalStatus from "./expencesApprovalStatus";
import expensesCategoriesForms from "./expensesCategoriesForms"
import AssignedAsset from "./assignedAsset";
import Gender from "./dropdown/type/gender";
import ReportingManagerEmployeeAssociation from "./reportingManagerEmployeeAssociation";
import UserDivision from "./userDivision";
import { ForeignKey } from "sequelize-typescript";
import ApprovalFlowType from "./dropdown/type/approvalFlowType";
import FamilyMember from "./familyMember";
import Relation from "./dropdown/relation/relation";
import LeaveAllocation from "./leaveAllocation";
import Months from "./dropdown/chronology/months";
import Experience from "./experience";
import EmploymentType from "./dropdown/type/employment";
import Education from "./education";
import EducationType from "./dropdown/type/educationType";
import ProfileImages from "./profileImages";
import RegularizationRecord from "./regularizationRecord";
import LeaveRequest from "./leaveRequest";
import DayType from "./dropdown/dayType/dayType";
import Notification from "./notification";
import RegularizationRequest from "./regularizationRequest";
import RegularizationRequestStatus from "./regularizationRequestStatus";
import ProfileChangeRecord from "./profileChangeRecord";
import ProfileChangeRequests from "./profileChangeRequests";
import HalfDayType from "./dropdown/dayType/halfDayType";
import Documents from "./documents";
import Letter from "./letter";
import LetterStatus from "./letterStatus";
import expenses from "./expenses";
import ExpenseRequest from "./expenseRequest";
import PunchLocation from "./punchLocation";
import RegularisationRequestHistory from "./regularisationRequestHistory";
import LeaveRequestHistory from "./leaveRequestHistory";
import ExpenseRequestHistory from "./expenseRequestHistory";
import ProfileChangeRequestHistory from "./profileChangeRequestHistory";




// User.hasOne(Roles, { foreignKey: 'id' })
User.belongsTo(Roles, {foreignKey: 'role_id', as:'role'});

Roles.hasMany(User, {foreignKey: 'role_id', as: 'users'});



Roles.belongsToMany(Permissions, {
    as: 'permissions',
    through: 'permissions_roles',
    foreignKey: 'roles_id',
    otherKey: 'permissions_id'
})

Permissions.belongsToMany(Roles, {
    as: 'roles',
    otherKey: 'roles_id',
    foreignKey: 'permissions_id',
    through: 'permissions_roles'
})

//User and Company Relationship
Company.hasMany(User, { foreignKey: 'company_id' })
User.belongsTo(Company)

//Company and CompanyAddress Relationship
CompanyAddress.belongsTo(Company, { foreignKey: 'companyId' })
Company.hasMany(CompanyAddress, { foreignKey: 'companyId' })

//User and UserAddress Relationship
EmployeeAddress.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(EmployeeAddress, { foreignKey: 'userId' })


//Company and Industry relatioship
Industry.hasMany(Company, {
    foreignKey: 'industryId'
});
Company.belongsTo(Industry)


//Address and Company Address Relationship
CompanyAddress.hasMany(Country, {
    foreignKey: 'company_present_country'
});
CompanyAddress.hasMany(Country, {
    foreignKey: 'company_permanent_country'
})
Country.belongsTo(CompanyAddress)


//Country and Employee Address Relationship
EmployeeAddress.hasMany(Country, {
    foreignKey: 'employee_present_country'
})
EmployeeAddress.hasMany(Country, {
    foreignKey: 'employee_permanent_country'
})
Country.belongsTo(EmployeeAddress)


//Attendance status and Attendance Relationship
// AttendancePolicy.hasOne(AttendanceStatus, {
//     foreignKey: 'default_attendance_status'
// });
// AttendanceStatus.belongsTo(AttendancePolicy)


//Attendance Data and Employee Relationship
User.hasMany(Attendance)
// User.belongsTo(Attendance)


//MasterPolicy and Other Policy Relationships
MasterPolicy.hasOne(AttendancePolicy, { sourceKey: 'attendance_policy_id', foreignKey: 'id' })
AttendancePolicy.belongsTo(MasterPolicy, { foreignKey: 'id' })

MasterPolicy.hasOne(BaseLeaveConfiguration, { sourceKey: 'base_leave_configuration_id', foreignKey: 'id' })
MasterPolicy.belongsTo(ApprovalFlow, { foreignKey: 'attendance_workflow', as: 'attendanceWorkflow' })
MasterPolicy.belongsTo(ApprovalFlow, { foreignKey: 'leave_workflow', as: 'leaveWorkflow' })
MasterPolicy.belongsTo(ApprovalFlow, {foreignKey: 'profile_change_workflow', as: 'profileChangeWorkflow'})

MasterPolicy.belongsTo(ApprovalFlow, {foreignKey: 'expense_workflow', as: 'expenseWorkflow'})

//Master Policy and Shift Policy relationship
MasterPolicy.hasOne(ShiftPolicy, { sourceKey: 'shift_policy_id', foreignKey: 'id' })
ShiftPolicy.belongsTo(MasterPolicy, {foreignKey: 'id'})

//Master Policy and Weekly Off policy Relationship
MasterPolicy.hasOne(WeeklyOffPolicy, { sourceKey: 'weekly_off_policy_id', foreignKey: 'id' })
WeeklyOffPolicy.belongsTo(MasterPolicy, { foreignKey: 'id' })

//Master Policy and Holiday calendar policy relationship
MasterPolicy.hasOne(HolidayCalendar, { sourceKey: 'holiday_calendar_id', foreignKey: 'id' })
HolidayCalendar.belongsTo(MasterPolicy, { foreignKey: 'id' })


//MasterPolicy and Employee Policy Relationship
// User.hasOne(MasterPolicy, { sourceKey: 'master_policy_id', foreignKey: 'id' })
User.belongsTo(MasterPolicy, {
    foreignKey: 'master_policy_id',
})

MasterPolicy.hasMany(User, {
    foreignKey: 'master_policy_id'
})



//Base Leave Configuration and Leave Types Relationship
// LeaveType.hasOne(BaseLeaveConfiguration, {sourceKey: 'base_leave_configuration_id', foreignKey: 'id'})


//Leave Balance Relationship with Leave Type and Employee ID
LeaveBalance.belongsTo(LeaveType, { foreignKey: 'leave_type_id' });
LeaveBalance.belongsTo(User, { foreignKey: 'user_id' });



LeaveType.hasMany(LeaveBalance, { foreignKey: 'leave_type_id' });
User.hasMany(LeaveBalance, { foreignKey: 'user_id' });


//Relationship Leave Record with the User
User.hasOne(LeaveRecord, { foreignKey: 'user_id', as:'requester' })
LeaveRecord.belongsTo(User, {foreignKey: 'user_id', as:'requester'})


//Peers and Leave Record Relationship
User.belongsToMany(LeaveRecord, { through: 'peers_leave_record' })
LeaveRecord.belongsToMany(User, { through: 'peers_leave_record' })

//LeaveRecord and Status Record Relationship
LeaveRecord.belongsTo(Approval, { foreignKey: 'status' })



//Leave Record and Leave Type ID Relationship
LeaveType.hasOne(LeaveRecord, { foreignKey: 'leave_type_id' })
LeaveRecord.belongsTo(LeaveType, {foreignKey: 'leave_type_id'})

//Regularisation Status and Attendance Polity Relationship
AttendancePolicy.belongsToMany(AttendanceStatus, {
    through: RegularisationStatusAttendancePolicy,
    foreignKey: 'attendance_policy_id',
});
AttendanceStatus.belongsToMany(AttendancePolicy, {
    through: RegularisationStatusAttendancePolicy,
    foreignKey: 'regularisation_status_id',
});

//Attendance Status and Attendance Policy relationship
AttendancePolicy.hasOne(AttendanceStatus, { sourceKey: 'default_attendance_status', foreignKey: 'id' })


//Attendance Status and Shift Policy
ShiftPolicy.hasOne(Shift, { sourceKey: 'shift_type_id', foreignKey: 'id' })
ShiftPolicy.hasOne(AttendanceStatus, { sourceKey: 'status_grace_exceeded', foreignKey: 'id' })
ShiftPolicy.hasOne(AttendanceStatus, { sourceKey: 'status_flexi_exceeded', foreignKey: 'id' })
ShiftPolicy.hasOne(AttendanceStatus, { sourceKey: 'status_punch_in_time_exceeded', foreignKey: 'id' })


//Division and Units Relationship
DivisionUnits.belongsTo(Division, { foreignKey: 'division_id' })
Division.hasMany(DivisionUnits, { foreignKey: 'division_id', sourceKey: 'id' })


//Division Units and User Relationship
// User.belongsTo(DivisionUnits, { as: 'Designation', foreignKey: 'designation' });
// User.belongsTo(DivisionUnits, { as: 'Department', foreignKey: 'department' });



//Units and Employees Relationship
DivisionUnits.belongsToMany(User, {
    through: 'user_division',
    foreignKey: 'unit_id',
    otherKey: 'user_id'
})
User.belongsToMany(DivisionUnits, {
    through: 'user_division',
    foreignKey: 'user_id',
    otherKey: 'unit_id'
})


// DivisionUnits.hasMany(UserDivision, { foreignKey: 'unit_id', sourceKey: 'id',  as: 'user_division' });


// UserDivision.belongsTo(DivisionUnits, { foreignKey: 'unit_id', targetKey: 'id' });
//leave type and leave type policy relationship
LeaveTypePolicy.belongsTo(LeaveType, { foreignKey: 'leave_type_id' })
LeaveType.hasMany(LeaveTypePolicy, { foreignKey: 'leave_type_id', sourceKey: 'id' })

LeaveTypePolicy.hasMany(LeaveAllocation, {
    foreignKey: 'leave_type_policy_id',
    sourceKey: 'id',
    as: 'leaveAllocations'
})

// LeaveAllocation.belongsTo(LeaveTypePolicy, { foreignKey: 'leave_type_policy_id'});
// LeaveAllocation.belongsTo(Months, {foreignKey: 'month_number'})

LeaveType.belongsTo(AccrualFrom, { foreignKey: 'leave_application_after' })


//Reporting Structure and Reporting Managers Relationship
// ReportingRole.hasMany(ReportingManagers, {foreignKey:'reporting_manager_id', sourceKey: 'id' })
ReportingManagers.belongsTo(ReportingRole, { foreignKey: 'reporting_role_id' })
ReportingRole.hasMany(ReportingManagers, { foreignKey: 'reporting_role_id' })
ReportingManagers.belongsTo(User, { foreignKey: 'user_id' })
// User.belongsTo(ReportingManagers, {foreignKey: 'user_id'})


//Employee and Announcement Relationship
Announcement.belongsToMany(User, { through: AnnouncementEmployee, foreignKey:'announcement_id' })
User.belongsToMany(Announcement, { through: AnnouncementEmployee, foreignKey: 'user_id' })

//Announcement and Unit Relationship
Announcement.belongsToMany(DivisionUnits, { through: AnnouncementDivisionUnit, foreignKey: 'announcement_id', as:'division_units' })
DivisionUnits.belongsToMany(Announcement, { through: AnnouncementDivisionUnit, foreignKey: 'division_unit_id' })

// AnnouncementDivisionUnit.hasMany(Announcement)
// Announcement.belongsTo(AnnouncementDivisionUnit)


// AnnouncementDivisionUnit.belongsTo(AnnouncementEmployee, {
//     foreignKey: 'announcement_id',
//     targetKey: 'announcement_id'
//   });
  
//Appproval Flow and Reporting Role relationship
ApprovalFlow.belongsToMany(ReportingRole, { through: ApprovalFlowReportingRole, foreignKey: 'approval_flow_id', as: 'direct' })
ReportingRole.belongsToMany(ApprovalFlow, { through: ApprovalFlowReportingRole, foreignKey: 'reporting_role_id', as: 'direct' })
ApprovalFlow.belongsToMany(User, { through: ApprovalFlowSupervisorIndirect, foreignKey: 'approval_flow_id', as: 'indirect' })
User.belongsToMany(ApprovalFlow, { through: ApprovalFlowSupervisorIndirect, foreignKey: 'supervisor_role_id', as: 'indirect' })



//Asset and User Relationship
// User.hasMany(Asset, { foreignKey: 'user_id' });
// Asset.belongsTo(User, { foreignKey: 'user_id' });
User.belongsToMany(Asset, { through: AssignedAsset, foreignKey: 'user_id'})
Asset.belongsToMany(User, {through: AssignedAsset, foreignKey: 'asset_id'})
AssignedAsset.belongsTo(Asset, {foreignKey: 'asset_id'})
AssignedAsset.belongsTo(User, {foreignKey: 'user_id'})


//Custom Holiday and Holiday Calendar Association
CustomHoliday.belongsTo(HolidayCalendar);
HolidayCalendar.hasMany(CustomHoliday);

//Holiday Calendar and Holiday Database Relationship
HolidayCalendar.belongsToMany(HolidayDatabase, { through: HolidayCalendarAssociation, foreignKey: 'holiday_calendar_id'});
HolidayDatabase.belongsToMany(HolidayCalendar, { through: HolidayCalendarAssociation, foreignKey: 'holiday_id' });


//WeeklyOffPolicy Relationship
WeeklyOffAssociation.belongsTo(WeeklyOffPolicy, { foreignKey: 'weekly_off_policy_id' });
// WeeklyOffAssociation.hasMany(Week, { foreignKey: 'week_name' });
WeeklyOffPolicy.hasMany(WeeklyOffAssociation, { foreignKey: 'weekly_off_policy_id' })

WeeklyOffAssociation.belongsTo(Week, {foreignKey: 'week_name', as: 'day'})

/// Expenses Model Relationship
expences.belongsTo(expencesCategories, { foreignKey: 'category_id' })
expences.belongsTo(expencesPurpuse, { foreignKey: 'purpose_id' })
expences.belongsTo(expencesApprovalStatus, { foreignKey: 'status_id' })

///Expenses Category Relationship
expencesCategories.belongsTo(expensesCategoriesForms, { foreignKey: 'expense_category_form_id' })

//Gender and User Relationship
User.belongsTo(Gender, {foreignKey: 'employee_gender_id'})


//User and Reporting Role Relationship
// User.belongsTo(ReportingManagers, {foreignKey: 'reporting_manager_id', as: 'Manager'})

User.belongsTo(ReportingRole, {foreignKey: 'reporting_role_id'})
ReportingManagers.belongsTo(User, { foreignKey: 'user_id'});


ReportingManagers.hasMany(User, {foreignKey: 'reporting_manager_id', as: 'employees'})


ReportingManagers.hasOne(User, {sourceKey: 'user_id', foreignKey:'id', as: 'manager'})

User.belongsToMany(ReportingManagers, {through: ReportingManagerEmployeeAssociation, foreignKey: 'user_id', as: 'Manager'})
ReportingManagers.belongsToMany(User, {through: ReportingManagerEmployeeAssociation, foreignKey: 'reporting_manager_id'})


// User.hasOne(ReportingManagers, {foreignKey: 'reporting_manager_id', as: 'manager'})

// ReportingManagers.hasMany(ReportingManagerEmployeeAssociation, {sourceKey: 'reporting_manager_id', foreignKey:'id', as: 'AllEmployee'})


//Master Policy and Leave Type policy that are selected relationship
MasterPolicy.belongsToMany(LeaveType, {foreignKey: 'master_policy_id', through: 'master_policy_leave_policy', as: 'LeaveTypes'});
LeaveType.belongsToMany(MasterPolicy, {foreignKey: 'leave_type_id', through: 'master_policy_leave_policy', as: 'MasterPolicies'});
MasterPolicy.belongsToMany(LeaveTypePolicy, {foreignKey: 'master_policy_id', through: 'master_policy_leave_policy', as: 'LeaveTypePolicies'});
LeaveTypePolicy.belongsToMany(MasterPolicy, {foreignKey: 'leave_type_policy_id', through:'master_policy_leave_policy', as: 'MasterPolicies'});

//User and reporting structure assocition
// User.belongsToMany(ReportingManagers, {through: ReportingManagerEmployeeAssociation, foreignKey: 'user_id', as: 'Employees'})
ReportingManagers.belongsToMany(User, {through: ReportingManagerEmployeeAssociation, foreignKey:'reporting_manager_id', as: 'Employees'})

ReportingRole.belongsToMany(User, {through: ReportingManagerEmployeeAssociation, foreignKey: 'reporting_role_id', as: 'ReportingRole'})

User.belongsToMany(ReportingManagers, {through: ReportingManagerEmployeeAssociation, foreignKey: 'user_id', as:'Managers'})

ApprovalFlow.belongsTo(ApprovalFlowType, {foreignKey: 'approval_flow_type_id'})
ApprovalFlowType.hasMany(ApprovalFlow, {foreignKey: 'approval_flow_type_id'})



//Relation and Family Member Table association
FamilyMember.belongsTo(Relation, {foreignKey: 'relation_id'});
Relation.hasMany(FamilyMember, {foreignKey: 'relation_id'});

//Association table between an Employee and the family member details.
User.hasMany(FamilyMember, {foreignKey: 'user_id'})



//Association between an Employee and their Experience Details.
User.hasMany(Experience, {foreignKey: 'user_id'})

Experience.belongsTo(EmploymentType, {foreignKey: 'employment_type_id'})
EmploymentType.hasMany(Experience, {foreignKey: 'employment_type_id'})


//Education Relationships

User.hasMany(Education, {foreignKey: 'user_id'})

Education.belongsTo(EducationType, {foreignKey: 'degree_id'})
EducationType.hasMany(Education, {foreignKey: 'degree_id'})


//User and ProfileImage
// ProfileImages.hasOne(User, {foreignKey: 'user_id'})
// User.belongsTo(ProfileImages, {foreignKey: 'user_id'})
User.hasOne(ProfileImages, {foreignKey: 'user_id'})
ProfileImages.belongsTo(User, {foreignKey: 'user_id'})

//User and Regularization Request
User.hasOne(RegularizationRecord, {foreignKey: 'user_id', as: 'Requester'})
RegularizationRecord.belongsTo(User, {foreignKey: 'user_id', as:'Requester'})

//User and Leave Request
User.hasOne(LeaveRecord, {foreignKey: 'user_id', as: 'leave_requester'})
LeaveRecord.belongsTo(User, {foreignKey: 'user_id', as:'leave_requester'})

LeaveRecord.hasOne(LeaveRequest, {foreignKey: 'leave_record_id'})
LeaveRequest.belongsTo(LeaveRecord, {foreignKey: 'leave_record_id'})

Approval.hasOne(LeaveRequest, {foreignKey: 'status'})
LeaveRequest.belongsTo(Approval, {foreignKey: 'status'})

// ReportingManagers.hasOne(LeaveRequest, {foreignKey: 'reporting_manager_id'})
// LeaveRequest.belongsTo(ReportingManagers, {foreignKey: 'reporting_manager_id'})

DayType.hasOne(LeaveRecord, {foreignKey: 'day_type_id'})
LeaveRecord.belongsTo(DayType, {foreignKey: 'day_type_id'})

HalfDayType.hasOne(LeaveRecord, {foreignKey: 'half_day_type_id'})
LeaveRecord.belongsTo(HalfDayType, {foreignKey: 'half_day_type_id'})


//User and Notification Relationship
User.hasOne(Notification, {foreignKey: 'user_id'})
Notification.belongsTo(User, {foreignKey: 'user_id'})


//Regularization Record and Regularization Relationship
RegularizationRecord.hasOne(RegularizationRequest, {foreignKey: 'regularization_record_id'})
RegularizationRequest.belongsTo(RegularizationRecord, {foreignKey: 'regularization_record_id'})

ProfileChangeRecord.hasOne(ProfileChangeRequests, {foreignKey: 'profile_change_record_id'})
ProfileChangeRequests.belongsTo(ProfileChangeRecord, {foreignKey: 'profile_change_record_id'})

RegularisationStatus.hasOne(RegularizationRecord, {foreignKey: 'request_status'})
RegularizationRecord.belongsTo(RegularisationStatus, {foreignKey: 'request_status'})

Approval.hasOne(RegularizationRecord, {foreignKey: 'status'})
RegularizationRecord.belongsTo(Approval, {foreignKey: 'status'})

User.hasMany(ProfileChangeRecord, {foreignKey: 'user_id', as: 'profile_change_requester'})
ProfileChangeRecord.belongsTo(User, {foreignKey: 'user_id', as: 'profile_change_requester'})


AttendanceStatus.hasOne(Attendance, {foreignKey: 'status'})
Attendance.belongsTo(AttendanceStatus, {foreignKey: 'status'})

AttendanceStatus.hasOne(RegularizationRecord, {foreignKey: 'request_status', as: 'Request_status'})
RegularizationRecord.belongsTo(AttendanceStatus, {foreignKey: 'request_status', as: 'Request_status'})

Approval.hasOne(ProfileChangeRecord, {foreignKey: 'status'})
ProfileChangeRecord.belongsTo(Approval, {foreignKey: 'status'})

// LeaveBalance.belongsTo(LeaveType, {foreignKey: 'leave_type_id', as: 'leaveType'})


//Last action by column in leave relationship with a user one to many
User.hasOne(LeaveRecord, {foreignKey: 'last_action_by'})
LeaveRecord.belongsTo(User, {foreignKey: 'last_action_by'})


//Relationship between documents and letters
Letter.belongsTo(Documents, {foreignKey: 'document_id'})
Documents.hasOne(Letter, {foreignKey: 'document_id'})

//Relationship between letters and users
User.hasMany(Letter, {foreignKey: 'user_id'})
Letter.belongsTo(User, {foreignKey: 'user_id'})

//relationship between letter and the approval
LetterStatus.hasOne(Letter, {foreignKey: 'status'})
Letter.belongsTo(LetterStatus, {foreignKey: 'status'})

Documents.hasOne(expenses)
expenses.belongsTo(Documents)

User.hasOne(expenses, {foreignKey: 'user_id'})
expenses.belongsTo(User, {foreignKey: 'user_id'})


//Expense and Expense Request relationships
expenses.hasOne(ExpenseRequest, {foreignKey: 'expense_id'})
ExpenseRequest.belongsTo(expenses, {foreignKey: 'expense_id'})

Approval.hasOne(ExpenseRequest, {foreignKey: 'status'})
ExpenseRequest.belongsTo(Approval, {foreignKey: 'status'})

// ReportingManagers.hasOne(ExpenseRequest, {foreignKey: 'reporting_manager_id'})
// ExpenseRequest.belongsTo(ReportingManagers, {foreignKey: 'reporting_manager_id'})


expensesCategoriesForms.hasOne(expencesCategories, {foreignKey: 'expense_category_form_id'})
expencesCategories.belongsTo(expensesCategoriesForms, {foreignKey: 'expense_category_form_id'})


Attendance.hasMany(PunchLocation, {foreignKey: "attendance_log_id"})
PunchLocation.belongsTo(Attendance, {foreignKey: "attendance_log_id"})

RegularizationRecord.belongsToMany(User, {through: 'regularisation_request_history', foreignKey: 'regularisation_record_id'})
User.belongsToMany(RegularizationRecord, {through: 'regularisation_request_history', foreignKey: 'user_id'})

RegularisationRequestHistory.belongsTo(RegularizationRecord, {
    foreignKey: "regularisation_record_id",
});

RegularizationRecord.hasMany(RegularisationRequestHistory, {
    foreignKey: 'regularisation_record_id'
})
RegularisationRequestHistory.belongsTo(User, {
    foreignKey: "user_id",
});

RegularisationRequestHistory.belongsTo(Approval, {foreignKey: 'status_before', as: 'statusBefore'})
RegularisationRequestHistory.belongsTo(Approval, {foreignKey: 'status_after', as: 'statusAfter'})

LeaveRequestHistory.belongsTo(LeaveRecord, {
    foreignKey: 'leave_record_id'
})
LeaveRecord.hasMany(LeaveRequestHistory, {
    foreignKey: 'leave_record_id'
})
LeaveRequestHistory.belongsTo(User, {
    foreignKey: 'user_id'
})

LeaveRequestHistory.belongsTo(Approval, {foreignKey: 'status_before', as: 'statusBefore'})
LeaveRequestHistory.belongsTo(Approval, {foreignKey: 'status_after', as: 'statusAfter'})

ExpenseRequestHistory.belongsTo(Approval, {foreignKey: 'status_before', as: 'statusBefore'})
ExpenseRequestHistory.belongsTo(Approval, {foreignKey: 'status_after', as: 'statusAfter'})


ExpenseRequestHistory.belongsTo(expenses, {
    foreignKey: 'expense_record_id'
})
expenses.hasMany(ExpenseRequestHistory, {
    foreignKey: 'expense_record_id'
})

ExpenseRequestHistory.belongsTo(User, {
    foreignKey: 'user_id'
})

//User and Leave Request
User.hasOne(expenses, {foreignKey: 'user_id', as: 'expense_requester'})
expenses.belongsTo(User, {foreignKey: 'user_id', as:'expense_requester'})

ProfileChangeRecord.hasMany(ProfileChangeRequestHistory, {foreignKey: 'profile_change_record_id'})
ProfileChangeRequestHistory.belongsTo(ProfileChangeRecord, {foreignKey: 'profile_change_record_id'})

ProfileChangeRequestHistory.belongsTo(User, {foreignKey: 'user_id'})

ExpenseRequestHistory.belongsTo(User, { foreignKey: 'user_id' })

LeaveRequestHistory.belongsTo(User, { foreignKey: 'user_id'})

// LeaveRecord.belongsTo(Approval, {foreignKey: 'status'})
// Approval.hasMany(LeaveRecord, {foreignKey: 'status'})

export { default as Roles } from './roles'
export { default as Permissions } from './permissions'
export { default as User } from './user'
export { default as Company } from './company'
export { default as CompanyAddress } from './address/companyAddress'
export { default as EmployeeAddress } from './address/employeeAddress'
export { default as Refresh } from './refresh'
export { default as AttendanceStatus } from './attendanceStatus'
export { default as Attendance } from './attendance'
export { default as DropdownApprovalStatus } from './dropdown/status/approval'
export { default as DropdownMarkingStatus } from './dropdown/status/marking'
export { default as LeaveType } from './leaveType'
export { default as LeaveBalance } from './leaveBalance'
export { default as LeaveRecord } from './leaveRecord'
export { default as AccrualFrom } from './dropdown/chronology/accrualFrom'
export { default as expencesCategories } from './expencesCategories'
export { default as expencesApprovalStatus } from './expencesApprovalStatus'
export { default as expencesPurpuse } from './expencesPurpuse'
export { default as expenses } from './expenses'
export { default as expensesCategoriesForms } from './expensesCategoriesForms'

