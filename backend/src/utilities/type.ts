export interface ApiError {
    code: number;
    message: string;
    name: string;
}

export interface MobileApiError {
    status: number;
    success: boolean;
    message: string;
    name: string;
}

// export type EmployeeResponseType = {
//     id: string,
//     company_id: number,
//     employee_name: string,
//     employee_generated_id: string,
//     date_of_joining: string,
//     probation_period: string,
//     probation_due_date: string,
//     designation: string,
//     department: string,
//     work_location: string,
//     level: string,
//     grade: string,
//     cost_center: string,
//     employee_official_email: string,
//     employee_personal_email: string,
//     dob_adhaar: string,
//     dob_celebrated: string,
//     employee_gender_id: number,
//     is_deleted: boolean,
//     role_id: number,
//     status: boolean,
//     employee_password: string,
//     master_policy_id: number,
//     password_changed: boolean   
// }