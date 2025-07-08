import { Model, Op } from "sequelize";
import { IMasterControllerOptions, MasterController } from "../masterController";
import { NextFunction, Request, Response } from "express";
import { internalServerError } from "../../services/error/InternalServerError";
import { badRequest } from "../../services/error/BadRequest";
import HolidayDatabase from "../../models/holidayDatabase";
import { generateResponse } from "../../services/response/response";


type HolidayDatabaseAttributes = {
    id: number,
    name: string,
    date: string
}

type HolidayDatabaseCreationAttributes = Omit<HolidayDatabaseAttributes, 'id'>;

type HolidayDatabaseModel = Model<HolidayDatabaseAttributes, HolidayDatabaseCreationAttributes>;

type HolidayDatabaseController = MasterController<HolidayDatabaseModel> & {
    getAllForSpecificYear: (req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions) => Promise<void>;
}


export const HolidayDatabaseController = (
    model: typeof Model & {
        new(): HolidayDatabaseModel
    }
):HolidayDatabaseController => {

    const {getAll, create, destroy, update, getById, getAllDropdown} = MasterController<HolidayDatabaseModel>(model);

    const getAllForSpecificYear = async(req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions):Promise<void> =>{
        try{
            const {year} = req.query

            if(!year){
                next(badRequest("Please enter a year"))
            }

            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${parseInt(year as string) + 1}-01-01`)

            const holidays = await HolidayDatabase.findAll({
                where:{
                    date: {
                        [Op.gte]: startDate,
                        [Op.lt]: endDate
                    }
                }
            })

            const response = generateResponse(200, true, "Holidays fetched Succesfully!", holidays)

            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    return {getAll, create, destroy, update, getById, getAllForSpecificYear, getAllDropdown}
}
