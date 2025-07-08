//@ts-nocheck
import {  Model, Op } from "sequelize";
import { IMasterControllerOptions, MasterController } from "../masterController";
import { NextFunction, Request, Response } from "express";
import { sequelize } from "../../utilities/db";
import ApprovalFlow from "../../models/approvalFlow";
import ApprovalFlowReportingRole from "../../models/approvalFlowReportingRole";
import { generateResponse } from "../../services/response/response";
import ReportingRole from "../../models/reportingRole";
import ApprovalFlowSupervisorIndirect from "../../models/approvalFlowSupervisorIndirect";
import User from "../../models/user";
import MasterPolicy from "../../models/masterPolicy";
import { conflict } from "../../services/error/Conflict";
import { badRequest } from "../../services/error/BadRequest";
import { internalServerError } from "../../services/error/InternalServerError";
import ApprovalFlowType from "../../models/dropdown/type/approvalFlowType";



//Types for Leave Balance 
type ApprovalFlowAttributes = {
    id: number,
    name: string,
    description: string,
    approval_flow_type_id: number,
    confirm_by_both_direct_undirect: boolean,
    confirmation_by_all: boolean,
}

type ApprovalFlowCreationAttributes = Omit<ApprovalFlowAttributes, 'id'>;

type ApprovalFlowModel = Model<ApprovalFlowAttributes, ApprovalFlowCreationAttributes>;

