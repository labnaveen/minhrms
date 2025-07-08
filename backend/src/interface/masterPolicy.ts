export interface MasterPolicyResponse {
    id: number;
    policy_name: string;
    policy_description: string;
    attendance_policy_id: number;
    base_leave_configuration_id: number;
    shift_policy_id: number;
    weekly_off_policy_id: number;
    holiday_calendar_id: number;
    leave_workflow: number;
    attendance_workflow: number;
    expense_workflow: number;
    createdAt: string;
    updatedAt: string;
    attendance_policy: AttendancePolicy;
    attendanceWorkflow: AttendanceWorkflowOrLeaveWorkflow;
    leaveWorkflow: AttendanceWorkflowOrLeaveWorkflow;
    LeaveTypePolicies?: (LeaveTypePoliciesEntity)[] | null;
}
export interface AttendancePolicy {
    id: number;
    description: string;
    name: string;
    attendance_cycle_start: number;
    biometric: boolean;
    web: boolean;
    app: boolean;
    manual: boolean;
    default_attendance_status: number;
    half_day: boolean;
    min_hours_for_half_day?: null;
    display_overtime_hours: boolean;
    display_deficit_hours: boolean;
    display_late_mark: boolean;
    display_average_working_hours: boolean;
    display_present_number_of_days: boolean;
    display_absent_number_of_days: boolean;
    display_number_of_leaves_taken: boolean;
    display_average_in_time: boolean;
    display_average_out_time: boolean;
    flexibility_hours: boolean;
    call_out_regularisation: boolean;
    round_off: boolean;
    auto_approval_attendance_request: boolean;
    regularisation_restriction: boolean;
    regularisation_restriction_limit?: null;
    regularisation_limit_for_month?: null;
    bypass_regularisation_proxy: boolean;
    location_based_restriction: boolean;
    location_mandatory: boolean;
    location?: null;
    distance_allowed?: null;
    mobile_app_restriction: boolean;
    number_of_devices_allowed?: null;
    createdAt: string;
    updatedAt: string;
}
export interface AttendanceWorkflowOrLeaveWorkflow {
    id: number;
    name: string;
    description: string;
    approval_flow_type_id: number;
    confirm_by_both_direct_undirect: boolean;
    confirmation_by_all: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface LeaveTypePoliciesEntity {
    id: number;
    leave_policy_name: string;
    description: string;
    leave_type: LeaveType;
}
export interface LeaveType {
    id: number;
    leave_type_name: string;
}
