import { NextFunction, Response, Request } from "express";
import { DestroyOptions, FindOptions, Model, Op } from "sequelize";
import { MasterController } from "../masterController";
import { generateResponse } from "../../services/response/response";
import { internalServerError } from "../../services/error/InternalServerError";
import MasterPolicy from "../../models/masterPolicy";
import { conflict } from "../../services/error/Conflict";
import { sequelize } from "../../utilities/db";
import Division from "../../models/division";
import DivisionUnits from "../../models/divisionUnits";
import { notFound } from "../../services/error/NotFound";
import { badRequest } from "../../services/error/BadRequest";
import UserDivision from "../../models/userDivision";
import { forbiddenError } from "../../services/error/Forbidden";


//Types for Leave Balance 
type DivisionAttributes = {
    id: number,
    division_name: string,
}

type DivisionCreationAttributes = Omit<DivisionAttributes, 'id'>;

type DivisionModel = Model<DivisionAttributes, DivisionCreationAttributes>;

type DivisionController = MasterController<DivisionModel> & {
    create: (req: Request, res: Response, next: NextFunction, option?: FindOptions) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addEmployeeToUnit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    removeEmployeeFromUnit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}



export const DivisionController = (
    model: typeof Model & {
        new(): DivisionModel
    }
):DivisionController => {

    const {getAllDropdown} = MasterController<Division>(model);


    const create = async(req: Request, res: Response, next: NextFunction) => {
        try{
            const {division_name, division_units}:{division_name: string, division_units: string[]} = req.body

            await sequelize.transaction(async(t) => {
                const data = {
                    division_name
                }

                const sameName = await Division.findOne({
                    where: {
                        division_name: division_name
                    }
                })

                if(!sameName){

                    const division = await Division.create(data, {transaction: t}) as any;

                    if(division_units && division_units.length>0){
                        await Promise.all(
                            division_units.map(async(unit) => {
                                await DivisionUnits.create({
                                    unit_name: unit,
                                    division_id: division.id
                                }, {transaction: t})
                            })
                        )   
                    }
                    
                    const response = generateResponse(201, true, "Division and it's units succesfully created!", division)
                    res.status(201).json(response)
                }else{
                    next(badRequest("A division with the same name already exists."))
                }
            })
        }catch(err){
            console.log(err)
            next(internalServerError("Something went Wrong!"))
        }
    }

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const { page, records, sortBy, sortOrder, search_term } = req.query as { page: string, records: string, sortBy: string, sortOrder: string, search_term: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

            const orderOptions = [] as any[]

            const whereOptions = {} as any;

            if(sortBy && sortOrder){
                if(sortBy === 'division_name'){
                    orderOptions.push([sortBy, sortOrder])
                }
                if(sortBy === 'division_unit'){
                    orderOptions.push([{model: DivisionUnits}, 'unit_name', sortOrder])
                }
                if(sortBy === 'employee_count'){
                    orderOptions.push([sequelize.literal('employee_count'), sortOrder])
                }
            }

            if(search_term){
                whereOptions.division_name = {
                    [Op.like]: `%${search_term}%`
                }
            }

            const data = await Division.findAndCountAll({
                where: whereOptions,
                attributes: {
                    include: [
                        [
                            sequelize.literal(
                                `(SELECT COUNT(*) FROM user_division WHERE unit_id IN (SELECT id FROM division_units WHERE division_id = division.id))`
                            ),
                            "employee_count",
                        ],
                    ],
                    exclude: ["createdAt", "updatedAt"]
                },
                include: [
                    {
                        model: DivisionUnits,
                    }
                ],
                limit: recordsPerPage,
                offset: offset,
                order: orderOptions,
                distinct: true
            });

            

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

            const result = {
                data: data.rows,
                meta
            }

            const response = generateResponse(200, true, "Data fetched succesfully!", data.rows, meta)

            res.status(200).json(response)    

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.params

            const division = await Division.findByPk(id, {
                include: [
                    {
                        model: DivisionUnits,
                        attributes: ['id', 'unit_name']
                    }
                ],
                attributes: ['id', 'division_name', 'system_generated']
            });

            if(division){
                const response = generateResponse(200, true, "Division fetched succesfully!", division)
                res.status(200).json(response)
            }else{
                next(notFound("Cannot find division with that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const addEmployeeToUnit = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            await sequelize.transaction(async(t) => {
                const {id, unit_id} = req.params

                const divisionId = id

                const {employee_id} = req.body

                if(employee_id.length > 0){

                    await Promise.all(
                        employee_id.map(async(userId : string | number) => {

                            const existingAssociation = await UserDivision.findOne({
                                where: {
                                    user_id: userId,
                                    division_id: id
                                }
                            })

                            if(existingAssociation){
                                await existingAssociation.destroy()
                            }

                            await UserDivision.create({
                                user_id: userId,
                                unit_id: unit_id,
                                division_id: id
                            })
                        })
                    )

                    const response = generateResponse(201, true, "Employee added to the unit")
                    res.status(201).json(response)

                }else{
                    next(badRequest("No employee id's in employee_id array."))
                }
            })
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const removeEmployeeFromUnit = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const{id, unit_id, user_id} = req.params


            await sequelize.transaction(async(t) => {

                await UserDivision.destroy({
                    where: {
                        user_id: user_id,
                        unit_id: unit_id
                    },
                    transaction: t
                })

                const response = generateResponse(200, true, "Employee removed from that particular unit!")
                res.status(200).json(response)
            })

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const divisionId = req.params.id

            const division = await Division.findByPk(divisionId)

            if(division){
                const unit = await DivisionUnits.findAll({
                    where: {
                        division_id: divisionId
                    }
                })

                if(unit.length > 0){
                    next(forbiddenError('Cannot delete this division, a unit is already created under this division'))
                }else{
                    await division.destroy()
                    
                    const response = generateResponse(200, true, "Division deleted succesfully!")
                    
                    res.status(200).json(response)
                }
            }else{
                next(badRequest("No division with that id exists."))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.params
            const{division_name} = req.body

            const division = await Division.findByPk(id)

            const existingDivision = await Division.findOne({
                where: {
                    division_name: division_name,
                    id: {
                        [Op.not]: id
                    }
                }
            })

            if(existingDivision){
                next(badRequest('A division with that name already exists!'))
            }

            const update = await division?.update(req.body)

            const response = generateResponse(200, true, "Division updated succesfully!", update)
            res.status(200).json(response)
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }
    
    return { getAll, create, update, getAllDropdown, getById, destroy, addEmployeeToUnit, removeEmployeeFromUnit }
}