import { NextFunction, Response, Request } from "express";
import { Model, Sequelize } from "sequelize";
import { MasterController } from "../masterController";
import { LeaveBalance, LeaveRecord, LeaveType, User } from "../../models";
import { generateResponse } from "../../services/response/response";
import { internalServerError } from "../../services/mobileErrorHandling/InternalServerError";
import { getMasterPolicy } from "../../services/masterPolicy/getMasterPolicy";
import moment from "moment";
import LeaveTypePolicy from "../../models/leaveTypePolicy";
import { calculateHalfYearlyAccrual, calculateMonthlyAccrual, calculateQuaterlyAccrual } from "../../utilities/leaveAccrual";
import BaseLeaveConfiguration from "../../models/baseLeaveConfiguration";
import { notFound } from "../../services/error/NotFound";


//Types for Leave Balance 
type LeaveBalanceAttributes = {
    id: number,
    user_id: number,
    leave_type_id: number,
    leave_balance: number,
    is_deleted: boolean
}

type LeaveBalanceCreationAttributes = Omit<LeaveBalanceAttributes, 'id'>;

type LeaveBalanceModel = Model<LeaveBalanceAttributes, LeaveBalanceCreationAttributes>;

type LeaveBalanceController = MasterController<LeaveBalanceModel> & {
    leaveBalance: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    employeeLeaveBalance: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getEmployeeLeaveBalance: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}



export const LeaveBalanceController = (
    model: typeof Model & {
        new(): LeaveBalanceModel
    }
): LeaveBalanceController => {

    const { getAll, create, destroy, update, getAllDropdown, getById } = MasterController<LeaveBalanceModel>(model);


    const leaveBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            //@ts-ignore
            const { id } = req.credentials
            const leaveBalanceDetails = await LeaveBalance.findAll({
                attributes: ['leave_balance'],
                include: [
                    {
                        model: LeaveType,
                        attributes: ['id','leave_type_name'],
                        required: false
                    }
                ],
                raw: true,
                where: { user_id: id, is_deleted: 0 }
            })

            const usedLeaveDetails = await LeaveRecord.findAll({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.literal(`
                        CASE
                            WHEN day_type_id = 1 THEN 0.5
                            ELSE DATEDIFF(end_date, start_date) + 1
                        END    
                    `)), 'usedLeave'],
                    'leave_type_id',
                    [Sequelize.col('leave_type.leave_type_name'), 'leave_type_name'],
                ],
                include: [
                  {
                    model: LeaveType,
                    attributes: [],
                  },
                ],
                where: {
                  user_id: id, status: 1
                },
                group: ['leave_record.leave_type_id', 'leave_type.id', 'leave_type.leave_type_name'],
            });
           
            // const usedLeaveDetails = await LeaveRecord.findAll({
            //     attributes: [
            //       [Sequelize.fn('COUNT', Sequelize.col('leave_record.id')), 'usedLeave'],
            //       'leave_type_id',
            //       [Sequelize.col('leave_type.leave_type_name'), 'leave_type_name'],
            //     ],
            //     include: [
            //       {
            //         model: LeaveType,
            //         attributes: [],
            //       },
            //     ],
            //     where: {
            //       user_id: id, status: 1
            //     },
            //     group: ['leave_record.leave_type_id', 'leave_type.id', 'leave_type.leave_type_name'],
            // });
            const mergedData = leaveBalanceDetails.map(item1 => {
                //@ts-ignore
                const correspondingItem = usedLeaveDetails.find(item2 => item1["leave_type.id"] == item2.leave_type_id);
                if (correspondingItem) {
                    return {
                        ...item1,
                        usedLeave: parseFloat(correspondingItem.dataValues.usedLeave),
                    };
                }
                else{
                    return{
                        ...item1,
                        usedLeave: 0
                    }
                }
            });
        
            const response = generateResponse(200, true, "Leave balance fetched Succesfully", mergedData)
            res.status(200).json(response)
            
        } catch (err) {
            console.log(err)
            next(internalServerError(false, "Something Went Wrong!"))
        }
    }

    const employeeLeaveBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            //@ts-ignore
            const {id} = req.credentials
            
            const user = await User.findByPk(id)

            if(user){

                const leaveBalances = await LeaveBalance.findAll({
                    where: {
                        user_id: id
                    },
                    include: [
                        {
                            model: LeaveType,
                            attributes: ['id', 'leave_type_name']
                        }
                    ],
                    paranoid: true
                })

                const response = generateResponse(200, true, "Data fetched succesfully!", leaveBalances)

                res.status(200).json(response)

            }else{
                next(notFound('Cannot find employee with that id!'))
            }
        }catch(err){
            console.log(err)
            next(internalServerError(false, "Something went wrong!"))
        }
    }

    const getEmployeeLeaveBalance = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            const {id} = req.params

            const user = await User.findByPk(id)

            if(user){

                const leaveBalance = await LeaveBalance.findAll({
                    where: {
                        user_id: id
                    },
                    include: [
                        {
                            model: LeaveType,
                            attributes: ['id', 'leave_type_name']
                        }
                    ],
                    paranoid: true
                })

                const response = generateResponse(200, true, "Data fetched succesfully!", leaveBalance)

                res.status(200).json(response)

            }else{
                next(notFound("Cannot find employee with that id!"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError( false, "Something went wrong!"))
        }
    }


    return { getAll, create, destroy, update, getAllDropdown, getById, leaveBalance, employeeLeaveBalance, getEmployeeLeaveBalance }

}