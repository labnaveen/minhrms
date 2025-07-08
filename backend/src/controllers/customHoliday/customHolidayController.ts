import { NextFunction, Response, Request } from "express";
import { Model } from "sequelize";
import { MasterController } from "../masterController";
import { generateResponse } from "../../services/response/response";
import { internalServerError } from "../../services/error/InternalServerError";
import HolidayCalendar from "../../models/holidayCalendar";
import { notFound } from "../../services/error/NotFound";
import HolidayDatabase from "../../models/holidayDatabase";
import { sequelize } from "../../utilities/db";
import HolidayCalendarAssociation from "../../models/holidayCalendarAssociation";
import { badRequest } from "../../services/error/BadRequest";
import moment from "moment";
import CustomHoliday from "../../models/customHoliday";


//Types for Leave Balance 
type CustomHolidayAttributes = {
    id: number,
    holiday_calendar_id: number,
    name: string,
    date: string
}

type CustomHolidayCreationAttributes = Omit<CustomHolidayAttributes, 'id'>;

type CustomHolidayModel = Model<CustomHolidayAttributes, CustomHolidayCreationAttributes>;

type CustomHolidayController = MasterController<CustomHolidayModel> & {
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>
}



export const CustomHolidayController = (
    model: typeof Model & {
        new(): CustomHolidayModel
    }
):CustomHolidayController => {

    const {getAll, getAllDropdown } = MasterController<CustomHolidayModel>(model);

    const create = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            await sequelize.transaction(async(t) => {

                //@ts-ignore
                const {id} = req.credentials
                const {holiday_calendar_id, name, date} = req.body

                const yearOfHoliday = moment(date).get('years');
                const currentYear = moment().get('years');
                
                const holidayCalendar = await HolidayCalendar.findByPk(holiday_calendar_id)

                if(holidayCalendar){
                    
                    const existingCustomHoliday = await HolidayDatabase.findOne({
                        where:{
                            name: name,
                            custom_holiday: true
                        }
                    })

                    if(existingCustomHoliday){
                        next(badRequest("A custom holiday with that holiday already exists."))
                    }

                    if(yearOfHoliday !== currentYear){
                        next(badRequest("The holiday should be of the current holiday calendar year"))
                    }

                    const customHoliday = await HolidayDatabase.create({
                        name: name,
                        date: date,
                        custom_holiday: true
                    }, {transaction: t}) as any;

                    console.log(customHoliday)

                    const association = await HolidayCalendarAssociation.create({
                        holiday_calendar_id: holiday_calendar_id,
                        holiday_id: customHoliday.id
                    }, {transaction: t})

                    const response = generateResponse(201, true, "Custom Holiday created succesfully!", customHoliday)
                    res.status(201).json(response)

                }else{
                    next(notFound("Cannot find a holiday calendar with that id!"))
                }
            })
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{

            const {id} = req.params

            await sequelize.transaction(async(t) => {
                const holiday = await HolidayDatabase.findByPk(id)
                if(holiday){
                    
                    await HolidayCalendarAssociation.destroy({
                        where:{
                            holiday_id: id
                        },
                        transaction: t
                    })

                    await holiday.destroy({transaction: t})

                    const response = generateResponse(200, true, "Deleted Succesfully!")

                    res.status(200).json(response)

                }
            })

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.params

            const holiday = await HolidayDatabase.findOne({
                where: {
                    id: id,
                    custom_holiday: true
                }
            })

            if(holiday){

                await holiday.update(req.body)
                const response = generateResponse(200, true, "Record updated succesfully!")
                res.status(200).json(response)

            }else{
                next(notFound("Cannot find the holida"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const getById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.params

            const customHoliday = await HolidayDatabase.findOne({
                where: {
                    id: id,
                    custom_holiday: true
                }
            })

            if(customHoliday){
                const response = generateResponse(200, true, "Data fetched succesfully!", customHoliday)
                res.status(200).json(response)
            }else{
                next(notFound("Cannot find any custom holiday with that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }
    
    return { getAll, create, update, getAllDropdown, getById, destroy }
}