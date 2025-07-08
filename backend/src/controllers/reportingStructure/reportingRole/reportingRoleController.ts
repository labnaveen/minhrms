import { NextFunction, Request, Response } from "express";
import {Model, Op, Sequelize, where} from 'sequelize'
import { IMasterControllerOptions, MasterController } from "../../masterController";
import ReportingManagers from "../../../models/reportingManagers";
import { generateResponse } from "../../../services/response/response";
import ReportingRole from "../../../models/reportingRole";
import { internalServerError } from "../../../services/error/InternalServerError";
import { sequelize } from "../../../utilities/db";
import { badRequest } from "../../../services/error/BadRequest";
import { User } from "../../../models";
import { notFound } from "../../../services/error/NotFound";
import { forbiddenError } from "../../../services/error/Forbidden";

type ReportingRoleAttributes = {
    id: number,
    user_id: number,
    reporting_role_id: number
}

type ReportingRoleCreationAttributes = Omit<ReportingRoleAttributes, 'id'>;

type ReportingRoleModel = Model<ReportingRoleAttributes, ReportingRoleCreationAttributes>;

type ReportingRoleController = MasterController<ReportingRoleModel> & {
    create:(req: Request, res:Response, next: NextFunction) => Promise<void>;
    getAll:(req: Request, res:Response, next: NextFunction) => Promise<void>;
    dropdown:(req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const ReportingRoleController= (
    model: typeof Model & {
        new (): ReportingRole;
    }
):ReportingRoleController => {

    const { getById, getAllDropdown } = MasterController<ReportingRole>(model);

    const create = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            //@ts-ignore
            const {id} = req.credentials

            const formData = {
                name: req.body.name,
                priority: req.body.priority
            }

            const existingReportingRole = await ReportingRole.findAll({
                where: {
                    priority: formData.priority
                }
            })

            const existingReportingRoleName = await ReportingRole.findAll({
                where: {
                    name: formData.name
                }
            })

            if(existingReportingRoleName.length > 0){
                next(badRequest("A reporting role with the same name is already created!"))
            }

            if(existingReportingRole.length > 0){
                next(badRequest("A reporting role with that same priority is already created!"))
            }else{

                const reportingRole = await ReportingRole.create(formData)
                
                const response = generateResponse(201, true, "Reporting role succesfully created!", reportingRole)

                res.status(201).json(response)
            }
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getAll = async(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> => {
        try{
            const { page, records, sortBy, sortOrder, search_term } = req.query as { page: string, records: string, sortBy: string, sortOrder: string, search_term: string };


            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            let whereOptions = {} as any;

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
    
            const offset = (pageNumber - 1) * recordsPerPage;

            const orderOptions = [] as any[]

            if(search_term){
                whereOptions.name = {
                    [Op.like]: `%${search_term}%`
                }
            }

            if(sortBy && sortOrder){
                if(sortBy === 'role_name'){
                    orderOptions.push(['name', sortOrder])
                }
                if(sortBy === 'reporting_manager_count'){
                    orderOptions.push([sequelize.literal('reporting_manager_count'), sortOrder])
                }
                if(sortBy === 'priority'){
                    orderOptions.push([sortBy, sortOrder])
                }
            }
  

            const reportingRole = await ReportingRole.findAndCountAll({
                where: whereOptions,
                attributes: {
                    include:[[Sequelize.literal('(SELECT COUNT(*) FROM reporting_managers WHERE reporting_managers.reporting_role_id = reporting_role.id)'), 'reporting_manager_count']],
                },
                include:[
                    {
                        model: ReportingManagers,
                        required: false
                    }
                ],
                limit: recordsPerPage,
                offset: offset,
                distinct: true,
                order: orderOptions
            })

            const totalPages = Math.ceil(reportingRole.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;

            const meta = {
                totalCount: reportingRole.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
              }

    

            const response = generateResponse(200, true, "Reporting Manager fetched Succesfully!", reportingRole.rows, meta)

            res.status(200).json(response)


        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something went wrong"))
        }
    }

    const dropdown = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const reportingRole = await ReportingRole.findAll({
                include: [
                    {model: ReportingManagers, attributes: ['id', 'user_id'], include:[
                        {model: User, attributes:['id', 'employee_name', 'employee_generated_id']}
                    ]}
                ],
                attributes:['id', 'name']
            })

            const response = generateResponse(200, true, "Dropdown fetched Succesfully!", reportingRole)

            res.status(200).json(response)
        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const reportingRoleId = req.params.id

            const reportingRole = await ReportingRole.findByPk(reportingRoleId);

            const reportingManagers = await ReportingManagers.findAll({
                where:{
                    reporting_role_id: reportingRoleId   
                }
            })

            if(reportingRole){
                if(reportingManagers.length > 0){
                    next(forbiddenError("Cannot delete reporting role, there are managers assigned to this reporting role"))
                }else{
                    await reportingRole.destroy()
                    const response = generateResponse(200, true, "Deleted Reporting role succesfully!")
                    res.status(200).json(response)
                }
            }else{
                next(notFound("Cannot find a reporting role with that id!"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const {id} = req.params

            const{name, priority} = req.body

            const reportingRole = await ReportingRole.findByPk(id);

            if(reportingRole){
                const existingReportingPriority = await ReportingRole.findAll({
                    where: {
                        priority: priority,
                        id: {
                            [Op.not]: id
                        }
                    }
                })

                const existingReportingName = await ReportingRole.findAll({
                    where: {
                        name: name,
                        id: {
                            [Op.not]: id
                        }
                    }
                })

                if(existingReportingPriority.length > 0){
                    next(badRequest("A reporting role with that same priority is already created!"))
                }else if (existingReportingName.length > 0){
                    next(badRequest("A reporting role with that same name already exists!"))
                }else{
                    await reportingRole.update({
                        name, 
                        priority
                    })
    
                    const response = generateResponse(200, true, "Data updated succesfully!")
                    res.status(200).json(response)
                }
            }else{
                next(notFound("There is no reporting role with that id!"))
            }
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

 
    
    return{ getAll, getById, update, destroy, create, getAllDropdown, dropdown }
}