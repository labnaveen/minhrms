import { NextFunction, Response, Request } from "express";
import { Model, Op } from "sequelize";
import { IMasterControllerOptions, MasterController } from "../masterController";
import { internalServerError } from "../../services/error/InternalServerError";
import { sequelize } from "../../utilities/db";
import WeeklyOffPolicy from "../../models/weeklyOffPolicy";
import WeeklyOffAssociation from "../../models/weeklyOffAssociation";
import { generateResponse } from "../../services/response/response";
import { badRequest } from "../../services/error/BadRequest";
import MasterPolicy from "../../models/masterPolicy";
import { notFound } from "../../services/error/NotFound";
import { forbiddenError } from "../../services/error/Forbidden";



//Types for Leave Balance 
type WeeklyOffPolicyAttributes = {
    id: number,
    name: string,
    description: string
}

type WeeklyOffPolicyCreationAttributes = Omit<WeeklyOffPolicyAttributes, 'id'>;

type WeeklyOffPolicyModel = Model<WeeklyOffPolicyAttributes, WeeklyOffPolicyCreationAttributes>;

type WeeklyOffPolicyController = MasterController<WeeklyOffPolicyModel> & {
    create: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}



export const WeeklyOffPolicyController = (
    model: typeof Model & {
        new(): WeeklyOffPolicyModel
    }
):WeeklyOffPolicyController => {

    const { getAllDropdown} = MasterController<WeeklyOffPolicyModel>(model);

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
            let whereOptions = {} as any

            if(sortBy && sortOrder){
                if(sortBy === 'policy_name'){
                    orderOptions.push(['name', sortOrder])
                }
            }

            if(search_term){
                whereOptions.name = {
                    [Op.like]: `%${search_term}%`
                }
            }


            const data = await WeeklyOffPolicy.findAndCountAll({
                where: whereOptions,
                include: [
                    {model: WeeklyOffAssociation, attributes: ['id', 'week_name', 'week_number']}
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

    const create = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {name, description, configuration} = req.body

            const policyFormBody = {
                name,
                description
            }

            const existingWeeklyOffPolicy = await WeeklyOffPolicy.findOne({
                where: {
                    name: name
                }
            })


            if(existingWeeklyOffPolicy){
                return next(badRequest("A policy with that name already exists!"))
            }else{
                await sequelize.transaction(async(t) => {
                    const weeklyOffPolicy = await WeeklyOffPolicy.create(policyFormBody, {transaction: t}) as any

                    if(configuration){
                        const week_id = Object.keys(configuration)
    
                        if(weeklyOffPolicy){
                            for(const weekId of week_id){
                                for(const week_number of configuration[weekId]){
                                    await WeeklyOffAssociation.create({
                                        weekly_off_policy_id: weeklyOffPolicy.id,
                                        week_name: weekId,
                                        week_number: week_number
                                    }, {transaction: t})
                                }
                            }
                        }
    
                        const response = generateResponse(201, true, "Weekly Off Policy Created Succesfully!", weeklyOffPolicy)
                        res.status(201).json(response)
                    }else{
                        next(badRequest("Please enter atleast one configuration!"))
                    }
                })
            }
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            await sequelize.transaction(async(t) => {
                const {name, description, configuration} = req.body

                const {id} = req.params

                const weeklyOffPolicyFormBody = {
                    name,
                    description
                }

                const weeklyOffPolicy = await WeeklyOffPolicy.findByPk(id)

                const existingWeeklyOffPolicy = await WeeklyOffPolicy.findOne({
                    where: {
                        name: name,
                        id: {
                            [Op.not]: id
                        }
                    }
                })

                if(existingWeeklyOffPolicy){
                    next(badRequest("A weekly off policy with that name already exists!"))
                }

                if(!weeklyOffPolicy){
                    next(badRequest("No weekly off policy exists with that id"))
                }else{
                    await weeklyOffPolicy.update(weeklyOffPolicyFormBody, {transaction: t})
                    await WeeklyOffAssociation.destroy({
                        where:{
                            weekly_off_policy_id: id
                        },
                        transaction: t
                    })

                    if(configuration){
                        const week_id = Object.keys(configuration)
    
                        if(weeklyOffPolicy){
                            for(const weekId of week_id){
                                for(const week_number of configuration[weekId]){
                                    await WeeklyOffAssociation.create({
                                        weekly_off_policy_id: id,
                                        week_name: weekId,
                                        week_number: week_number
                                    }, {transaction: t})
                                }
                            }
                        }
                    }
                }

                const response = generateResponse(200, true, "Weekly Off Policy updated succesfully!")

                res.status(200).json(response)

            })
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            await sequelize.transaction(async(t) => {
                const {id} = req.params

                const weeklyOffPolicy = await WeeklyOffPolicy.findByPk(id)

                if(!weeklyOffPolicy){
                    next(badRequest("There is no policy with that id"))
                }else{
                    const masterPolicy = await MasterPolicy.findAll({
                        where: {
                            weekly_off_policy_id: id
                        }
                    })

                    if(masterPolicy.length > 0){
                        next(forbiddenError("Cannot delete, This weekly off policy is already assigned to a master policy"))
                    }else{
                        await WeeklyOffAssociation.destroy({
                            where:{
                                weekly_off_policy_id: id
                            },
                            transaction: t
                        })

                        await weeklyOffPolicy.destroy({transaction: t})

                        const response = generateResponse(200, true, "Weekly Off Policy deleted succesfully!")

                        res.status(200).json(response)

                    }
                }
            })
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const weeklyOffPolicyId = req.params.id
            
            const weeklyOffPolicy = await WeeklyOffPolicy.findByPk(weeklyOffPolicyId, {
                include: [
                    {
                        model: WeeklyOffAssociation,
                        attributes: ['id', 'week_name', 'week_number'],
                        required: false
                    },
                    
                ]
            });

            if(weeklyOffPolicy){
                const response = generateResponse(200, true, "Weekly off policy fetched succesfully!", weeklyOffPolicy)
                res.status(200).json(response)
            }else{
                next(notFound("Cannot find weekly off policy with that id"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }
    
    return { getAll, create, update, getAllDropdown, getById, destroy }
}