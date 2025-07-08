import { Model, Op } from "sequelize";
import { IMasterControllerOptions, MasterController } from "../masterController";
import { NextFunction, Request, Response } from "express";
import { internalServerError } from "../../services/error/InternalServerError";
import { badRequest } from "../../services/error/BadRequest";
import HolidayDatabase from "../../models/holidayDatabase";
import { generateResponse } from "../../services/response/response";
import Notification from "../../models/notification";
import { notFound } from "../../services/error/NotFound";


type NotificationAttributes = {
    id: number,
    name: string,
    date: string
}

type NotificationCreationAttributes = Omit<NotificationAttributes, 'id'>;

type NotificationModel = Model<NotificationAttributes, NotificationCreationAttributes>;

type NotificationController = MasterController<NotificationModel> & {
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markAllRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markSingleRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}


export const NotificationController = (
    model: typeof Model & {
        new(): NotificationModel
    }
):NotificationController => {

    const { create, destroy, update, getById, getAllDropdown} = MasterController<NotificationModel>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            //@ts-ignore
            const{id} = req.credentials

            const{read} = req.query

            const { sortOrder, sortBy } = req.query

            const { page, records } = req.query as { page: string, records: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;


            const where = {
                user_id: id
            } as any;

            if(read){
                where.read = read
            }

            const orderClause = [] as any;

			if(sortOrder && sortBy){
				orderClause.push([sortBy, sortOrder])
			}

            const notification = await Notification.findAndCountAll({
                where,
                offset: offset,
                limit: recordsPerPage,
                order: orderClause
            })

            const totalPages = Math.ceil(notification.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;

            const meta = {
                totalCount: notification.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const response = generateResponse(200, true, "Data fetched succesfully!", notification.rows, meta)
            
            res.status(200).json(response)

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const markAllRead = async(req: Request, res: Response, next:NextFunction) : Promise<void> => {
        try{
            //@ts-ignore
            const {id} = req.credentials

            const notifications = await Notification.findAll({
                where: {
                    user_id: id
                }
            })

            await Promise.all(
                notifications.map(async(notification) => {
                    await notification.update({
                        read: 1
                    })
                })
            )
            
            const response = generateResponse(200, true, "Mark all notifications as read succesfully!")
            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const markSingleRead = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.params
            const notification = await Notification.findByPk(id)

            if(notification){
                await notification.update({
                    read: 1
                })

                const response = generateResponse(200, true, "Notification updated succesfully!")
                res.status(200).json(response)
            }else{
                next(notFound("There is no notification with that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    return { getAll, create, destroy, update, getById, markAllRead, markSingleRead, getAllDropdown }
}
