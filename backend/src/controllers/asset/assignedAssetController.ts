import { Model, Op } from "sequelize";
import { IMasterControllerOptions, MasterController } from "../masterController";
import { internalServerError } from "../../services/error/InternalServerError";
import { Request, Response, NextFunction } from "express";
import Asset from "../../models/asset";
import { User } from "../../models";
import { badRequest } from "../../services/error/BadRequest";
import { generateResponse } from "../../services/response/response";
import AssignedAsset from "../../models/assignedAsset";
import { sequelize } from "../../utilities/db";
import { notFound } from "../../services/error/NotFound";


//Types for Leave Balance 
type AssignedAssetAttributes = {
    id: number,
    user_id: number,
    asset_id: number,
    date_of_issue: Date,
    date_of_return: Date,
    description: string,
    deleted_at: Date,
    created_at: Date,
    updated_at: Date
}

type AssignedAssetCreationAttributes = Omit<AssignedAssetAttributes, 'id'>;

type AssignedAssetModel = Model<AssignedAssetAttributes, AssignedAssetCreationAttributes>;

type AssignedAssetController = MasterController<AssignedAssetModel> & {
    assignAsset: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    unassignAsset: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
}



export const AssignedAssetController = (
    model: typeof Model & {
        new(): AssignedAssetModel
    }
):AssignedAssetController => {

    const {create, update, getAllDropdown } = MasterController<AssignedAssetModel>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> => {
        try{
            
            const { page, records, sortBy, sortOrder, search_term } = req.query as { page: string, records: string, sortBy: string, sortOrder: string, search_term: string };

            console.log(page, records)
    
            if (!page && !records) {
              next(badRequest("No request parameters are present!"))
              return
            }
    
    
            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
    
            const offset = (pageNumber - 1) * recordsPerPage;

            const orderOptions = [] as any[];
            let whereOptions ={
                deleted_at: null,
                date_of_return: null
            } as any;
            
            if(search_term){
                whereOptions[Op.or] = [
                    {
                        '$user.employee_name$': {
                            [Op.like]: `%${search_term}%`
                        }
                    },
                    {
                        '$asset.asset_name$': {
                            [Op.like]: `%${search_term}%`
                        }
                    }
                ];
            }

            if(sortBy && sortOrder){
                if(sortBy === 'employee_name'){
                    orderOptions.push([{model: User}, 'employee_name', sortOrder])
                }

                if(sortBy === 'asset_name'){
                    orderOptions.push([{model: Asset}, 'asset_name', sortOrder])
                }

                if(sortBy === 'date_of_issue'){
                    orderOptions.push([sortBy, sortOrder])
                }
            }

            const assignedAsset = await AssignedAsset.findAndCountAll({
                where: whereOptions,
                include:[
                    {model: Asset, attributes: ['id', 'asset_code', 'asset_name']},
                    {model: User, attributes: ['id', 'employee_name', 'employee_generated_id']}
                ],
                offset: offset,
                limit: recordsPerPage,
                order: orderOptions
            })

            const totalPages = Math.ceil(assignedAsset.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;

            const meta = {
                totalCount: assignedAsset.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: assignedAsset.rows,
                meta
            }

            const response = generateResponse(200, true, "Data Fetched Succesfully!", result.data, meta)

            res.status(200).json(response)

        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something went wrong"))
        }
    }

    const assignAsset = async(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> => {
        try{
            const {employee_id, date_of_issue, description} = req.body
            const{id} = req.params

            const result = await sequelize.transaction(async(t) => {
                let asset = await Asset.findByPk(id, {transaction: t}) as any;

                const employee = await User.findByPk(employee_id, {transaction: t})

                if(!employee){
                    next(badRequest('There is no employee with that id!'))
                }

                if(!asset){
                    next(badRequest("There is not asset with that id"))
                }

                const formBody = {
                    user_id: employee_id,
                    asset_id: id,
                    date_of_issue: date_of_issue,
                    description: description
                }
                

                const assignedAsset = await AssignedAsset.create(formBody, {transaction: t});

                asset.is_assigned = true
                await asset?.save({transaction: t})

                return { assignedAsset }
            })


            const response = generateResponse(200, true, 'Asset assigned to employee',  result.assignedAsset)

            res.status(200).json(response)

        }catch(err){
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    const unassignAsset = async(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions):Promise<void> => {
        try{

            const{id} = req.params

            const {date_of_return} = req.body

            await sequelize.transaction(async(t) => {
                 const assignedAsset = await AssignedAsset.findOne({
                    where:{
                        asset_id: id,
                        deleted_at: null,
                        date_of_return: null
                    },
                    transaction: t
                }) as any;

                const asset = await Asset.findByPk(id, {transaction: t})

                console.log(date_of_return)

                if(!date_of_return){
                    next(badRequest("Please give a date of return"))
                }

                if(assignedAsset && date_of_return){
                    assignedAsset.date_of_return = date_of_return
                    assignedAsset.deleted_at = date_of_return

                    //@ts-ignore
                    asset.is_assigned = false

                    await asset?.save({transaction: t})

                    await assignedAsset.save({transaction: t})

                    const response = generateResponse(200, true, "Asset Unassigned Succesfully!", assignedAsset)

                    res.status(200).json(response)
                }
                if(!assignedAsset){
                    next(badRequest("No asset is assigned with that id."))
                }
            })

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }
    
    const destroy = async(req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions):Promise<void> => {
        try{

            const {id} = req.params

            const asset = await Asset.findByPk(id) as any;

            if(asset?.user_id){
                next(badRequest("This asset is already assigned to an employee!"))
            }else{
                await Asset.destroy({
                    where:{
                        id: id
                    }
                })

                const response = generateResponse(200, true, "Asset deleted Sucesfully!")

                res.status(200).json(response)
            }



        }catch(err){

            next(internalServerError("Something went wrong!"))

        }
    }

    const getById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const{id} = req.params

            const assignedAsset = await AssignedAsset.findOne({
                where: {
                    id: id
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

            console.log(assignedAsset)

            if(!assignedAsset){
                next(notFound('There is no asset assignment with that id'))
            }

            const response = generateResponse(200, true,  "Data fetched succesfully!", assignedAsset)

            res.status(200).json(response)
        
        }catch(err){
            next(internalServerError("Something went wrong"))
        }
    }

    return { getAll, create, update, getAllDropdown, getById, destroy, assignAsset, unassignAsset }
}