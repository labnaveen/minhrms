import { Request, Response, NextFunction } from "express";
import { internalServerError } from "../error/InternalServerError";
import { LeaveType, User } from "../../models";
import { EmployeeAttributes } from "../../controllers/employee/employeeController";
import MasterPolicy from "../../models/masterPolicy";
import AttendancePolicy from "../../models/attendancePolicy";
import ApprovalFlow from "../../models/approvalFlow";
import LeaveTypePolicy from "../../models/leaveTypePolicy";
import LeaveAllocation from "../../models/leaveAllocation";




export const getMasterPolicy = async(id: string | number) => {
    try{

        const user = await User.findByPk(id) as EmployeeAttributes | null

        const masterPolicyId = user?.master_policy_id


        const masterPolicy = await MasterPolicy.findByPk(masterPolicyId, {
            include: [
                {
                    model: AttendancePolicy
                },
                {
                    model: ApprovalFlow,
                    as: 'attendanceWorkflow'
                },
                {
                    model: ApprovalFlow,
                    as: 'leaveWorkflow'
                },
                {
                    model: ApprovalFlow,
                    as: 'profileChangeWorkflow'
                },
                // {
                //     model: ApprovalFlow,
                //     as: 'approvalWorkflow'
                // },
                {
                    model: LeaveTypePolicy,
                    as: 'LeaveTypePolicies',
                    attributes:['id', 'leave_policy_name', 'description'],
                    include:[
                        {model: LeaveType, attributes:['id', 'leave_type_name', 'allow_half_days']}
                    ],
                    through:{
                        attributes: []
                    }
                }
            ]
        });

        if(masterPolicy){
            return masterPolicy
        }else{
            return new Error("Cannot find a master policy")
        }
    }catch(err){
        console.log(err)
    }
}