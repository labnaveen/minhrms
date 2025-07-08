import { NextFunction, Request, Response } from "express";
import { internalServerError } from "../../services/error/InternalServerError";
import Letter from "../../models/letter";
import Documents from "../../models/documents";
import { User } from "../../models";
import { generateResponse } from "../../services/response/response";
import { badRequest } from "../../services/error/BadRequest";
import { Op, where } from "sequelize";
import moment from "moment";
import { sequelize } from "../../utilities/db";
import { notFound } from "../../services/error/NotFound";
import Approval from "../../models/dropdown/status/approval";
import LetterStatus from "../../models/letterStatus";



class DocumentController{

    async getDocuments (req: Request, res: Response, next: NextFunction){
        try{

            const { page, records, year, month, employee_id, sortBy, sortOrder, status} = req.query as { page: string, records: string, year: string, month: string, employee_id: string, sortBy: string, sortOrder: string, status: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const year_int = parseInt(year, 10)

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
            const offset = (pageNumber - 1) * recordsPerPage;

            let whereOptions = {} as any;
            let whereOptions2 = {} as any;
            
            if(year){
                const startDate = moment(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
                const endDate = moment(`${year}-12-31`).endOf('year').format('YYYY-MM-DD');
                whereOptions.date = {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }

            if(month){
                const startDate = moment(`${month}-01`, 'MM').startOf('month').format('YYYY-MM-DD');
                const endDate = moment(`${month}-01`, 'MM').endOf('month').format('YYYY-MM-DD')
                whereOptions.date = {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }

            if(year && month){
                console.log("BOTH ARE PROVIDED")
                const startDate = moment(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD');
                const endDate = moment(`${year}-${month}-31`).startOf('month').format('YYYY-MM-DD')
                whereOptions.date = {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }

            if(employee_id){
                whereOptions2.employee_generated_id = employee_id
            }

            if(status){
                whereOptions.status = status
            }

            const orderOptions = [] as any[];

            if(sortBy && sortOrder){
                if(sortBy === 'employee_id'){
                    orderOptions.push([{model: User}, 'employee_generated_id', sortOrder])
                }
                if(sortBy === 'letter_type'){
                    orderOptions.push([sortBy, sortOrder])
                }
                if(sortBy === 'name'){
                    orderOptions.push([{model: User}, 'employee_name', sortOrder])
                }
                if(sortBy === 'status'){
                    orderOptions.push([{model: Approval}, 'status', sortOrder])
                }
                if(sortBy === 'date'){
                    orderOptions.push([sortBy, sortOrder])
                }
            }

            const list = await Letter.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: Documents
                    },
                    {
                        model: User,
                        where: whereOptions2,
                        attributes:['id', 'employee_name', 'employee_generated_id'],
                    },
                    {
                        model: LetterStatus,
                        attributes:['id', 'name']
                    }
                ],
                limit: recordsPerPage,
                offset: offset,
                order: orderOptions
            })

            const totalPages = Math.ceil(list.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;

            const meta = {
                totalCount: list.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const response = generateResponse(200, true, "Data fetched succesfully!", list.rows, meta)
            res.status(200).json(response)
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    async deleteDocuments (req: Request, res: Response, next: NextFunction){
        try{

            await sequelize.transaction(async(t) => {
                const {id} = req.params

                const letter = await Letter.findByPk(id) as any;

                if(letter){
                    const document = await Documents.findByPk(letter.document_id)
                    
                    await letter.destroy({transaction: t})

                    await document?.destroy({transaction: t})

                    const response = generateResponse(200, true, "Letter deleted succesfully!")
                    res.status(200).json(response)
                }else{
                    return next(notFound("There is no letter with that id!"))
                }
            })
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    async getEmployeeLetters (req: Request, res: Response, next: NextFunction){
        try{
            //@ts-ignore
            const {id} = req.credentials

            const user = await User.findByPk(id)

            const {page, records, year, month, sortBy, sortOrder, status, search_term} = req.query

            if (!page && !records) {
                next(badRequest("No request parameters are present!"))
                return
            }      

            const currentDate = moment().date()
            const currentMonth = moment().month() + 1
            const currentYear = moment().year()
    
            const pageNumber = parseInt(page as string)
            const recordsPerPage = parseInt(records as string)
    
            const offset = (pageNumber - 1) * recordsPerPage;

            if(user){

                const orderOptions = [] as any[];

                

                if(sortBy && sortOrder){
                    if(sortBy === 'employee_id'){
                        orderOptions.push([{model: User}, 'employee_generated_id', sortOrder])
                    }
                    if(sortBy === 'letter_type'){
                        orderOptions.push([sortBy, sortOrder])
                    }
                    if(sortBy === 'name'){
                        orderOptions.push([{model: User}, 'employee_name', sortOrder])
                    }
                }


                const whereOptions = {
                    user_id: id,
                    date: {
                        [Op.lte]: moment().format('YYYY-MM-DD')
                    }
                } as any;

                if(search_term){
                    whereOptions.letter_type = {
                        [Op.like]: `%${search_term}%`
                    }
                }

                if(year){
                    //@ts-ignore
                    if(year == currentYear){
                        const startDate = moment(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
                        const endDate = moment().format('YYYY-MM-DD')
                        whereOptions.date = {
                            [Op.gte]: startDate,
                            [Op.lte]: endDate
                        }
                    }else{
                        const startDate = moment(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
                        const endDate = moment(`${year}-12-31`).endOf('year').format('YYYY-MM-DD')
                        whereOptions.date = {
                            [Op.gte]: startDate,
                            [Op.lte]: endDate
                        }
                    }
                }

                if(status){
                    whereOptions.status = status
                }
                
                const letters = await Letter.findAndCountAll({
                    where: whereOptions,
                    include: [
                        {
                            model: Documents
                        },
                        {
                            model: User,
                            attributes:['id', 'employee_name', 'employee_generated_id'],
                        },
                        {
                            model: LetterStatus,
                            attributes:['id', 'name']
                        }
                    ],
                    offset: offset,
                    limit: recordsPerPage,
                    order: orderOptions
                })


                const totalPages = Math.ceil(letters.count / recordsPerPage)
                const hasNextPage = pageNumber < totalPages;
                const hasPrevPage = pageNumber > 1;

                const meta = {
                    totalCount: letters.count,
                    pageCount: totalPages,
                    currentPage: page,
                    perPage: recordsPerPage,
                    hasNextPage,
                    hasPrevPage
                }

                const result = {
                    data: letters.rows,
                    meta
                }

                const response = generateResponse(200, true, "Data fetched succesfully!", result.data, meta)
                res.status(200).json(response)
            }else{
                next(notFound("Cannot find a user with that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    async acceptLetter (req: Request, res: Response, next: NextFunction){
        try{

            const {id} = req.params

            const letter = await Letter.findByPk(id) as any;

            if(letter){
                if(letter.status == 2 || letter.status == 1){
                    next(badRequest("This letter has already been accepted/rejected"))
                }else{
                    await letter.update({
                        status: 1
                    })
                    const response = generateResponse(200, true, "Letter accepted succesfully!")
                    res.status(200).json(response)
                }
            }else{
                next(notFound("Cannot find a letter with that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    async rejectLetter (req: Request, res: Response, next: NextFunction) {
        try{

            const {id} = req.params

            const letter = await Letter.findByPk(id) as any;

            if(letter){
                if(letter.status == 1 || letter.status == 2){
                    next(badRequest("This letter has already been accepted/rejected"))
                }else{
                    await letter.update({
                        status: 2
                    })

                    const response = generateResponse(200, true, "Letter succesfully accepted!")
                    res.status(200).json(response)
                }
            }else{
                next(notFound("Cannot find a letter with that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

}


const documentController = new DocumentController()

export default documentController