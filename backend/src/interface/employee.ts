export interface EmployeeResponseType {
  id: number;
  company_id: number;
  employee_name: string;
  employee_generated_id: string;
  phone: string;
  profile_image?: null;
  date_of_joining: string;
  probation_period?: null;
  probation_due_date?: null;
  work_location?: null;
  level?: null;
  grade?: null;
  cost_center?: null;
  employee_official_email: string;
  employee_personal_email: string;
  dob_adhaar: string;
  dob_celebrated: string;
  employee_gender_id: number;
  blood_group?: null;
  nationality?: null;
  mother_tongue?: null;
  alternate_email?: null;
  alternate_contact?: null;
  religion?: null;
  bank_name?: null;
  bank_branch?: null;
  account_number?: null;
  ifsc_code?: null;
  payroll_details?: null;
  account_holder_name?: null;
  pan_number?: null;
  adhaar_number?: null;
  is_deleted: boolean;
  role_id: number;
  status: boolean;
  master_policy_id: number;
  password_changed: boolean;
  reporting_role_id?: null;
  reporting_manager_id?: null;
  deleted_at?: null;
  companyId: number;
  company: Company;
  master_policy: MasterPolicy;
  role: Role;
  division_units?: (DivisionUnitsEntity)[] | null;
  gender: Gender;
  Managers?: (ManagersEntity)[] | null;
  department: Department;
}
export interface Company {
  id: number;
  company_name: string;
}
export interface MasterPolicy {
  id: number;
  policy_name: string;
}
export interface Role {
  id: number;
  name: string;
  alias: string;
}
export interface DivisionUnitsEntity {
  id: number;
  unit_name: string;
  division_id: number;
  system_generated: boolean;
  createdAt: string;
  updatedAt?: null;
  user_division: UserDivision;
  division: Division;
}
export interface UserDivision {
  createdAt?: null;
  updatedAt?: null;
  unit_id: number;
  user_id: number;
}
export interface Division {
  id: number;
  division_name: string;
  system_generated: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Gender {
  id: number;
  name: string;
}
export interface ManagersEntity {
  id: number;
  user_id: number;
  reporting_role_id: number;
  user: User;
}
export interface User {
  id: number;
  employee_generated_id: string;
  employee_name: string;
}
export interface Department {
  name: string;
}
