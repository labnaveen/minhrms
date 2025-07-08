//@ts-nocheck
import { NextFunction, Request, Response, response } from "express";
import { FindOptions, Includeable, Model, Op, Optional, Order, WhereOptions } from "sequelize";
import { IMasterControllerOptions, MasterController } from "../masterController";
import { Attendance, Company, EmployeeAddress, LeaveBalance, LeaveRecord, LeaveType, Permissions, Roles, User } from "../../models";
import { generatePassword } from "../../services/auth/RandomPassword";
import jwt, { verify } from 'jsonwebtoken'
import { AuthUserJWT } from "../../services/auth/IFace";
import { internalServerError } from "../../services/error/InternalServerError";
import { unauthorized } from "../../services/error/Unauthorized";
import { notFound } from "../../services/error/NotFound";
import MasterPolicy from "../../models/masterPolicy";
import RolePermissions from "../../models/rolePermissions";
import { hasPermissions } from "../../utilities/hasPermission";
import { string } from "joi";
import { sequelize } from "../../utilities/db";
import UserDivision from "../../models/userDivision";
import { generateResponse } from "../../services/response/response";
import DivisionUnits from "../../models/divisionUnits";
import { badRequest } from "../../services/error/BadRequest";
import Asset from "../../models/asset";
import AssignedAsset from "../../models/assignedAsset";
import Division from "../../models/division";
import { MailSenderService } from "../../services/mail";
import { AnniversaryTemplate, BirthdayTemplate, EmailTemplate } from "../../utilities/EmailTemplate";
import Gender from "../../models/dropdown/type/gender";
import ReportingManagerEmployeeAssociation from "../../models/reportingManagerEmployeeAssociation";
import ReportingManagers from "../../models/reportingManagers";
import { ReportingManagerAttributes } from "../reportingStructure/reportingManager/reportingManagerController";
import ReportingRole from "../../models/reportingRole";
import FamilyMember from "../../models/familyMember";
import Relation from "../../models/dropdown/relation/relation";
import Experience from "../../models/experience";
import Education from "../../models/education";
import EmploymentType from "../../models/dropdown/type/employment";
import EducationType from "../../models/dropdown/type/educationType";
import ProfileImages from "../../models/profileImages";
import { MasterPolicyResponse } from "../../interface/masterPolicy";
import { getMasterPolicy } from "../../services/masterPolicy/getMasterPolicy";
import AttendancePolicy from "../../models/attendancePolicy";
import ShiftPolicy from "../../models/shiftPolicy";
import moment from "moment";
import DayType from "../../models/dropdown/dayType/dayType";
import Approval from "../../models/dropdown/status/approval";
import RegularizationRequest from "../../models/regularizationRequest";
import RegularizationRecord from "../../models/regularizationRecord";
import RegularisationStatus from "../../models/regularisationStatus";
import RegularizationRequestStatus from "../../models/regularizationRequestStatus";
import ProfileChangeRecord from "../../models/profileChangeRecord";
import ApprovalFlow from "../../models/approvalFlow";
import ProfileChangeRequests from "../../models/profileChangeRequests";
import LeaveRequest from "../../models/leaveRequest";
import { sendNotification } from "../../services/notification/sendNotification";
import Notification from "../../models/notification";
import LeaveTypePolicy from "../../models/leaveTypePolicy";
import ApprovalFlowType from "../../models/dropdown/type/approvalFlowType";
import { forbiddenError } from "../../services/error/Forbidden";
import fs from 'fs';
import csvToJson from 'csvtojson'
import formidable from 'formidable'
import { calcualteOvertimeHours, calculateOvertimeDeficit, calculateWorkingHours, getTotalCompletedHoursForMonth, getTotalCompletedHoursForWeek, getTotalWorkingDaysInCurrentWeek, getWorkingDaysInAMonth } from "../../helpers";
import { getUserRoles } from "../../services/auth/PermissionService";
import path from "path";
import { sendPushNotification } from "../../services/pushNotification/notificationService";
import axios from "axios";
import PunchLocation from "../../models/punchLocation";
import ProfileChangeRequestHistory from "../../models/profileChangeRequestHistory";


const imageAttachment = fs.readFileSync('./src/assets/birthday-banner.png').toString('base64');
const appUrl = process.env.APP_URL



export type EmployeeAttributes = {
    id: string,
    company_id: number,
    employee_name: string,
    employee_generated_id: string,
    date_of_joining: string,
    probation_period: string,
    probation_due_date: string,
    work_location: string,
    level: string,
    grade: string,
    cost_center: string,
    employee_official_email: string,
    employee_personal_email: string,
    dob_adhaar: string,
    dob_celebrated: string,
    employee_gender_id: number,
    is_deleted: boolean,
    role_id: number,
    status: boolean,
    employee_password: string,   
    master_policy_id: number,
    phone: string,
    units: Array<number>,
    profile_image: number,
    reporting_managers: Array<number>,
}

type EmployeeReqBody = {
    employee_name: string,    
    employee_personal_email: string,
    dob_adhaar: string,
    dob_celebrated: string,
    employee_gender_id: string,
    blood_group: string,
    nationality: string,
    mother_tongue: string,
    alternate_email: string,
    alternate_contact: string,
    religion: string,
    bank_name: string,
    bank_branch: string,
    account_number: string,
    ifsc_code: string,
    payroll_details: string,
    account_holder_name: string,
    pan_number: string,
    adhaar_number: string,
    phone: string,
    profile_image?: number
    employee_gender_id: number
}

type EmployeeCreationAttributes = Omit<EmployeeAttributes, 'id'>;

type UserModel = Model<EmployeeAttributes, EmployeeCreationAttributes>;


