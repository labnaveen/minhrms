import { NextFunction, Request, Response } from "express";
import {Model} from 'sequelize'
import { MasterController } from "../masterController";
import { Permissions, Roles, User} from "../../models/index";
import { internalServerError } from "../../services/error/InternalServerError";
import { generateResponse } from "../../services/response/response";
import { badRequest } from "../../services/error/BadRequest";

type PermissionAttributes = {
    id: number,
    name: string,
    level:string,
    status: string,
    is_deleted: string,
}

type PermissionCreationAttributes = Omit<PermissionAttributes, 'id'>;

type PermissionModel = Model<PermissionAttributes, PermissionCreationAttributes>;

type PermissionController = MasterController<PermissionModel> & {

}

export const PermissionController= (
    model: typeof Model & {
        new (): PermissionModel;
    }
):PermissionController => {

    const { update, destroy, getById, getAllDropdown  } = MasterController<PermissionModel>(model)


    const getAll = async(req: Request, res: Response, next:NextFunction): Promise<void> => {
        try{
            const permissions = await Permissions.findAll({
                where: {
                    status: true,
                    is_deleted: false
                },
                attributes:['id', 'name', 'status']
            })

            const response = generateResponse(200, true, "Data fetched succesfully!", permissions)

            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const create = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            
            const {name, level} = req.body

            const existingPermission = await Permissions.findOne({
                where: {
                    name: name
                }
            })

            if(existingPermission){
                return next(badRequest("A permission with that name is already created!"))
            }

            const permission = await Permissions.create(req.body)

            const response = generateResponse(200, true, "Permission created succesfully!", permission)

            res.status(200).json(response)

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }


    return { getAll, getById, update, destroy, create, getAllDropdown }
}