import { NextFunction, Response, Request } from "express";
import { DestroyOptions, FindOptions, Model, Op, or } from "sequelize";
import { IMasterControllerOptions, MasterController } from "../masterController";
import { generateResponse } from "../../services/response/response";
import { internalServerError } from "../../services/error/InternalServerError";
import MasterPolicy from "../../models/masterPolicy";
import { sequelize } from "../../utilities/db";
import HolidayCalendar from "../../models/holidayCalendar";
import HolidayCalendarAssociation from "../../models/holidayCalendarAssociation";
import HolidayDatabase from "../../models/holidayDatabase";
import { badRequest } from "../../services/error/BadRequest";
import CustomHoliday from "../../models/customHoliday";
import { notFound } from "../../services/error/NotFound";
import { forbiddenError } from "../../services/error/Forbidden";


//Types for Leave Balance 
type HolidayCalendarAttributes = {
    id: number,
}

type HolidayCalendarCreationAttributes = Omit<HolidayCalendarAttributes, 'id'>;

type HolidayCalendarModel = Model<HolidayCalendarAttributes, HolidayCalendarCreationAttributes>;

type HolidayCalendarController = MasterController<HolidayCalendarModel> & {
    createCalendar: (req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions) => Promise<void>;
    holidayForSpecificCalendar: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
    deleteSingleHoliday: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}