type EmployeeController = MasterController<UserModel> & {
    // getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    dropdown: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    changeStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPunchDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLeaveRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRegularizationRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approveProfileChangeRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    rejectProfileChangeRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProfileChangeRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    creditLeaves: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteEmployee: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    bulkUpload: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    employeeStatistics: (req: Request, res: Response, next:NextFunction) => Promise<void>;
    wishEmployeeBirthday: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    wishEmployeeAnniversary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const EmployeeController = (
    model: typeof Model & {
        new(): UserModel;
    }
):EmployeeController => {

    const{destroy, getAllDropdown} = MasterController<UserModel>(model)


    const getAll = async(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> => {
        try {
            const findOptions: IMasterControllerOptions = options || {}; //Can add Options such as where, attributes, etc.
            const { page, records, search_term } = req.query as { page: string, records: string, search_term: string };
            const{unit_id, role, sortBy, sortOrder, month, year} = req.query

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }



            

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;


            findOptions.searchBy = options?.searchBy
            findOptions.included = options?.included
            findOptions.order = options?.sortBy?.map((field) => [field, 'DESC'])
            findOptions.offset = offset
            findOptions.limit = recordsPerPage
            findOptions.distinct = true
            findOptions.order = []


            if(req.query.search_term){
                findOptions.where= {
                    [Op.or]: [
                        {employee_name: {[Op.like]: `%${search_term}%`}},
                        {employee_generated_id:{ [Op.like]: `%${search_term}%`}},
                        {employee_official_email: {[Op.like]: `%${search_term}%`}},
                        {phone: {[Op.like]: `%${search_term}%`}}
                    ]
                }
            }


            if(role){
                findOptions.where = {
                    role_id: role
                }
            }

            if(sortBy && sortOrder){
                if(sortBy === 'name'){
                    findOptions.order?.push(['employee_name', sortOrder])
                }
                if(sortBy === 'employee_id'){
                    findOptions.order?.push(['employee_generated_id', sortOrder])
                }
                if(sortBy === 'role'){
                    findOptions.order?.push([{model: Roles, as: 'role'}, 'name', sortOrder])
                }
                if(sortBy === 'contact'){
                    findOptions.order?.push(['phone', sortOrder])
                }
            }

            console.log(">>>>>>>>>>>>>>>>>", findOptions.order)

            findOptions.include = [
                {
                    model: MasterPolicy,
                    attributes:['id', 'policy_name', 'policy_description']
                },
                {
                    model: Roles,
                    as: 'role',
                    attributes:['id', 'name', 'alias']
                },
                {
                    model: FamilyMember,
                    include: [{model: Relation, attributes:['id', 'name']}],
                    attributes: ['id', 'name', 'dob', 'relation_id', 'occupation', 'phone', 'email'],
                }
            ]

            if(unit_id){
                findOptions.include.push({
                    model: DivisionUnits,
                    where: { id: unit_id }
                })
            }else{
                findOptions.include.push({
                    model: DivisionUnits,
                    include: [
                        {model: Division}
                    ]
                })
            }

            findOptions.attributes= {
                exclude: ['employee_password']
            }

            const data = await User.findAndCountAll(findOptions);

            const totalPages = Math.ceil(data.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;



            const meta = {
                totalCount: data.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const updatedData = await Promise.all(data.rows.map(async (employee) => {
                const unit = await UserDivision.findAll({
                    where: {
                        user_id: employee.id
                    },
                })
                
                const department = await Promise.all(unit.map(async(unit) => {
                    const division_unit = await DivisionUnits.findByPk(unit.id)
                    if(division_unit?.division_id === 2){
                        return({
                            name: division_unit?.unit_name
                        })
                    }
                }))

                const designation = await Promise.all(unit.map(async(unit) => {
                    const division_unit = await DivisionUnits.findByPk(unit.id)
                    if(division_unit?.division_id === 1){
                        return({
                            id: division_unit?.id,
                            name: division_unit?.unit_name
                        })
                    }
                }))
                
                
                const employeeResponse = employee.toJSON()

                employeeResponse.department = department[0]
                employeeResponse.designation = designation[0]

                return employeeResponse
            }))

            const result = {
                data: updatedData,
                meta
            }

            const response = generateResponse(200, true, "Data Fetched Succesfully!", updatedData, meta)


            if (data) {
                res.status(200).json(response);
            }
            else {
                // res.status(404).json({error: 'There are no companies!'})
                next(badRequest("There are no companies!"))
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    }

    const getById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.params

            const employee = await User.findByPk(id, {
                include: [
                    {
                        model: Company,
                        attributes: ['id', 'company_name']
                    }, 
                    {
                        model: MasterPolicy,
                        attributes: ['id', 'policy_name']
                    },
                    {
                        model: Roles,
                        as: 'role',
                        attributes: ['id', 'name', 'alias']
                    },
                    {
                        model: DivisionUnits,
                        include: [{model: Division}]
                    },
                    {
                        model: Gender,
                        attributes: ['id', 'name']
                    },
                    {
                        model: ReportingManagers,
                        as:'Managers',
                        include:[
                            {model: User, attributes: ['id', 'employee_generated_id', 'employee_name']}
                        ],
                        attributes:['id', 'user_id', 'reporting_role_id'],
                        through:{
                            attributes:[]
                        }
                    }
                ],
                attributes:{
                    exclude: ['employee_password', 'createdAt', 'updatedAt']
                }
            })

            

            if(employee){

                const unit = await UserDivision.findAll({
                    where: {
                        user_id: id
                    },
                })
                

                const department = await Promise.all(unit.map(async(unit) => {
                    const division_unit = await DivisionUnits.findByPk(unit.id)
                    if(division_unit?.division_id === 2){
                        return({
                            name: division_unit?.unit_name
                        })
                    }
                }))

                const designation = await Promise.all(unit.map(async(unit) => {
                    const division_unit = await DivisionUnits.findByPk(unit.id)
                    if(division_unit?.division_id === 1){
                        return({
                            name: division_unit?.unit_name
                        })
                    }
                }))
                
                
                const employeeResponse = employee.toJSON()

                employeeResponse.department = department[0]
                employeeResponse.designation = designation[0]


                const response = generateResponse(200, true, "Data fetched Succesfully!", employeeResponse)

                res.status(200).json(response)

            }else{
                next(notFound("Employee not found"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const create = async(req: Request, res:Response, next: NextFunction): Promise<void> => {
        try{
            const{
                employee_name, 
                employee_generated_id, 
                phone, 
                date_of_joining, 
                probation_period, 
                units, 
                probation_due_date, 
                work_location, 
                level, grade, 
                cost_center, 
                employee_official_email, 
                employee_personal_email, 
                dob_adhaar, 
                dob_celebrated, 
                employee_gender_id, 
                role_id, master_policy_id, 
                reporting_managers
            } = req.body

            const existingEmployee = await User.findOne({
                where: {
                    employee_generated_id: employee_generated_id
                }
            })

            const existingEmployeeEmail = await User.findOne({
                where: {
                    employee_official_email: employee_official_email
                }
            })

            const existingPhone = await User.findOne({
                where: {
                    phone: phone    
                }
            })
            
            const dob = req.body.dob_adhaar

            const currentDate = moment()

            const userAge = currentDate.diff(dob, 'years')

            if(userAge < 18){
                return next(badRequest("The employee cannot be less than 18 years of age!"))
            }
            if(existingEmployee){
                return next(badRequest("An employee with that employee ID already exists!"))
            }
            if(existingEmployeeEmail){
                return next(badRequest("An employee with that official email ID already exists!"))
            }
            if(existingPhone){
                return next(badRequest("An employee with that same phone number already exists!"))
            }
        
            // const {employee_present_address, employee_present_pincode, employee_present_city, employee_present_state, employee_present_country_id, employee_present_mobile, employee_permanent_address, employee_permanent_pincode, employee_permanent_city, employee_permanent_state, employee_permanent_country_id, employee_permanent_mobile} = req.body

            
            const transaction = await sequelize.transaction( async (t) =>{
                const employee_password = generatePassword() as string

                const token = req.headers.authorization?.split(' ')[1]
    
                if(!token){
                    // res.status(401).json('There is no Token provided.')
                    next(unauthorized('There is no token provided'))
                }


                if(token){
                    const decodedToken = jwt.decode(token)

                    const companyId = decodedToken?.company_id

                    const employeeData = {
                        company_id: companyId,
                        employee_name, 
                        employee_generated_id, 
                        date_of_joining, 
                        probation_period, 
                        probation_due_date, 
                        work_location, 
                        level, 
                        grade, 
                        cost_center, 
                        employee_official_email, 
                        employee_personal_email, 
                        dob_adhaar, 
                        dob_celebrated, 
                        employee_gender_id,
                        employee_password,
                        role_id,
                        master_policy_id,
                        phone,
                    }

                    

                    const employee = await User.create(employeeData, {transaction: t})

                    // const employeeAddressData = {
                    //     employee_present_address,
                    //     employee_present_pincode,
                    //     employee_present_city,
                    //     employee_present_state,
                    //     employee_present_country_id,
                    //     employee_present_mobile,
                    //     employee_permanent_address,
                    //     employee_permanent_pincode,
                    //     employee_permanent_city,
                    //     employee_permanent_state,
                    //     employee_permanent_country_id,
                    //     employee_permanent_mobile,
                    //     user_id: employee.id
                    // }

                    // const employeeAddress = await EmployeeAddress.create(employeeAddressData, {transaction: t})


                    if(units.length > 0){
                        await Promise.all(
                            units.map(async (unitId: any) => {
                                if(typeof unitId !== 'number'){
                                    throw new Error('Invalid statusId in regularisation_status array');
                                }
                                const Unit = await DivisionUnits.findByPk(unitId);

                                const divisionId = Unit?.division_id

                                await UserDivision.create(
                                    {
                                        user_id: employee.id,
                                        unit_id: unitId,
                                        division_id: divisionId
                                    },
                                    {transaction: t}
                                )
                            })
                        )
                    }

                    if(reporting_managers){
                        await Promise.all(
                            reporting_managers.map(async (reportingManagerId: any) => {
                                if(typeof reportingManagerId !== 'number'){
                                    throw new Error('Invalid Reporting Manager id in regularisation_status array');
                                }
                                const reportingManager: ReportingManagerAttributes | null = await ReportingManagers.findByPk(reportingManagerId) as ReportingManagerAttributes | null;

                                if(reportingManager){
                                    await ReportingManagerEmployeeAssociation.create(
                                        {
                                            user_id: employee.id,
                                            reporting_role_id: reportingManager.reporting_role_id,
                                            reporting_manager_id: reportingManager.id
                                        },
                                        {transaction: t}
                                    )
                                }
                                
                            })
                        )
                    }

                    const masterPolicy = await MasterPolicy.findByPk(master_policy_id, {
                        include: [
                            {
                                model: LeaveTypePolicy,
                                as: 'LeaveTypePolicies',
                                attributes:['id', 'leave_policy_name', 'description'],
                                include:[{model: LeaveType, attributes:['id', 'leave_type_name']}],
                                through:{
                                    attributes: []
                                }
                            }
                        ]
                    })

                    if(masterPolicy && masterPolicy.LeaveTypePolicies.length > 0){
                        const leaveTypePolicies = masterPolicy?.LeaveTypePolicies
                        for(const policy of leaveTypePolicies){
                            const leaveTypePolicy = await LeaveTypePolicy.findByPk(policy?.id)
                            const leaveType = await LeaveType?.findByPk(policy?.leave_type?.id)
                            await LeaveBalance.create({
                                user_id: employee?.id,
                                leave_type_id: policy.leave_type.id,
                                leave_balance: 0,
                                total_leaves: leaveTypePolicy?.annual_eligibility
                            }, {transaction: t})
                        }
                    }

                    return {employee, employee_password}
                }
            });

            const credentialData = {
                email: employee_official_email,
                subject: "Login Credentials for HRMS",
                html: EmailTemplate.replace("{{ email }}", employee_official_email).replace("{{ password }}", transaction?.employee_password)
            }

            await MailSenderService.sendToEmail(employee_official_email, credentialData)

            const data = {
                employee: transaction?.employee,
                // employeeAddress: transaction?.employeeAddress
            }
            const response = generateResponse(201, true, "Employee Created Succesfully", data)
            res.status(201).json(response)
        }catch(err){
            res.status(500).json(err)
            console.log(err)
            // next(internalServerError("Something Went Wrong!"))
        }
    }


    const update = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try{
            const employee_id = req.params.id

            const {id} = req.credentials

            const employeeBeforeChange = await User.findByPk(employee_id)

            const employee :  (EmployeeAttributes & EmployeeReqBody & User) = await User.findByPk(employee_id, {
                include:{
                    model: Roles,
                    as: 'role',
                    attributes: {exclude: ['employee_password']}
                },
            });

            const existingEmployeeId = await User.findOne({
                where: {
                    employee_generated_id: req.body.employee_generated_id,
                    id: {
                        [Op.not]: employee_id
                    }
                }
            })

            if(req.body.phone){
                const existingPhone = await User.findOne({
                    where: {
                        phone: req.body.phone,
                        id: {
                            [Op.not]: employee_id
                        }
                    }
                })
                if(existingPhone){
                    return next(badRequest("An employee with that phone number already exists!"))
                }
    
            }

            const existingEmail = await User.findOne({
                where: {
                    employee_official_email: req.body.employee_official_email,
                    id: {
                        [Op.not]: employee_id
                    }
                }
            })

            if(existingEmail){
                return next(badRequest("An employee with that email ID already exists!"))
            }

            
            if(existingEmployeeId){
                return next(badRequest("An employee with that emplpyee ID already exists!"))
            }

            if(req.body.role_id && employee.id == id && employee.role_id !== req.body.role_id){
                return next(badRequest("Cannot change your own role!"))
            }
            

            await sequelize.transaction(async(t) => {
                        
                if(!employee){
                    return next(notFound("There is no Employee with that id"))
                }else{
                    const {
                        master_policy_id, 
                        role_id, 
                        employee_generated_id,
                        date_of_joining,
                        probation_due_date,
                        probation_period,
                        work_location,
                        level,
                        grade,
                        cost_center,
                        employee_official_email,
                        status,
                        phone,
                        units,
                        reporting_managers,
                        dob_adhaar, 
                        dob_celebrated,
                        employee_gender_id,
                        employee_name
                    }: EmployeeAttributes = req.body

                    const formData = {
                        master_policy_id,
                        role_id,
                        employee_generated_id
                    }
                    
                    if(master_policy_id){
                        employee.master_policy_id = master_policy_id
                    }

                    if(role_id){
                        employee.role_id = role_id
                    }

                    if(employee_name){
                        employee.employee_name = employee_name
                    }

                    if(employee_gender_id){
                        employee.employee_gender_id = employee_gender_id
                    }

                    if(employee_generated_id && employee_generated_id.trim() !== ''){
                        employee.employee_generated_id = employee_generated_id
                    }

                    if(date_of_joining && date_of_joining.trim() !== ''){
                        employee.date_of_joining = date_of_joining
                    }

                    if(probation_due_date && probation_due_date.trim() !== ''){
                        employee.probation_due_date = probation_due_date
                    }

                    if(probation_period && probation_period.trim() !== ''){
                        employee.probation_period = probation_period
                    }

                    if(work_location && work_location.trim() !== ''){
                        employee.work_location = work_location
                    }

                    if(level && level.trim() !== ''){
                        employee.level = level
                    }
                    
                    if(grade && grade.trim() !== ''){
                        employee.grade = grade
                    }

                    if(cost_center && cost_center.trim() !== ''){
                        employee.cost_center = cost_center
                    }

                    if(employee_official_email && employee_official_email.trim() !== ''){
                        employee.employee_official_email = employee_official_email
                    }

                    if(dob_celebrated && dob_celebrated.trim() !== ''){
                        employee.dob_celebrated = dob_celebrated
                    }

                    if(dob_adhaar && dob_adhaar.trim() !== ''){
                        employee.dob_adhaar = dob_adhaar
                    }

                    if(status){
                        employee.status = status
                    }

                    if(phone){
                        employee.phone = phone
                    }

                    await UserDivision.destroy({
                        where: {
                            user_id: employee_id
                        },
                        transaction: t
                    })

                    if(units.length>0){
                        await Promise.all(
                            units.map(async(unitId) => {
                                const unit = await DivisionUnits.findByPk(unitId)
                                // const association = await UserDivision.findOne({
                                //     where:{
                                //         user_id: employee_id,
                                //         division_id: unit?.division_id
                                //     }
                                // })

                                // console.log(">>>>>>>ASSOCIATION", association)

                                // if(association){
                                //     await association.destroy({transaction: t})
                                // }

                                await UserDivision.create({
                                    user_id: employee_id,
                                    unit_id: unitId,
                                    division_id: unit?.division_id
                                }, {transaction: t})
                            })
                        )
                    }


                    await ReportingManagerEmployeeAssociation.destroy({
                        where: {
                            user_id: employee?.id
                        },
                        transaction: t
                    })


                    if(reporting_managers?.length > 0){
                        await Promise.all(
                            reporting_managers.map(async (reportingManagerId: any) => {
                                if(typeof reportingManagerId !== 'number'){
                                    throw new Error('Invalid Reporting Manager id in reporting manager array');
                                }
                                const reportingManager: ReportingManagerAttributes | null = await ReportingManagers.findByPk(reportingManagerId) as ReportingManagerAttributes | null;

                                // const association = await ReportingManagerEmployeeAssociation.findOne({
                                //     where: {
                                //         user_id: employee.id,
                                //         reporting_role_id: reportingManager?.reporting_role_id
                                //     }
                                // })

                                // console.log(association)

                                // if(association){
                                //     association.destroy({transaction: t})
                                // }

                                
                                if(reportingManager){
                                    await ReportingManagerEmployeeAssociation.create(
                                        {
                                            user_id: employee.id,
                                            reporting_role_id: reportingManager.reporting_role_id,
                                            reporting_manager_id: reportingManager.id
                                        },
                                        {transaction: t}
                                    )
                                }
                                
                            })
                        )
                    }


                    if(master_policy_id !== employeeBeforeChange?.master_policy_id){
                        await LeaveBalance.destroy({
                            where: {
                                user_id: employee?.id
                            },
                            transaction: t
                        })

                        const masterPolicy = await MasterPolicy.findByPk(master_policy_id, {
                            include: [
                                {
                                    model: LeaveTypePolicy,
                                    as: 'LeaveTypePolicies',
                                    attributes:['id', 'leave_policy_name', 'description'],
                                    include:[
                                        {model: LeaveType, attributes:['id', 'leave_type_name']}
                                    ],
                                    through:{
                                        attributes: []
                                    }
                                }
                            ]
                        })
                        if(masterPolicy){
                            const leaveTypePolicies = masterPolicy?.LeaveTypePolicies
                            console.log(">>>>>>>>>>>>>>>", leaveTypePolicies)
                            if(leaveTypePolicies.length > 0){
                                for(const policy of leaveTypePolicies){
                                    const leaveTypePolicy = await LeaveTypePolicy.findByPk(policy?.id)
                                    const leaveType = await LeaveType?.findByPk(policy?.leave_type?.id)
                                    await LeaveBalance.create({
                                        user_id: employee?.id,
                                        leave_type_id: policy.leave_type.id,
                                        leave_balance: 0,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    }, {transaction: t})
                                }
                            }
                        }
                    }

                    await employee.save({transaction: t})
                    
                    const response = generateResponse(200, true, "Data Updated succesfully!")
                    res.status(200).json(response)
                }
            })
        }
        catch(err){
            console.log(err)
            res.status(500).json(err)
            // return next(internalServerError("Something went wrong!"))
        }
    }

    const updateProfile = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials

            const employee = await User.findByPk(id, {
                include: [
                    {
                        model: Gender,
                        attributes: ['id', 'name']
                    }
                ]
            }) as EmployeeAttributes | EmployeeReqBody | unknown

            if(employee){
                await sequelize.transaction(async(t) => {
                    const {
                        employee_name, 
                        employee_personal_email, 
                        dob_adhaar, dob_celebrated, 
                        employee_gender_id, 
                        blood_group,
                        nationality,
                        mother_tongue,
                        alternate_email,
                        alternate_contact,
                        religion,
                        bank_name,
                        bank_branch,
                        account_number,
                        ifsc_code,
                        payroll_details,
                        account_holder_name,
                        pan_number,
                        adhaar_number,
                        phone,    
                    }: EmployeeReqBody= req.body

                    const formData = {} as EmployeeReqBody

                    const previous = {
                        employee_name: employee.employee_name, 
                        employee_personal_email: employee.employee_personal_email, 
                        dob_adhaar: employee.dob_adhaar, 
                        dob_celebrated: employee.dob_celebrated, 
                        employee_gender_id: employee.gender, 
                        blood_group: employee.blood_group,
                        nationality: employee.nationality,
                        mother_tongue: employee.mother_tongue,
                        alternate_email: employee.alternate_email,
                        alternate_contact: employee.alternate_contact,
                        religion: employee.religion,
                        bank_name: employee.bank_name,
                        bank_branch: employee.bank_branch,
                        account_number: employee.account_number,
                        ifsc_code: employee.ifsc_code,
                        payroll_details: employee.payroll_details,
                        account_holder_name: employee.account_holder_name,
                        pan_number: employee.pan_number,
                        adhaar_number: employee.adhaar_number,
                        phone: employee.phone,     
                    }
    
                    if(employee_name && employee_name.trim() !== ''){
                        formData.employee_name = employee_name
                    }
    
                    if(employee_personal_email && employee_personal_email.trim() !== ''){
                        formData.employee_personal_email = employee_personal_email
                    }
    
                    if(dob_adhaar && dob_adhaar.trim() !== ''){
                        formData.dob_adhaar = dob_adhaar
                    }
    
                    if(dob_celebrated && dob_celebrated.trim() !== ''){
                        formData.dob_celebrated = dob_celebrated
                    }             
    
                    if(employee_gender_id){
                        formData.employee_gender_id = employee_gender_id
                    }
    
                    // if(blood_group.trim() !== ''){
                        formData.blood_group = blood_group
                    // }
    
                    formData.nationality = nationality
    
                    if(mother_tongue && mother_tongue.trim() !== ''){
                        formData.mother_tongue = mother_tongue
                    }
    
                    if(alternate_email && alternate_email.trim() !== ''){
                        formData.alternate_email = alternate_email
                    }
    
                    if(alternate_contact && alternate_contact.trim() !== ''){
                        formData.alternate_contact = alternate_contact
                    }
    
                    // if(religion.trim() !== ''){
                        formData.religion = religion
                    // }
    
                    if(bank_name && bank_name.trim() !== ''){
                        formData.bank_name = bank_name
                    }
    
                    if(bank_branch && bank_branch.trim() !== ''){
                        formData.bank_branch = bank_branch
                    }
    
                    if(account_number && account_number.trim() !== ''){
                        formData.account_number = account_number
                    }
    
                    if(ifsc_code && ifsc_code.trim() !== ''){
                        formData.ifsc_code = ifsc_code
                    }
    
                    if(payroll_details && payroll_details.trim() !== ''){
                        formData.payroll_details = payroll_details
                    }
    
                    if(account_holder_name && account_holder_name.trim() !== ''){
                        formData.account_holder_name = account_holder_name
                    }
    
                    if(pan_number && pan_number.trim() !== ''){
                        formData.pan_number = pan_number
                    }
    
                    if(adhaar_number && adhaar_number.trim() !== ''){
                        formData.adhaar_number = adhaar_number
                    }
    
                    if(phone && phone.trim() !== ''){
                        formData.phone = phone
                    }
    
                    // await employee.save({transaction: t})

                    if(req.body.employee_gender_id){
                        const gender = await Gender.findByPk(req.body.employee_gender_id, {attributes: ['id', 'name']})
                        req.body.employee_gender_id = gender
                    }

                    const filterObject = (originalObject: EmployeeReqBody | EmployeeAttributes | EmployeeCreationAttributes, filterObject: EmployeeReqBody) => {
                        const filteredObject = {};
                        Object.keys(originalObject).forEach((key) => {
                            if (filterObject.hasOwnProperty(key)) {
                                filteredObject[key] = originalObject[key];
                            }
                        });
                        return filteredObject;
                    };

                    const previousValues = filterObject(previous, req.body);
                    

                    const profileChangeRecord = await ProfileChangeRecord.create({
                        user_id: id,
                        section: req.body.section,
                        previous: previousValues,
                        change: JSON.stringify(req.body)
                    }, {transaction: t})

                    console.log("PROFILE CHANGEEE RECORRDDDD", profileChangeRecord)

                    const user = await User.findByPk(id, {
                        include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']},  {model: ReportingRole}]}],
                        attributes:['id', 'employee_name']
                    })
                    const masterPolicy = await getMasterPolicy(id);

                    const profileChangeWorkflow = masterPolicy.profile_change_workflow;

                    const approvalWorkflow = await ApprovalFlow.findByPk(profileChangeWorkflow, 
                        {
                            include:[
                                {
                                    model: ReportingRole,
                                    as: 'direct',
                                    through:{attributes:[]},
                                    include: [
                                        {
                                            model: ReportingManagers
                                        }
                                    ]
                                },
                                {
                                    model: ApprovalFlowType,
                                }
                            ]
                        }
                    )

                    const administrators = await User.findAll({
                        where: {
                            role_id: 1 //admin
                        }
                    })

                    if(user?.Manager && user?.Manager.length > 0){
                        if(approvalWorkflow?.approval_flow_type?.id === 2){ //Sequential Approval Flow
                            const reportingManagers = user?.Manager as any[]
                            console.log("MANAGERRRSSSS", reportingManagers)
                            const sortedManagers = approvalWorkflow?.direct.sort((a, b) => b.priority - a.priority)
                            const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority))
    
                            const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority)
    
                            console.log("MIN PRIORITY MANAGERSSS", minPriorityManagers)
    
                            for (const manager of minPriorityManagers){
                                console.log("HATKEEE", manager?.reporting_managers)
                                await Promise.all(
                                    manager?.reporting_managers?.map(async(item) => {
                                        console.log("ITEEEEMMM", item, profileChangeRecord?.id)
                                        try{
                                            if(reportingManagers.some(manager => manager.id === item.id)){

                                                const profileChangeRequest = await ProfileChangeRequests.create({
                                                    profile_change_record_id: profileChangeRecord?.id,
                                                    user_id: item.user_id,
                                                    status: 1,
                                                    priority: manager.priority
                                                }, {transaction: t})
                
                                                const notificationData = {
                                                    user_id: item.user_id,
                                                    title: 'Profile Change Request',
                                                    type: 'profile_change_creation',
                                                    description: `${user?.employee_name} has applied for a profile details change request`,
                                                }
                
                                                const notification = await Notification.create(notificationData, {transaction: t})
            
                                                await sendNotification(manager.id, notification)

                                                let data = {
                                                    user_id: item.user_id,
                                                    type: 'Profile Change Request',
                                                    message: `${user?.employee_name} has applied for a profile details change request`,
                                                    path: 'profile_change_creation',
                                                    reference_id: profileChangeRequest?.id
                                                }

                                                console.log("HERE IS THE NOTFICATION PART!!!!")
                                                await sendPushNotification(data)
                                            }
                                        }catch(err){
                                            console.log(err)
                                        }		
                                    })
                                )
                            }	
                            for(let admin of administrators){
                                const AdminProfileChangeRequest = await ProfileChangeRequests.create({
                                    profile_change_record_id: profileChangeRecord?.id,
                                    user_id: admin.id,
                                    status: 1,
                                    priority: 0 //Admin Priority
                                }, {transaction: t})
                            }   
                        }else if (approvalWorkflow?.approval_flow_type?.id === 1){ //Parallel Approval Flow
    
                            const reportingManagers = user?.Manager as any[]
    
                            const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id))
    
                            console.log("POLICYYY", approvalWorkflow)
    
                            console.log("FILTERED MANAGERSSSS", filteredManagers)

                            console.log("Profile Change Request: ", profileChangeRecord?.id)
    
                            await Promise.all(
                                filteredManagers.map(async(item) => {
                                    if(reportingManagers.some(manager => manager.id === item.id)){
                                        const profileChangeRequest = await ProfileChangeRequests.create({
                                            profile_change_record_id: profileChangeRecord?.id,
                                            user_id: item.user_id,
                                            status: 1,
                                            priority: 1
                                        }, {transaction: t})

                                        const notificationData = {
                                            user_id: item.user_id,
                                            title: 'Profile Change Request',
                                            type: 'profile_change_creation',
                                            description: `${user?.employee_name} has applied for a profile details change request`,
                                        }
        
                                        const notification = await Notification.create(notificationData, {transaction: t})
    
                                        await sendNotification(item.user_id, notification)
                                        let data = {
                                            user_id: item.user_id,
                                            type: 'Profile Change Request',
                                            message: `${user?.employee_name} has applied for a profile details change request`,
                                            path: 'profile_change_creation',
                                            reference_id: profileChangeRequest?.id
                                        }
                                        console.log("HERE IS THE NOTFICATION PART!!!!")

                                        await sendPushNotification(data)
                                    }
                                })
                            )       
                            console.log("Administrators Length: ", administrators.length)
                            for(let admin of administrators){
                                const AdminProfileChangeRequest = await ProfileChangeRequests.create({
                                    profile_change_record_id: profileChangeRecord?.id,
                                    user_id: admin.id,
                                    status: 1,
                                    priority: 0 //Admin Priority
                                }, {transaction: t})
                            }                 
                        }
                        const response = generateResponse(200, true, "Profile Change Request created succesfully!")
                        res.status(200).json(response)
                    }else{
                        const user = await User.findByPk(id)
                        if(user){
                            console.log(formData)
                            await user.update(formData, {transaction: t})
                            const response = generateResponse(200, true, "Profile updated succesfully!")
                            res.status(200).json(response)
                        }
                    }
                })
            }
        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    const dropdown = async (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> => {
        try {
            const findOptions = options || {};

            findOptions.searchBy = options?.searchBy
            findOptions.included = options?.included
            findOptions.order = options?.sortBy?.map((field) => [field, 'DESC'])

            const {role_id} = req.query


            if(role_id){
                const roleExists = await Roles.findByPk(role_id)

                if(roleExists){
                    findOptions.where = {
                        ...options?.where,
                        role_id: roleExists.id
                    }
                    
                }else{
                    next(badRequest("There is no role with that name"))
                }
            }else{
                findOptions.where={
                    ...options?.where
                }
            }

            if (options?.searchBy && options.searchBy.length > 0 && (role_id || req.query.searchTerm)) {
                const searchConditions: WhereOptions[] = options.searchBy.map((field) => ({
                    [field]: { [Op.startsWith]: req.query?.searchTerm || '' },
                }));

                findOptions.where = {
                    ...options.where,
                    ...findOptions.where,
                    [Op.or]: searchConditions
                }
            }


            if (options?.included) {
                findOptions.include = options.included.map((relation) => {
                    const nestedIncluded = options.nestedIncluded?.[relation];
                    const attributes = options.attributes?.[relation];

                    if (nestedIncluded) {
                        return {
                            model: model.sequelize?.model(relation),
                            include: nestedIncluded.map((nestedRelation) => ({
                                model: model.sequelize?.model(nestedRelation),
                            })),
                        };
                    } else if (attributes) {
                        return {
                            model: model.sequelize?.model(relation),
                            attributes: attributes.map((attribute) => {
                                return attribute
                            })
                        };
                    } else {
                        return {
                            model: model.sequelize?.model(relation)
                        }
                    }
                }) as Includeable[]
            }

            if (options?.attribute) {
                findOptions.attributes = options.attribute
            }

            console.log(findOptions)

            const data = await model.findAndCountAll(findOptions);
            const result = {
                data: data.rows,
            };

            if (data) {
                res.status(200).json(result);
            } 

        } catch (err) {
            console.log(err)
            next(internalServerError('Something Went Wrong!'))
        }
    };

    const getProfile = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.params

            const assignedAsset = await AssignedAsset.findAll({
                where: {
                    user_id: id,
                    deleted_at: null,
                    date_of_return: null
                },
                include:[
                    {
                        model: Asset,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: User,
                        attributes: ['id', 'employee_name', 'employee_generated_id']
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })

            
            const employee = await User.findByPk(id, {
                include: [
                    {
                        model: Company,
                        attributes: ['id', 'company_name']
                    }, 
                    {
                        model: MasterPolicy,
                        attributes: ['id', 'policy_name']
                    },
                    {
                        model: Roles,
                        as: 'role',
                        attributes: ['id', 'name', 'alias']
                    },
                    {
                        model: DivisionUnits,
                        include: [{model: Division}]
                    },
                    {
                        model: Gender,
                        attributes: ['id', 'name']
                    },
                    {
                        model: ReportingManagers,
                        as:'Managers',
                        include:[
                            {model: User, attributes: ['id', 'employee_generated_id', 'employee_name']}
                        ],
                        attributes:['id', 'user_id', 'reporting_role_id'],
                        through:{
                            attributes:[]
                        }
                    },
                    {
                        model: FamilyMember,
                        attributes:{
                            exclude: ['createdAt', 'updatedAt']
                        },
                        include: [
                            {
                                model: Relation,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            }
                        ]
                    },
                    {
                    
                        model: Experience,
                        include: [
                            {
                                model: EmploymentType,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            }
                        ],
                        attributes:{
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: Education,
                        include:[
                            {
                                model: EducationType,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            }
                        ],
                        attributes:{
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    // {
                    //     model: Asset,
                    //     where: {
                    //         is_assigned: true
                    //     },
                    //     required: false,
                    //     attributes:{
                    //         exclude: ['createdAt', 'updatedAt']
                    //     },
                    //     through: {
                    //         attributes: []
                    //     }
                    // },
                    {
                        model: ProfileImages,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                attributes:{
                    exclude: ['employee_password', 'createdAt', 'updatedAt']
                }
            })
            
            const scope = await getUserRoles(employee?.role_id)

            if(employee){

                const unit = await UserDivision.findAll({
                    where: {
                        user_id: id
                    },
                })
                
                let departmentName;
                let designationName;

                const department = await Promise.all(unit.map(async(unit) => {
                    const division_unit = await DivisionUnits.findByPk(unit.unit_id)
                    if(division_unit?.division_id === 2){
                        departmentName = division_unit?.unit_name
                    }
                }))

                const designation = await Promise.all(unit.map(async(unit) => {
                    const division_unit = await DivisionUnits.findByPk(unit.unit_id)
                    if(division_unit?.division_id === 1){
                        designationName = division_unit?.unit_name
                    }
                }))
                
                const employeeResponse = employee.toJSON()

                employeeResponse.department = departmentName ? departmentName : null
                employeeResponse.designation = designationName ? designationName : null
                employeeResponse.asset = assignedAsset
                employeeResponse.scope = scope.permissions


                const response = generateResponse(200, true, "Data fetched Succesfully!", employeeResponse)

                res.status(200).json(response)

            }else{
                next(notFound("No Employee with that id!"))
            }

        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    const changeStatus = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.params

            const employee = await User.findByPk(id)

            if(!employee){
                next(badRequest("Employee with that id doesn't exist"))
            }

            employee.status = !employee.status

            await employee?.save()

            const response = generateResponse(200, true, "Status changed succesfully!")

            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong"))
        }
    }

    const getPunchDetails = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials

            const employee = await User.findByPk(id)

            const masterPolicy = await getMasterPolicy(id)

			const attendancePolicy = await AttendancePolicy.findByPk(
				masterPolicy.attendance_policy_id
			);

			const shiftPolicy = await ShiftPolicy.findByPk(
				masterPolicy.shift_policy_id
			);

            const todayDate = moment().format('YYYY-MM-DD')

            const attendanceRecord = await Attendance.findOne({
                where: {
                    user_id: id,
                    date: new Date(todayDate)
                }
            })


            let total_working_hours
            

            if(shiftPolicy?.shift_type_id == 1){
                const shift_start_time = shiftPolicy?.shift_start_time
                const shift_end_time = shiftPolicy?.shift_end_time

                const shiftStartDateTime = moment(shift_start_time, 'HH:mm:ss');
                const shiftEndDateTime = moment(shift_end_time, 'HH:mm:ss');
                
                const workingHours = moment.duration(shiftEndDateTime.diff(shiftStartDateTime));

                const totalHours = workingHours.hours() + workingHours.minutes() / 60;

                total_working_hours = totalHours
            }else{
                const totalWorkingHours = shiftPolicy?.base_working_hours / 60

                total_working_hours = totalWorkingHours
            }

            const lastPunchRecord = await Attendance.findOne({
                where:{
                    user_id: id,
                    punch_out_time: {
                        [Op.ne]: null,
                    },
                },
                order: [['id', 'DESC']],
                limit: 1
            })

            let punch_location;

            if(lastPunchRecord){

                const punch_location = await PunchLocation.findOne({
                    where: {
                        attendance_log_id: lastPunchRecord?.id
                    },
                    order: [["punch_time", "DESC"]]
                })
            }

            const responseBody = {
                punch_in_time: attendanceRecord?.punch_in_time? attendanceRecord?.punch_in_time : null,
                // last_punch_out: lastPunchRecord?.punch_out_time && lastPunchRecord?.date ? ` ${lastPunchRecord?.date} ${lastPunchRecord?.punch_out_time}` : null,
                last_punch_out: lastPunchRecord?.punch_out_time && lastPunchRecord?.date ? lastPunchRecord?.punch_out_time : null,
                total_working_hours: total_working_hours,
                punch_location: punch_location? punch_location : null
            }

            const response = generateResponse(200, true, "Data fetched succesfully!", responseBody)

            res.status(200).json(response)

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getLeaveRequests = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.credentials
            const {status} = req.query
            const { page, records, leave_type, day_type, sortBy, sortOrder, month, year } = req.query as { page: string, records: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
    
            const offset = (pageNumber - 1) * recordsPerPage;

            const whereClause = {
                user_id: id
            }

            if(status){
                whereClause.status = status
            }

            if(leave_type){
                whereClause.leave_type_id = leave_type
            }

            if(day_type){
                whereClause.day_type_id = day_type
            }

            let orderOptions = [] as Order[];

            if(sortBy && sortOrder){
                orderOptions.push([sortBy, sortOrder])
            }

            if(month && year){
                whereClause[Op.or] = [
                    {
                        start_date: {
                            [Op.gte]: startOfMonth,
                            [Op.lte]: endOfMonth
                        }
                    }
                ]
            }

            const leaveRecord = await LeaveRecord.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: LeaveType,
                        attributes: ['id', 'leave_type_name']
                    },
                    {
                        model: DayType,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: Approval,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                offset: offset,
                limit: recordsPerPage,
                order: orderOptions
            })

            const totalPages = Math.ceil(leaveRecord.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;



            const meta = {
                totalCount: leaveRecord.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: leaveRecord.rows,
                meta
            }
            const response = generateResponse(200, true, "Data fetched succesfully!", result.data, meta)
            res.status(200).json(response)

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getRegularizationRequests = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials

            const status = req.query.status

            const where = {
                user_id: id
            }

            if(status){
                where.status = status
            }

            const regularizationRequests = await RegularizationRecord.findAll({
                where: where,
                include: [
                    {
                        model: RegularisationStatus,
                    },
                    {
                        model: RegularizationRequestStatus
                    }
                ]
            })

            const response = generateResponse(200, true, "Data fetched succesfully!", regularizationRequests)

            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const approveProfileChangeRequest = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            await sequelize.transaction(async(t) => {

                const {id} = req.credentials

                const requestId = req.params.id

                const manager = await ReportingManagers.findAll({
                    where:{
                        user_id: id
                    }
                })

                const user  = await User.findByPk(id);

                const managerUser = await User.findByPk(manager?.user_id)

                const managerIds = manager.map((item) => item.reporting_role_id)


                const profileChangeRequest = await ProfileChangeRequests.findByPk(requestId);

                const profileChangeRecord = await ProfileChangeRecord.findByPk(profileChangeRequest?.profile_change_record_id)

                const masterPolicy = await getMasterPolicy(profileChangeRecord?.user_id)

                const profileChangeWorkflow = masterPolicy.profile_change_workflow

                const approvalWorkflow = await ApprovalFlow.findByPk(profileChangeWorkflow, 
					{
						include:[
							{
								model: ReportingRole,
								as: 'direct',
								through:{attributes:[]},
								include: [{
									model: ReportingManagers,
								}]
							},
							{
								model: ApprovalFlowType,
							}
						]
					}
				)

                const reportingRoleIds = approvalWorkflow?.direct.map(item => item.id);

				const isManager = managerIds.some(id => reportingRoleIds.includes(id));

                
                if(user && manager && (isManager) && profileChangeRecord){

                    const masterPolicy = await getMasterPolicy(profileChangeRecord?.user_id)

					const profileChangeWorkflow = masterPolicy.profile_change_workflow

					const approvalWorkflow = await ApprovalFlow.findByPk(profileChangeWorkflow)

                    if(approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1){ //Parallel Approval Workflow

                        const profileChangeRequest = await ProfileChangeRequests.findAll({
							where: {
								profile_change_record_id: profileChangeRecord?.id,   
							}
						})
                        

                        await Promise.all(
							profileChangeRequest.map(async(request) => {
								const profileChangeRecord = await ProfileChangeRecord.findByPk(request.profile_change_record_id)
								// request.status = regularizationRecord?.request_status
								request.status = 2
								await request.save({transaction: t})
							})   
						)

                        if(profileChangeRecord){
        
                            await profileChangeRecord.update({
                                status: 2
                            }, {transaction: t})
        
                            const changeValues = profileChangeRecord.change

                            console.log(">>>>>>>>>>>>", changeValues)
                            
                            Object.keys(changeValues).map((key) => {
                                if(key === 'section'){
                                    delete changeValues[key]
                                }
                                if(key === 'employee_gender_id'){
                                    changeValues[key] = changeValues[key].id
                                }
                            })
        
                            const user = await User.findByPk(profileChangeRecord?.user_id);
        
                            await user?.update(changeValues, {transaction: t})

                            const approvalManager = await User.findByPk(id)

                            await ProfileChangeRequestHistory.create({
                                profile_change_record_id: profileChangeRecord?.id,
                                user_id: id,
                                action: 'approved',
                                status_before: 1,
                                status_after: 2,
                            }, {transaction: t})
        
                            const notification = await Notification.create({
                                user_id: profileChangeRecord?.user_id,
                                title: 'Profile Change',
                                type: 'profile_change_approval',
                                description: `${approvalManager?.employee_name} has succesfully approved your profile change request`
                            }, {transaction: t})
        
                            await sendNotification(user?.id, notification)

                            let data = {
                                user_id: profileChangeRecord?.user_id,
                                type: 'profile_change_approval',
                                message: `${approvalManager?.employee_name} has succesfully approved your profile change request`,
                                path: 'profile_change_approval',
                                reference_id: profileChangeRecord?.id
                            }

                            console.log("HERE IS THE NOTFICATION PART!!!!")
                            await sendPushNotification(data)
        
                            const response = generateResponse(200, true, "Request approved succesfully!")
        
                            res.status(200).json(response)

                        }
                    }else if(approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2){
                        const profileChangeRequests = await ProfileChangeRequests.findAll({
							where:{
								profile_change_record_id: profileChangeRecord?.id
							}
						})

                        const user = await User.findByPk(profileChangeRecord?.user_id, {
							include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']}, {model: ReportingRole}]}],
							attributes:['id', 'employee_generated_id']
						})

                        const masterPolicy = await getMasterPolicy(id);
    
						const profileChangeWorkflow = masterPolicy.profile_change_workflow;


						const approvalWorkflow = await ApprovalFlow.findByPk(profileChangeWorkflow, 
							{
								include:[
									{
										model: ReportingRole,
										as: 'direct',
										through:{attributes:[]},
										include: [{
											model: ReportingManagers,
										}]
									},
									{
										model: ApprovalFlowType,
									}
								]
							}
						)

                        const reportingManager = user?.Manager as any[]

						console.log("ahdlahsdhasld", approvalWorkflow?.direct)

						const filteredManagers = reportingManager.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id))

						console.log("REPORTING MANAGERS >>>>>",reportingManager)

						console.log("FILTERED MANAGERSSS", filteredManagers)

						// const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));

						// const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority)
		
						const existingRequests = await ProfileChangeRequests.findAll({
							where: {
								profile_change_record_id: profileChangeRecord?.id,
							}
						})

                        if(existingRequests.length > 0){

							const approvedManagerIds = existingRequests.map(request => request.reporting_manager_id);
							const remainingManagers = filteredManagers.filter(manager => !approvedManagerIds.includes(manager.id))

							console.log("REMAINING MANAGERSSSSS", remainingManagers)
							console.log("APPROVEDMANAGERIDSSS", approvedManagerIds)

							if(remainingManagers.length > 0){
								const minPriority = Math.max(...remainingManagers.map(manager => manager.reporting_role.priority));
								const minPriorityManagers = remainingManagers.filter(manager => manager.reporting_role.priority === minPriority);

								console.log("MIN PRIORITYYYYY", minPriority)
								console.log("MIN PRIORITY MANAGERSSSSS", minPriorityManagers)

								for(const manager of minPriorityManagers){
									await ProfileChangeRequests.create({
										profile_change_record_id: profileChangeRecord?.id,
										reporting_manager_id: manager.id,
										status: 1,
										priority: manager.reporting_role.priority
									}, {transaction: t})
								}
								
							}else{
								await profileChangeRecord.update({
									status: 2
								}, {
									where: {
										id: profileChangeRecord?.id
									}
								})

								
                                await profileChangeRecord.update({
                                    status: 2
                                }, {transaction: t})
            
                                const changeValues = profileChangeRecord.change
                                
                                Object.keys(changeValues).map((key) => {
                                    if(key === 'section'){
                                        delete changeValues[key]
                                    }
                                    if(key === 'employee_gender_id'){
                                        changeValues[key] = changeValues[key].id
                                    }
                                })

                                const user = await User.findByPk(profileChangeRecord?.user_id);
                                await user?.update(changeValues, {transaction: t})

                                const approvalManager = await User.findByPk(id)

                                const notification = await Notification.create({
                                    user_id: profileChangeRecord?.user_id,
                                    title: 'Profile Change Request',
                                    type: 'profile_change_creation',
                                    description: `${approvalManager?.employee_name} has approved your profile Change Request`
                                }, {transaction: t})
    
                                await sendNotification(profileChangeRecord?.user_id, notification)


                                let data = {
                                    user_id: profileChangeRecord?.user_id,
                                    type: 'profile_change_approval',
                                    message: `${approvalManager?.employee_name} has succesfully approved your profile change request`,
                                    path: 'profile_change_approval',
                                    reference_id: profileChangeRecord?.id
                                }

                                console.log("HERE IS THE NOTFICATION PART!!!!")
                                await sendPushNotification(data)

                                
							}

                            await ProfileChangeRequestHistory.create({
                                profile_change_record_id: profileChangeRecord?.id,
                                user_id: id,
                                action: 'approved',
                                status_before: 1,
                                status_after: 2,
                            }, {transaction: t})

							await Promise.all(
								existingRequests.map(async(request) => {
									await request.update({
										status: 2
									}, {transaction: t})
								})
							)

							const response = generateResponse(200, true, "Regularization Approved succesfully", profileChangeRequests);
                        	res.status(200).json(response)
                        }
                    }   
                }else{
                    next(badRequest("You're not the authorized user to approve the leave!"))
                }
            })
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const rejectProfileChangeRequest = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            await sequelize.transaction(async(t) => {

                const {id} = req.credentials

                const requestId = req.params.id

                const manager = await ReportingManagers.findOne({
                    where:{
                        user_id: id
                    }
                })

                const managerUser = await User.findByPk(manager?.user_id)

                const user = await User.findByPk(id)

                const profileChangeRequest = await ProfileChangeRequests.findByPk(requestId);

                const profileChangeRecord = await ProfileChangeRecord.findByPk(profileChangeRequest?.profile_change_record_id)
                
                if(user && manager && (profileChangeRequest?.reporting_manager_id === manager.id) && profileChangeRecord){

                    await profileChangeRequest?.update({
                        status: 3,
                    }, {transaction: t})

                    await profileChangeRecord.update({
                        status: 3
                    }, {transaction: t})

                    const user = await User.findByPk(profileChangeRecord?.user_id);

                    const notification = await Notification.create({
                        user_id: profileChangeRecord?.user_id,
                        title: 'Profile Change',
                        type: 'profile_change_rejection',
                        description: `${managerUser?.employee_name} has rejected your profile change request`
                    }, {transaction: t})

                    await sendNotification(user?.id, notification)

                    let data = {
                        user_id: profileChangeRecord?.user_id,
                        type: 'profile_change_rejection',
                        message: `${managerUser?.employee_name} has rejected your profile change request`,
                        path: 'profile_change_rejection',
                        reference_id: profileChangeRecord?.id
                    }

                    await ProfileChangeRequestHistory.create({
                        profile_change_record_id: profileChangeRecord?.id,
                        user_id: id,
                        action: 'rejected',
                        status_before: 1,
                        status_after: 3,
                    }, {transaction: t})

                    await sendPushNotification(data)

                    const response = generateResponse(200, true, "Request rejected succesfully!")

                    res.status(200).json(response)

                }else{
                    next(badRequest("You're not the authorized user to approve the leave!"))
                }
            })

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getProfileChangeRequests = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials
            const { page, records } = req.query as { page: string, records: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }


            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

            const user = await User.findByPk(id)

            const profileChangeRecord = await ProfileChangeRecord.findAndCountAll({
                where: {
                    user_id: id,
                },
                include: [
                    {
                        model: Approval,
                        attributes: ['id', 'name']
                    }
                ],
                offset: offset,
                limit: recordsPerPage
            })

            const totalPages = Math.ceil(profileChangeRecord.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;



            const meta = {
                totalCount: profileChangeRecord.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: profileChangeRecord.rows,
                meta
            }

            const response = generateResponse(200, true, "Data fetched succesfully", result.data, meta)

            res.status(200).json(response)


        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }


    const creditLeaves = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const employeeId = req.params.user_id

            const leave_type_id = req.params.leave_type_id

            const user = await User.findByPk(employeeId)

            const leaveType = await LeaveType.findByPk(leave_type_id)

            const {
                leave_balance
            } = req.body

            if(user){

                await sequelize.transaction(async(t) => {
                    for (const leaveTypeId of Object.keys(leave_balance)){
                    
                        const leaveBalance = await LeaveBalance.findOne({
                            where: {
                                user_id: user.id,
                                leave_type_id: parseInt(leaveTypeId)
                            }
                        })
    
                        await leaveBalance?.update({
                            leave_balance: leave_balance[leaveTypeId]
                        }, {transaction: t})

                    }
                })

                const response = generateResponse(200, true, "Leave balance credited succsfully!")

                res.status(200).json(response)

                // if(leaveType){
                //     const masterPolicy = await getMasterPolicy(employeeId)

                //     const leaveBalance = await LeaveBalance.findOne({
                //         where: {
                //             user_id: employeeId,
                //             leave_type_id: leave_type_id
                //         }
                //     })

                //     if(leaveBalance){
                        
                //         await leaveBalance.update({
                //             leave_balance: leaves
                //         })

                //         const response = generateResponse(200, true, "Leave Balance updated succesfully!", leaveBalance)

                //         res.status(200).json(response)

                //     }else{
                //         const leaveBalance = await LeaveBalance.create({
                //             user_id: employeeId,
                //             leave_type_id: leave_type_id,
                //             leave_balance: leaves
                //         })

                //         const response = generateResponse(200, true, "Leaves credited succesfully!", leaveBalance)
                //         res.status(201).json(response)
                //     }

                // }else{
                //     next(notFound("Cannot find leave type with that id!"))
                // }                

            }else{
                next(notFound("Cannot find employee"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }


    const deleteEmployee = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{
            const {id} = req.params

            const user = await User.findByPk(id)

            if(user){

                await sequelize.transaction(async(t) => {

                    const manager = await ReportingManagers.findAll({
                        where: {
                            user_id: id,
                            deleted_at: null
                        }
                    })

                    if(manager.length > 0){
                        next(forbiddenError('You cannot delete this employee, since it is a reporting manager and have several employees reporting to them, replace this employee as a manager and then delete.'))
                    }

                    await user.destroy({transaction: t})

                    const response = generateResponse(200, true, "Employee deleted succesfully!")
                    res.status(200).json(response)

                })
            }else{
                next(notFound('There is no employee with that id!'))
            }
        }catch(err){
            next(internalServerError('Something went wrong!'))
        }
    }

    const bulkUpload = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const form = formidable();

            const {id} = req.credentials
            const user = await User.findByPk(id)

            form.parse(req, async(err, fields, files) => {
                if(err){
                    console.error('Error parsing form:', err)
                    next(internalServerError("Something went wrong!"))
                    return;
                }

                const csvFile = files.file

                if(!csvFile){
                    next(badRequest('No CSV File uploaded!'))
                }
                let result = [];
                
                csvToJson()
                .fromFile(csvFile[0].filepath)
                .then(async(jsonObj) => {
                    
                    for(const row of jsonObj){
                        const employee_password = generatePassword() as string
                        let roleId;
                        let genderId;

                        const{
                            employee_generated_id,
                            employee_name,
                            date_of_joining,
                            date_of_confirmation,
                            dob_celebrated,
                            dob_adhaar,
                            employee_personal_email,
                            employee_official_email,
                            alternate_contact,
                            phone,
                            role_id,
                            master_policy_id,
                            employee_gender_id
                        } = row

                        if(role_id == 'HR'){
                            roleId = 1
                        }else if (role_id == 'Supervisor'){
                            roleId = 2
                        }else if (role_id == 'Employee'){
                            roleId = 3
                        }

                        if(employee_gender_id == 'Male'){
                            genderId = 1
                        }else if (employee_gender_id == 'Female'){
                            genderId = 2
                        }else if (employee_gender_id == 'Others'){
                            genderId = 3
                        }
                        
                        const responseBody = {
                            employee_generated_id,
                            employee_name,
                            date_of_joining,
                            date_of_confirmation,
                            dob_celebrated,
                            dob_adhaar,
                            employee_personal_email,
                            employee_official_email,
                            alternate_contact,
                            phone,
                            role_id: roleId,
                            employee_password: employee_password,
                            master_policy_id,
                            employee_gender_id: genderId,
                            company_id: user?.company_id,
                        }
    
                        const ifExists = await User.findOne({
                            where: {
                                employee_generated_id: employee_generated_id
                            }
                        })
    
                        if(!ifExists){
                            result.push(responseBody)
                            const credentialData = {
                                email: employee_official_email,
                                subject: "Login Credentials for HRMS",
                                html: EmailTemplate.replace("{{ email }}", employee_official_email).replace("{{ password }}", employee_password)
                            }
            
                            await MailSenderService.sendToEmail(employee_official_email, credentialData)
                        }
                    }
                })
                .then(async() => {
                    await User.bulkCreate(result)
                    const response = generateResponse(200, true, "Employees uploaded succesfully!")
                    res.status(200).json(response)
                })

            })
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const employeeStatistics = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.params

            const user = await User.findByPk(id)

            if(user){

                const masterPolicy = await getMasterPolicy(id)
                const shiftPolicy = await ShiftPolicy.findByPk(masterPolicy?.shift_policy_id)
                
                let baseWorkingHours;
                let hoursInAWeek;
                let hoursInAMonth;
                let currentMonth = moment().get('months') + 1
                let overtimeHoursInAMonth;

                const month = moment().get('month')
                const year = moment().get('year')
                
                const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
                const endDate = moment(startDate).endOf('month').toDate();

                if(shiftPolicy?.shift_type_id == 1){
                    const shift_start_time = moment(shiftPolicy?.shift_start_time, 'HH:mm').set({seconds: 0, milliseconds: 0})
                    const shift_end_time = moment(shiftPolicy?.shift_end_time, 'HH:mm').set({seconds: 0, milliseconds: 0})
                    baseWorkingHours = moment.duration(shift_end_time.diff(shift_start_time)).asHours()
                }else{
                    baseWorkingHours = shiftPolicy?.base_working_hours
                }

                const workingDaysInAMonth = await getWorkingDaysInAMonth(masterPolicy?.weekly_off_policy_id)          
                const workingDaysInAWeek = await getTotalWorkingDaysInCurrentWeek(masterPolicy?.weekly_off_policy_id)   
                
                hoursInAWeek = workingDaysInAWeek * baseWorkingHours
                hoursInAMonth = workingDaysInAMonth * baseWorkingHours

                const totalWorkingHoursForAMonth = await getTotalCompletedHoursForMonth(year, currentMonth, user?.id)
                const totalWorkingHoursForAWeek = await getTotalCompletedHoursForWeek(year, currentMonth, user?.id)
                
                const attendanceLogs = await Attendance.findAll({
                    where: {
                        user_id: id,
                        date: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                })

                const todayPunchInTime = await Attendance.findOne({
                    where: {
                        date: moment().toDate(),
                        user_id: id
                    }
                })

                

                overtimeHoursInAMonth = await calcualteOvertimeHours(attendanceLogs, hoursInAMonth)

                const responseBody = {
                    month: {
                        total_working_hours: hoursInAMonth.toFixed(2),
                        hours_worked: totalWorkingHoursForAMonth.toFixed(2),
                        overtime_hours: overtimeHoursInAMonth.toFixed(2)
                    },
                    week: {
                        total_working_hours: hoursInAWeek.toFixed(2),
                        hours_worked: totalWorkingHoursForAWeek.toFixed(2)
                    },
                    today: {
                        total_working_hours: baseWorkingHours,
                        punch_in_time: todayPunchInTime? todayPunchInTime.punch_in_time : null
                    }
                }

                const response = generateResponse(200, true, "Data fetched succefully!", responseBody)
                res.status(200).json(response)

            }else{
                next(notFound("Cannot find an employee with that id!"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError('Something went wrong!'))
        }
    }


    const wishEmployeeBirthday = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const {id} = req.params

            const user = await User.findByPk(id, {
                include: [
                    {model: ProfileImages}
                ]
            })


            if(user){
                const allActiveEmployees = await User.findAll({
                    where: {
                        status: true
                    },
                    attributes:['id', 'employee_official_email']
                })
    
                const ccEmail = allActiveEmployees.filter(email => email.employee_official_email !== user.employee_official_email).map(email => email.employee_official_email)  

                const image = appUrl + user?.profile_image?.public_url

                const imageRes = await axios.get(image, { responseType: 'arraybuffer'})
                const imageData = Buffer.from(imageRes.data).toString('base64')
    
                const emailData = {
                    email: user?.employee_official_email,
                    subject: `Happy Birthday ${user?.employee_name}`,
                    html: BirthdayTemplate.replace("{{Username}}", user?.employee_name),
                    // cc: ccEmail,
                    attachments: [
                        {
                            content: imageAttachment,
                            filename: 'image.png',
                            type: 'image/png',
                            disposition: 'inline',
                            content_id: 'birthdayBanner' // same cid value as in the HTML img src
                        },
                        {
                            content: imageData,
                            filename: 'profile.png',
                            type: 'image/png',
                            disposition: 'inline',
                            content_id: 'profileImage'
                        }
                    ]
                }
                const mailRes = MailSenderService.sendToEmail(user?.employee_official_email, emailData)

                const response = generateResponse(200, true, "Mail sent succesfully!")
                res.status(200).json(response)

            }else{
                next(notFound("No employee with that id!"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const wishEmployeeAnniversary = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const {id} = req.params

            const user = await User.findByPk(id)

            if(user){
                const emailData = {
                    email: user?.employee_official_email,
                    subject: `Happy Work Anniversary ${user?.employee_name}`,
                    html: AnniversaryTemplate.replace("{{Username}}", user?.employee_name),
                    attachment: [{
                        filename: 'image.png',
                        path: 'src/assets/birthday-banner.png',
                        cid: 'birthdayBanner' // same cid value as in the HTML img src
                    }]
                }
                const mailRes = MailSenderService.sendToEmail(user?.employee_official_email, emailData)

                const response = generateResponse(200, true, "Mail sent succesfully!")
                res.status(200).json(response)

            }else{
                next(notFound("No employee with that id found!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }
  
    return { 
        create, 
        getAll, 
        getById, 
        destroy, 
        update, 
        updateProfile, 
        dropdown, 
        getAllDropdown, 
        getProfile, 
        changeStatus, 
        getPunchDetails, 
        getLeaveRequests, 
        getRegularizationRequests, 
        approveProfileChangeRequest, 
        rejectProfileChangeRequest, 
        getProfileChangeRequests, 
        creditLeaves, 
        deleteEmployee,
        bulkUpload,
        employeeStatistics,
        wishEmployeeBirthday,
        wishEmployeeAnniversary
    }

}
