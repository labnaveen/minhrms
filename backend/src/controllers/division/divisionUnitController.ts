import { NextFunction, Response, Request } from "express";
import { DestroyOptions, FindOptions, Model, Op, Sequelize } from "sequelize";
import { MasterController } from "../masterController";
import { generateResponse } from "../../services/response/response";
import { internalServerError } from "../../services/error/InternalServerError";
import MasterPolicy from "../../models/masterPolicy";
import { conflict } from "../../services/error/Conflict";
import DivisionUnits from "../../models/divisionUnits";
import { User } from "../../models";
import UserDivision from "../../models/userDivision";
import { sequelize } from "../../utilities/db";
import { badRequest } from "../../services/error/BadRequest";
import { forbiddenError } from "../../services/error/Forbidden";
import { notFound } from "../../services/error/NotFound";


//Types for Leave Balance 
type DivisionUnitAttributes = {
    id: number,
    unit_name: string,
    division_id: number
}

type DivisionUnitCreationAttributes = Omit<DivisionUnitAttributes, 'id'>;

type DivisionUnitModel = Model<DivisionUnitAttributes, DivisionUnitCreationAttributes>;

type DivisionUnitController = MasterController<DivisionUnitModel> & {
    getDivisionUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next:NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}



export const DivisionUnitController = (
    model: typeof Model & {
        new(): DivisionUnitModel
    }
): DivisionUnitController => {

    const { getAllDropdown, getById } = MasterController<DivisionUnitModel>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            
            const { page, records, search_term, sortBy, sortOrder } = req.query as { page: string, records: string, search_term: string, sortBy: string, sortOrder: string };

            const divisionId = req.params.id

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            console.log(page, records)

            const offset = (pageNumber - 1) * recordsPerPage;

            let whereOptions = {
                division_id: divisionId
            } as any;

            let orderOptions = [] as any[]

            if(search_term){
                whereOptions.unit_name = {
                    [Op.like]: `%${search_term}%`
                }
            }

            if(sortBy && sortOrder){
                if(sortBy == 'unit_name'){
                    orderOptions.push([sortBy, sortOrder])
                }

                if(sortBy == 'user_count'){
                    orderOptions.push([sequelize.literal('user_count'), sortOrder])
                }
            }

            const divisionUnits = await DivisionUnits.findAndCountAll({
                where: whereOptions,
                attributes: {
                    include:[[Sequelize.literal('(SELECT COUNT(*) FROM user_division WHERE user_division.unit_id = division_units.id)'), 'user_count']]
                },
                include: [
                  {
                    model: User,
                    attributes: [], // Include this to avoid retrieving User attributes
                    through: { attributes: [] }, // Include this to avoid retrieving the user_division junction table attributes
                  },
                ],
                offset: offset,
                limit: recordsPerPage,
                distinct: true,
                order: orderOptions
            });

            const totalPages = Math.ceil(divisionUnits.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;


            const meta = {
                totalCount: divisionUnits.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: divisionUnits.rows,
                meta
            }

            const response = generateResponse(200, true, "Data fetched succesfully!", divisionUnits.rows, meta)
            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    async function create(req: Request, res: Response, next: NextFunction) {
        try{

            const {units, division_id} = req.body

            const unit = await DivisionUnits.findOne({
                where:{
                    unit_name: {
                        [Op.in]: units
                    },
                    division_id: division_id
                }
            })


            if(!unit){

                await Promise.all(
                    units.map(async(unit: string | number) => {
                        await DivisionUnits.create({
                            unit_name: unit,
                            division_id: division_id
                        })
                    })
                )

                const response = generateResponse(201, true, "Division unit created succesfully!")
                res.status(201).json(response)
                
            }else{
                next(badRequest("A unit with that name already exists."))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    async function update(req: Request, res: Response, next:NextFunction): Promise<void> {
        try{

            const {id} = req.params

            const {unit_name, division_id} = req.body

            const unit = await DivisionUnits.findByPk(id) as any;

            const existingUnit = await DivisionUnits.findOne({
                where: {
                    unit_name: unit_name,
                    id: {
                        [Op.not]: id
                    },
                    division_id: unit?.division_id
                }
            })

            if(!unit){
                next(notFound("No division unit with that id!"))
            }

            if(existingUnit){
                next(badRequest("A division unit of that name already exists!"))
            }

            const update = await unit?.update(req.body)
            const response = generateResponse(200, true, "Division unit updated succesfully!", update)
            res.status(200).json(response)


        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    async function getDivisionUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, records } = req.query as { page: string, records: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            console.log(page, records)

            const offset = (pageNumber - 1) * recordsPerPage;

            const divisionUnits = await DivisionUnits.findAndCountAll({
                attributes: {
                    include:[[Sequelize.literal('(SELECT COUNT(*) FROM user_division WHERE user_division.unit_id = division_units.id)'), 'user_count']]
                },
                include: [
                  {
                    model: User,
                    attributes: [], // Include this to avoid retrieving User attributes
                    through: { attributes: [] }, // Include this to avoid retrieving the user_division junction table attributes
                  },
                ],
                offset: offset,
                limit: recordsPerPage,
                distinct: true,
                order: [['id', 'DESC']]
              });

            // const divisionUnits = await DivisionUnits.findAndCountAll({
            //     attributes: [
            //         'id',
            //         'unit_name',
            //         [Sequelize.fn('COUNT', Sequelize.col('user_division.user_id')), 'user_id_count'],
            //     ],
            //     include: [
            //         {
            //             model: UserDivision,
            //             as: 'user_division',
            //             required: true,
            //             attributes:[],
                        
            //         },

            //     ],
            //     subQuery: true,
            //     group: ['division_units.id'],
            //     offset: offset,
            //     limit: recordsPerPage,
            // })
            const totalPages = Math.ceil(divisionUnits.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;

            console.log('>>>>>>>>', divisionUnits.count)


            const meta = {
                totalCount: divisionUnits.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: divisionUnits.rows,
                meta
            }

            const response = generateResponse(200, true, "Data fetched succesfully!", result)

            res.status(200).json(response)

        } catch (err) {
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const unit_id = req.params.id

            const unit = await DivisionUnits.findByPk(unit_id)

            if(unit){
                const userAssociation = await UserDivision.findAll({
                    where: {
                        unit_id: unit_id
                    }
                })

                if(userAssociation.length > 0){
                    next(forbiddenError("Cannot delete division unit, employees are already associated."))
                }else{
                    await unit.destroy()

                    const response = generateResponse(200, true, "Division unit deleted succesfully!")
                    res.status(200).json(response)
                }
            }else{
                next(badRequest("No division unit exists with that id"))
            }
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    return { getAll, create, update, getAllDropdown, getById, destroy, getDivisionUsers }
}