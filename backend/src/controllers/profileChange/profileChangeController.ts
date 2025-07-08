//@ts-nocheck
import { Model, Op } from "sequelize";
import { MasterController } from "../masterController";
import { NextFunction, Request, Response } from "express";
import { internalServerError } from "../../services/error/InternalServerError";
import { badRequest } from "../../services/error/BadRequest";
import { generateResponse } from "../../services/response/response";
import { User } from "../../models";
import ReportingManagers from "../../models/reportingManagers";
import ProfileChangeRequests from "../../models/profileChangeRequests";
import ProfileChangeRecord from "../../models/profileChangeRecord";
import Approval from "../../models/dropdown/status/approval";
import { forbiddenError } from "../../services/error/Forbidden";
import { notFound } from "../../services/error/NotFound";
import { sequelize } from "../../utilities/db";
import moment from "moment";
import { sendNotification } from "../../services/notification/sendNotification";
import { sendPushNotification } from "../../services/pushNotification/notificationService";
import ProfileChangeRequestHistory from "../../models/profileChangeRequestHistory";
import Notification from "../../models/notification";


type ProfileChangeAttributes = {
    id: number,
}

type ProfileChangeCreationAttributes = Omit<ProfileChangeAttributes, 'id'>;

type ProfileChangeModel = Model<ProfileChangeAttributes, ProfileChangeCreationAttributes>;

type ProfileChangeController = MasterController<ProfileChangeModel> & {
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAdminProfileChangeRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    adminApprovalProfileChangeRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    adminRejectionProfileChangeRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}


