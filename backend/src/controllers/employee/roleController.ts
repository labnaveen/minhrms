import e, { NextFunction, Request, Response } from "express";
import {Model, Op} from 'sequelize'
import { MasterController } from "../masterController";
import {Company, EmployeeAddress, Permissions, Roles, User} from "../../models/index";
import {CompanyAddress} from "../../models/index";
import { sequelize } from "../../utilities/db";
import { generatePassword } from "../../services/auth/RandomPassword";
import { MailSenderService } from "../../services/mail";
import { EmailTemplate } from "../../utilities/EmailTemplate";
import { internalServerError } from "../../services/error/InternalServerError";
import { notFound } from "../../services/error/NotFound";
import { badRequest } from "../../services/error/BadRequest";
import { generateResponse } from "../../services/response/response";
import RolePermissions from "../../models/rolePermissions";
import { forbiddenError } from "../../services/error/Forbidden";

type RoleAttributes = {
    id: number,
    name: string,
    alias: string,
    description: string,
}

type RoleCreationAttributes = Omit<RoleAttributes, 'id'>;

type RoleModel = Model<RoleAttributes, RoleCreationAttributes>;

type RoleController = MasterController<RoleModel> & {
    addPermissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    editPermissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const RoleController= (
    model: typeof Model & {
        new (): RoleModel;
    }
):RoleController => {

    const { getAllDropdown } = MasterController<RoleModel>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const { page, records, search_term, sortBy, sortOrder } = req.query as { page: string, records: string, search_term: string, sortBy: string, sortOrder: string};

            if (!page && !records) {
              next(badRequest("No request parameters are present!"))
              return
            }
    
            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
    
            const offset = (pageNumber - 1) * recordsPerPage;

            const orderOptions = [] as any[]
            let whereOptions = {} as any;

            if(sortBy && sortOrder){
                if(sortBy === 'role_name'){
                    orderOptions.push(['name', sortOrder])
                }
                if(sortBy === 'user_count'){
                    orderOptions.push([sequelize.literal('user_count'), sortOrder])
                }
            }

            if(search_term){
                whereOptions.name = {
                    [Op.like]: `%${search_term}%`
                }
            }


            const roles = await Roles.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: Permissions,
                        attributes: ['id', 'name'],
                        as: 'permissions',
                        through: {
                            attributes: []
                        },
                        where: {
                            status: true
                        },
                        required: false
                    },
                    {
                        model: User,
                        attributes:[],
                        as: 'users',
                        where: sequelize.literal('`roles`.`id` = `users`.`role_id`'),
                        required: false,
                        duplicating: false
                    }
                ],
                attributes:{
                    include: [
                        [
                            sequelize.literal('(SELECT COUNT(*) FROM `user` WHERE `user`.`role_id` = `roles`.`id`)'),
                            'user_count'
                        ]
                    ]
                },
                offset: offset,
                limit: recordsPerPage,
                distinct: true,
                order: orderOptions
            })



            const totalPages = Math.ceil(roles.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1

            const meta = {
                totalCount: roles.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const response = generateResponse(200, true, "Roles fetched succesfully!", roles.rows, meta)
            res.status(200).json(response)

        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something Went Wrong!"))
        }
    }

    const getById = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try{

            const {id} = req.params

            const role = await Roles.findByPk(id, {
                include:[
                    {
                        model: Permissions,
                        attributes: ['id', 'name'],
                        as: 'permissions',
                        where:{
                            status:true
                        },
                        through:{
                            attributes:[]
                        },
                        required: false
                    }
                ],
                logging: true
            });

            if(!role){
                next(notFound("There is no role with that id"))
            }else{
                const response = generateResponse(200, true, "Role fetched succesfully!", role)
                res.status(200).json(response)
            }
        }catch(err){
            // res.status(404).json(err)
            next(internalServerError("Something Went Wrong!"))
        }
    }


    const create = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const { name, alias, description } = req.body

            // await sequelize.transaction(async(t) => {
                const role = await Roles.findOne({
                    where:{
                        name: name
                    }
                })

                if(role){
                    next(badRequest("A role with that name already exists"))
                }else{

                    const roleBody = {
                        name,
                        alias,
                        description,
                    }

                    const role = await model.create(roleBody)

                    const response = generateResponse(201, true, "Role created succesfully", role)

                    res.status(201).json(response)
                }
            // })
        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something Went Wrong!"))
        }
    }

    const addPermissions = async(req: Request, res: Response, next:NextFunction): Promise<void> => {
        try{

            const {permissions} = req.body
            const roleId = req.params.id
            
            const role = await Roles.findByPk(roleId)

            if(!role){
                next(badRequest("There is no role with that id"))
            }else{
                if(permissions.length > 0 && roleId){
                    await Promise.all(
                        permissions.map(async (permId: any) => {
                            if(typeof permId !== 'number'){
                                throw new Error('Invalid permissions ID in permissions array');
                            }
                            await RolePermissions.create(
                                {
                                    permissions_id: permId,
                                    roles_id: roleId
                                },
                            )
                        })
                    )
                }else{
                    next(badRequest("Please provide permissions"))
                }
            }
            
            const response = generateResponse(200, true, "Permissions added succesfully!")

            res.status(200).json(response)
            

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const editPermissions = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const roleId = req.params.id
            const {permissions} = req.body
            
            const role = await Roles.findByPk(roleId)

            if(!role) {
                next(notFound("There is no role with that id"))
            }else{
                await sequelize.transaction(async(t) => {
                    const associations = await RolePermissions.findAll({
                        where: {
                            roles_id: roleId
                        }
                    })

                    if(associations && associations.length > 0){
                        await RolePermissions.destroy({
                            where: {
                                roles_id: roleId
                            },
                            transaction: t
                        })
                    }

                    await Promise.all(
                        permissions.map(async (permId: any) => {
                            if(typeof permId !== 'number'){
                                throw new Error('Invalid permissions ID in permissions array');
                            }
                            await RolePermissions.create(
                                {
                                    permissions_id: permId,
                                    roles_id: roleId
                                },
                                {transaction: t}
                            )
                        })
                    )
                })
            }

            const response = generateResponse(200, true, "Permissions updated successfully!")

            res.status(200).json(response)
            
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req:Request, res:Response, next:NextFunction): Promise<void> => {
        try{

            await sequelize.transaction(async(t) => {
                const role_id = req.params.id

                const role = await Roles.findByPk(role_id);
                
                const associatedUsers = await User.findAll({
                    where:{
                        role_id: role_id
                    }
                })

                //@ts-ignore
                if(role?.is_system_generated == true){
                    next(badRequest("You cannot delete a system generated role."))
                }

                if(role){
                    if(associatedUsers.length === 0){
                        await RolePermissions.destroy({
                            where: {
                                roles_id: role_id
                            },
                            transaction: t
                        })

                        await role.destroy({transaction: t})

                        const response = generateResponse(200, true, "Role deleted succesfully!")
                        
                        res.status(200).json(response)
                    }else{
                        next(forbiddenError("This role is associated to one or many users, you cannot delete this."))
                    }
                }else{
                    next(notFound("There is no role with that id."))
                }
            })

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const update = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.params

            const role = await Roles.findByPk(id)

            const existingRole = await Roles.findOne({
                where:{
                    name: req.body.name,
                    id: {
                        [Op.not]: id
                    }
                }
            })

            //@ts-ignore
            if(role?.is_system_generated == true){
                next(badRequest("You cannot update a system generated role."))
            }

            if(existingRole){
                next(badRequest("A role with that name already exists"))
            }else{
                if(role){

                    const newRole = await role.update(req.body)
    
                    const response = generateResponse(200, true, "Role updated succesfully!", newRole)
    
                    res.status(200).json(response)
    
                }else{
                    next(notFound("Cannot find a role with that id!"))
                }
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    return { getAll, getById, update, destroy, create, addPermissions, editPermissions, getAllDropdown }
}