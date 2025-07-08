import { NextFunction, Response, Request } from "express";
import { Model } from "sequelize";
import { MasterController } from "../masterController";
import Education from "../../models/education";
import { internalServerError } from "../../services/error/InternalServerError";
import { User } from "../../models";
import { notFound } from "../../services/error/NotFound";
import { generateResponse } from "../../services/response/response";


//Types for Leave Balance 
type EducationAttributes = {
    id: number,
    institution_name: string,
    degree_id: number,
    course_name: string,
    field_of_study: string,
    year_of_completion: number,
    percentage: number
}

type EducationCreationAttributes = Omit<EducationAttributes, 'id'>;

type EducationModel = Model<EducationAttributes, EducationCreationAttributes>;

type EducationController = MasterController<EducationModel> & {
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}



export const EducationController = (
    model: typeof Model & {
        new(): EducationModel
    }
):EducationController => {

    const {getAll, update, getAllDropdown, getById} = MasterController<Education>(model);

    const create = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            
            //@ts-ignore
            const {id} = req.credentials

            const user = await User.findByPk(id)

            const {institution_name, degree_id, course_name, field_of_study, year_of_completion, percentage } = req.body

            if(user){

                const formBody = {
                    user_id: id,
                    institution_name: institution_name,
                    degree_id: degree_id,
                    course_name: course_name,
                    field_of_study: field_of_study,
                    year_of_completion: year_of_completion,
                    percentage: percentage
                }

                const education = await Education.create(formBody)

                const response = generateResponse(200, true, "Education experience created succesfully!", education)

                res.status(201).json(response)

            }else{
                next(notFound("There is no employee with that id"))
            }            
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const destroy = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            
            const {id} = req.params
            const education = await Education.findByPk(id)

            if(education){

                await education.destroy()

                const response = generateResponse(200, true, "Record deleted succesfully!")

                res.status(200).json(response)

            }else{
                next(notFound("Cannot find education record with that id"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }
    
    return { getAll, create, destroy, update, getAllDropdown, getById }

}