"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const Authorize_1 = require("../middleware/Authorize");
const leaveBalanceController_1 = require("../controllers/leave/leaveBalanceController");
const leaveController_1 = require("../controllers/leave/leaveController");
const leave_1 = require("../schemas/leave");
const RequestValidate_1 = require("../middleware/RequestValidate");
const reportingManagers_1 = __importDefault(require("../models/reportingManagers"));
const getMasterPolicy_1 = require("../services/masterPolicy/getMasterPolicy");
var router = express_1.default.Router();
const leaveBalanceController = (0, leaveBalanceController_1.LeaveBalanceController)(models_1.LeaveBalance);
const leaveRecordController = (0, leaveController_1.LeaveController)(models_1.LeaveRecord);
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
router.post('/', (0, Authorize_1.Authorize)('employee_leaves.add'), (0, RequestValidate_1.validate)(leave_1.LeaveCreationSchema, 'body'), (req, res, next) => leaveRecordController.apply(req, res, next));
//API To get all the leave-records for a specific employee
router.get('/leave-record', (0, Authorize_1.Authorize)('employee_leaves.view'), (req, res, next) => { leaveRecordController.getAll(req, res, next); });
///Mobiel API for leave management
router.get('/mobile/leave-balance', (0, Authorize_1.Authorize)('employee_leaves.view'), (req, res, next) => leaveBalanceController.leaveBalance(req, res, next));
//Api to edit a leave record
router.put('/leave-record/:id', (0, Authorize_1.Authorize)('employee_leaves.edit'), (req, res, next) => leaveRecordController.editLeaveRecord(req, res, next));
router.put('/approve/:id', (0, Authorize_1.Authorize)('leave_requests.edit'), (req, res, next) => { leaveRecordController.approve(req, res, next); });
router.put('/reject/:id', (0, Authorize_1.Authorize)('leave_requests.edit'), (req, res, next) => leaveRecordController.reject(req, res, next));
router.get('/request', (0, Authorize_1.Authorize)('leave_requests.view'), (req, res, next) => { leaveRecordController.getRequest(req, res, next); });
//Api to get a single leave record details
router.get('/leave-record/:id', (0, Authorize_1.Authorize)('employee_leaves.view'), (req, res, next) => leaveRecordController.getSingleRecord(req, res, next));
//API to delete leave record
router.delete('/leave-record/:id', (0, Authorize_1.Authorize)('employee_leaves.delete'), (req, res, next) => leaveRecordController.deleteLeaveRecord(req, res, next));
//API To get all the leave balances of an employee
router.get('/leave-balance', (0, Authorize_1.Authorize)('employee_leaves.view'), (req, res, next) => leaveBalanceController.employeeLeaveBalance(req, res, next));
//API To get leave balances of a particular employee
router.get('/leave-balance/:id', (0, Authorize_1.Authorize)('employee_leaves.view'), (req, res, next) => leaveBalanceController.getEmployeeLeaveBalance(req, res, next));
//Api to get all the leave requested status
router.get('/holidays', (0, Authorize_1.Authorize)('employee_leaves.view'), (req, res, next) => leaveRecordController.leaveHolidaySummary(req, res, next));
//Api to get Requested Leave Status
router.get('/requested-status', (0, Authorize_1.Authorize)('employee_leaves.view'), (req, res, next) => leaveRecordController.getLeaveRequestedSummary(req, res, next));
router.get('/example/:id', async (req, res, next) => {
    const user_id = req.params.id;
    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(user_id);
    const manager = await reportingManagers_1.default.findOne({
        where: {
            user_id: user_id,
            deleted_at: null
        },
        include: [
            { model: models_1.User, as: 'Employees' }
        ]
    });
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
    res.json(manager);
});
exports.default = router;
