import { NextFunction, Request, Response } from "express";
import {Model} from 'sequelize'
import { MasterController } from "../masterController";
import {Company, EmployeeAddress, Roles, User} from "../../models/index";
import {CompanyAddress} from "../../models/index";
import { sequelize } from "../../utilities/db";
import { generatePassword } from "../../services/auth/RandomPassword";
import { MailSenderService } from "../../services/mail";
import { EmailTemplate } from "../../utilities/EmailTemplate";
import { internalServerError } from "../../services/error/InternalServerError";
import { notFound } from "../../services/error/NotFound";
import Industry from "../../models/Industry";

type CompanyAttributes = {
    id: number,
    company_name: string,
    company_email: string,
    company_mobile: string,
    teamsize: number,
    industryId: number,
    domain: string,
    pan: string,
    gst: string,
    company_prefix: string
}

type CompanyCreationAttributes = Omit<CompanyAttributes, 'id'>;

type CompanyModel = Model<CompanyAttributes, CompanyCreationAttributes>;

type CompanyController = MasterController<CompanyModel> & {
    getByName: (req: Request, res:Response, next: NextFunction) => Promise<void>;
}

export const CompanyController= (
    model: typeof Model & {
        new (): CompanyModel;
    }
):CompanyController => {

    const { update, destroy, getAll, getAllDropdown} = MasterController<CompanyModel>(model);

    // const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     try{

    //             const { page, records } = req.query as { page: string, records: string };

    //             const pageNumber = parseInt(page) || 1
    //             const recordsPerPage = parseInt(records) || 10

    //             const offset = (pageNumber - 1) * recordsPerPage;

    //             const data = await model.findAll({
    //                 include:[{
    //                     model: CompanyAddress
    //                 },
    //                 {
    //                     model: User,
    //                     attributes: [[sequelize.fn('COUNT', sequelize.col('users.id')), 'numberOfUsers']]
    //                 },
    //                 {
    //                     model: Industry,
    //                     attributes:['name']
    //                 }
    //             ],
    //             offset,
    //             limit: recordsPerPage,
    //             group: ["company.id", "company_addresses.id", "users.id"],
    //             subQuery: false
    //         })

    //         console.log(data)


    //         const totalPages = Math.ceil(data.length / recordsPerPage)
    //         const hasNextPage = pageNumber < totalPages;
    //         const hasPrevPage = pageNumber > 1;

    //         const meta={
    //             totalCount: data.length,
    //             pageCount: totalPages,
    //             currentPage: page,
    //             perPage: recordsPerPage,
    //             hasNextPage,
    //             hasPrevPage
    //         }

    //         const result = {
    //             data: data,
    //             meta
    //         }

    //         res.status(200).json(result)
    //     }catch(err){
    //         res.status(500).json(err);
    //         // next(internalServerError("Something Went Wrong!"))
    //     }
    // }

    const getById = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try{
            const company = await model.findByPk(req.params.id, {
                include:[
                    {
                        model: CompanyAddress
                    },
                    {
                        model: User,
                        attributes: [[sequelize.fn('COUNT', sequelize.col('users.id')), 'numberofUsers']],
                        where:{
                            company_id: req.params.id  
                        },
                        required: false
                    }
                ],
                group: ['company.id', 'company_addresses.id', 'users.id']
            });

            if(!company){
                // res.status(404).json('No company with that id exists.')
                next(notFound('No company with that id exists.'))
            }else{
                res.status(200).json(company)
            }
        }catch(err){
            // res.status(404).json(err)
            next(internalServerError("Something Went Wrong!"))
        }
    }

    const getByName = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {name} = req.params;
            const options = { where: {name}};
            const data = await model.findOne(options)
            res.status(200).json(data);
        }catch(err){
            // res.status(500).json(err);
            next(internalServerError("Something Went Wrong!"))
        }
    }

    const create = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {company_name, company_email, company_mobile, teamsize, industryId, domain, pan, gst, company_prefix} = req.body

            const{employee_name, phone, employee_generated_id, date_of_joining, probation_period, probation_due_date, work_location, level, grade, cost_center, employee_official_email, employee_personal_email, dob_adhaar, dob_celebrated, employee_gender_id, role_id, master_policy_id} = req.body

            const {company_present_address, company_present_pincode, company_present_city, company_present_state, company_present_country_id, company_present_mobile, company_permanent_address, company_permanent_pincode, company_permanent_city, company_permanent_state, company_permanent_country_id, company_permanent_mobile} = req.body

            const {employee_present_address, employee_present_pincode, employee_present_city, employee_present_state, employee_present_country_id, employee_present_mobile, employee_permanent_address, employee_permanent_pincode, employee_permanent_city, employee_permanent_state, employee_permanent_country_id, employee_permanent_mobile} = req.body

            const employee_password = generatePassword() as string

            const companyData = {
                company_name,
                company_email,
                company_mobile,
                teamsize,
                industryId,
                domain,
                pan,
                gst,
                company_prefix
            }


            await sequelize.transaction(async(t) => {

                            

                const company = await Company.create(companyData, {transaction: t}) as any;
                

                const employeeData = {
                    company_id: company.id,
                    employee_name, 
                    employee_generated_id, 
                    date_of_joining, 
                    probation_period, 
                    probation_due_date, 
                    work_location, 
                    level, 
                    grade, 
                    phone,
                    cost_center, 
                    employee_official_email, 
                    employee_personal_email, 
                    dob_adhaar, 
                    dob_celebrated, 
                    employee_gender_id,
                    employee_password,
                    role_id,
                    master_policy_id
                }
    

                const companyAddressData = {
                    company_present_address,
                    company_present_pincode,
                    company_present_city,
                    company_present_state,
                    company_present_country_id,
                    company_present_mobile,
                    company_permanent_address,
                    company_permanent_pincode,
                    company_permanent_city,
                    company_permanent_state,
                    company_permanent_country_id,
                    company_permanent_mobile,
                    company_id: company.id
                }

                const companyAddress = await CompanyAddress.create(companyAddressData, {transaction: t})



                const employee = await User.create(employeeData, {transaction: t}) as any;

                const employeeAddressData = {
                    employee_present_address,
                    employee_present_pincode,
                    employee_present_city,
                    employee_present_state,
                    employee_present_country_id,
                    employee_present_mobile,
                    employee_permanent_address,
                    employee_permanent_pincode,
                    employee_permanent_city,
                    employee_permanent_state,
                    employee_permanent_country_id,
                    employee_permanent_mobile,
                    user_id: employee.id
                }

                const employeeAddress = await EmployeeAddress.create(employeeAddressData, {transaction: t})

                const credentialData = {
                    email: employee_official_email,
                    subject: "Login Credentials for HRMS",
                    html: EmailTemplate.replace("{{ email }}", employee_official_email).replace("{{ password }}", employee_password)
                }

                const mailRes = MailSenderService.sendToEmail(employee_official_email, credentialData)
                
                res.status(201).json({company, companyAddress, employee, employeeAddress})
            })
            
        }catch(err){
            res.status(500).json(err)
            // next(internalServerError("Something Went Wrong!"))
        }
    }

    return{ getAll, getById, create, update, destroy, getByName, getAllDropdown }
}