export const ProfileChangeController = (
    model: typeof Model & {
        new(): ProfileChangeModel
    }
):ProfileChangeController => {

    const {create, destroy, update, getById, getAllDropdown} = MasterController<ProfileChangeModel>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            //@ts-ignore
            const {id} = req.credentials
            const { page, records, sortBy, sortOrder, search_term } = req.query as { page: string, records: string, sortBy: string, sortOrder: string, search_term: string };
            

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;


            const manager = await ReportingManagers.findAll({
                where:{
                    user_id: id
                }
            })

            const orderOptions = [] as any[];

            if(sortBy && sortOrder){
                if(sortBy === 'employee_name'){
                    orderOptions.push([{model: ProfileChangeRecord}, {model: User}, 'employee_name', sortOrder]);
                }
                
                if(sortBy === 'section'){
                    orderOptions.push([{model: ProfileChangeRecord}, 'section', sortOrder])
                }
                // orderOptions.push([sortBy, sortOrder])
            }

            // if(manager.length > 0){

                //@ts-ignore
            const managerIds = manager.map(manager => manager.user_id); // Extract manager IDs from the array

            let whereOptions = {
                user_id: {[Op.in]: managerIds},
                status: 1
            } as any;

            

            if(search_term){
                whereOptions[Op.or] = [
                    {
                        '$profile_change_record.user.employee_name$': {
                            [Op.like]: `%${search_term}%`
                        }
                    }
                ];
            }


            const profileChangeRequests = await ProfileChangeRequests.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: ProfileChangeRecord,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        },
                        include: [
                            {
                                model: Approval,
                                attributes: ['id', 'name']
                            },
                            {
                                model: User,
                                attributes: ['id', 'employee_name']
                            }
                        ]
                    },
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                offset: offset,
                limit: recordsPerPage,
                order: orderOptions
            })
            
            const totalPages = Math.ceil(profileChangeRequests.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;


            const meta = {
                totalCount: profileChangeRequests.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: profileChangeRequests.rows,
                meta
            }

            const response = generateResponse(200, true, "Requests fetched succesfully!", result.data, result.meta);
            res.status(200).json(response)
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getAdminProfileChangeRequests = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            //@ts-ignore
            const {id} = req.credentials
            const { page, records, sortBy, sortOrder, search_term, status } = req.query as { page: string, records: string, sortBy: string, sortOrder: string, search_term: string, status: string };

            const user = await User.findByPk(id)

            if(!user){
                next(notFound('User not found with this id!'))
            }

            //@ts-ignore
            if(user?.role_id !== 1){
                next(forbiddenError("You don't have administrator rights to access this resource."))
            }


            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

            const orderOptions = [] as any[];

            if(sortBy && sortOrder){
                if(sortBy === 'employee_name'){
                    orderOptions.push([{model: ProfileChangeRecord}, {model: User}, 'employee_name', sortOrder]);
                }
                
                if(sortBy === 'section'){
                    orderOptions.push([{model: ProfileChangeRecord}, 'section', sortOrder])
                }
                // orderOptions.push([sortBy, sortOrder])
            }

                //@ts-ignore

            let whereOptions = {
                // user_id: 1,
            } as any;

            if(status && status !== "null"){
                whereOptions.status = status
            }
            
            let whereOptions2 = {} as any
            
            if(search_term){
                whereOptions2[Op.or] = [
                    {
                        'employee_name':{
                            [Op.like]: `%${search_term}%`

                        }
                    }
                ]
            }

            const profileChangeRequests = await ProfileChangeRecord.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: Approval,
                        attributes: ['id', 'name']
                    },
                    {
                        model: User,
                        where: whereOptions2,
                        attributes: ['id', 'employee_name'],
                        as: 'profile_change_requester'
                    },
                    {
                        model: ProfileChangeRequestHistory,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'employee_name']
                            }
                        ]
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                offset: offset,
                limit: recordsPerPage,
                order: orderOptions,
                logging: true
            })


            // const profileChangeRequests = await ProfileChangeRequests.findAndCountAll({
            //     where: whereOptions,
            //     include: [
            //         {
            //             model: ProfileChangeRecord,
            //             attributes: {
            //                 exclude: ['createdAt', 'updatedAt']
            //             },
            //             include: [
            //                 {
            //                     model: Approval,
            //                     attributes: ['id', 'name']
            //                 },
            //                 {
            //                     model: User,
            //                     attributes: ['id', 'employee_name']
            //                 },
            //                 {
            //                     model: ProfileChangeRequestHistory,
            //                     include: [
            //                         {
            //                             model: User,
            //                             attributes: ['id', 'employee_name']
            //                         }
            //                     ]
            //                 }
            //             ]
            //         },
            //     ],
            //     attributes: {
            //         exclude: ['createdAt', 'updatedAt']
            //     },
            //     offset: offset,
            //     limit: recordsPerPage,
            //     order: orderOptions
            // })
            
            const totalPages = Math.ceil(profileChangeRequests.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;


            const meta = {
                totalCount: profileChangeRequests.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: profileChangeRequests.rows,
                meta
            }

            const response = generateResponse(200, true, "Requests fetched succesfully!", result.data, result.meta);
            res.status(200).json(response)

        }catch(err){
            console.log("err: ", err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const adminApprovalProfileChangeRequests = async( req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{
            //@ts-ignore
            const {id} = req.credentials 

            const requestId = req.params.id

            const user = await User.findByPk(id)

            if(!user){
                next(notFound("User not found!"))
            }

            //@ts-ignore
            if(user?.role_id !== 1){
                next(forbiddenError("You don't have administrator rights!"))
            }
            
            const profileChangeRecord = await ProfileChangeRecord.findByPk(requestId)

			const profileChangeRequest = await ProfileChangeRequests.findOne({
                where: {
                    //@ts-ignore
                    profile_change_record_id: profileChangeRecord?.id,
                    user_id: id
                }
            })

			if(!profileChangeRequest){
				next(notFound("Cannot find profile change request"))
			}

			const profileChangeRequests = await ProfileChangeRequests.findAll({
				where: {
                    //@ts-ignore
					profile_change_record_id: profileChangeRecord?.id,   
				}
			})

			await sequelize.transaction(async(t) => {

				await Promise.all(
					profileChangeRequests.map(async(request) => {
						const profileChangeRecord = await ProfileChangeRecord.findByPk(request.profile_change_record_id)
						// request.status = regularizationRecord?.request_status
                        //@ts-ignore
						request.status = 2
						await request.save({transaction: t})
					})   
				)

				if(profileChangeRecord){
					profileChangeRecord.status = 2
					await profileChangeRecord.save({transaction: t})

                    const changeValues = profileChangeRecord.change
                    
                    Object.keys(changeValues).map((key) => {
                        if(key === 'section'){
                            delete changeValues[key]
                        }
                        if(key === 'employee_gender_id'){
                            changeValues[key] = changeValues[key].id
                        }
                    })

                    const user = await User.findByPk(profileChangeRecord?.user_id);

                    await user?.update(changeValues, {transaction: t})

					await ProfileChangeRequestHistory.create({
						profile_change_record_id: profileChangeRecord?.id,
						user_id: id,
						action: 'approved',
						status_before: 1,
						status_after: 2,
					}, {transaction: t})
					

					const notification = await Notification.create({
						user_id: profileChangeRecord?.user_id,
						title: 'Profile Change Request',
						type: 'profile_change_request_approval',
						description: `${user?.employee_name} has approved your profile change request`
					}, {transaction: t})

					await sendNotification(profileChangeRecord?.user_id, notification)

					let data = {
						user_id: profileChangeRecord?.user_id,
						type: 'profile_change_request_approval',
						message:`${user?.employee_name} has approved your profile change request`,
						path: 'profile_change_request_approval',
						reference_id: profileChangeRecord?.id
					}

					await sendPushNotification(data)

					const response = generateResponse(200, true, "Profile Change Request Approved succesfully", profileChangeRequest);
					res.status(200).json(response)
				}
			})

        }catch(err){
            console.log("err: ", err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const adminRejectionProfileChangeRequests = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const {id} = req.credentials 

            const {requestId} = req.params

            const user = await User.findByPk(id)

            if(!user){
                next(notFound("User not found!"))
            }

            if(user?.role_id !== 1){
                next(forbiddenError("You don't have administrator rights!"))
            }
            
            const profileChangeRequest = await ProfileChangeRequests.findByPk(requestId)

			const profileChangeRecord = await ProfileChangeRecord.findByPk(profileChangeRequest?.profile_change_record_id)

			if(!profileChangeRequest){
				next(notFound("Cannot find regularisation request"))
			}

			const profileChangeRequests = await ProfileChangeRequests.findAll({
				where: {
					profile_change_record_id: profileChangeRecord?.id,   
				}
			})

			await sequelize.transaction(async(t) => {
                await Promise.all(
					profileChangeRequests.map(async(request) => {
						const profileChangeRecord = await ProfileChangeRecord.findByPk(request.profile_change_record_id)
						// request.status = regularizationRecord?.request_status
						request.status = 2
						await request.save({transaction: t})
					})   
				)

				if(profileChangeRecord){
					profileChangeRecord.status = 3
					await profileChangeRecord.save({transaction: t})

					await ProfileChangeRequestHistory.create({
						profile_change_record_id: profileChangeRecord?.id,
						user_id: id,
						action: 'rejected',
						status_before: 1,
						status_after: 3,
					}, {transaction: t})
					

					const notification = await Notification.create({
						user_id: profileChangeRecord?.user_id,
						title: 'Profile Change Request',
						type: 'profile_change_request_rejection',
						description: `${user?.employee_name} has rejected your profile change request`
					}, {transaction: t})

					await sendNotification(profileChangeRecord?.user_id, notification)

					let data = {
						user_id: profileChangeRecord?.user_id,
						type: 'regularisation_request_approval',
						message:`${user?.employee_name} has rejected your regularization request`,
						path: 'regularisation_request_approval',
						reference_id: profileChangeRecord?.id
					}

					await sendPushNotification(data)

					const response = generateResponse(200, true, "Profile Change Request rejected", profileChangeRequest);
					res.status(200).json(response)
				}
            })

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    return { 
        getAll, 
        create, 
        destroy, 
        update, 
        getById, 
        getAllDropdown,
        getAdminProfileChangeRequests,
        adminApprovalProfileChangeRequests,
        adminRejectionProfileChangeRequests 
    }
}
