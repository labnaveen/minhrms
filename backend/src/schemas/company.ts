import Joi from "joi";


const date = new Date()


export const EmployeeAddressCreationSchema = Joi.object({
    employee_permanent_address: Joi.string().required().example('A-36'),
    employee_permanent_pincode: Joi.string().required().example('201301'),
    employee_permanent_city: Joi.string().required().example('Noida'),
    employee_permanent_state: Joi.string().required().example('Uttar Pradesh'),
    employee_permanent_country_id: Joi.number().required().example(1),
    employee_permanent_mobile: Joi.number().required().example(9773914237),
    employee_present_mobile: Joi.number().required().example(9773914237),
    employee_present_address: Joi.string().required().example('A-36'),
    employee_present_pincode: Joi.string().required().example('201301'),
    employee_present_city: Joi.string().required().example('Noida'),
    employee_present_state: Joi.string().required().example('Uttar Pradesh'),
    employee_present_country_id: Joi.string().required().example(1),
    user_id: Joi.number()
})

export const CompanyAddressCreationSchema = Joi.object({
    company_present_address: Joi.string().required().example('A-34'),
    company_present_pincode: Joi.string().required().example('201301'),
    company_present_city: Joi.string().required().example('Noida'),
    company_present_state: Joi.string().required().example('Uttar Pradesh'),
    company_present_country_id: Joi.number().required().example(1),
    company_present_mobile: Joi.string().required().example('9773914237'),
    company_permanent_address: Joi.string().required().example('A-36'),
    company_permanent_pincode: Joi.string().required().example('201301'),
    company_permanent_city: Joi.string().required().example('Noida'),
    company_permanent_state: Joi.string().required().example('Country'),
    company_permanent_country_id: Joi.number().required().example(1),
    company_permanent_mobile: Joi.string().required().example('9773914237'),
    company_id: Joi.number()
})

export const CompanyCreationSchema = Joi.object({
    company_name: Joi.string().required().example('Glocalview Infotech'),
    company_email: Joi.string().email().required().example('gvnoida@gmail.com'),
    company_mobile: Joi.number().required().example(9773914237),
    teamsize: Joi.number().required().example(100),
    industryId: Joi.number().required().example(1),
    domain: Joi.string().required().example('glocalview'),
    pan: Joi.string().required().example('DBHSG0596'),
    gst: Joi.string().required().example('32AAUFR3713P2ZM'),
    company_prefix: Joi.string().required().example('GV'),
    employee_name: Joi.string().required().example('Anugrah Bhatt'),
    employee_generated_id : Joi.string().required().example('GV-123'),
    date_of_joining: Joi.date(),
    probation_period: Joi.string(),
    probation_due_date: Joi.date(),
    designation: Joi.string(),
    department: Joi.string(),
    work_location: Joi.string(),
    level: Joi.string(),
    grade: Joi.string(),
    cost_center: Joi.string(),
    employee_official_email: Joi.string(),
    employee_personal_email: Joi.string(),
    dob_adhaar: Joi.string(),
    dob_celebrated: Joi.string(),
    employee_gender_id: Joi.number().required(),
    employee_password: Joi.string(),
    role_id: Joi.number(),
    employee_permanent_address: Joi.string().required().example('A-36'),
    employee_permanent_pincode: Joi.string().required().example('201301'),
    employee_permanent_city: Joi.string().required().example('Noida'),
    employee_permanent_state: Joi.string().required().example('Uttar Pradesh'),
    employee_permanent_country_id: Joi.string().required().example('India'),
    employee_permanent_mobile: Joi.number().required().example(9773914237),
    employee_present_mobile: Joi.number().required().example(9773914237),
    employee_present_address: Joi.string().required().example('A-36'),
    employee_present_pincode: Joi.string().required().example('201301'),
    employee_present_city: Joi.string().required().example('Noida'),
    employee_present_state: Joi.string().required().example('Uttar Pradesh'),
    employee_present_country_id: Joi.string().required().example('India'),
    user_id: Joi.number(),
    company_present_address: Joi.string().required().example('A-34'),
    company_present_pincode: Joi.string().required().example('201301'),
    company_present_city: Joi.string().required().example('Noida'),
    company_present_state: Joi.string().required().example('Uttar Pradesh'),
    company_present_country_id: Joi.string().required().example('India'),
    company_present_mobile: Joi.string().required().example('9773914237'),
    company_permanent_address: Joi.string().required().example('A-36'),
    company_permanent_pincode: Joi.string().required().example('201301'),
    company_permanent_city: Joi.string().required().example('Noida'),
    company_permanent_state: Joi.string().required().example('Country'),
    company_permanent_country_id: Joi.required().example('India'),
    company_permanent_mobile: Joi.string().required().example('9773914237'),
    company_id: Joi.number()
})

