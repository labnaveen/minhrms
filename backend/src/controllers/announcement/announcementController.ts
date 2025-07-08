//@ts-nocheck
import {  FindOptions, Model, Op, Sequelize, where } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { IMasterControllerOptions, MasterController } from "../masterController";
import { internalServerError } from "../../services/error/InternalServerError";
import Announcement from "../../models/announcements";
import { sequelize } from "../../utilities/db";
import AnnouncementEmployee from "../../models/announcementEmployee";
import AnnouncementDivisionUnit from "../../models/announcementDivisionUnit";
import { sendNotification } from "../../services/notification/sendNotification";
import { generateResponse } from "../../services/response/response";
import Notification from "../../models/notification";
import DivisionUnits from "../../models/divisionUnits";
import { decode } from "jsonwebtoken";
import { User } from "../../models";
import { badRequest } from "../../services/error/BadRequest";
import UserDivision from "../../models/userDivision";
import { start } from "repl";
import { notFound } from "../../services/error/NotFound";
import moment from "moment";


//Types for Leave Balance 
type AnouncementAttributes = {
    id: number,
    title: string,
    description: string,
    start_date: string,
    end_date: string,
    acceptable_announcement: boolean,
    // archive: boolean
}

type AnnouncementCreationAttributes = Omit<AnouncementAttributes, 'id'>;

type AnnouncementModel = Model<AnouncementAttributes, AnnouncementCreationAttributes>;

type AnnouncementController = MasterController<AnnouncementModel> & {
    create:(req: Request, res:Response, next: NextFunction) => Promise<void>;
    getAnnouncementsForAUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update:(req:Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next:NextFunction) => Promise<void>;
}



