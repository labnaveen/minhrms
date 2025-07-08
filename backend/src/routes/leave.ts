import express, { NextFunction, Response, Request } from 'express'
import { LeaveBalance, LeaveRecord, LeaveType, User } from '../models'
import { Authorize } from '../middleware/Authorize'
import { sequelize } from '../utilities/db'
import jwt from 'jsonwebtoken'
import { AuthUserJWT } from '../services/auth/IFace'
import { LeaveBalanceController } from '../controllers/leave/leaveBalanceController'
import { LeaveController } from '../controllers/leave/leaveController'
import { EmployeeController } from '../controllers/employee/employeeController'
import { LeaveCreationSchema } from '../schemas/leave'
import { validate } from '../middleware/RequestValidate'
import ReportingManagers from '../models/reportingManagers'
import ReportingRole from '../models/reportingRole'
import ApprovalFlow from '../models/approvalFlow'
import { getMasterPolicy } from '../services/masterPolicy/getMasterPolicy'
import ApprovalFlowType from '../models/dropdown/type/approvalFlowType'
import UserDivision from '../models/userDivision'





var router = express.Router()

const leaveBalanceController = LeaveBalanceController(LeaveBalance)

const leaveRecordController = LeaveController(LeaveRecord)


//Get All the Leave Balance for an employee
// router.get('/leave-balance', Authorize('employee_leaves.view'), (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization?.split(" ")[1]
//     if(token){
//         const decoded = jwt.decode(token) as AuthUserJWT
//         const{employee_id} = decoded
//         const options = {
//             where:[{user_id: employee_id}],
//             included:['leave_type', 'user'],
//             nesetedIncluded:{
//                 leave_type: ['leave_balance']
//             }
//             // attributes:{
//             //     leave_type: ['id', 'leave_type_name'],
//             //     user: ['id', 'employee_generated_id', 'employee_name']
//             // }
//         }
//         leaveBalanceController.getAll(req, res, next, options)
//     }
// })


//Applying a leave
router.post('/', Authorize('employee_leaves.add'), validate(LeaveCreationSchema, 'body'), (req, res, next) => leaveRecordController.apply(req, res, next))


//API To get all the leave-records for a specific employee
router.get('/leave-record', Authorize('employee_leaves.view'), (req, res, next) => {leaveRecordController.getAll(req, res, next)})


///Mobiel API for leave management
router.get('/mobile/leave-balance', Authorize('employee_leaves.view'), (req, res, next) => leaveBalanceController.leaveBalance(req, res, next))


//Api to edit a leave record
router.put('/leave-record/:id', Authorize('employee_leaves.edit'), (req, res, next) => leaveRecordController.editLeaveRecord(req, res, next))

router.put('/approve/:id', Authorize('leave_requests.edit'), (req, res, next) => {leaveRecordController.approve(req, res, next)})

router.put('/reject/:id', Authorize('leave_requests.edit'), (req, res, next) => leaveRecordController.reject(req, res, next))

//Api to approve leave request by admin
router.put('/admin/:id/approve', Authorize('leave_requests.edit'), (req, res, next) => leaveRecordController.adminLeaveRequestApprove(req, res, next))
router.put('/admin/:id/reject', Authorize('leave_requests.edit'), (req, res, next) => leaveRecordController.adminLeaveRequestReject(req, res, next))


//API to get leave requests pending for Manager
router.get('/request', Authorize('leave_requests.view'), (req, res, next) => {leaveRecordController.getRequest(req, res, next)})

//API to get leave requests for Admin
router.get("/admin/request", Authorize('leave_requests.view'), (req, res, next) => leaveRecordController.getAdminLeaveRequests(req, res, next))

//API to get all the leave requests for Admin
router.get('/admin/leave-records', Authorize('leave_requests.view'), (req, res, next) => leaveRecordController.getAdminLeaveRecords(req, res, next))

//Api to get a single leave record details
router.get('/leave-record/:id', Authorize('employee_leaves.view'), (req, res, next) => leaveRecordController.getSingleRecord(req, res, next))

//API to delete leave record
router.delete('/leave-record/:id', Authorize('employee_leaves.delete'), (req, res, next) => leaveRecordController.deleteLeaveRecord(req, res, next))

//API To get all the leave balances of an employee
router.get('/leave-balance', Authorize('employee_leaves.view'), (req, res, next) => leaveBalanceController.employeeLeaveBalance(req, res, next))

//API To get leave balances of a particular employee
router.get('/leave-balance/:id', Authorize('employee_leaves.view'), (req, res, next) => leaveBalanceController.getEmployeeLeaveBalance(req, res, next))

//Api to get all the leave requested status
router.get('/holidays', Authorize('employee_leaves.view'), (req, res, next) => leaveRecordController.leaveHolidaySummary(req, res, next))

//Api to get Requested Leave Status
router.get('/requested-status', Authorize('employee_leaves.view'), (req, res, next) => leaveRecordController.getLeaveRequestedSummary(req, res, next))


router.get('/example/:id', async(req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.id
    const masterPolicy = await getMasterPolicy(user_id);

    const manager = await ReportingManagers.findOne({
        where: {
            user_id: user_id,
            deleted_at: null
        },
        include: [
            {model: User, as: 'Employees'}
        ]
    })


    // const leaveWorkflow = masterPolicy?.leave_workflow;
    // const approvalWorkflow = await ApprovalFlow.findByPk(leaveWorkflow, 
    //     {
    //         include:[
    //             {
    //                 model: ReportingRole,
    //                 as: 'direct',
    //                 through:{attributes:[]},
    //                 include: [{
    //                     model: ReportingManagers,
    //                     // attributes: ['id', 'employee_name']
    //                 }]
    //             },
    //             {
    //                 model: ApprovalFlowType,
    //             }
    //         ]
    //     }
    // )
    
    // const user = await User.findByPk(user_id, {
    //     include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']}, {model: ReportingRole}]}],
    //     attributes:['id', 'employee_generated_id']
    // })



    // const employee = await UserDivision.findAll({
    //     where:{
    //         unit_id: user_id,
    //     },
    // })

    res.json(manager)
})


export default router;