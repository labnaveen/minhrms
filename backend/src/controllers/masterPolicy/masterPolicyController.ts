import { NextFunction, Request, Response } from "express";
import { Model, Op } from 'sequelize'
import { MasterController } from "../masterController";
import { Attendance, LeaveBalance, LeaveType, User } from "../../models";
import MasterPolicy from "../../models/masterPolicy";
import AttendancePolicy from "../../models/attendancePolicy";
import { generateResponse } from "../../services/response/response";
import ApprovalFlow from "../../models/approvalFlow";
import { sequelize } from "../../utilities/db";
import { internalServerError } from "../../services/error/InternalServerError";
import MasterPolicyLeavePolicy from "../../models/masterPolicyLeavePolicy";
import LeaveTypePolicy from "../../models/leaveTypePolicy";
import { badRequest } from "../../services/error/BadRequest";
import { forbiddenError } from "../../services/error/Forbidden";
import { notFound } from "../../services/error/NotFound";


export type MasterPolicyControllerAttributes = {
    id: number,
    policy_name: string,
    policy_description: string,
    attendance_policy_id: number,
    base_leave_configuration_id: number,
    shift_policy_id: number,
    leave_workflow: number,
    attendance_workflow: number,
    weekly_off_policy_id: number,
    holiday_calendar_id: number,
    expense_workflow: number,
    is_deleted: boolean,
    created_at: Date,
    updated_at: Date
}

type MasterPolicyCreationAttributes = Omit<MasterPolicyControllerAttributes, 'id'>;

type MasterPolicyModel = Model<MasterPolicyControllerAttributes, MasterPolicyControllerAttributes>;

