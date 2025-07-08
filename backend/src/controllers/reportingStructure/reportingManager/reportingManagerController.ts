import e, { NextFunction, Request, Response } from "express";
import {Model, Op, Sequelize} from 'sequelize'
import { MasterController } from "../../masterController";
import ReportingManagers from "../../../models/reportingManagers";
import { generateResponse } from "../../../services/response/response";
import { internalServerError } from "../../../services/error/InternalServerError";
import { User } from "../../../models";
import { badRequest } from "../../../services/error/BadRequest";
import { sequelize } from "../../../utilities/db";
import { notFound } from "../../../services/error/NotFound";
import ReportingManagerEmployeeAssociation from "../../../models/reportingManagerEmployeeAssociation";
import LeaveRequest from "../../../models/leaveRequest";
import { forbiddenError } from "../../../services/error/Forbidden";

export type ReportingManagerAttributes = {
    id: number,
    user_id: number,
    reporting_role_id: number
}


type ReportingManagerCreationAttributes = Omit<ReportingManagerAttributes, 'id'>;

type ReportingManagerModel = Model<ReportingManagerAttributes, ReportingManagerCreationAttributes>;

type ReportingManagerController = MasterController<ReportingManagerModel> & {
    create:(req: Request, res:Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const ReportingManagerController= (
    model: typeof Model & {
        new (): ReportingManagers;
    }
):ReportingManagerController => {

    const { getAllDropdown} = MasterController<ReportingManagers>(model);


    const create = async(req: Request, res: Response, next: NextFunction) => {
        try{
            const {user_id, reporting_role_id, employee_id} = req.body

            // await sequelize.transaction(async(t) => {
                

            const reportingManager = await ReportingManagers.findOne({
                where:{
                    user_id: user_id,
                    reporting_role_id: reporting_role_id
                },
                include:[
                    {model: User, as: 'Employees'}
                ]
            }) as any;

            const manager = await ReportingManagers.findAll({
                where: {
                    user_id: user_id
                },
            })

            let employeesThoseAreManagers = [] as any[]

            for(let user of employee_id){
                const manager = await ReportingManagers.findAll({
                    where: {
                        user_id: user
                    },
                    include: [
                        {model: User, as: 'Employees', attributes: {include: ['id', 'employee_name']}}
                    ]
                })

                // manager.forEach(item => {
                //     employeesThoseAreManagers.push(item)
                // })
                employeesThoseAreManagers.push(...manager)
            }

            // const conflict = employeesThoseAreManagers.some(manager => {
            //     return manager.Employees.some(employee => {console.log("!!!!!!!!!!!!!!!!!", employee.id, user_id); employee.id == user_id})
            // });

            const conflict = employeesThoseAreManagers.some(manager => {
                const hasConflict = manager?.Employees?.some((employee: { id: number; }) => {
                    return employee.id === parseInt(user_id);
                });
                return hasConflict;
            });

            console.log("CONFLICTTT:", conflict)

            if(conflict){
                return next(badRequest('An employee is already a manager of the said employee!'))
            }

            if(reportingManager){
                const association = await ReportingManagerEmployeeAssociation.findAll({
                    where:{
                        reporting_manager_id: reportingManager.id,
                        reporting_role_id: reporting_role_id
                    }
                })

                const oldArray: any[] = []

                association.length>0 && association.forEach((item : any) => {
                    oldArray.push(item.user_id)
                })
                
                
                const _valuesToAdd = employee_id.filter( (id: any) => !oldArray.includes(id))

                if(_valuesToAdd.length > 0){
                    if(_valuesToAdd && _valuesToAdd.length > 0){
                        await Promise.all(
                            _valuesToAdd.map(async(employeeId: number) => {
                                const employee = await User.findByPk(employeeId);
                                if(typeof employeeId !== 'number'){
                                    throw new Error('Invalid id in employee_id array');
                                }
                                if(employee){
                                    await ReportingManagerEmployeeAssociation.create({
                                        user_id: employeeId,
                                        reporting_role_id: reporting_role_id,
                                        reporting_manager_id: reportingManager.id
                                    }) 
                                }else{
                                    throw new Error("There are no employees with that id!")
                                }
                            })
                        )
                    }

                    const response = generateResponse(200, true, "Created Succesfully!")
                    
                    // res.status(200).json({message: "There are some new Values! ADD", data:"ADDED!"})
                    res.status(200).json(response)
                }else{
                    next(badRequest("These employees are already added to this manager."))
                }
            }else{

                const formData = {
                    user_id,
                    reporting_role_id
                }

                const newManager = await ReportingManagers.create(formData) as any;

                if(employee_id && employee_id.length > 0){
                    await Promise.all(
                        employee_id.map(async(employeeId: number) => {
                            const employee = await User.findByPk(employeeId);
                            if(typeof employeeId !== 'number'){
                                throw new Error('Invalid id in employee_id array');
                            }
                            if(employee){
                                await ReportingManagerEmployeeAssociation.create({
                                    user_id: employeeId,
                                    reporting_role_id: reporting_role_id,
                                    reporting_manager_id: newManager.id
                                }) 
                            }else{
                                throw new Error("There are no employees with that id!")
                            }
                        })
                    )
                }

                const response = generateResponse(201, true, "Reporting Manager succesfully created!")
                res.status(201).json(response)
            }
        }
        catch(err){
            console.log(err)
            // res.status(500).json(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const { page, records, search_term, sortBy, sortOrder } = req.query as { page: string, records: string, search_term: string, sortBy: string, sortOrder: string };

            const reporting_role_id = req.params.id

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }
            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

            let orderOptions = [] as any[]

            let whereOption = {
                reporting_role_id: reporting_role_id
            } as any;

            let whereOption2 = {} as any;

            if(search_term){
                whereOption2['$manager.employee_name$'] = {
                    [Op.like]: `%${search_term}%`
                };    
            }

            const reportingManagers = await ReportingManagers.findAndCountAll({
                where: whereOption,
                include: [
                    {
                        model: User,
                        as:'manager', 
                        attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], 
                        where: whereOption2,
                    },
                    {
                        model: User, 
                        as:'Employees', 
                        attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], 
                        required: false
                    },
                ],
                attributes:['id'],
                offset: offset,
                limit: recordsPerPage,
                logging: true, 
            })

            
            const totalPages = Math.ceil(reportingManagers.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;



            const meta = {
                totalCount: reportingManagers.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }


            const response = generateResponse(200, true, "Data fetched succesfully!", reportingManagers.rows, meta)

            res.status(200).json(response)

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getById = async(req: Request, res: Response, next:NextFunction): Promise<void> => {
        try{

            const {id} = req.params
            const reportingManager = await ReportingManagers.findByPk(id, {
                include: [
                    {
                        model: User, as:'manager', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false
                    },
                    {
                        model: User, as:'Employees', attributes: ['id', 'employee_generated_id', 'employee_name', 'role_id'], required: false
                    },
                    // {
                    //     model: User, as: 'employees', where: {
                    //         reporting_manager_id: id
                    //     },
                    //     attributes: ['id', 'employee_name', 'employee_generated_id']
                    // }
                ]
            })

            const response = generateResponse(200, true, "Data fetched succesfully!", reportingManager)

            res.status(200).json(response)

        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.params
            const {reporting_role_id, user_id, employee_id} = req.body
            const reportingManager = await ReportingManagers.findByPk(id) as any;

            let employeesThoseAreManagers = [] as any[]

            for(let user of employee_id){
                const manager = await ReportingManagers.findAll({
                    where: {
                        user_id: user
                    },
                    include: [
                        {model: User, as: 'Employees', attributes: {include: ['id', 'employee_name']}}
                    ]
                })

                employeesThoseAreManagers.push(...manager)
            }

            const conflict = employeesThoseAreManagers.some(manager => {
                const hasConflict = manager?.Employees?.some((employee: { id: number; }) => {
                    return employee.id === parseInt(user_id);
                });
                return hasConflict;
            });

            console.log("CONFLICTTT:", conflict)

            if(conflict){
                return next(badRequest('An employee is already a manager of the said employee!'))
            }

            if(!conflict){
                await sequelize.transaction(async(t) => {
                if(!reportingManager){
                    next(notFound("There is no reporting manager with that id"))
                }else{
                    if(reportingManager.user_id === user_id){

                        console.log("IDHAR GAYA")

                        const entries = await ReportingManagerEmployeeAssociation.findAll({
                            where: {
                                reporting_role_id: reporting_role_id,
                                reporting_manager_id: id
                            }
                        })

                        await Promise.all(
                            entries.map(async(item) => {
                                try{
                                    await item.destroy({transaction: t})
                                }catch(err){
                                    throw new Error("Error Deleting Item")
                                }
                            })
                        )

                        if(employee_id && employee_id.length > 0){
                            console.log("EMPLOYEE LENGTH IS MORE THAN 0")
                            await Promise.all(
                                employee_id.map(async(employeeId: number) => {
                                    const employee = await User.findByPk(employeeId);
                                    if(typeof employeeId !== 'number'){
                                        throw new Error('Invalid id in employee_id array');
                                    }
                                    if(employee){
                                        await ReportingManagerEmployeeAssociation.create({
                                            user_id: employeeId,
                                            reporting_role_id: reporting_role_id,
                                            reporting_manager_id: reportingManager.id
                                        }, {transaction: t}) 
                                    }else{
                                        throw new Error("There are no employees with that id!")
                                    }
                                })
                            )
                        }

                        const response = generateResponse(200, true, "Updated Succesfully!")
                        res.status(200).json(response)
                    }else{
                        console.log("REPORTING MANAGER ID IS NOT THE SAME")
                        const _reportingManager = await ReportingManagers.findOne({
                            where:{
                                user_id,
                                reporting_role_id
                            }
                        }) as any;

                        if(_reportingManager){

                            const _entries = await ReportingManagerEmployeeAssociation.findAll({
                                where:{
                                    reporting_role_id: reporting_role_id,
                                    reporting_manager_id: _reportingManager.id
                                }
                            })

                            const oldEntries =  await ReportingManagerEmployeeAssociation.findAll({
                                where:{
                                    reporting_role_id: reporting_role_id,
                                    reporting_manager_id: id
                                }
                            })
                            
                            console.log(oldEntries)

                            // oldEntries.forEach(async(item) => {
                            //     await item.destroy({transaction: t})
                            // })
                            
                            const oldArray: any[] = []

                            _entries.length>0 && _entries.forEach((item: any) => {
                                oldArray.push(item.user_id)
                            })

                            console.log(">>>>>>>>>>>", oldArray)
                            
                            
                            const _valuesToAdd = employee_id.filter( (id: any) => !oldArray.includes(id))

                            console.log(">>>>>>>>>>>>>>>>", _valuesToAdd)

                            if(_valuesToAdd && _valuesToAdd.length > 0){
                                console.log("Came in this again!")
                                await Promise.all(
                                    oldEntries.map(async(item) => {
                                        try{
                                            await item.destroy({transaction: t})
                                        }catch(err){
                                            console.error("Error Deleting item:", err)
                                        }
                                    })
                                )
                            
                                await Promise.all(
                                    _valuesToAdd.map(async(employeeId: number) => {
                                        const employee = await User.findByPk(employeeId);
                                        if(typeof employeeId !== 'number'){
                                            throw new Error('Invalid id in employee_id array');
                                        }
                                        if(employee){
                                            console.log("This is where it should've gone to!")
                                            await ReportingManagerEmployeeAssociation.create({
                                                user_id: employeeId,
                                                reporting_role_id: reporting_role_id,
                                                reporting_manager_id: _reportingManager.id
                                            }, {transaction: t}) 
                                        }else{
                                            throw new Error("There are no employees with that id!")
                                        }
                                    })
                                )

                                const response = generateResponse(200, true, "Updated Succesfully!")
                                res.status(200).json(response)
                            }else{
                                const response = generateResponse(200, true, "Updated Succesfully!")
                                res.status(200).json(response)
                            } 
                        }else{
                            const newManager = await ReportingManagers.create({
                                user_id: user_id,
                                reporting_role_id
                            }) as any;
                            
                            await reportingManager.destroy({transaction: t})

                            await ReportingManagerEmployeeAssociation.destroy({
                                where: {
                                    reporting_manager_id: reportingManager?.id
                                },
                                transaction: t
                            })

                            await Promise.all(
                                employee_id.map(async(employeeId: number) => {
                                    const employee = await User.findByPk(employeeId);
                                    if(typeof employeeId !== 'number'){
                                        throw new Error('Invalid id in employee_id array');
                                    }
                                    if(employee){
                                        await ReportingManagerEmployeeAssociation.create({
                                            user_id: employeeId,
                                            reporting_role_id: reporting_role_id,
                                            reporting_manager_id: newManager.id
                                        }, {transaction: t}) 
                                    }else{
                                        throw new Error("There are no employees with that id!")
                                    }
                                })
                            )

                            const response = generateResponse(200, true, "updated succesfully!")
                            res.status(200).json(response)
                        }
                    }
                }
                })
            }
        
            
        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("something went wrong"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            await sequelize.transaction(async(t) => {
                const {id} = req.params

                const leaveRequests = await LeaveRequest.findAll({
                    where: {
                        status: 1,
                        reporting_manager_id: id
                    }
                })

                const employeeAssociated = await ReportingManagerEmployeeAssociation.findAll({
                    where:{
                        reporting_manager_id: id
                    }
                })
                

                const reportingManager = await ReportingManagers.findByPk(id)

                if(reportingManager){
                    if(employeeAssociated.length > 0){
                        next(forbiddenError("This manager has employees reporting to them, cannot delete!"))
                    }else{
                        if(leaveRequests.length === 0){
                            await ReportingManagerEmployeeAssociation.destroy({
                                where: {
                                    reporting_manager_id: id
                                },
                                transaction: t
                            })
            
                            await ReportingManagers.destroy({
                                where:{
                                    id: id
                                },
                                transaction: t
                            })
                            
                            const response = generateResponse(200, true, "Reporting Manager removed succesfully!")
                            res.status(200).json(response)
                        }else if(leaveRequests.length > 0){
                            next(forbiddenError("There are pending approval requests of this reporting manager!"))
                        }
                    }
                }else{
                    next(notFound("Cannot find a reporting manager with that id!"))
                }                
            })
        }catch(err){
            // res.status(500).json(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    
    return{ getAll, getById, update, destroy, create, getAllDropdown }
}