type ApprovalFlowController = MasterController<ApprovalFlowModel> & {
    create: (req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
}



export const ApprovalFlowController = (
    model: typeof Model & {
        new(): ApprovalFlowModel
    }
):ApprovalFlowController => {

    const {getAllDropdown} = MasterController<ApprovalFlowModel>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials

            const {page, records, search_term, sortBy, sortOrder} = req.query as {page: string, records: string, search_term: string, sortBy: string, sortOrder: string}


            if (!page && !records) {
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

            let whereOptions = {}

            if(search_term){
                whereOptions.name ={
                    [Op.like]: `%${search_term}%`
                }
            }

            const orderOptions = []

            if(sortBy && sortOrder){
                if(sortBy === 'flow_name'){
                    orderOptions.push(['name', sortOrder])
                }
            }

            const data = await ApprovalFlow.findAndCountAll({
                where: whereOptions,
                include: [
                    {model: ApprovalFlowType }
                ],
                offset: offset,
                limit: recordsPerPage,
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
            next(internalServerError('Something went wrong!'))
        }
    }


    const create = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            await sequelize.transaction(async(t) => {
                const {name, description, approval_flow_type_id, confirm_by_both_direct_undirect, confirmation_by_all, confirmation_by_all_direct, confirmation_by_all_indirect, direct_reporting_manager_id, indirect_reporting_manager_id} = req.body

                const formBody = {
                    name,
                    description,
                    approval_flow_type_id,
                    confirm_by_both_direct_undirect,
                    confirmation_by_all,
                    confirmation_by_all_direct,
                    confirmation_by_all_indirect
                }

                const existingApprovalFlow = await ApprovalFlow.findOne({
                    where: {
                        name: name  
                    }
                })

                if(existingApprovalFlow){
                    next(badRequest("An approval flow with the same already exists!"))
                }


                let approvalFlowResponse = await ApprovalFlow.create(formBody, {transaction: t})


                if(direct_reporting_manager_id && direct_reporting_manager_id.length>0){
                    await Promise.all(
                        direct_reporting_manager_id.map(async(id) => {
                            console.log(approvalFlowResponse.id)
                            if(typeof id !== 'number'){
                                throw new Error('Invalid id in direct_reporting_manager_id array');
                            }
                            await ApprovalFlowReportingRole.create({
                                approval_flow_id: approvalFlowResponse.id,
                                reporting_role_id: id
                            }, {transaction: t})
                        })
                    )
                }

                if(indirect_reporting_manager_id && indirect_reporting_manager_id.length > 0){
                    await Promise.all(
                        indirect_reporting_manager_id.map(async(id) => {
                            if(typeof id !== 'number'){
                                throw new Error('Invalid id in indirect_reporting_manager_id array')
                            }
                            await ApprovalFlowSupervisorIndirect.create({
                                approval_flow_id: approvalFlowResponse.id,
                                supervisor_role_id: id
                            }, {transaction: t})
                        })
                    )
                }

                const response = generateResponse(201, true,  "Approval Flow Created Succesfully!", approvalFlowResponse)

                res.status(201).json(response)
            })
        }catch(err){
            res.status(500).json(err)
            // console.log(err)
            // next(internalServerError("Something went wrong!"))
        }

    }


    const getById = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try{
            const {id} = req.params

            const approvalFlow = await ApprovalFlow.findByPk(id, {
                include: [
                    {model: ReportingRole, as: 'direct', attributes: ['id', 'name', 'priority'], through:{attributes: []}},
                    {model: User, as: 'indirect', attributes: ['id', 'employee_name', 'employee_generated_id'], through: {attributes: []}}
                ]
            })

            const response = generateResponse(200, true, "Approval Flow fetched succesfully!", approvalFlow)

            res.status(200).json(response)

        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            await sequelize.transaction(async(t)=> {
                const {id} = req.params

                const approvalFlow = await ApprovalFlow.findByPk(id, {
                    include: [
                        {model: ReportingRole, as: 'direct', attributes: ['id', 'name', 'priority'], through:{attributes: []}},
                        {model: User, as: 'indirect', attributes: ['id', 'employee_name', 'employee_generated_id'], through: {attributes: []}}
                    ]
                });

                if(approvalFlow.direct.length>0 && approvalFlow.direct){
                    ApprovalFlowReportingRole.destroy({
                        where: {
                            approval_flow_id: approvalFlow.id
                        }
                    }, {transaction: t});
                }

                if(approvalFlow.indirect && approvalFlow.indirect.length > 0){
                    ApprovalFlowSupervisorIndirect.destroy({
                        where:{
                            approval_flow_id: approvalFlow.id
                        }
                    }, {transaction: t});
                }


                const {name, description, approval_flow_type_id, confirm_by_both_direct_undirect, confirmation_by_all, confirmation_by_all_direct, confirmation_by_all_indirect,  direct_reporting_manager_id, indirect_reporting_manager_id} = req.body

                const formBody = {
                    name,
                    description,
                    approval_flow_type_id,
                    confirm_by_both_direct_undirect,
                    confirmation_by_all,
                    confirmation_by_all_direct,
                    confirmation_by_all_indirect
                }

                const existingApprovalFlow = await ApprovalFlow.findOne({
                    where: {
                        name: name,
                        id: {
                            [Op.not]: id
                        }
                    }
                })

                if(existingApprovalFlow){
                    next(badRequest("A approval flow with that name already exists!"))
                }

                if(!existingApprovalFlow){
                    const approvalFlowResponse = await approvalFlow?.update(formBody, {transaction: t})
                
                    if(direct_reporting_manager_id && direct_reporting_manager_id.length>0){
                        await Promise.all(
                            direct_reporting_manager_id.map(async(id) => {
                                console.log(approvalFlowResponse.id)
                                if(typeof id !== 'number'){
                                    throw new Error('Invalid id in direct_reporting_manager_id array');
                                }
                                await ApprovalFlowReportingRole.create({
                                    approval_flow_id: approvalFlowResponse.id,
                                    reporting_role_id: id
                                }, {transaction: t})
                            })
                        )
                    }

                    if(indirect_reporting_manager_id && indirect_reporting_manager_id.length > 0){
                        await Promise.all(
                            indirect_reporting_manager_id.map(async(id) => {
                                if(typeof id !== 'number'){
                                    throw new Error('Invalid id in indirect_reporting_manager_id array')
                                }
                                await ApprovalFlowSupervisorIndirect.create({
                                    approval_flow_id: approvalFlowResponse.id,
                                    supervisor_role_id: id
                                }, {transaction: t})
                            })
                        )
                    }

                    const response = generateResponse(200, true,  "Approval Flow Updated Succesfully!", approvalFlowResponse)
                    res.status(200).json(response)
                }
            })
        }catch(err){
            console.log(err)
            next(internalServerError('Something went wrong!'))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try{
            const {id} = req.params
            const isReferenced = await MasterPolicy.findOne({
                where:{
                    [Op.or]: [{attendance_workflow: id}, {leave_workflow: id}]
                }
            })

            if(isReferenced){
                next(conflict("Unable to delete. Policy is already in use."))
            }

            await sequelize.transaction(async(t)=> {
                const approvalFlow = await ApprovalFlow.findByPk(id)

                console.log("APPROVAL FLOW>>>>>>>>", approvalFlow)

                // if(approvalFlow?.direct.length>0 && approvalFlow?.direct){
                    ApprovalFlowReportingRole.destroy({
                        where: {
                            approval_flow_id: approvalFlow.id
                        },
                        transaction: t
                    });
                // }

                // if(approvalFlow?.indirect && approvalFlow?.indirect.length > 0){
                    ApprovalFlowSupervisorIndirect.destroy({
                        where:{
                            approval_flow_id: approvalFlow.id
                        },
                        transaction: t
                    });
                // }


                await ApprovalFlow.destroy({
                    where: {
                        id: id
                    },
                    transaction: t
                })

                const response = generateResponse(200, true, "Approval Flow succesfully Deleted!")

                res.status(200).json(response)

            })
            

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }



    
    return { getAll, update, getAllDropdown, getById, create, destroy }
}