export const HolidayCalendarController = (
    model: typeof Model & {
        new(): HolidayCalendarModel
    }
):HolidayCalendarController => {

    const {getAllDropdown, getById, create} = MasterController<HolidayCalendarModel>(model);


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
                orderOptions.push([sortBy, sortOrder])
            }

            if(search_term){
                whereOptions[Op.or] = [
                    {name: {[Op.like]: `%${search_term}%`}},
                    {year: {[Op.like]: `%${search_term}%`}}
                ]
            }


            const data = await HolidayCalendar.findAndCountAll({
                where: whereOptions,
                include: [
                    {model: HolidayDatabase, attributes: ['id', 'name', 'date']}
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

    const createCalendar = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try{
            await sequelize.transaction(async(t) => {
                const {name, year, holiday_id} = req.body

                const CalendarFormBody = {
                    name,
                    year
                }

                const holidayCalendar = await HolidayCalendar.create(CalendarFormBody, {transaction: t}) as any;
                
                
                if(holiday_id && holiday_id.length>0){
                    await Promise.all(
                        holiday_id.map(async(id: number) => {
                            if(typeof id !== 'number'){
                                throw new Error('Invalid id in holiday_id array')
                            }
                            await HolidayCalendarAssociation.create({
                                holiday_calendar_id: holidayCalendar.id,
                                holiday_id: id
                            }, {transaction: t})
                        })
                    )
                    const response = generateResponse(201, true, "Holiday Calendar created Succesfully!", holidayCalendar)
                    res.status(201).json(response)
                }else{
                    next(badRequest("Please select atleast one holiday!"))
                }
            })
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong"))
        }
    }


    const update = async(req: Request, res: Response, next: NextFunction) => {
        try{

            await sequelize.transaction(async(t) => {

                const {id} = req.params
                

                const {name, year, holiday_id} = req.body
    
                const formBody = {
                    name,
                    year
                }
    
                const holidayCalendar = await HolidayCalendar.findByPk(id, {
                    include: [{model: HolidayDatabase, through: {attributes: []}}]
                }) as any;
    
                await holidayCalendar?.update(formBody, {transaction: t})

                await HolidayCalendarAssociation.destroy({
                    where:{
                        holiday_calendar_id: id
                    },
                    transaction: t
                })

                if(holiday_id && holiday_id.length >0){
                    await Promise.all(
                        holiday_id.map(async(holiday: number) => {
                            console.log('ahaha', holiday)
                            if(typeof holiday !== 'number'){
                                throw new Error('Invalid id in holiday_id array')
                            }
                            await HolidayCalendarAssociation.create({
                                holiday_calendar_id: holidayCalendar?.id,
                                holiday_id: holiday
                            }, {transaction: t})
                        })
                    )
                }
                
                const response = generateResponse(200, true, "Holiday Calendar updated succesfully!", holidayCalendar)
                res.status(200).json(response)

            })



        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.params

            await sequelize.transaction(async(t) => {

                const holidayCalendar = await HolidayCalendar.findByPk(id, {transaction: t});

                const masterPolicy = await MasterPolicy.findAll({
                    where:{
                        holiday_calendar_id: id
                    }
                })

                if(holidayCalendar){

                    if(masterPolicy.length > 0){
                        next(forbiddenError("This holiday calendar is already assigned to a master policy!"))
                    }else{
                        await CustomHoliday.destroy({
                            where: {
                                holiday_calendar_id: id
                            },
                            transaction: t
                        });
                        await HolidayCalendarAssociation.destroy({
                            where:{
                                holiday_calendar_id: id
                            },
                            transaction: t
                        });
                        await holidayCalendar.destroy({transaction: t})

                        const response = generateResponse(200, true, "Holiday Calendar deleted succesfully!")

                        res.status(200).json(response)
                    }

                }else{
                    next(notFound("Cannot find holiday calendar with that id!"))
                }

            })

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const holidayForSpecificCalendar = async(req: Request, res: Response, next: NextFunction): Promise<void> => {

        try{

            const {id} = req.params

            const { page, records, sortOrder, sortBy, search_term } = req.query as { page: string, records: string, sortOrder: string, sortBy: string, search_term: string };

            if (!page && !records) {
              // res.status(400).json({message: "No request parameters are present!"})
              next(badRequest("No request parameters are present!"))
              return
            }

            const holidayCalendar = await HolidayCalendar.findByPk(id)
            
            if(!holidayCalendar){
                next(badRequest("There is no Holiday Calendar with that id"))
            }

            let orderOptions = [] as any[]

            if(sortBy && sortOrder){
                if(sortBy == 'holiday_name'){
                    orderOptions.push(['name', sortOrder])
                }
                if(sortBy == 'holiday_date'){
                    orderOptions.push(['date', sortOrder])
                }
            }

            let whereOptions = {} as any;

            if(search_term){
                whereOptions.name = {
                    [Op.like]: `%${search_term}%`
                }
            }
    
    
            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
    
            const offset = (pageNumber - 1) * recordsPerPage;
            const holiday = await HolidayDatabase.findAndCountAll({
                where: whereOptions,
                include:[
                    {
                        model: HolidayCalendar,
                        where: {id: id},
                        through:{
                            attributes: []
                        },
                        attributes:[]
                    },
                ],
                limit: recordsPerPage,
                offset: offset,
                order: orderOptions
            })

            const totalPages = Math.ceil(holiday.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;

            const meta = {
                totalCount: holiday.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const response = generateResponse(200, true, "Data Fetched Succesfully!", holiday.rows,  meta)

            res.status(200).json(response)
        }catch(err){
            console.log(err)
            // res.status(500).json(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const deleteSingleHoliday = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id, holidayId} = req.params

            const holiday = await HolidayCalendarAssociation.findOne({
                where:{
                    holiday_calendar_id: id,
                    holiday_id: holidayId
                }
            })

            if(!holiday){
                next(badRequest("No holiday exists with that id"))
            }else{

                await HolidayCalendarAssociation.destroy({
                    where:{
                        holiday_calendar_id: id,
                        holiday_id: holidayId
                    }
                })

                const response = generateResponse(200, true, "Holiday Deleted succesfully!")

                res.status(200).json(response)

            }

        }catch(err){
            next(internalServerError("Something went Wrong!"))
        }
    }


    
    return { 
        getAll, 
        createCalendar, 
        getAllDropdown, 
        getById, 
        destroy, 
        update, 
        holidayForSpecificCalendar, 
        deleteSingleHoliday,
        create
    }
}