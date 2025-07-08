import { NextFunction, Request, Response } from "express";
import {DestroyOptions, FindOptions, Model, Op, OrderItem, UpdateOptions, WhereOptions} from 'sequelize'
import { IMasterControllerOptions, MasterController } from "../masterController";
import { AttendanceStatus, User } from "../../models";
import { internalServerError } from "../../services/error/InternalServerError";

import AttendancePolicy from "../../models/attendancePolicy";
import { sequelize } from "../../utilities/db";
import RegularisationStatusAttendancePolicy from "../../models/regularisationStatus_attendancePolicy";
import { generateResponse } from "../../services/response/response";
import { badRequest } from "../../services/error/BadRequest";
import MasterPolicy from "../../models/masterPolicy";
import { conflict } from "../../services/error/Conflict";
import { notFound } from "../../services/error/NotFound";
import { Where } from "sequelize/types/utils";

type AttendancePolicyAttributes = {
    id: number,
    description: string,
    name: string,
    attendance_cycle_start: number,
    biometric: boolean,
    web: boolean,
    app: boolean,
    manual: boolean,
    regularisation_status: string,
    half_day: boolean,
    hours_half_day: number,
    display_overtime_hours: boolean,
    display_deficit_hours: boolean,
    display_late_mark: boolean,
    display_average_working_hours: boolean,
    display_present_number_of_days: boolean,
    display_absent_number_of_days: boolean,
    display_number_of_leaves_taken: boolean,
    display_average_in_time: boolean,
    display_average_out_time: boolean,
    flexibility_hours: boolean,
    call_out_regularisation: boolean,
    round_off: boolean,
    auto_approval_attendance_request: boolean,
    regularisation_restriction: boolean,
    regularisation_restriction_limit: boolean,
    regularisation_limit_for_month: number,
    bypass_regularisation_proxy: boolean,
    location_based_restriction: boolean,
    location_mandatory: boolean,
    location: string,
    distance_allowed: string,
    mobile_app_restriction: boolean,
    number_of_devices_allowed: number
}

type AttendancePolicyCreationAttributes = Omit<AttendancePolicyAttributes, 'id'>;

type AttendancePolicyModel = Model<AttendancePolicyCreationAttributes, AttendancePolicyCreationAttributes>;

