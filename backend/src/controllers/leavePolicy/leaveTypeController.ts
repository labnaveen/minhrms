import { NextFunction, Request, Response } from "express";
import {Model, Op} from 'sequelize'
import { MasterController } from "../masterController";
import { LeaveType, User } from "../../models";
import BaseLeaveConfiguration from "../../models/baseLeaveConfiguration";
import { internalServerError } from "../../services/error/InternalServerError";
import MasterPolicy from "../../models/masterPolicy";
import LeaveTypePolicy from "../../models/leaveTypePolicy";
import { MasterPolicyResponse } from "../../interface/masterPolicy";
import { forbiddenError } from "../../services/error/Forbidden";
import { generateResponse } from "../../services/response/response";
import MasterPolicyLeavePolicy from "../../models/masterPolicyLeavePolicy";
import { badRequest } from "../../services/error/BadRequest";
import { notFound } from "../../services/error/NotFound";
import { getMasterPolicy } from "../../services/masterPolicy/getMasterPolicy";

type LeaveTypeAttributes = {
    id: number,
    policy_name: string,
    policy_description: string,
    leave_calendar_from: number, 
    leave_request_status: boolean,
    leave_balance_status: boolean,
    contact_number_allowed: boolean,
    contact_number_mandatory: boolean,
    reason_for_leave: boolean,
    reason_for_leave_mandatory: boolean,
    notify_peer: boolean,
    leave_rejection_reason: boolean
}

type LeaveTypeCreationAttributes = Omit<LeaveTypeAttributes, 'id'>;

type LeaveTypeModel = Model<LeaveTypeAttributes, LeaveTypeCreationAttributes>;

type LeaveTypeController = MasterController<LeaveTypeModel> & {
    create:(req: Request, res:Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    dropdownForEmployees: (req: Request, res: Response, next:NextFunction) => Promise<void>;
}

export const LeaveTypeController= (
    model: typeof Model & {
        new (): User;
    }
):LeaveTypeController => {

    const {getById, getAllDropdown} = MasterController<LeaveType>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const{page, records, search_term, sortBy, sortOrder} = req.query as {page: string, records: string, search_term: string, sortBy: string, sortOrder: string}

            if (!page && !records) {
                next(badRequest("No request parameters are present!"))
                return
            }
    
    
            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
    
            const offset = (pageNumber - 1) * recordsPerPage;


            let orderOptions = [] as any[]
            let whereOptions = {} as any;

            if(sortBy && sortOrder){
                if(sortBy === 'leave_type_name'){
                    orderOptions.push(['leave_type_name', sortOrder])
                }
            }

            if(search_term){
                whereOptions.leave_type_name = {
                    [Op.like]: `%${search_term}%`
                }
            }


            const data = await LeaveType.findAndCountAll({
                where: whereOptions,
                include: [
                    {model: LeaveTypePolicy}
                ],
                limit: recordsPerPage,
                offset: offset,
                order: orderOptions
            })

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

            const response = generateResponse(200, true, "Data fetched succesfully!", data.rows, meta)
            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }


    const create = async(req: Request, res: Response, next: NextFunction) => {
        try{
            const {
                leave_type_name, 
                negative_balance, 
                max_leave_allowed_in_negative_balance, 
                max_days_per_leave, 
                max_days_per_month, 
                allow_half_days, 
                application_on_holidays, 
                restriction_for_application, 
                limit_back_dated_application, 
                notice_for_application, 
                auto_approval, 
                auto_action_after, 
                auto_approval_action, 
                supporting_document_mandatory, 
                prorated_accrural_first_month, 
                prorated_rounding, 
                prorated_rounding_factor, 
                encashment_yearly, 
                max_leaves_for_encashment, 
                carry_forward_yearly, 
                carry_forward_rounding, 
                carry_forward_rounding_factor, 
                intra_cycle_carry_forward, 
                prefix_postfix_weekly_off_sandwhich_rule, 
                prefix_postfix_holiday_sandwhich_rule, 
                inbetween_weekly_off_sandwhich_rule,
                leave_application_after
            } = req.body

            const existingLeaveType = await LeaveType.findOne({
                where: {
                    leave_type_name: leave_type_name
                }
            })


            if(existingLeaveType){
               return next(badRequest("A leave with that name already exists!"))
            }

            const formData = {
                leave_type_name, 
                negative_balance, 
                max_leave_allowed_in_negative_balance, 
                max_days_per_leave, 
                max_days_per_month, 
                allow_half_days, 
                application_on_holidays, 
                restriction_for_application, 
                limit_back_dated_application, 
                notice_for_application, 
                auto_approval, 
                auto_action_after, 
                auto_approval_action, 
                supporting_document_mandatory, 
                prorated_accrural_first_month, 
                prorated_rounding, 
                prorated_rounding_factor, 
                encashment_yearly, 
                max_leaves_for_encashment, 
                carry_forward_yearly, 
                carry_forward_rounding, 
                carry_forward_rounding_factor, 
                intra_cycle_carry_forward, 
                prefix_postfix_weekly_off_sandwhich_rule, 
                prefix_postfix_holiday_sandwhich_rule, 
                inbetween_weekly_off_sandwhich_rule,
                leave_application_after
            }
            
            const leaveType = await LeaveType.create(formData)
            res.status(201).json(leaveType)
        }
        catch(err){
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction) => {
        try{
            const {id} = req.params

            const leaveType = await LeaveType.findByPk(id)

            if(leaveType){

                const existingLeaveType = await LeaveType.findOne({
                    where: {
                        leave_type_name: req.body.leave_type_name,
                        id: {
                            [Op.not] : id
                        }
                    }
                })

                if(existingLeaveType){
                    next(badRequest('A leave type with that name already exists!'))
                }else{
                    const updatedLeaveType = leaveType.update(req.body)

                    const response = generateResponse(200, true, "Data updated succesfully!", updatedLeaveType)
                    res.status(200).json(response)
                }
            }else{
                next(notFound("There is no leave type with that id!"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const leaveTypeId = req.params.id

            const leaveType = await LeaveType.findByPk(leaveTypeId);

            const existing = await MasterPolicyLeavePolicy.findAll({
                where: {
                    leave_type_id: leaveTypeId
                }
            })

            if(existing.length > 0){
                next(forbiddenError("Cannot delete. This leave type is already has a policy assigned to in the master policy."))
            }else{
                await leaveType?.destroy()
                
                const response = generateResponse(200, true, "Leave Type Deleted succesfully!");

                res.status(200).json(response)
            }

        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    /**
     * This is a function for the employees where they'll only see the leave types that have been allotted to them.
     * @param req 
     * @param res 
     * @param next 
     */
    const dropdownForEmployees = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            //@ts-ignore
            const {id} = req.credentials
            const user = await User.findByPk(id)

            if(user){

                const masterPolicy = await getMasterPolicy(id) as any;

                const leaveTypes = [];

                for(const leaveType of masterPolicy.LeaveTypePolicies){
                    leaveTypes.push(leaveType.leave_type)    
                }

                console.log(">>>>>>>>>>>>>>>>>>>>>>>", leaveTypes)

                const response = generateResponse(200, true, "Data fetched succesfully!", leaveTypes)
                res.status(200).json(response)

            }else{
                next(notFound("There is no user with that id!"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    
    return{ getAll, getById, update, destroy, create, getAllDropdown, dropdownForEmployees }
}