type MasterPolicyController = MasterController<MasterPolicyModel> & {
  create:(req: Request, res:Response, next: NextFunction) => Promise<void>;
  getAll:(req: Request, res: Response, next: NextFunction) => Promise<void>;
  getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const MasterPolicyController= (
    model: typeof Model & {
        new (): User;
    }
):MasterPolicyController => {

    const {getAllDropdown} = MasterController<Attendance>(model);


    const create = async(req: Request, res: Response, next: NextFunction) => {
        try{
            const { 
                policy_name, 
                policy_description, 
                attendance_policy_id, 
                base_leave_configuration_id, 
                attendance_workflow_id, 
                leave_workflow_id, 
                shift_policy_id,
                weekly_off_policy_id,
                holiday_calendar_id,
                expense_workflow_id,
                leave_type_policies,
                profile_change_workflow_id
            } = req.body

            const existingPolicy = await MasterPolicy.findOne({
                where: {
                    policy_name: policy_name
                }
            })

            if(existingPolicy){
                next(badRequest("A master policy with that name already exists!"))
            }else{
                await sequelize.transaction(async(t) => {
        
                    const formData = {
                    policy_name,
                    policy_description,
                    attendance_policy_id,
                    base_leave_configuration_id,
                    attendance_workflow: attendance_workflow_id,
                    leave_workflow: leave_workflow_id,
                    shift_policy_id,
                    weekly_off_policy_id,
                    holiday_calendar_id,
                    expense_workflow: expense_workflow_id,
                    profile_change_workflow: profile_change_workflow_id
                    }     

                    const masterPolicy = await MasterPolicy.create(formData, {transaction: t}) as any;

                    
                    if(leave_type_policies){
                        await Promise.all(
                            
                            leave_type_policies.map(async(id : string | number) => {
                                if(typeof id !== 'number'){
                                    throw new Error('Invalid id in leave_type_policies array');
                                }

                                const leaveTypePolicy = await LeaveTypePolicy.findByPk(id) as any;
                                
                                await MasterPolicyLeavePolicy.create({
                                    master_policy_id: masterPolicy.id,
                                    leave_type_id: leaveTypePolicy?.leave_type_id,
                                    leave_type_policy_id: id
                                }, {transaction: t})
                            })
                        )
                    }

                    const response = generateResponse(201, true, "Master Policy Succesfully Generated!", masterPolicy)
                    res.status(201).json(response)
                })
            }
            
        }
        catch(err){
            // next(internalServerError("Something went wrong!"))
            res.status(500).json(err)
        }
    }

    const getAll = async(req: Request, res: Response, next: NextFunction) => {
        try{

            const { page, records, search_term, sortBy, sortOrder } = req.query as { page: string, records: string, search_term: string, sortBy: string, sortOrder: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            let orderOptions = [] as any[]
            let whereOptions = {} as any

            if(search_term){
                whereOptions.policy_name = {
                    [Op.like]: `%${search_term}%`
                }
            }

            if(sortBy && sortOrder){
                orderOptions.push([sortBy, sortOrder])
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;


            const masterPolicy = await MasterPolicy.findAndCountAll({
                where: whereOptions,
                include:[
                    {
                        model: AttendancePolicy
                    },
                    {
                        model: ApprovalFlow,
                        as: 'attendanceWorkflow'
                    },
                    {
                        model: ApprovalFlow,
                        as: 'leaveWorkflow'
                    },
                    {
                        model: LeaveTypePolicy,
                        as: 'LeaveTypePolicies',
                        attributes:['id', 'leave_policy_name', 'description'],
                        include:[{model: LeaveType, attributes:['id', 'leave_type_name']}],
                        through:{
                            attributes: []
                        }
                    },
                ],
                limit: recordsPerPage,
                offset: offset,
                order: orderOptions
            })   

            const totalPages = Math.ceil(masterPolicy.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;



            const meta = {
                totalCount: masterPolicy.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const response = generateResponse(200, true, "Data fetched succesfully!", masterPolicy.rows, meta)

            return res.status(200).json(response)
        }
        catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    }
    

    const getById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.params

            const masterPolicy = await MasterPolicy.findByPk(id, {
                include:[
                    {
                        model: AttendancePolicy
                    },
                    {
                        model: ApprovalFlow,
                        as: 'attendanceWorkflow'
                    },
                    {
                        model: ApprovalFlow,
                        as: 'leaveWorkflow'
                    },
                    {
                        model: LeaveTypePolicy,
                        as: 'LeaveTypePolicies',
                        attributes:['id', 'leave_policy_name', 'description'],
                        include:[{model: LeaveType, attributes:['id', 'leave_type_name']}],
                        through:{
                            attributes: []
                        }
                    },
                ],
            })

            const response = generateResponse(200, true, "Data fetched succesfully!", masterPolicy)

            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }


    const destroy = async(req: Request, res:Response, next: NextFunction):Promise<void> => {
        try{

            await sequelize.transaction(async(t) => {
                const {id} = req.params

                const masterPolicy = await MasterPolicy.findByPk(id, {
                    include:[
                        {model: User, attributes: ['id', 'employee_name']}
                    ]
                }) as any;


                if(masterPolicy?.users.length > 0){
                    next(forbiddenError("This policy is already assigned to users, you cannot delete this!"))
                }else{
                    const leaveTypePolicies = await MasterPolicyLeavePolicy.findAll({
                        where: {
                            master_policy_id: id
                        }
                    })

                    if(leaveTypePolicies.length > 0){
                        await MasterPolicyLeavePolicy.destroy({
                            where:{
                                master_policy_id: id
                            },
                            transaction: t
                        })
                    }

                    await masterPolicy?.destroy({transaction: t})

                    const response = generateResponse(200, true, "Master Policy deleted succesfully!")
                    res.status(200).json(response)
                }
            })
            

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.params

            const masterPolicy = await MasterPolicy.findByPk(id)

            const { 
                policy_name, 
                policy_description, 
                attendance_policy_id, 
                base_leave_configuration_id, 
                attendance_workflow_id, 
                leave_workflow_id, 
                shift_policy_id,
                weekly_off_policy_id,
                holiday_calendar_id,
                expense_workflow_id,
                leave_type_policies,
                profile_change_workflow_id
            } = req.body

            const existingMasterPolicy = await MasterPolicy.findOne({
                where: {
                    policy_name: policy_name,
                    id: {
                        [Op.not]: id
                    }
                }
            })


            if(existingMasterPolicy){
                next(badRequest("A master policy with that name already exists!"))
            }else{
                if(masterPolicy){
                    await sequelize.transaction(async(t) => {
                        const formData = {
                            policy_name,
                            policy_description,
                            attendance_policy_id,
                            base_leave_configuration_id,
                            attendance_workflow: attendance_workflow_id,
                            leave_workflow: leave_workflow_id,
                            shift_policy_id,
                            weekly_off_policy_id,
                            holiday_calendar_id,
                            expense_workflow: expense_workflow_id,
                            profile_change_workflow: profile_change_workflow_id
                        }    
        
        
                        if(req.body.leave_type_policies){
                            await MasterPolicyLeavePolicy.destroy({
                                where: {
                                    master_policy_id: id
                                },
                                transaction: t,
                                logging: false
                            })

                            const users = await User.findAll({
                                where: {
                                    master_policy_id: id
                                }
                            }) as any;

                            let leaveTypes = []

                            for(const policy of leave_type_policies){
                                const leaveTypePolicy = await LeaveTypePolicy.findByPk(policy) as any;
                                if(leaveTypePolicy){
                                    leaveTypes.push(leaveTypePolicy?.leave_type_id)
                                }
                            }

                            for(const user of users){

                                await LeaveBalance.destroy({
                                    where: {
                                        user_id: user.id,
                                        leave_type_id:{
                                            [Op.not]: leaveTypes
                                        }
                                    },
                                    transaction: t
                                })

                                for(const policy of leave_type_policies){
                                    const leaveTypePolicy = await LeaveTypePolicy.findByPk(policy) as any;
                                    const isIncluded = await LeaveBalance.findOne({
                                        where: {
                                            user_id: user?.id,
                                            leave_type_id: leaveTypePolicy?.leave_type_id
                                        },
                                        paranoid: true
                                    })
                                    console.log(">>>>>>>>>>>>>", isIncluded)
                                    if(leaveTypePolicy && !isIncluded){
                                        await LeaveBalance.create({
                                            user_id: user?.id,
                                            leave_type_id: leaveTypePolicy.leave_type_id,
                                            leave_balance: 0,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        }, {transaction: t})
                                        console.log("CREATED!!!")
                                    }

                                }
                            }
        
                            for(const leaveTypePolicyId of leave_type_policies){
                                if(typeof leaveTypePolicyId !== 'number'){
                                    throw new Error('Invalid id in leave type policies array');
                                }
        
                                const leaveTypePolicy = await LeaveTypePolicy.findByPk(leaveTypePolicyId) as any;
                                                
                                await MasterPolicyLeavePolicy.create({
                                    master_policy_id: id,
                                    leave_type_id: leaveTypePolicy?.leave_type_id,
                                    leave_type_policy_id: leaveTypePolicyId
                                }, {transaction: t})
                            }
                        }


        
                        await masterPolicy?.update(formData, {transaction: t})
        
                        const response = generateResponse(200, true, "Master Policy updated succesfully!")
        
                        res.status(200).json(response)
                    })
                }else{
                    next(notFound("Cannot find master policy with that id!"))
                }
            }

            
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }


    return{ 
        //@ts-ignore
        getAll, 
        getById, 
        destroy, 
        create, 
        update, 
        getAllDropdown 
    }
}