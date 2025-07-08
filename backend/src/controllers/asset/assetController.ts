import { Model, Op, Order, OrderItem, where } from "sequelize";
import { IMasterControllerOptions, MasterController } from "../masterController";
import { internalServerError } from "../../services/error/InternalServerError";
import e, { Request, Response, NextFunction } from "express";
import Asset from "../../models/asset";
import { User } from "../../models";
import { badRequest } from "../../services/error/BadRequest";
import { generateResponse } from "../../services/response/response";
import AssignedAsset from "../../models/assignedAsset";
import { notFound } from "../../services/error/NotFound";
import { sequelize } from "../../utilities/db";


//Types for Leave Balance 
type AssetAttributes = {
    id: number,
    asset_code: string,
    asset_name: string,
    date_of_purchase: string,
    asset_cost: string,
    description?:string,
    user_id: number
}

type AssetCreationAttributes = Omit<AssetAttributes, 'id'>;

type AssetModel = Model<AssetAttributes, AssetCreationAttributes>;

type AssetController = MasterController<AssetModel> & {
    assignAsset: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    unassignAsset: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}



export const AssetController = (
    model: typeof Model & {
        new(): AssetModel
    }
):AssetController => {

    const { getAllDropdown, getById } = MasterController<AssetModel>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {page, records, search_term, sortBy, sortOrder} = req.query as {page: string, records: string, search_term: string, sortBy: string, sortOrder: string}

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

            let whereOptions = {}
            const orderOptions = [] as OrderItem[]

            if(sortBy && sortOrder){
                if(sortBy == 'asset_cost'){
                    orderOptions.push([sequelize.cast(sequelize.col('asset_cost'), 'DECIMAL'), sortOrder])
                }else{
                    orderOptions.push([sortBy, sortOrder])
                }
            }

            if(search_term){
                whereOptions = {
                    [Op.or]: [
                        {asset_code: {[Op.like]: `%${search_term}%`}},
                        {asset_name: {[Op.like]: `%${search_term}%`}},
                        {asset_cost: {[Op.like]: `%${search_term}%`}}
                    ]
                }
            }

            const data = await Asset.findAndCountAll({
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

            const response = generateResponse(200, true, "Data", data.rows, meta)
            res.status(200).json(response)
            
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const create = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            const {
                asset_code,
                asset_name,
                date_of_purchase,
                asset_cost,
                description,
            } = req.body

            const existingAsset = await Asset.findOne({
                where: {
                    asset_code: asset_code
                }
            })

            if(existingAsset){
                next(badRequest("An asset with that asset code already exists."))
            }else{
                const asset = await Asset.create(req.body)

                const response = generateResponse(201, true, "Asset created succesfully!", asset)
                res.status(200).json(response)
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const assignAsset = async(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> => {
        try{

            const {employee_id} = req.body
            const{id} = req.params

            const asset = await Asset.findByPk(id) as any;

            const employee = await User.findByPk(employee_id)

            if(!employee){
                next(badRequest('There is no employee with that id!'))
            }

            if(!asset){
                next(badRequest("There is not asset with that id"))
            }


            if(asset){
                if(asset.user_id !== null){
                    next(badRequest("The asset is already assigned to someone"))
                }else{
                    asset.user_id = employee_id
                }
            }

            await asset?.save()

            const response = generateResponse(200, true, 'Asset assigned to employee')

            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const unassignAsset = async(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions):Promise<void> => {
        try{

            const{id} = req.params

            const asset = await Asset.findByPk(id) as any;

            if(asset){
                if(asset.user_id !== null){
                    asset.user_id = null

                    await asset?.save()

                    const response = generateResponse(200, true, "Asset unassigned succesfully!")
        
                    res.status(200).json(response)
                }else{
                    next(badRequest("Asset is not assigned to anybody"))
                }
            }
            
            if(!asset){
                next(badRequest("No asset exists with that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }
    
    const destroy = async(req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions):Promise<void> => {
        try{

            const {id} = req.params

            const asset = await Asset.findByPk(id);

            const assignedAsset = await AssignedAsset.findAll({
                where:{
                    asset_id: id,
                    date_of_return: null
                }
            })

            if(asset){
                if(assignedAsset.length > 0){
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
            }else{
                next(notFound('Cannot find any asset with that id!'))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))

        }
    }

    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.params

            const asset = await Asset.findByPk(id)

            const {
                asset_code,
                asset_name,
                date_of_purchase,
                asset_cost,
                description,
                is_assigned
            } = req.body

            const existingAsset = await Asset.findOne({
                where: {
                    asset_name: asset_name,
                    id: {
                        [Op.not]: id
                    }
                }
            })

            if(existingAsset){
                next(badRequest("An asset with that name already exists"))
            }

            const updatedAssset = await asset?.update(req.body)

            const response = generateResponse(200, true, "Asset updated succesfully!", updatedAssset)
            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    return { getAll, create, update, getAllDropdown, getById, destroy, assignAsset, unassignAsset }
}