export const AnnouncementController = (
    model: typeof Model & {
        new(): AnnouncementModel
    }
):AnnouncementController => {

    const {getAllDropdown, getById} = MasterController<AnnouncementModel>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {page, records, search_term, sortBy, sortOrder}= req.query

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }
    
    
            const pageNumber = parseInt(page as string)
            const recordsPerPage = parseInt(records as string)
    
            const offset = (pageNumber - 1) * recordsPerPage;
            let whereOptions = {} as any
            const orderOptions = [] as any

            if(sortBy && sortOrder){
                orderOptions.push([sortBy, sortOrder])
            }

            if(search_term){
                whereOptions.title = {
                    [Op.like]: `%${search_term}%`
                }
            }

            const data = await Announcement.findAndCountAll({
                where: whereOptions,
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

    async function create (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void>{
        try{
            await sequelize.transaction(async(t) => {
                const {title, description, suspendable, start_date, end_date, employees, units, group_specific} = req.body

                const announcementFormData = {
                    title,
                    description,
                    start_date: suspendable? start_date:null,
                    end_date: suspendable? end_date:null,
                    group_specific: group_specific,
                    suspendable: suspendable,
                }
    
                const announcement = await Announcement.create(announcementFormData, {transaction: t}) as any;

                if(employees && employees.length > 0){
                    await Promise.all(
                        employees.map(async(id: any) => {
                            await AnnouncementEmployee.create({
                                announcement_id: announcement.id,
                                user_id: id
                            }, {transaction: t})

                            const notificationFormData = {
                                user_id: id,
                                title: 'Announcement',
                                description: announcement.description,
                                type: 'announcement',
                            }

                            const notification = await Notification.create(notificationFormData, {transaction: t}) as any;
            
                            await sendNotification(id, {...notificationFormData, date: notification?.created_at, id: notification.id})
  
                        })
                        
                    )
                }

                if(units && units.length>0){
                    await Promise.all(
                        units.map(async(unit) => {
                            await AnnouncementDivisionUnit.create({
                                announcement_id: announcement.id,
                                division_unit_id: unit
                            }, {transaction: t})

                            const employee = await UserDivision.findAll({
                                where:{
                                    unit_id: unit,
                                },
                            })

                            await Promise.all(
                                employee.map(async(user) => {
                                    const notificationFormData = {
                                        user_id: user.user_id,
                                        title: 'Announcement',
                                        description: announcement.description,
                                        type: 'announcement',
                                    }
                    
                                    const notification = await Notification.create(notificationFormData, {transaction: t});
                                    
                                    await sendNotification(user.user_id, {...notificationFormData, date: notification.created_at, id: notification.id})
                                })
                            )
                        })
                    )
                }

                const response = generateResponse(201, true, "Announcement Posted Succesfully!", announcement)

                res.status(201).json(response)
            })
        }catch(err){
            console.log(err)
            // res.status(500).json(err)
            next(internalServerError("Something went Wrong!"))
        }
    }

    async function getAnnouncementsForAUser (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void>{
        try{
        
            const {id} = req.credentials
            const { page, records } = req.query as { page: string, records: string };
    
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }
    
            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
    
            const offset = (pageNumber - 1) * recordsPerPage;
    
            const employee = await User.findByPk(id, {
                include: [
                    {
                        model: DivisionUnits,
                    }
                ]
            }) as EmployeeResponseType | null
    
            const divisionUnit = employee?.division_units?.map((unit) => unit.id)

            const today = moment().format("YYYY-MM-DD hh:mm:ss")

            console.log("TODAY>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", today)
            
    
            const _announcement = await Announcement.findAll({
                attributes: ['id'],
                where: {
                    [Op.or]: [
                        {
                            suspendable: false,
                            start_date: null,
                            end_date: null
                        },
                        {
                            [Op.and]: [
                                {
                                    suspendable: true,
                                    start_date: { [Op.lte]: today },
                                    end_date: { [Op.gte]: today }
                                },
                                {
                                    [Op.or]: [
                                        {
                                            group_specific: false,
                                        },
                                        {
                                            group_specific: true,
                                            '$division_units.id$':{
                                                [Op.in]: divisionUnit,
                                                where: {
                                                    start_date: {
                                                        [Op.lte]: today
                                                    },
                                                    end_date: {
                                                        [Op.lte]: today
                                                    }
                                                }
                                            },
                                        },
                                    ],
                                }
                            ]
                        }
                    ]
                },
                include: [
                    {
                        model: DivisionUnits,
                        through: { attributes: [] },
                        as: 'division_units',
                        attributes: ['id'],
                        where: {
                            id: {
                                [Op.in]: divisionUnit
                            }
                        }
                    }
                ]
            })
    
            const announcementIdsArray = _announcement.map(item => item.id );
    
            const announcements = await Announcement.findAndCountAll({
                where: {
                    [Op.or]: [
                        {
                            id:{
                                [Op.in]: announcementIdsArray
                            }
                        },
                        {
                            group_specific: false
                        }
                    ]
                    
                },
                include:[
                    {
                        model: DivisionUnits,
                        as: 'division_units',
                        through: {
                            attributes: [],
                        },
                        // where:{
                        //     id: {
                        //         [Op.in]: divisionUnit
                        //     }
                        // },
                        attributes: []
                    }
                ],
                limit: recordsPerPage,
                offset: offset,
                order: [['id', 'DESC']]
            })
    
    
            const totalPages = Math.ceil(announcements.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
    
            const meta = {
                totalCount: announcements.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
              }
      
              const result = {
                data: announcements.rows,
                meta
              }
    
            const response = generateResponse(200, true, "Announcements fetched succesfully!", result.data, meta)
    
            res.status(200).json(response)
            
        }catch(err){
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.credentials
            const announcement_id = req.params.id
            
            const today = moment().format('YYYY-MM-DD')

            const {title, description, suspendable, group_specific, end_date, units, employees, start_date } = req.body

            if(moment(start_date).isBefore(today)){
                next(badRequest("Cannot change the start date once the announcement is active"))
            }

            await sequelize.transaction(async(t) => {

                const formBody = {
                    title,
                    description,
                    suspendable,
                    group_specific,
                    start_date,
                    end_date
                }

                if(suspendable === false){
                    formBody.start_date = null
                    formBody.end_date = null
                }

                const announcement = await Announcement.findByPk(announcement_id)

                await announcement?.update(formBody, {transaction: t})
                
                await AnnouncementDivisionUnit.destroy({
                    where:{
                        announcement_id: announcement_id
                    },
                    transaction: t
                })

                if(units && units.length>0){
                    await Promise.all(
                        units.map(async(unit_id) => {
                            await AnnouncementDivisionUnit.create({
                                announcement_id: announcement_id,
                                division_unit_id: unit_id
                            }, {transaction: t})
                        })
                    )
                }                
                const response = generateResponse(200, true, "Announcement updated succesfully!");
                res.status(200).json(response)
            })
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next:NextFunction): Promise<void> => {
        try{

            await sequelize.transaction(async(t) => {
                const announcement_id = req.params.id

                const announcement = await Announcement.findByPk(announcement_id);

                if(announcement){
                    
                    await AnnouncementDivisionUnit.destroy({
                        where:{
                            announcement_id: announcement_id
                        },
                        transaction: t
                    })

                    await announcement.destroy({transaction: t})

                    const response = generateResponse(200, true, "Announcement deleted succesfully!")

                    res.status(200).json(response)
                }else{
                    next(notFound("No announcement found with that ID"))
                }
            })
            
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    
    return { getAll, create, update, getAllDropdown, getById, destroy, getAnnouncementsForAUser }
}