type AttendancePolicyController = MasterController<AttendancePolicyModel> & {
    create:(req: Request, res:Response, next: NextFunction) => Promise<void>;
    attendancePolicyDelete: (req: Request, res: Response, next:NextFunction) => Promise<void>;
    attendancePolicyUpdate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const AttendancePolicyController= (
    model: typeof Model & {
        new (): User;
    }
):AttendancePolicyController => {

    const {update, destroy, getAllDropdown} = MasterController<User>(model);


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


            let orderOptions = [] as OrderItem[]
            let whereOptions = {} as any;

            if(sortBy && sortOrder){
                if(sortBy === 'name'){
                    orderOptions.push(['name', sortOrder])
                }
            }

            if(search_term){
                whereOptions.name = {
                    [Op.like]: `%${search_term}%`
                }
            }


            const data = await AttendancePolicy.findAndCountAll({
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

    const create = async(req: Request, res: Response, next: NextFunction) => {
        try{
            await sequelize.transaction(async(transaction) => {
                const {
                    name, 
                    description, 
                    default_attendance_status, 
                    working_hours, 
                    attendance_cycle_start, 
                    biometric, 
                    web, 
                    app, 
                    manual, 
                    regularisation_status, 
                    half_day, 
                    min_hours_for_half_day, 
                    display_overtime_hours, 
                    display_deficit_hours, 
                    display_late_mark, 
                    display_average_working_hours, 
                    display_present_number_of_days, 
                    display_absent_number_of_days, 
                    display_number_of_leaves_taken, 
                    display_average_in_time, 
                    display_average_out_time, 
                    flexibility_hours, 
                    call_out_regularisation, 
                    round_off, 
                    auto_approval_attendance_request, 
                    regularisation_restriction, 
                    regularisation_restriction_limit, 
                    regularisation_limit_for_month, 
                    bypass_regularisation_proxy, 
                    location_based_restriction, 
                    location_mandatory, 
                    location, 
                    distance_allowed,
                    mobile_app_restriction,
                    number_of_devices_allowed
                } = req.body

                const formData = {
                    name,
                    description,
                    working_hours,
                    attendance_cycle_start,
                    default_attendance_status,
                    biometric,
                    web,
                    app,
                    manual,
                    half_day,
                    min_hours_for_half_day,
                    display_overtime_hours,
                    display_deficit_hours,
                    display_late_mark,
                    display_average_working_hours,
                    display_present_number_of_days,
                    display_absent_number_of_days,
                    display_number_of_leaves_taken,
                    display_average_in_time,
                    display_average_out_time,
                    flexibility_hours,
                    call_out_regularisation,
                    round_off,
                    auto_approval_attendance_request,
                    regularisation_restriction,
                    regularisation_restriction_limit,
                    regularisation_limit_for_month,
                    bypass_regularisation_proxy,
                    location_based_restriction,
                    location_mandatory,
                    location,
                    distance_allowed,
                    mobile_app_restriction,
                    number_of_devices_allowed
                }
        
                const attendancePolicy = await AttendancePolicy.create(formData, {transaction}) as any;

                if(!Array.isArray(regularisation_status)){
                    return next(badRequest("regularisation status should be an array of id's"))
                }

                await Promise.all(
                    regularisation_status.map(async (statusId) => {
                        if(typeof statusId !== 'number'){
                            throw new Error('Invalid statusId in regularisation_status array');
                        }
                        await RegularisationStatusAttendancePolicy.create(
                            {
                                attendance_policy_id: attendancePolicy.id,
                                regularisation_status_id: statusId
                            },
                            {transaction}
                        )
                    })
                )

                const response = generateResponse(201,true, "Attendance Policy Created Succesfully!", null )
                res.status(201).json(response)
            })
        }
        catch(err){
            console.log(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    async function attendancePolicyDelete(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> {
        try {
          const id = Number(req.params.id);

          const isReferenced = await MasterPolicy.findOne({
            where: { attendance_policy_id: id },
          });

          if(isReferenced){
            next(conflict("Unable to delete. Policy is already in use."))
          }
          
          const attendancePolicy = await AttendancePolicy.findByPk(id)

          if(!attendancePolicy){
            next(badRequest("No attendance Policy exists with that id"))
          }

          const options: DestroyOptions = { where: { id } };
          await model.destroy(options);
          const response = generateResponse(200, true, "Deleted Succesfully!", )
          res.status(200).json(response);
        } catch (err) {
        //   res.status(500).json(err);
          next(internalServerError("Something Went Wrong!"))
        }
    }

    async function attendancePolicyUpdate(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> {
        try {

            await sequelize.transaction(async(t) => {
                const {id} = req.params

                const options: UpdateOptions = { where: { id }, transaction: t };

            

                const {
                    description,
                    name,
                    attendance_cycle_start,
                    biometric,
                    web,
                    app,
                    manual,
                    regularisation_status,
                    half_day,
                    min_hours_for_half_day,
                    display_overtime_hours,
                    display_deficit_hours,
                    display_late_mark,
                    display_average_working_hours,
                    display_present_number_of_days,
                    display_absent_number_of_days,
                    display_number_of_leaves_taken,
                    display_average_in_time,
                    display_average_out_time,
                    flexibility_hours,
                    call_out_regularisation,
                    round_off,
                    auto_approval_attendance_request,
                    regularisation_restriction,
                    regularisation_restriction_limit,
                    regularisation_limit_for_month,
                    bypass_regularisation_proxy,
                    location_based_restriction,
                    location_mandatory,
                    location,
                    distance_allowed,
                    mobile_app_restriction,
                    number_of_devices_allowed,
                    default_attendance_status
                } = req.body
    
                const formBody = {
                    description,
                    name,
                    attendance_cycle_start,
                    biometric,
                    web,
                    app,
                    manual,
                    bypass_regularisation_proxy,
                    location_based_restriction,
                    location_mandatory,
                    location,
                    distance_allowed,
                    display_overtime_hours,
                    display_deficit_hours,
                    display_late_mark,
                    display_average_working_hours,
                    display_present_number_of_days,
                    display_absent_number_of_days,
                    display_number_of_leaves_taken,
                    display_average_in_time,
                    display_average_out_time,
                    flexibility_hours,
                    call_out_regularisation,
                    round_off,
                    auto_approval_attendance_request,
                    min_hours_for_half_day,
                    half_day,
                    default_attendance_status
                } as any;
    
                // if(half_day) {
                //     formBody.half_day = half_day
                //     formBody.min_hours_for_half_day = min_hours_for_half_day
                // }
    
                if(regularisation_restriction){
                    formBody.regularisation_restriction = regularisation_restriction
                    formBody.regularisation_restriction_limit = regularisation_restriction_limit
                    formBody.regularisation_limit_for_month = regularisation_limit_for_month
                }
    
                if(mobile_app_restriction){
                    formBody.mobile_app_restriction = mobile_app_restriction
                    formBody.number_of_devices_allowed = number_of_devices_allowed
                }


                const destroyed = await RegularisationStatusAttendancePolicy.destroy({
                    where: {
                        attendance_policy_id: id
                    },
                    transaction: t
                })

                if(regularisation_status){
                    await Promise.all(
                        regularisation_status.map(async (statusId: string | number) => {
                            if(typeof statusId !== 'number'){
                                throw new Error('Invalid statusId in regularisation_status array');
                            }
                            await RegularisationStatusAttendancePolicy.create(
                                {
                                    attendance_policy_id: id,
                                    regularisation_status_id: statusId
                                },
                                {transaction: t}
                            )
                        })
                    )
                }

                const update = await AttendancePolicy.update(formBody, options)

                const response = generateResponse(200, true, "Data updated Succesfully!", update)    
                res.status(200).json(response)
                
            })

        } catch (err) {
            console.log(err)
          res.status(500).json(err);
        //   next(internalServerError("Something Went Wrong!"))
        }
    }

    async function getById(req: Request, res: Response, next: NextFunction): Promise<void>{
        try{

            const {id} = req.params

            const attendancePolicy = await AttendancePolicy.findByPk(id, {
                include: [
                    {model: AttendanceStatus, attributes: ['id', 'name'], through: {attributes: []}}
                ]
            })

            if(attendancePolicy){
                const response = generateResponse(200, true, "Data fetched succesfully!", attendancePolicy)
                res.status(200).json(response)

            }else{
                next(notFound("Cannot find attendance Policy with that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    
    return{ getAll, getById, update, destroy, create, getAllDropdown, attendancePolicyDelete, attendancePolicyUpdate }
}