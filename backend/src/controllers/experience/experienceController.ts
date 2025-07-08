import { Model } from "sequelize";
import { MasterController } from "../masterController";
import { NextFunction, Request, Response } from "express";
import { internalServerError } from "../../services/error/InternalServerError";
import { User } from "../../models";
import { badRequest } from "../../services/error/BadRequest";
import { sequelize } from "../../utilities/db";
import Experience from "../../models/experience";
import { generateResponse } from "../../services/response/response";
import { notFound } from "../../services/error/NotFound";


//Types for Experience policy  
export type ExperienceAttributes = {
    id: number,
    company_name: string,
    designation: string,
    employment_type_id: number,
    start_date: Date,
    end_date: Date,
    address: string
}

type ExperienceCreationAttributes = Omit<ExperienceAttributes, 'id'>;

type ExperienceModel = Model<ExperienceAttributes, ExperienceCreationAttributes>;

type ExperienceController = MasterController<ExperienceModel> & {
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next:NextFunction) =>  Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}



export const ExperienceController = (
    model: typeof Model & {
        new(): ExperienceModel
    }
):ExperienceController => {

    const {getAll, getAllDropdown } = MasterController<ExperienceModel>(model);

    const create = async(req: Request, res: Response, next:NextFunction): Promise<void> => {
        try{
            //@ts-ignore
            const {id} = req.credentials

            const {company_name, user_id, designation, employment_type_id, start_date, end_date, address} = req.body

            const employee = await User.findByPk(id)

            if(employee){
                await sequelize.transaction(async(t) => {
                    const formBody = {
                        company_name,
                        user_id: id,
                        designation,
                        employment_type_id,
                        start_date,
                        end_date,
                        address
                    }
                    const experience = await Experience.create(formBody, {transaction: t})
                    const response = generateResponse(201, true, "Experience created succesfully!", experience)
                    res.status(201).json(response)
                })
            }else{
                next(badRequest("There is no employee with that id!"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.params

            //@ts-ignore
            const employee_id = req.credentials?.id
            
            await sequelize.transaction(async(t) => {
                
                const experience = await Experience.findByPk(id)

                await experience?.destroy({transaction: t})

                const response = generateResponse(200, true, "Record deleted succesfully!")

                res.status(200).json(response)
            })

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const getById = async(req:Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            
            const {id} = req.params

            //@ts-ignore
            const employee_id = req.credentials

            const experience = await Experience.findByPk(id, {
                attributes:{
                    exclude: ['createdAt', 'updatedAt']
                }
            })

            if(experience){
                const response = generateResponse(200, true, "Data fetched succesfully!", experience)
                res.status(200).json(response)
            }else{
                next(notFound("Experience with that id not found!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.params
            const experience = await Experience.findByPk(id)
            if(experience){
                await experience.update(req.body)
                const response = generateResponse(200, true, "Record updated succesfully!")
                res.status(200).json(response)
            }else{
                next(notFound("Cannot find experience with that id"))
            }
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    
    return { getAll, create, update, getAllDropdown, getById, destroy }
}