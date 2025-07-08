import { NextFunction, Response, Request } from "express";
import { DestroyOptions, FindOptions, Model, Op } from "sequelize";
import { MasterController } from "../masterController";
import { generateResponse } from "../../services/response/response";
import { internalServerError } from "../../services/error/InternalServerError";
import MasterPolicy from "../../models/masterPolicy";
import { conflict } from "../../services/error/Conflict";
import { forbiddenError } from "../../services/error/Forbidden";
import { notFound } from "../../services/error/NotFound";
import ShiftPolicy from "../../models/shiftPolicy";
import { badRequest } from "../../services/error/BadRequest";


//Types for shift policy  
export type ShiftPolicyAttributes = {
    id: number,
    shift_name: string,
    shift_description: string,
    notes_for_punch: boolean,
    allow_single_punch: boolean,
    shift_type_id: number,
    shift_start_time: string,
    shift_end_time:string,
    pre_shift_duration:string,
    post_shift_duration: string,
    consider_breaks:boolean,
    break_duration: string,
    break_start_time: string,
    break_end_time: string,
    enable_grace: boolean,
    grace_duration_allowed: string,
    number_of_days_grace_allowed:string,
    status_grace_exceeded: number,
    enable_grace_recurring: boolean,
    enable_flex: boolean,
    flex_start_time: string,
    flexi_duration_allowed: string
    number_of_days_flexi_allowed: string,
    status_flexi_exceeded: boolean,
    exceeded_flexi_time_limit: string,
    enable_flex_recurring: boolean,
    base_working_hours: number
}

type ShiftPolicyCreationAttributes = Omit<ShiftPolicyAttributes, 'id'>;

type ShiftPolicyModel = Model<ShiftPolicyAttributes, ShiftPolicyCreationAttributes>;

type ShiftPolicyController = MasterController<ShiftPolicyModel> & {
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}



export const ShiftPolicyController = (
    model: typeof Model & {
        new(): ShiftPolicyModel
    }
):ShiftPolicyController => {

    const { create, update, getAllDropdown, getById } = MasterController<ShiftPolicyModel>(model);

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
                if(sortBy === 'shift_name'){
                    orderOptions.push(['shift_name', sortOrder])
                }
            }

            if(search_term){
                whereOptions.shift_name = {
                    [Op.like]: `%${search_term}%`
                }
            }


            const data = await ShiftPolicy.findAndCountAll({
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

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const shiftPolicyId = req.params.id

            const shiftPolicy = await ShiftPolicy.findByPk(shiftPolicyId);

            const masterPolicy =  await MasterPolicy.findAll({
                where: {
                    shift_policy_id: shiftPolicyId
                }
            })

            if(shiftPolicy){
                if(masterPolicy.length > 0){
                    next(forbiddenError("Cannot delete, Shift policy is assigned in a master policy!"))
                }else{
                    await shiftPolicy?.destroy()
                    const response = generateResponse(200, true, "Shift policy deleted succesfully!")
                    res.status(200).json(response)
                }
            }else{
                next(notFound("Cannot find any shift policy with that id!"))
            }
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    
    return { getAll, create, update, getAllDropdown, getById, destroy }
}