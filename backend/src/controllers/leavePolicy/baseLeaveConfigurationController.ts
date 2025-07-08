import { NextFunction, Request, Response } from "express";
import {Model, Op} from 'sequelize'
import { IMasterControllerOptions, MasterController } from "../masterController";
import { User } from "../../models";
import BaseLeaveConfiguration from "../../models/baseLeaveConfiguration";
import MasterPolicy from "../../models/masterPolicy";
import { conflict } from "../../services/error/Conflict";
import { generateResponse } from "../../services/response/response";
import { internalServerError } from "../../services/error/InternalServerError";
import { getMasterPolicy } from "../../services/masterPolicy/getMasterPolicy";
import { forbiddenError } from "../../services/error/Forbidden";
import { notFound } from "../../services/error/NotFound";
import { badRequest } from "../../services/error/BadRequest";

type BaseLeaveConfigurationAttributes = {
    id: number,
    policy_name: string,
    policy_description: string,
    leave_calendar_from: number,
    proxy_leave_application: boolean, 
    leave_request_status: boolean,
    leave_balance_status: boolean,
    contact_number_allowed: boolean,
    contact_number_mandatory: boolean,
    reason_for_leave: boolean,
    reason_for_leave_mandatory: boolean,
    notify_peer: boolean,
    notify_peer_mandatory: boolean,
    leave_rejection_reason: boolean
}

type BaseLeaveConfigurationCreationAttributes = Omit<BaseLeaveConfigurationAttributes, 'id'>;

type BaseLeaveConfigurationModel = Model<BaseLeaveConfigurationCreationAttributes, BaseLeaveConfigurationCreationAttributes>;

type BaseLeaveConfigurationController = MasterController<BaseLeaveConfigurationModel> & {
    create:(req: Request, res:Response, next: NextFunction) => Promise<void>;
    baseLeaveConfigurationDelete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAppliedConfiguration: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const BaseLeaveConfigurationController= (
    model: typeof Model & {
        new (): User;
    }
):BaseLeaveConfigurationController => {

    const { getById, update, destroy, getAllDropdown} = MasterController<User>(model);


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
                if(sortBy === 'policy_name'){
                    orderOptions.push(['policy_name', sortOrder])
                }
            }

            if(search_term){
                whereOptions.policy_name = {
                    [Op.like]: `%${search_term}%`
                }
            }


            const data = await BaseLeaveConfiguration.findAndCountAll({
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

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const create = async(req: Request, res: Response, next: NextFunction) => {
        try{
            const {policy_name, policy_description, proxy_leave_application, notify_peer_mandatory, leave_calendar_from, leave_request_status, leave_balance_status, contact_number_allowed, contact_number_mandatory, reason_for_leave, reason_for_leave_mandatory, notify_peer, leave_rejection_reason} = req.body

            const formData = {
                policy_name,
                policy_description,
                leave_calendar_from,
                proxy_leave_application,
                leave_request_status,
                leave_balance_status,
                contact_number_allowed,
                contact_number_mandatory,
                reason_for_leave,
                reason_for_leave_mandatory,
                notify_peer,
                notify_peer_mandatory,
                leave_rejection_reason,
            }

            console.log(formData)

            const baseLeaveConfiguration = await BaseLeaveConfiguration.create(formData)

            const response = generateResponse(201, true, "Base Leave Configuration created succesfully!", baseLeaveConfiguration)

            res.status(201).json(response)
        }
        catch(err){
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }
    async function baseLeaveConfigurationDelete(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> {
        try{
            
            const id = Number(req.params.id)

            const isReferenced = await MasterPolicy.findOne({
                where:{id}
            })

            if(isReferenced){
                next(conflict("Unable to delete. Policy is already in use"))
            }
            
            await BaseLeaveConfiguration.destroy({
                where:{
                    id
                }
            })
            const response = generateResponse(200, true, "Deleted Succesfully!", )
            res.status(200).json(response);

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const getAppliedConfiguration = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            //@ts-ignore
            const {id} = req.credentials

            const employee = await User.findByPk(id)

            const masterPolicy = await getMasterPolicy(id) as any;

            if(employee){
                if(masterPolicy){
                    const baseLeaveConfiguration = await BaseLeaveConfiguration.findByPk(masterPolicy?.base_leave_configuration_id)
                    if(baseLeaveConfiguration){
                        const response = generateResponse(200, true, "Data fetched succesfully!", baseLeaveConfiguration)
                        res.status(200).json(response)
                    }else{
                        next(notFound("No base leave configuration found!"))
                    }
                }else{
                    next(forbiddenError("No Master policy applied to this employee"))
                }
            }else{
                next(notFound("Employee not found!"))
            }            
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }


    
    return{ getAll, getById, update, destroy, create, getAllDropdown, baseLeaveConfigurationDelete, getAppliedConfiguration }
}