export interface LeaveTypeResponse {
    id:                                       number;
    leave_type_name:                          string;
    negative_balance:                         boolean;
    max_leave_allowed_in_negative_balance:    number;
    max_days_per_leave:                       number;
    max_days_per_month:                       number;
    allow_half_days:                          boolean;
    leave_application_after:                  number;
    application_on_holidays:                  boolean;
    restriction_for_application:              boolean;
    limit_back_dated_application:             number;
    notice_for_application:                   number;
    auto_approval:                            boolean;
    auto_action_after:                        number;
    auto_approval_action:                     number;
    supporting_document_mandatory:            boolean;
    prorated_accrual_first_month:             boolean;
    prorated_rounding:                        number;
    prorated_rounding_factor:                 number;
    encashment_yearly:                        boolean;
    max_leaves_for_encashment:                number;
    carry_forward_yearly:                     boolean;
    carry_forward_rounding:                   number;
    carry_forward_rounding_factor:            number;
    intra_cycle_carry_forward:                boolean;
    prefix_postfix_weekly_off_sandwhich_rule: boolean;
    prefix_postfix_holiday_sandwhich_rule:    boolean;
    inbetween_weekly_off_sandwhich_rule:      boolean;
    inbetween_holiday_sandwhich_rule:         boolean;
    custom_leave_application_date:            null;
    createdAt:                                Date;
    updatedAt:                                Date;
    leave_type_policies:                      LeaveTypePolicy[];
}

export interface LeaveTypePolicy {
    id:                                    number;
    leave_type_id:                         number;
    leave_policy_name:                     string;
    description:                           string;
    accrual_frequency:                     number;
    accrual_type:                          number;
    accrual_from:                          number;
    accrual_from_custom_date:              null;
    advance_accrual_for_entire_leave_year: boolean;
    annual_eligibility:                    number;
    annual_breakup:                        boolean;
    createdAt:                             Date;
    updatedAt:                             Date;
}


export interface LeaveBalanceResponse {
    id:            number;
    user_id:       number;
    leave_type_id: number;
    leave_balance: number;
    total_leaves:  number;
    is_deleted:    boolean;
    createdAt:     Date;
    updatedAt:     Date;
    leave_type:    LeaveType;
}

export interface LeaveType {
    id:              number;
    leave_type_name: string;
}

export interface LeaveRecordResponse {
    id:               number;
    leave_type_id:    number;
    day_type_id:      number;
    half_day_type_id: null;
    user_id:          number;
    start_date:       Date;
    end_date:         Date;
    reason:           string;
    document:         null;
    contact_number:   string;
    status:           number;
    is_deleted:       boolean;
    approval_status:  ApprovalStatus;
    leave_type:       LeaveType;
    day_type:         ApprovalStatus;
}

export interface ApprovalStatus {
    id:   number;
    name: string;
}

export interface LeaveType {
    id:              number;
    leave_type_name: string;
}
