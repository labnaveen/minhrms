import { NextFunction, Response, Request } from "express";
import { Model } from "sequelize";
import { MasterController } from "../masterController";
import { internalServerError } from "../../services/error/InternalServerError";
import { User } from "../../models";
import { sequelize } from "../../utilities/db";
import { notFound } from "../../services/error/NotFound";
import FamilyMember from "../../models/familyMember";
import { generateResponse } from "../../services/response/response";
import { badRequest } from "../../services/error/BadRequest";


//Types for Leave Balance 
type FamilyMemberAttributes = {
    id: number,
    name: string,
    dob: Date,
    relation_id: number,
    occupation: string,
    phone: string,
    email: string
}

type FamilyMemberCreationAttributes = Omit<FamilyMemberAttributes, 'id'>;

type FamilyMemberModel = Model<FamilyMemberAttributes, FamilyMemberCreationAttributes>;

type FamilyMemberController = MasterController<FamilyMemberModel> & {
    createFamilyMember: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateFamilyMember: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteFamilyMember: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getFamilyForEmployee: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}


export const FamilyMemberController = (
    model: typeof Model & {
        new(): FamilyMemberModel
    }
):FamilyMemberController => {

    const {getAll, create, destroy, update, getAllDropdown, getById} = MasterController<FamilyMemberModel>(model);

    const createFamilyMember = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            //@ts-ignore
            const {id} = req.credentials

            const employee = await User.findByPk(id)

            if(employee){
                await sequelize.transaction(async(t) => {
                    const {name, dob, relation_id, occupation, phone, email} = req.body;

                    const formBody = {
                        user_id: id,
                        name: name,
                        dob: dob,
                        relation_id: relation_id,
                        occupation: occupation,
                        phone: phone,
                        email: email
                    }

                    const newMember = await FamilyMember.create(formBody, {transaction: t})

                    const response = generateResponse(201, true, "New Family Member added", newMember);

                    res.status(201).json(response)

                })
            }else{
                next(notFound("The user does not exist with that id"))
            }
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const updateFamilyMember = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {name, dob, relation_id, occupation, phone, email} = req.body;
            
            const {id} = req.params
            
            const familyMember = await FamilyMember.findByPk(id);

            if(familyMember){
                await familyMember.update(req.body);
                
                const response = generateResponse(200, true, "Family member data updated succesfully!")

                res.status(200).json(response)
            }else{
                next(notFound("Family Member with that id does not exist"))
            }
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const deleteFamilyMember = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            
            await sequelize.transaction(async(t) => {
                const {id} = req.params

                const {family_member_id} = req.params

                
                const familyMember = await FamilyMember.findByPk(family_member_id);

                if(familyMember){
                    await familyMember.destroy({transaction: t})
                    const response = generateResponse(200, true, "Family Member deleted sucessfully!")
                    res.status(200).json(response)
                }
            })
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const getFamilyForEmployee = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.params

            const user = await User.findByPk(id)

            if(user){
                
                const familyMembers = await User.findByPk(id, {
                    include:[
                        {
                            model: FamilyMember,
                            attributes:{
                                exclude:['createdAt', 'updatedAt']
                            }
                        }
                    ],
                    attributes:['id', 'employee_generated_id', 'employee_name']
                })

                const response = generateResponse(200, true, "Family members fetched succesfully!", familyMembers)

                res.status(200).json(response)

            }else{
                next(badRequest("There is no employee with that id!"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }
    
    return { getAll, create, destroy, update, getAllDropdown, getById, createFamilyMember, updateFamilyMember, deleteFamilyMember, getFamilyForEmployee}

}