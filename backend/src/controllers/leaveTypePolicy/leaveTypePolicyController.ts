import {Model, Op} from 'sequelize'
import { MasterController } from "../masterController";
import { LeaveType, User } from "../../models";
import LeaveTypePolicy from "../../models/leaveTypePolicy";
import { NextFunction, Request, Response } from 'express';
import { internalServerError } from '../../services/error/InternalServerError';
import { sequelize } from '../../utilities/db';
import BaseLeaveConfiguration from '../../models/baseLeaveConfiguration';
import LeaveAllocation from '../../models/leaveAllocation';
import { generateResponse } from '../../services/response/response';
import { notFound } from '../../services/error/NotFound';
import MasterPolicyLeavePolicy from '../../models/masterPolicyLeavePolicy';
import { forbiddenError } from '../../services/error/Forbidden';
import { badRequest } from '../../services/error/BadRequest';

type LeaveTypePolicyAttributes = {
    id: number,
    leave_type_id: number,
    leave_policy_name: string,
    description: string,
    accrural_frequency: number,
    accrural_type: number,
    accrural_from: number,
    accrual_from_custom_date: string,
    advance_accrual_for_entire_leave_year: boolean,
    annual_eligibility: number,
    annual_breakup: boolean
}

type LeaveTypePolicyCreationAttributes = Omit<LeaveTypePolicyAttributes, 'id'>;

type LeaveTypePolicyModel = Model<LeaveTypePolicyCreationAttributes, LeaveTypePolicyCreationAttributes>;

type LeaveTypePolicyController = MasterController<LeaveTypePolicyModel> & {
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const LeaveTypePolicyController= (
    model: typeof Model & (new () => LeaveTypePolicy)
):LeaveTypePolicyController => {

    const {getAllDropdown} = MasterController<Model>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const leaveTypeId = req.params.id

            const leaveType = await LeaveType.findByPk(leaveTypeId)

            if(leaveType){
                const{page, records, search_term, sortBy, sortOrder} = req.query as {page: string, records: string, search_term: string, sortBy: string, sortOrder: string}

                if (!page && !records) {
                    next(badRequest("No request parameters are present!"))
                    return
                }
        
        
                const pageNumber = parseInt(page)
                const recordsPerPage = parseInt(records)
        
                const offset = (pageNumber - 1) * recordsPerPage;


                let orderOptions = [] as any[]
                let whereOptions = {
                    leave_type_id: req.params.id
                } as any;

                if(sortBy && sortOrder){
                    if(sortBy === 'leave_policy_name'){
                        orderOptions.push(['leave_policy_name', sortOrder])
                    }
                }

                if(search_term){
                    whereOptions.leave_policy_name = {
                        [Op.like]: `%${search_term}%`
                    }
                }


                const data = await LeaveTypePolicy.findAndCountAll({
                    where: whereOptions,
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
                
            }else{
                next(notFound("Cannot find the leave type with that id!"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const create = async(req: Request, res: Response, next: NextFunction) => {
        try{
            await sequelize.transaction(async(t) => {
                const {
                    leave_type_id, 
                    leave_policy_name, 
                    description, 
                    accrual_frequency, 
                    accrual_type, 
                    accrual_from, 
                    custom_leave_application_date, 
                    advance_accrual_for_entire_leave_year, 
                    annual_eligibility, 
                    annual_breakup, 
                    custom_annual_breakup
                } = req.body
    
                const formData = {
                    leave_type_id, 
                    leave_policy_name, 
                    description, 
                    accrual_frequency, 
                    accrual_type, 
                    accrual_from, 
                    custom_leave_application_date, 
                    advance_accrual_for_entire_leave_year, 
                    annual_eligibility, 
                    annual_breakup, 
                }

                const leaveTypePolicy = await LeaveTypePolicy.create(formData, {transaction: t}) as any;

                const leaveAllocations = Object.entries(custom_annual_breakup).map(([monthNumber, allocatedLeaves]: any[]) => ({
                    leave_type_policy_id: leaveTypePolicy.id,
                    month_number: parseInt(monthNumber, 10),
                    allocated_leaves: parseInt(allocatedLeaves, 10)
                }));

                await LeaveAllocation.bulkCreate(leaveAllocations, {transaction: t});

                const response = generateResponse(201, true, "Leave type policy succesfully created!", leaveTypePolicy)

                res.status(201).json(response)

            })
            
        }
        catch(err){
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    const getById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const leaveTypePolicyId = req.params.id

            const leaveTypePolicy = await LeaveTypePolicy.findByPk(leaveTypePolicyId, {
                include: [
                    {
                        model: LeaveAllocation,
                        as: 'leaveAllocations',
                        attributes:['id', 'month_number', 'allocated_leaves', 'leave_type_policy_id']
                    }
                ]
            });

            if(leaveTypePolicy){
                const response = generateResponse(200, true, "Leave Type Policy fetched succesfully!", leaveTypePolicy)
                res.status(200).json(response)
            }else{
                next(notFound("Cannot find leave type policy with that id"))
            }
            
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const leaveTypePolicyId = req.params.id

            const leaveTypePolicy = await LeaveTypePolicy.findByPk(leaveTypePolicyId);

            if(leaveTypePolicy){
                const existing = await MasterPolicyLeavePolicy.findAll({
                    where: {
                        leave_type_policy_id: leaveTypePolicyId
                    }
                })

                if(existing.length > 0){
                    next(forbiddenError('Cannot delete, this leave policy is assigned to a leave type in master policy'))
                }else{
                    await leaveTypePolicy.destroy()

                    const response = generateResponse(200, true, "Leave Type Policy succesfully deleted!")

                    res.status(200).json(response)
                }
            }else{
                next(notFound("Cannot find a leave Type Policy with that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }


    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const leaveTypePolicyId = req.params.id

            const leaveTypePolicy = await LeaveTypePolicy.findByPk(leaveTypePolicyId) as any;

            if(leaveTypePolicy){
                await sequelize.transaction(async(t) => {
                    const {
                        leave_type_id, 
                        leave_policy_name, 
                        description, 
                        accrual_frequency, 
                        accrual_type, 
                        accrual_from, 
                        custom_leave_application_date, 
                        advance_accrual_for_entire_leave_year, 
                        annual_eligibility, 
                        annual_breakup, 
                        custom_annual_breakup
                    } = req.body
        
                    const formData = {
                        leave_type_id, 
                        leave_policy_name, 
                        description, 
                        accrual_frequency, 
                        accrual_type, 
                        accrual_from, 
                        custom_leave_application_date, 
                        advance_accrual_for_entire_leave_year, 
                        annual_eligibility, 
                        annual_breakup, 
                    }

                    await leaveTypePolicy.update(formData, {transaction: t})

                    await LeaveAllocation.destroy({
                        where: {
                            leave_type_policy_id: leaveTypePolicy.id
                        },
                        transaction: t
                    })

                    const leaveAllocations = Object.entries(custom_annual_breakup).map(([monthNumber, allocatedLeaves]: any[]) => ({
                        leave_type_policy_id: leaveTypePolicy.id,
                        month_number: parseInt(monthNumber, 10),
                        allocated_leaves: parseInt(allocatedLeaves, 10)
                    }));

                    console.log(">>>>>>>", leaveAllocations)

                    await LeaveAllocation.bulkCreate(leaveAllocations, {transaction: t});

                    const response = generateResponse(200, true, "Policy updated succesfully!")
                    res.status(200).json(response)
                    
                })
               
            }else{
                next(notFound("There are not policy with that id"))
            }
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    
    return { create, getAll, getById, update, destroy, getAllDropdown }
}