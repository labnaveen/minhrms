import express, { NextFunction, Request, Response } from 'express'
import { seedHolidays } from '../cronjobs/calendarSeeder';
import { internalServerError } from '../services/error/InternalServerError';
import moment from 'moment';
import { badRequest } from '../services/error/BadRequest';


var router = express.Router()


router.post('/', async(req: Request, res: Response, next: NextFunction) => {
    try{
        
        const {year} = req.query

        if(year){

            const validYearRegex = /^\d{4}$/;
            const startDate = moment(year as string, 'YYYY').startOf('year').format('YYYY-MM-DD');
            const endDate = moment(year as string, 'YYYY').endOf('year').format('YYYY-MM-DD');
            await seedHolidays(startDate, endDate);

            if(!validYearRegex.test(year as string)){
                return next(badRequest("Invalid year format. Please provide a valid 4-digit year."))
            }
            res.status(201).json("Holidays seeded succesfully!")
        }else{
            const nextYear = moment().add(1, 'year');

            const timeMin = nextYear.startOf('year').format('YYYY-MM-DD');
            const timeMax = nextYear.endOf('year').format('YYYY-MM-DD');
    
            await seedHolidays(timeMin, timeMax)
            
            res.status(201).json("Holidays seeded succesfully!")
        }
    }catch(err){
        console.log(err)
        next(internalServerError("Something went wrong!"))
    }
})





export default router;