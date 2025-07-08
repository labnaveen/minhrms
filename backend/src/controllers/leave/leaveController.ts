//@ts-nocheck
import { NextFunction, Response, Request } from "express";
import { FindOptions, Model, Op, WhereOptions } from "sequelize";
import { MasterController } from "../masterController";
import { internalServerError } from "../../services/error/InternalServerError";
import jwt, { decode } from 'jsonwebtoken'
import { AuthUserJWT } from "../../services/auth/IFace";
import { LeaveBalance, LeaveRecord, LeaveType, User } from "../../models";
import { sequelize } from "../../utilities/db";
import PeersLeaveRecord from "../../models/peersLeaveRecord";
import { generateResponse } from "../../services/response/response";
import { badRequest } from "../../services/error/BadRequest";
import Approval from "../../models/dropdown/status/approval";
import ReportingManagers from "../../models/reportingManagers";
import { getMasterPolicy } from "../../services/masterPolicy/getMasterPolicy";
import ApprovalFlow from "../../models/approvalFlow";
import ReportingRole from "../../models/reportingRole";
import LeaveRequest from "../../models/leaveRequest";
import ApprovalFlowType from "../../models/dropdown/type/approvalFlowType";
import ReportingManagerEmployeeAssociation from "../../models/reportingManagerEmployeeAssociation";
import { unauthorized } from "../../services/error/Unauthorized";
import moment, { duration } from "moment";
import { forbidden } from "joi";
import { forbiddenError } from "../../services/error/Forbidden";
import DayType from "../../models/dropdown/dayType/dayType";
import Notification from "../../models/notification";
import { sendNotification } from "../../services/notification/sendNotification";
import { notFound } from "../../services/error/NotFound";
import HolidayCalendar from "../../models/holidayCalendar";
import HolidayDatabase from "../../models/holidayDatabase";
import { LeaveBalanceResponse, LeaveRecordResponse, LeaveTypeResponse } from "../../interface/leave";
import BaseLeaveConfiguration from "../../models/baseLeaveConfiguration";
import { sendPushNotification } from "../../services/pushNotification/notificationService";
import LeaveRequestHistory from "../../models/leaveRequestHistory";


//Types for Leave Balance 
type LeaveAttributes = {
    id: number,
    user_id: number,
    leave_from: Date,
    leave_to: Date,
    reason: string,
    document: string,
    is_deleted: boolean
}

type LeaveCreationAttributes = Omit<LeaveAttributes, 'id'>;

type LeaveModel = Model<LeaveAttributes, LeaveCreationAttributes>;

type LeaveController = MasterController<LeaveModel> & {
    apply: (req: Request, res: Response, next:NextFunction, option?:FindOptions) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approve: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLeaveRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    reject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    cancelRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    leaveHolidaySummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSingleRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLeaveRequestedSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    editLeaveRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteLeaveRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAdminLeaveRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAdminLeaveRecords: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    adminLeaveRequestApprove: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    adminLeaveRequestReject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}


///Function to check if a leave is overlapping or not
const isLeaveRecordOverlap = async (userId: number, startDate: string, endDate: string, recordId?: number): Promise<boolean> => {

    const whereCondition: any = {
        user_id: userId,
        status: {
            [Op.not]: 3
        },
        [Op.or]: [
            {
                start_date: {
                    [Op.between]: [startDate, endDate],
                },
            },
            {
                end_date: {
                    [Op.between]: [startDate, endDate],
                },
            },
            {
                // Check if the specified date range falls within existing leave record range
                start_date: startDate,
                end_date: endDate
            }
        ],
    };

    if(recordId){
        whereCondition.id = {
            [Op.ne]: recordId
        }
    }

    const overlappingRecord = await LeaveRecord.findOne({
        where: whereCondition
    });

    return !!overlappingRecord;
};


export const LeaveController = (
    model: typeof Model & {
        new(): LeaveModel
    }
):LeaveController => {

    const {create, destroy, update, getAllDropdown, getById} = MasterController<LeaveModel>(model);

    const getAll = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, records } = req.query as { page: string, records: string };

            const {status} = req.query

            
            if (!page && !records) {
              next(badRequest("No request parameters are present!"))
              return
            }

            const {id} = req.credentials    

            let whereOptions = {
                user_id: id
            }

            if(status){

                const statusFilters = status.split(',');

                whereOptions.status = {
                    [Op.in]: statusFilters
                }
            }    
    
            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
    
            const offset = (pageNumber - 1) * recordsPerPage;
    
    
            const data = await model.findAndCountAll({
                where: whereOptions,
                include: [
                    {model: Approval, attributes:['id', 'name'] },
                    {model: LeaveType, attributes:['id', 'leave_type_name']},
                    {model: DayType, attributes: ['id', 'name']}
                ],
                attributes:{
                    exclude: ['createdAt', 'updatedAt']
                },
                offset: offset,
                limit: recordsPerPage,
                order: [['id', 'DESC']]
            });
    
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
    
            const result = {
              data: data.rows,
              meta
            }
    
            const response = generateResponse(200, true, "Data Fetched Succesfully!", result.data, meta)

            res.status(200).json(response)

        } catch (err) {
            console.log(err)
            next(internalServerError("Something Went Wrong!"))
        }
    }

    const apply = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            // const t = await sequelize.transaction()

            const {id} = req.credentials

            const user = await User.findByPk(id)

            if(user){
                const employee_id = id
                const {
                    leave_type_id,
                    day_type_id,
                    half_day_type_id, 
                    start_date, 
                    end_date, 
                    reason, 
                    document, 
                    contact_number
                } = req.body

                const status = 1
                const user_id = employee_id

                const leaveRecordBody = {
                    user_id,
                    leave_type_id,
                    day_type_id,
                    half_day_type_id,
                    start_date,
                    end_date,
                    reason,
                    document,
                    contact_number,
                    status
                }

                const user = await User.findByPk(user_id, {
                    include:[
                        {model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']}, 
                        {model: ReportingRole}]}
                    ],
                    attributes:['id', 'employee_name', 'date_of_joining'],
                    plain: true
                })

                const currentStartMonth = moment().startOf('month');
                const currentEndMonth = moment().endOf('month');

                const leaveRecordsInCurrentMonth = await LeaveRecord.findAll({
                    where: {
                        user_id: id,
                        status: {
                            [Op.not]: 3
                        },
                        [Op.or]: [
                            {
                                start_date: { [Op.between]: [currentStartMonth, currentEndMonth] }
                            },
                            {
                                end_date: {[Op.between]: {[Op.between]: [currentStartMonth, currentEndMonth]}}
                            },
                            {
                                [Op.and]: [
                                    {start_date: { [Op.lt]: currentStartMonth }},
                                    {end_date: { [Op.gt]: currentEndMonth }}
                                ]
                            }
                        ]
                    }
                })

                console.log("LEAVE RECORDSS", leaveRecordsInCurrentMonth)

                const totalLeaveDaysInMonth = leaveRecordsInCurrentMonth.reduce((totalDays, leaveRecord) => {
                    return totalDays + moment(leaveRecord.end_date).diff(moment(leaveRecord.start_date), 'days') + 1;
                }, 0);

                console.log("TOTAL LEAVES DAYS IN MONTH", totalLeaveDaysInMonth)

                const leaveRequestDuration = moment(end_date).diff(moment(start_date), 'days') + 1;

                const masterPolicy = await getMasterPolicy(id);

                const leaveWorkflow = masterPolicy.leave_workflow;

                const leaveType = await LeaveType.findByPk(leave_type_id) as LeaveTypeResponse | null;

                const noticeDays = leaveType?.notice_for_application

                const isAfterNotice = moment(start_date).isSameOrAfter(moment().add(noticeDays, 'days'))

                if(!leaveType?.allow_half_days && day_type_id === 1){
                    return next(badRequest("Half days are not allowed for this leave type!"))
                }

                if(noticeDays && !isAfterNotice){
                    return next(badRequest(`You need to give atleast ${noticeDays} days of notice`))
                }

                const approvalWorkflow = await ApprovalFlow.findByPk(leaveWorkflow, 
                    {
                        include:[
                            {
                                model: ReportingRole,
                                as: 'direct',
                                through:{attributes:[]},
                                include: [{
                                    model: ReportingManagers,
                                    // attributes: ['id', 'employee_name']
                                }]
                            },
                            {
                                model: ApprovalFlowType,
                            }
                        ]
                    }
                )

                console.log("APPROVAL WORKFLOW>>>>>>>>>>>>>>>>>>>>", approvalWorkflow)

                const leaveBalance = await LeaveBalance.findOne({
                    where:{
                        user_id: id,
                        leave_type_id: leave_type_id
                    }
                });

                let startDate;

                let endDate;    

                if(day_type_id == 1){
                    startDate = moment(start_date)
                    endDate = moment(start_date)
                }else{
                    startDate = moment(start_date)
                    endDate = moment(end_date)
                }

                const maximumDaysOfLeaveAllowed = leaveType?.max_days_per_leave

                const backDatedDays = leaveType?.limit_back_dated_application

                const minimumdate = moment().subtract(backDatedDays, 'days')
                const leaveStartDate = moment(start_date)

                console.log("MINIMUM DATEEE>>>>>>>>>", minimumdate)

                const maximumDaysOfLeaveAllowedInNegative = leaveType?.negative_balance

                console.log("MAXXXIMUMM DAYS OF LEAVE ALLOWED", maximumDaysOfLeaveAllowed)

                const dateOfJoining = moment(user?.date_of_joining)

                const isBeforeDateOfJoining = moment(start_date).isSameOrBefore(dateOfJoining)

                console.log(">>>>>>>>>>>>>>>>>", isBeforeDateOfJoining, moment(start_date), dateOfJoining, user?.date_of_joining)

                if(isBeforeDateOfJoining){
                    return next(forbiddenError("You cannot apply for leave before your joining date!"))
                }

                let durationInDays: number;

                if(day_type_id == 1){
                    durationInDays = 0.5
                }else{
                    console.log("IDHAR GAYA")
                    durationInDays = moment(endDate).diff(startDate, 'days') + 1
                    console.log("HAHSHSADHASKDAS>>>>>>>>>", durationInDays, endDate, startDate)
                }

                console.log("DURATION>>>>>>>>>>>>>>>", durationInDays)

                const overlappingLeave = await isLeaveRecordOverlap(id, start_date, end_date)

                console.log("OVERLAPPING LEAVE", overlappingLeave)

                if(overlappingLeave){
                    next(forbiddenError("A leave for these dates are already applied"))
                }

                let leaveRecord: Model<LeaveRecordResponse>

                console.log("IS IT?", durationInDays <= leaveBalance?.leave_balance)

                const administrators = await User.findAll({
					where: {
						role_id: 1 //admin
					}
				})

                if(leaveBalance && !overlappingLeave){
                    await sequelize.transaction(async(t) => {
                        if(totalLeaveDaysInMonth + leaveRequestDuration > leaveType?.max_days_per_month){
                            return next(badRequest("You've used all the leave requests that are allowed in a month!"))
                        }else{
                            if(!leaveStartDate.isAfter(minimumdate.toDate())){
                                next(badRequest(`You cannot apply leaves for any date beyond ${minimumdate.format('YYYY-MM-DD')}`))
                            }else{
                                if(durationInDays > leaveBalance?.leave_balance){
                                    console.log("THE CODE IS HERE!")
                                    if(leaveType?.negative_balance){
                                        console.log(">>>>>>>>>>>>>>>>>>>>>>>NEGATIVE BALANCE IS ALLOWED")
                                        if(leaveType?.max_leave_allowed_in_negative_balance >= (durationInDays - leaveBalance?.leave_balance)){
                                            console.log(">>>>>>>>>>>>>>>>>>>MAX LEAVE IS GREATER THAN THE LEAVE APPLIED FOR!")
                                            leaveRecord = await LeaveRecord.create(leaveRecordBody, {transaction: t});
                                            console.log("LEAVE RECORD!!!", leaveRecord)
                                            if(leaveRecord){
                                                const balance = leaveBalance?.leave_balance - durationInDays
                                                await leaveBalance?.update({
                                                    leave_balance: balance
                                                }, {transaction: t})
                                                // leaveBalance?.leave_balance = leaveBalance?.leave_balance - durationInDays
                                                // await leaveRecord.save({transaction: t})
                                            }
                                        }else{
                                            console.log(">>>>>>>", leaveType?.max_leave_allowed_in_negative_balance, (durationInDays - leaveBalance?.leave_balance), durationInDays)
                                            next(forbiddenError("Insufficient leave balance"))
                                        }
                                    }else{
                                        next(forbiddenError("Insufficient leave balance"))
                                    }
                                }else if(durationInDays <= leaveBalance?.leave_balance){
                                    if(durationInDays <= maximumDaysOfLeaveAllowed){
                                        console.log(">>>>>>>>>>>>>>>>>>>>>>>>..IT IS SUFFICIENT!")
                                        leaveRecord  = await LeaveRecord.create(leaveRecordBody, {transaction: t});
                                        console.log("HERHE IS CREATED,", leaveRecord)
                                        if(leaveRecord){
                                            const balance = leaveBalance.leave_balance - durationInDays
                                            await leaveBalance.update({
                                                leave_balance: balance
                                            })
                                            // leaveRecord.leave_balance = leaveRecord.leave_balance - durationInDays
                                            // await leaveRecord.save({transaction: t})
                                        }
                                    }else{
                                        next(forbiddenError(`You can only apply for leaves upto, ${maximumDaysOfLeaveAllowed} days`))
                                    }
                                }
                            }
                            if(leaveRecord){
                                console.log("HAAN DIRECTLY IDHAR AAYA HAIN !")
                                if(user?.Manager && user?.Manager.length > 0){

                                    console.log("Manager: ", user?.Manager)
            
                                    if(approvalWorkflow?.approval_flow_type?.id === 2){  //Sequential

                                        console.log("SEQUENTIAL MEIN GAYA HAIN YEH")
                                        const reportingManagers = user?.Manager as any[]

                                        console.log("REporting Managers: ", user.toJSON()?.Manager)

                                        const sortedManagers = approvalWorkflow?.direct?.sort((a, b) => b.priority - a.priority);
                                        const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
            
                                        const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);

                                        console.log("MIN PRIORITY MANAAGERSSS", minPriorityManagers)
                                        console.log("MIN PRIORITYYYY", minPriority)

                                        for (const manager of minPriorityManagers){
                                            await Promise.all(
                                                manager?.reporting_managers.map(async(item) => {
                                                    console.log(">>>>> ITEM: ", item)
                                                    try{
                                                        if(reportingManagers.some(manager => manager.id === item.id)){
                                                            const leaveRequest = await LeaveRequest.create({
                                                                leave_record_id: leaveRecord?.id,
                                                                user_id: item.user_id,
                                                                status: 1,
                                                                priority: manager.priority
                                                            }, {transaction: t})
                        
                                                            const notificationData = {
                                                                user_id: item.user_id,
                                                                title: 'Leave Request',
                                                                type: 'leave_request_creation',
                                                                description: `${user?.employee_name} has applied for leave`,
                                                            }
                        
                                                            const notification = await Notification.create(notificationData, {transaction: t})
                        
                                                            await sendNotification(item.user_id, notification)

                                                            let data = {
                                                                user_id: item.user_id,
                                                                type: 'leave_request_creation',
                                                                message: `${user?.employee_name} has applied for leave`,
                                                                path: 'leave_request_creation',
                                                                reference_id: leaveRequest?.id
                                                            }
                            
                                                            console.log("HERE IS THE NOTFICATION PART!!!!")
                                                            await sendPushNotification(data)
                                                        }
                                                    }catch(err){
                                                        console.log(err)
                                                    }
                                                })
                                            )

                                            for(let admin of administrators){
                                                const AdminLeaveRequest = await LeaveRequest.create({
                                                    leave_record_id: leaveRecord?.id,
                                                    user_id: admin.id,
                                                    status: 1,
                                                    priority: 0 //Admin Priority
                                                }, {transaction: t})
                                            }
                                        }
            
                                    }else if (approvalWorkflow?.approval_flow_type?.id === 1){ //Parallel

                                        console.log("PARALLEL MEIN GAYA HAIN YEH!")

                                        const reportingManagers = user?.Manager as any[]

                                        const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id))

                                        await Promise.all(
                                            filteredManagers.map(async(manager) => {
                                                const leaveRequest = await LeaveRequest.create({
                                                    leave_record_id: leaveRecord?.id,
                                                    reporting_manager_id: manager.id,
                                                    status: 1,
                                                    priority: 1
                                                }, {transaction: t})
                                                const notificationData = {
                                                    user_id: manager.user_id,
                                                    title: 'Leave Request',
                                                    type: 'leave_request_creation',
                                                    description: `${user?.employee_name} has applied for leave`,
                                                }
                        
                                                const notification = await Notification.create(notificationData, {transaction: t})       
                                                await sendNotification(manager.id, notification)
                                                
                                                let data = {
                                                    user_id: manager.user_id,
                                                    type: 'leave_request_creation',
                                                    message: `${user?.employee_name} has applied for leave`,
                                                    path: 'leave_request_creation',
                                                    reference_id: leaveRequest?.id
                                                }
                
                                                console.log("HERE IS THE NOTFICATION PART!!!!")
                                                await sendPushNotification(data)
                                            })
                                        )   
                                        
                                        for(let admin of administrators){
                                            console.log("ADMIN: ", admin)
                                            const AdminLeaveRequest = await LeaveRequest.create({
                                                leave_record_id: leaveRecord?.id,
                                                user_id: admin.id,
                                                status: 1,
                                                priority: 0 //Admin Priority
                                            }, {transaction: t})
                                        }
                                    }
                                }
                                const peer_user_id: number[] = req.body.peer_user_id || [];
                                const leave_record_id = leaveRecord?.id
            
                                if(peer_user_id.length > 0){
                                    for(const peerUserId of peer_user_id){
                                        const peerLeaveRecordFormBody = {
                                            leave_record_id,
                                            'peer_user_id': peerUserId
                                        };
                                        const peerLeaveRecordRelationship = await PeersLeaveRecord.create(peerLeaveRecordFormBody, {transaction: t});
                                    }
                                }
                                // await t.commit()
                                const response = generateResponse(201, true, "Record created succesfully!", leaveRecord)
                                res.status(201).json(response)
                            }
                        }    
                    })
                }else{
                    next(forbiddenError("Insufficient Leave Balance"))
                }
            }else{
                next(notFound("Cannot find user with that id!"))
            }
        }catch(err){
            console.log(err)
            next(internalServerError("Something Went Wrong!"))
        }
    }

    const approve = async(req:Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            
            await sequelize.transaction(async(t) => {
                
                const {id} = req.credentials

                const requestId = req.params.id

                const user  = await User.findByPk(id);

                const manager = await ReportingManagers.findAll({
                    where:{
                        user_id: id
                    }
                })

                const managerIds = manager.map((item) => item.reporting_role_id)

                const managerUser = await User.findByPk(id)

                console.log("MANAGER USERRR", managerUser)
                
                const leaveRequest = await LeaveRequest.findByPk(requestId);

                const leaveRecord = await LeaveRecord.findByPk(leaveRequest?.leave_record_id);
                
                const masterPolicy = await getMasterPolicy(leaveRecord?.user_id)

                const leaveWorkflow = masterPolicy.leave_workflow

                const approvalWorkflow = await ApprovalFlow.findByPk(leaveWorkflow, 
                    {
                        include:[
                            {
                                model: ReportingRole,
                                as: 'direct',
                                through:{attributes:[]},
                                include: [{
                                    model: ReportingManagers,
                                }]
                            },
                            {
                                model: ApprovalFlowType,
                            }
                        ]
                    }
                )

                const reportingRoleIds = approvalWorkflow?.direct.map(item => item.id);

                const isManager = managerIds.some(id => reportingRoleIds.includes(id));

                if(user && manager && (isManager) && leaveRequest){

                    console.log("HELLO")

                    const masterPolicy = await getMasterPolicy(leaveRecord?.user_id)

                    const leaveWorkflow = masterPolicy.leave_workflow

                    const approvalWorkflow = await ApprovalFlow.findByPk(leaveWorkflow)

                    console.log(approvalWorkflow?.id)


                    if(approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1){ //Parallel Approval Workflow

                        const leaveRequests = await LeaveRequest.findAll({
                            where: {
                                leave_record_id: leaveRecord?.id,   
                            }
                        })

                        await Promise.all(
                            leaveRequests.map(async(request) => {
                                request.status = 2
                                await request.save({transaction: t})
                            })   
                        )

                        if(leaveRecord){

                            console.log("LEAVE RECORD FOUND!>>>>>>>>>>>>>>>")
                            // leaveRecord.status = 2

                            // leaveRecord.last_action_by = user?.id

                            await leaveRecord.update({
                                status: 2,
                                last_action_by: user?.id
                            }, {transaction: t})

                            const approverManager = await User.findByPk(id, {
                                attributes: ['id', 'employee_name']
                            })

                            await LeaveRequestHistory.create({
                                leave_record_id: leaveRequest?.leave_record_id,
                                user_id: user?.id,
                                action: 'approved',
                                status_before: 1,
                                status_after: 2
                            })

                            const notification = await Notification.create({
                                user_id: leaveRecord?.user_id,
                                title: 'Leave Request',
                                type: 'leave_request_approval',
                                description: `${approverManager?.employee_name} has succesfully approved your leave request`
                            }, {transaction: t})

                            await sendNotification(user?.id, notification)

                            let data = {
                                user_id: leaveRecord?.user_id,
                                type: 'leave_request_approval',
                                message: `${user?.employee_name} has succesfully approved your leave request`,
                                path: 'leave_request_approval',
                                reference_id: leaveRecord?.id
                            }

                            console.log("HERE IS THE NOTFICATION PART!!!!")
                            await sendPushNotification(data)

                            const response = generateResponse(200, true, "Leave Approved succesfully", leaveRequest);
                            res.status(200).json(response)
                        }


                    }else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2){ //Sequential Workflow


                        const leaveRequest = await LeaveRequest.findAll({
                            where:{
                                leave_record_id: leaveRecord?.id
                            }
                        })
                        
                        const user = await User.findByPk(leaveRecord?.user_id, {
                            include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']}, {model: ReportingRole}]}],
                            attributes:['id', 'employee_generated_id', 'employee_name']
                        })
        
                        const masterPolicy = await getMasterPolicy(leaveRecord?.user_id);
        
                        const leaveWorkflow = masterPolicy.leave_workflow;
        
                        // const leaveType = await LeaveType.findByPk(leave_type_id);
        
                        const approvalWorkflow = await ApprovalFlow.findByPk(leaveWorkflow, 
                            {
                                include:[
                                    {
                                        model: ReportingRole,
                                        as: 'direct',
                                        through:{attributes:[]},
                                        include: [{
                                            model: ReportingManagers,
                                        }]
                                    },
                                    {
                                        model: ApprovalFlowType,
                                    }
                                ]
                            }
                        )
                        
                        const reportingManager = user?.Manager as any[]

                        const filteredManagers = reportingManager.filter(manager => {return approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id)})

                        console.log("APPROVAL FLOW MANAGERSSS", approvalWorkflow?.direct)

                        console.log("FILTERED MANAGERSSSS", filteredManagers)

                        console.log("REPORTING MANAGERSSS", reportingManager)

                        const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));

                        const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority)
        
                        const existingRequests = await LeaveRequest.findAll({
                            where: {
                                leave_record_id: leaveRecord?.id,
                            }
                        })

                        if(leaveRecord){
                            if(existingRequests.length > 0){
                                
                                const approvedManagerIds = existingRequests.map(request => request.user_id);
                                const remainingManagers = filteredManagers.filter(manager => !approvedManagerIds.includes(manager.user_id))

                                console.log("REMAINING MANAGERSSS", remainingManagers)

                                if(remainingManagers.length > 0){
                                    const minPriority = Math.max(...remainingManagers.map(manager => manager.reporting_role.priority));
                                    const minPriorityManagers = remainingManagers.filter(manager => manager.reporting_role.priority === minPriority);

                                    console.log("MIN PRIORITY MANAGERSSSS", minPriorityManagers)


                                    leaveRecord.last_action_by = user?.id

                                    await leaveRecord.save({transaction: t})

                                    for(const manager of minPriorityManagers){
                                        await LeaveRequest.create({
                                            leave_record_id: leaveRecord?.id,
                                            user_id: manager.user_id,
                                            status: 1,
                                            priority: manager.reporting_role.priority
                                        }, {transaction: t})
                                    }
                                    
                                }else{
                                    await leaveRecord.update({
                                        status:2,
                                        last_action_by: user?.id
                                    }, {transaction: t})
                                    
                                    
                                    // await LeaveRecord.update({
                                    //     status: 2
                                    // }, {
                                    //     where: {
                                    //         id: leaveRecord?.id
                                    //     }
                                    // })
                                }

                                await Promise.all(
                                    existingRequests.map(async(request) => {
                                        await request.update({
                                            status: 2
                                        }, {transaction: t})
                                    })
                                )

                                const approverManager = await User.findByPk(id, {
                                    attributes: ['id', 'employee_name']
                                })

                                const notification = await Notification.create({
                                    user_id: leaveRecord?.user_id,
                                    title: 'Leave Request',
                                    type: 'leave_request_approval',
                                    description: `${approverManager?.employee_name} has succesfully approved your leave request`
                                }, {transaction: t})


                                await LeaveRequestHistory.create({
                                    leave_record_id: leaveRequest?.leave_record_id,
                                    user_id: user?.id,
                                    action: 'approved',
                                    status_before: 1,
                                    status_after: 2
                                })

                                await sendNotification(user?.id, notification)

                                let data = {
                                    user_id: leaveRecord?.user_id,
                                    type: 'leave_request_approval',
                                    message: `${approverManager?.employee_name} has succesfully approved your leave request`,
                                    path: 'leave_request_approval',
                                    reference_id: leaveRecord?.id
                                }
        
                                console.log("HERE IS THE NOTFICATION PART!!!!")
                                await sendPushNotification(data)
                            
                                const response = generateResponse(200, true, "Leave Approved succesfully", leaveRequest);
                                res.status(200).json(response)
                            }
                        }
                    }
                }else{
                    next(badRequest("You're not the authorized user to approve the leave!"))
                }
            })
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials
            const { page, records, sortBy, sortOrder, search_term, month, year, day_type} = req.query as { page: string, records: string, sortBy: string, sortOrder: string, searchTerm: string, month: string, year: string };
            

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')


            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;


            const manager = await ReportingManagers.findAll({
                where:{
                    user_id: id
                }
            })

            const orderOptions = [] as Order[]

            if(sortBy && sortOrder){
                if(sortBy === 'employee_name'){
                    orderOptions.push([{model: LeaveRecord}, {model: User, as: 'requester'}, 'employee_name', sortOrder]);
                }

                if(sortBy === 'leave_type'){
                    orderOptions.push([{model: LeaveRecord},'leave_type_id', sortOrder])
                }

                if(sortBy === 'day_type'){
                    orderOptions.push([{model: LeaveRecord}, 'day_type_id', sortOrder])
                }

                if(sortBy === 'from'){
                    orderOptions.push([{model: LeaveRecord}, 'start_date', sortOrder])
                }

                if(sortBy === 'to'){
                    orderOptions.push([{model: LeaveRecord}, 'end_date', sortOrder])
                }                
                // orderOptions.push([sortBy, sortOrder])
            }
            

            if(manager.length > 0){

                const managerIds = manager.map(manager => manager.user_id); // Extract manager IDs from the array

                let whereOptions = {
                    user_id: {[Op.in]: managerIds},
                    status: 1
                }

                let whereOptions2 = {}

                if(month && year){
                    whereOptions.createdAt = {
                        [Op.gte]: startOfMonth.toDate(),
                        [Op.lte]: endOfMonth.toDate()
                    }
                }

                if(search_term){
                    whereOptions[Op.or] = [
                        {
                            '$leave_record.requester.employee_name$': {
                                [Op.like]: `%${search_term}%`
                            }
                        }
                    ];
                }

                if(day_type){
                    whereOptions2.day_type_id = day_type
                }

                let processedRows = [];

                const leaveRequest = await LeaveRequest.findAndCountAll({
                    where: whereOptions,
                    include: [
                        {
                            model: LeaveRecord,
                            where: whereOptions2,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            },
                            include: [
                                {
                                    model: LeaveType,
                                    attributes: ['id', 'leave_type_name']
                                },
                                {
                                    model: DayType,
                                    attributes: ['id', 'name']
                                },
                                {
                                    model: User,
                                    as: 'requester',
                                    attributes: ['id', 'employee_name']
                                }
                            ]
                        },
                    ],
                    // attributes: {
                    //     exclude: ['createdAt', 'updatedAt']
                    // },
                    offset: offset,
                    limit: recordsPerPage,
                    order: orderOptions,
                })

                for(let row of leaveRequest.rows){
                    const leaveRecord = await LeaveRecord?.findByPk(row.leave_record_id)
                    const user = await User.findByPk(leaveRecord?.user_id)
                    const masterPolicy = await getMasterPolicy(user?.id)
                    const baseLeaveConfiguration = await BaseLeaveConfiguration.findByPk(masterPolicy?.base_leave_configuration_id)

                    if(baseLeaveConfiguration?.leave_rejection_reason){
                       const response =  {
                        ...row.toJSON(),
                        rejection_reason_mandatory: true,
                       }
                       processedRows.push(response)
                    }else{
                        const response = {
                            ...row.toJSON(),
                            rejection_reason_mandatory: false,
                        }
                        processedRows.push(response)
                    }
                }
                
                const totalPages = Math.ceil(leaveRequest.count / recordsPerPage)
                const hasNextPage = pageNumber < totalPages;
                const hasPrevPage = pageNumber > 1;


                const meta = {
                    totalCount: leaveRequest.count,
                    pageCount: totalPages,
                    currentPage: page,
                    perPage: recordsPerPage,
                    hasNextPage,
                    hasPrevPage
                }

                const result = {
                    data: leaveRequest.rows,
                    meta
                }

                const response = generateResponse(200, true, "Requests fetched succesfully!", processedRows, result.meta);
                res.status(200).json(response)
            }else{
                const meta = {
                    totalCount: 0,
                    pageCount: 0,
                    currentPage: page,
                    perPage: recordsPerPage,
                    hasNextPage: false,
                    hasPrevPage: false
                }
                const response = generateResponse(200, false, "This employee has not been assigned as a manager by the admin", [], meta)
                res.status(200).json(response)
                // next(forbiddenError("You don't have the access role to view this resource!"))
            }
        }catch(err){
            console.log(err)
            next(internalServerError("Something went Wrong!"))
        }
    }

    const getLeaveRequests = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.credentials
            const {status} = req.query
    
            const whereClause = {
                user_id: id
            }

            if(status){
                whereClause.status = status
            }

            const leaveRecord = await LeaveRecord.findAll({
                where: whereClause,
                include: [
                    {
                        model: LeaveType,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: DayType,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: User,
                        attributes: ['id', 'employee_name']
                    }
                ]
            })

            const response = generateResponse(200, true, "Data fetched succesfully!", leaveRecord)
            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const reject = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials

            // const t = await sequelize.transaction()

            const {reject_reason} = req.body

            const requestId = req.params.id

            const user  = await User.findByPk(id);

            const manager = await ReportingManagers.findAll({
                where:{
                    user_id: id
                }
            })
            
            const leaveRequest = await LeaveRequest.findByPk(requestId);

            const leaveRecord = await LeaveRecord.findByPk(leaveRequest?.leave_record_id);


            const managerIds = manager?.map((item) => item.reporting_role_id)
            const managerUser = await User.findByPk(id)

            const masterPolicy = await getMasterPolicy(leaveRecord?.user_id)

            const attendanceWorkflow = masterPolicy.leave_workflow

            const baseLeaveConfiguration = await BaseLeaveConfiguration.findByPk(masterPolicy?.base_leave_configuration_id)

            if(baseLeaveConfiguration?.leave_rejection_reason && !req.body.reject_reason){
                return next(badRequest("A reason for rejection is mandatory!"))
            }


            const approvalWorkflow = await ApprovalFlow.findByPk(attendanceWorkflow, 
                {
                    include:[
                        {
                            model: ReportingRole,
                            as: 'direct',
                            through:{attributes:[]},
                            include: [{
                                model: ReportingManagers,
                            }]
                        },
                        {
                            model: ApprovalFlowType,
                        }
                    ]
                }
            )

            const reportingRoleIds = approvalWorkflow?.direct.map(item => item.id);

			const isManager = managerIds.some(id => reportingRoleIds.includes(id));


            let startDate;

            let endDate;

            if(leaveRecord?.day_type_id == 1){
                startDate = moment(leaveRecord?.start_date)
                endDate = moment(leaveRecord?.start_date)
            }else{
                startDate = moment(leaveRecord?.start_date)
                endDate = moment(leaveRecord?.end_date)
            }
            

            let durationInDays;

            if(leaveRecord?.day_type_id == 1){
                durationInDays = 0.5
            }else{
                durationInDays = moment(endDate).diff(startDate, 'days') + 1
            }


            const leaveBalance = await LeaveBalance.findOne({
                where: {
                    user_id: leaveRecord?.user_id,
                    leave_type_id: leaveRecord?.leave_type_id
                }                
            })

            if(user && manager && (isManager) && leaveRequest){
                await sequelize.transaction(async(t) => {

                    const masterPolicy = await getMasterPolicy(leaveRecord?.user_id)

                    const leaveWorkflow = masterPolicy.leave_workflow

                    const approvalWorkflow = await ApprovalFlow.findByPk(leaveWorkflow)

                    if(approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1){ //Parallel Workflow

                        const leaveRequests = await LeaveRequest.findAll({
                            where: {
                                leave_record_id: leaveRecord?.id,   
                            }
                        })

                        await Promise.all(
                            leaveRequests.map(async(request) => {
                                request.status = 3
                                await request.save({transaction: t})
                            })   
                        )

                        if(leaveRecord){

                            leaveRecord.status = 3

                            if(baseLeaveConfiguration?.leave_rejection_reason){
                                leaveRecord.reject_reason = reject_reason
                            }

                            leaveRecord.last_action_by = user.id

                            await leaveBalance?.update({
                                leave_balance: leaveBalance?.leave_balance + durationInDays
                            })
                            await leaveRecord.save({transaction: t})
                            const response = generateResponse(200, true, "Leave Rejected succesfully", leaveRequest);
                            res.status(200).json(response)
                        }


                        await LeaveRequestHistory.create({
                            leave_record_id: leaveRequest?.leave_record_id,
                            user_id: user?.id,
                            action: 'rejected',
                            status_before: 1,
                            status_after: 3
                        })

                        const notification = await Notification.create({
                            user_id: leaveRecord?.user_id,
                            title: 'Leave Request',
                            type: 'leave_request_rejection',
                            description: `${managerUser?.employee_name} has rejected your leave request`
                        }, {transaction: t})
    
                        await sendNotification(leaveRecord?.id, notification)

                        let data = {
                            user_id: leaveRecord?.user_id,
                            type: 'leave_request_rejection',
                            message: `${managerUser?.employee_name} has rejected your leave request`,
                            path: 'leave_request_rejection',
                            reference_id: leaveRecord?.id
                        }

                        await sendPushNotification(data)

                        


                    }else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2){ //Sequential Workflow
                        const leaveRequests = await LeaveRequest.findAll({
                            where: {
                                leave_record_id: leaveRecord?.id,   
                            }
                        })

                        await Promise.all(
                            leaveRequests.map(async(request) => {
                                request.status = 3
                                await request.save({transaction: t})
                            })   
                        )

                        if(leaveRecord){

                            leaveRecord.status = 3
                            await leaveBalance?.update({
                                leave_balance: leaveBalance?.leave_balance + durationInDays
                            })

                            if(baseLeaveConfiguration?.leave_rejection_reason){
                                leaveRecord.reject_reason = reject_reason
                            }

                            leaveRecord.last_action_by = user.id

                            await leaveRecord.save({transaction: t})

                            const notification = await Notification.create({
                                user_id: leaveRecord?.user_id,
                                title: 'Leave Change',
                                type: 'leave_change_rejection',
                                description: `${managerUser?.employee_name} has rejected your leave request`
                            }, {transaction: t})


                            await LeaveRequestHistory.create({
                                leave_record_id: leaveRequest?.leave_record_id,
                                user_id: user?.id,
                                action: 'rejected',
                                status_before: 1,
                                status_after: 3
                            })
        
                            await sendNotification(leaveRecord?.id, notification)

                            let data = {
                                user_id: leaveRecord?.user_id,
                                type: 'leave_request_rejection',
                                message: `${managerUser?.employee_name} has rejected your leave request`,
                                path: 'leave_request_rejection',
                                reference_id: leaveRecord?.id
                            }
    
                            await sendPushNotification(data)

                            const response = generateResponse(200, true, "Leave Rejected succesfully", leaveRequest);
                            res.status(200).json(response)
                        }
                        
                    }
                })
            }else{
                next(unauthorized("You don't have the access role to view this resource!"))
            }
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const cancelRequest = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            await sequelize.transaction(async(t) => {

                const {id} = req.credentials

                const recordId = req.params.id

                const leaveRecord = await LeaveRecord.findByPk(recordId)

                if(leaveRecord){
                    await leaveRecord.destroy({transaction: t})

                    await LeaveRequest.destroy({
                        where: {
                            leave_record_id: recordId
                        },
                        transaction: t
                    })

                }else{
                    next(notFound("Cannot find leave record for this id!"))
                }
            })
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const leaveHolidaySummary = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            
            const {id} = req.credentials

            const {month, year} = req.query

            const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
            const endDate = moment(startDate).endOf('month').toDate();

            const user = await User.findByPk(id)

            if(user){

                const masterPolicy = await getMasterPolicy(id)

                const holidayCalendar = await HolidayCalendar.findByPk(masterPolicy?.holiday_calendar_id, {
                    include: [
                        {
                            model: HolidayDatabase,
                            attributes: ['name', 'date'],
                            through: {attributes: []},
                            where: {
                                date: {
                                    [Op.gte]: moment().toDate()
                                },
                            }
                        }
                    ],
                    attributes: []
                })
                
    
                
                const response = generateResponse(200, true, "Data fetched succesfully!", holidayCalendar)
                
                res.status(200).json(response)

            }else{
                next(notFound("Cannot find employee with that id"))
            }

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getSingleRecord = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            
            const {id} = req.params

            const leaveRecord = await LeaveRecord.findByPk(id, {
                include: [
                    {model: Approval, attributes:['id', 'name'] },
                    {model: LeaveType, attributes:['id', 'leave_type_name']}
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })

            if(leaveRecord){
                const response = generateResponse(200, true, "Data fetched succesfully!", leaveRecord)

                res.status(200).json(response)
            }else{
                next(notFound("Cannot find leave record for that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const getLeaveRequestedSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials

            const user = await User.findByPk(id)

            if(user){
                const leaveRecordSummary = await LeaveRecord.findAll({
                    where: {
                        user_id: id
                    },
                    attributes:[
                        [sequelize.fn('COUNT', sequelize.col('id')), 'total_leave_records'],
                        [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = 1 THEN 1 ELSE 0 END')), 'pending_count'],
                        [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = 2 THEN 1 ELSE 0 END')), 'approved_count'],
                        [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = 3 THEN 1 ELSE 0 END')), 'rejected_count'],
                    ],
                    group: ['user_id']
                })

                const response = generateResponse(200, true, "Data fetched succesfully!", leaveRecordSummary)
                res.status(200).json(response)
            }else{
                next(notFound("Cannot find an employee with that id!"))
            }

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const editLeaveRecord = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const leaveRecordId = req.params.id

            const {id} = req.credentials

            const leaveRecord = await LeaveRecord.findByPk(leaveRecordId)

            const user = await User.findByPk(id)

            if(!user){
                next(notFound("Cannot find employee with that id!"))
            }

            if(!leaveRecord){
                next(notFound("Cannot find a leave record with that id!"))
            }

            if(user?.id !== leaveRecord?.user_id){
                next(forbiddenError("This leave record is not yours!"))
            }

            if(leaveRecord?.status !== 1){
                next(forbiddenError("Cannot edit already approved/rejected leave record!"))
            }

            await sequelize.transaction(async(t) => {
                const {
                    leave_type_id,
                    day_type_id,
                    half_day_type_id, 
                    start_date, 
                    end_date, 
                    reason, 
                    document, 
                    contact_number
                } = req.body

                const leaveType = await LeaveType.findByPk(leave_type_id) as LeaveTypeResponse | null;


                const leaveBalance = await LeaveBalance.findOne({
                    where:{
                        user_id: id,
                        leave_type_id: leave_type_id
                    }
                });

                let startDate;

                let endDate;    

                if(day_type_id == 1){
                    startDate = moment(start_date)
                    endDate = moment(start_date)
                }else{
                    startDate = moment(start_date)
                    endDate = moment(end_date)
                }

                const maximumDaysOfLeaveAllowed = leaveType?.max_days_per_leave

                const maximumDaysOfLeaveAllowedInNegative = leaveType?.negative_balance
                

                let durationInDays: number;

                let previousDurationInDays: number;

                if(leaveRecord?.day_type_id == 1){
                    previousDurationInDays = 0.5 
                    console.log("Previous duration when day is half", previousDurationInDays)
                }else{
                    previousDurationInDays = moment(leaveRecord?.end_date).diff(leaveRecord?.start_date, 'days') + 1
                    console.log("Previous duration when day is full", previousDurationInDays)
                }

            
                const recoveredBalance = leaveBalance?.leave_balance + previousDurationInDays;

                if(day_type_id == 1){
                    durationInDays = 0.5
                }else{
                    console.log("IDHAR GAYA")
                    durationInDays = moment(endDate).diff(startDate, 'days') + 1
                    console.log("HAHSHSADHASKDAS>>>>>>>>>", durationInDays, endDate, startDate)
                }

                console.log("DURATION>>>>>>>>>>>>>>>", durationInDays)

                const overlappingLeave = await isLeaveRecordOverlap(id, start_date, end_date, leaveRecord?.id)

                if(overlappingLeave){
                    next(forbiddenError("A leave for these dates are already applied"))
                }

                let newUpdatedRecord;

                if(durationInDays > recoveredBalance){
                    console.log("THE CODE IS HERE!")
                    if(leaveType?.negative_balance){
                        console.log(">>>>>>>>>>>>>>>>>>>>>>>NEGATIVE BALANCE IS ALLOWED")
                        if(leaveType?.max_leave_allowed_in_negative_balance >= (durationInDays - recoveredBalance)){
                            console.log(">>>>>>>>>>>>>>>>>>>MAX LEAVE IS GREATER THAN THE LEAVE APPLIED FOR!")
                            newUpdatedRecord = await leaveRecord?.update(req.body, {transaction: t});
                            console.log("LEAVE RECORD!!!", leaveRecord)
                            if(newUpdatedRecord){
                                const balance = recoveredBalance - durationInDays
                                await leaveBalance?.update({
                                    leave_balance: balance
                                }, {transaction: t})
                                // leaveBalance?.leave_balance = leaveBalance?.leave_balance - durationInDays
                                // await leaveRecord.save({transaction: t})
                            }
                            const response = generateResponse(200, true, "Leave Record updated succesfully!", newUpdatedRecord)
                            res.status(200).json(response)
                        }else{
                            next(forbiddenError("Insufficient leave balance"))
                        }
                    }else{
                        next(forbiddenError("Insufficient leave balance"))
                    }
                }else if(durationInDays <= recoveredBalance){
                    if(durationInDays <= maximumDaysOfLeaveAllowed){
                        console.log(">>>>>>>>>>>>>>>>>>>>>>>>..IT IS SUFFICIENT!")
                        newUpdatedRecord  = await leaveRecord?.update(req.body, {transaction: t});
                        console.log("HERHE IS CREATED,", newUpdatedRecord)
                        if(newUpdatedRecord){
                            const balance = recoveredBalance - durationInDays
                            await leaveBalance?.update({
                                leave_balance: balance
                            })
                            // leaveRecord.leave_balance = leaveRecord.leave_balance - durationInDays
                            // await leaveRecord.save({transaction: t})
                        }
                        const response = generateResponse(200, true, "Leave Record updated succesfully!", newUpdatedRecord)   
                        res.status(200).json(response)
                    }else{
                        next(forbiddenError(`You can only apply for leaves upto, ${maximumDaysOfLeaveAllowed} days`))
                    }   
                }   
            })         
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const deleteLeaveRecord = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{

            const {id} = req.credentials

            const recordId = req.params.id

            const user = await User.findByPk(id)

            const leaveRecord = await LeaveRecord.findByPk(recordId)

            if(!user){
                next(notFound("Cannot find employee with that id!"))
            }

            if(!leaveRecord){
                next(notFound("Cannot find a leave record with that id!"))
            }

            if(user?.id !== leaveRecord?.user_id){
                next(forbiddenError("This leave record is not yours!"))
            }

            if(leaveRecord?.status !== 1){
                next(forbiddenError("Cannot edit already approved/rejected leave record!"))
            }

            await sequelize.transaction(async(t) => {

                const leaveType = await LeaveType.findByPk(leaveRecord?.leave_type_id) as LeaveTypeResponse | null;


                const leaveBalance = await LeaveBalance.findOne({
                    where:{
                        user_id: id,
                        leave_type_id: leaveRecord?.leave_type_id
                    }
                });

                let startDate;

                let endDate;    

                if(leaveRecord?.day_type_id == 1){
                    startDate = moment(leaveRecord?.start_date)
                    endDate = moment(leaveRecord?.start_date)
                }else{
                    startDate = moment(leaveRecord?.start_date)
                    endDate = moment(leaveRecord?.end_date)
                }
                
                let durationInDays: number;

                if(leaveRecord?.day_type_id == 1){
                    durationInDays = 0.5
                }else{
                    durationInDays = moment(endDate).diff(startDate, 'days') + 1
                }

                await LeaveRequest.destroy({
                    where: {
                        leave_record_id: recordId
                    },
                    transaction: t
                })

                await leaveRecord?.destroy({transaction: t})

                const newBalance = leaveBalance?.leave_balance + durationInDays

                await leaveBalance?.update({
                    leave_balance: newBalance
                }, {transaction: t})

                const response = generateResponse(200, true, "Leave Requests deleted succesfully!")

                res.status(200).json(response)
            })
        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getAdminLeaveRequests = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            const {id} = req.credentials
            const { page, records, sortBy, sortOrder, search_term, month, year, day_type, status} = req.query as { page: string, records: string, sortBy: string, sortOrder: string, searchTerm: string, month: string, year: string, status: string };
            

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')


            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

            const orderOptions = [] as Order[]

            if(sortBy && sortOrder){
                if(sortBy === 'employee_name'){
                    orderOptions.push([{model: LeaveRecord}, {model: User, as: 'requester'}, 'employee_name', sortOrder]);
                }

                if(sortBy === 'leave_type'){
                    orderOptions.push([{model: LeaveRecord},'leave_type_id', sortOrder])
                }

                if(sortBy === 'day_type'){
                    orderOptions.push([{model: LeaveRecord}, 'day_type_id', sortOrder])
                }

                if(sortBy === 'from'){
                    orderOptions.push([{model: LeaveRecord}, 'start_date', sortOrder])
                }

                if(sortBy === 'to'){
                    orderOptions.push([{model: LeaveRecord}, 'end_date', sortOrder])
                }                
                // orderOptions.push([sortBy, sortOrder])
            }
            

            // const managerIds = manager.map(manager => manager.user_id); // Extract manager IDs from the array

            let whereOptions = {
                // user_id: {[Op.in]: managerIds},
                // user_id: id,
                // status: 1,
                // priority: 0
            }

            let whereOptions2 = {}

            if(month && year){
                whereOptions.createdAt = {
                    [Op.gte]: startOfMonth.toDate(),
                    [Op.lte]: endOfMonth.toDate()
                }
            }

            let whereOptions3 = {}

            if(search_term){
                whereOptions3[Op.or] = [
                    {
                        'employee_name': {
                            [Op.like]: `%${search_term}%`
                        }
                    }
                ];
            }

            if(status && status!== "null"){
                whereOptions2.status = status 
            }

            if(day_type){
                whereOptions2.day_type_id = day_type
            }

            let processedRows = [];

            const leaveRequest = await LeaveRecord.findAndCountAll({
                where: whereOptions2,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: LeaveType,
                        attributes: ['id', 'leave_type_name']
                    },
                    {
                        model: DayType,
                        attributes: ['id', 'name']
                    },
                    {
                        model: User,
                        as: 'requester',
                        attributes: ['id', 'employee_name'],
                        where: whereOptions3,
                        required: true
                    },
                    {
                        model: Approval,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: LeaveRequestHistory,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'employee_name']
                            }
                        ]
                    }
                ],
                // attributes: {
                //     exclude: ['createdAt', 'updatedAt']
                // },
                offset: offset,
                limit: recordsPerPage,
                order: orderOptions,
            })

            for(let row of leaveRequest.rows){
                const leaveRecord = await LeaveRecord?.findByPk(row.leave_record_id)
                const user = await User.findByPk(leaveRecord?.user_id)
                const masterPolicy = await getMasterPolicy(user?.id)
                const baseLeaveConfiguration = await BaseLeaveConfiguration.findByPk(masterPolicy?.base_leave_configuration_id)

                if(baseLeaveConfiguration?.leave_rejection_reason){
                    const response =  {
                    ...row.toJSON(),
                    rejection_reason_mandatory: true,
                    }
                    processedRows.push(response)
                }else{
                    const response = {
                        ...row.toJSON(),
                        rejection_reason_mandatory: false,
                    }
                    processedRows.push(response)
                }
            }
            
            const totalPages = Math.ceil(leaveRequest.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;


            const meta = {
                totalCount: leaveRequest.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: leaveRequest.rows,
                meta
            }

            const response = generateResponse(200, true, "Requests fetched succesfully!", processedRows, result.meta);
            res.status(200).json(response)
        }catch(err){
            console.log('err: ', err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const getAdminLeaveRecords = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const {id} = req.credentials
            const {status} = req.query
            const { page, records, leave_type, day_type, sortBy, sortOrder, month, year } = req.query as { page: string, records: string };

            const user = await User.findByPk(id)

            if(!user){
                return notFound("User not found with that id!")
            }

            if(user.role_id !== 1){
                return forbidden("You don't have administrator rights to view this resource")
            }


            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
            const endOfMonth = moment(startOfMonth).endOf('month')    
            
            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)
    
            const offset = (pageNumber - 1) * recordsPerPage;

            const whereClause = {}

            if(status){
                whereClause.status = status
            }

            if(leave_type){
                whereClause.leave_type_id = leave_type
            }

            if(day_type){
                whereClause.day_type_id = day_type
            }

            let orderOptions = [] as Order[];

            if(sortBy && sortOrder){
                orderOptions.push([sortBy, sortOrder])
            }

            if(month && year){
                whereClause[Op.or] = [
                    {
                        start_date: {
                            [Op.gte]: startOfMonth,
                            [Op.lte]: endOfMonth
                        }
                    }
                ]
            }

            const leaveRecord = await LeaveRecord.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'leave_requester'
                    },
                    {
                        model: LeaveType,
                        attributes: ['id', 'leave_type_name']
                    },
                    {
                        model: DayType,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: Approval,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: LeaveRequestHistory,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'employee_name']
                            },
                            {
                                model: Approval,
                                as: 'statusBefore',
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            },
                            {
                                model: Approval,
                                as: 'statusAfter',
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            }
                        ]
                    }
                ],
                offset: offset,
                limit: recordsPerPage,
                order: orderOptions
            })

            const totalPages = Math.ceil(leaveRecord.count / recordsPerPage)
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;



            const meta = {
                totalCount: leaveRecord.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            }

            const result = {
                data: leaveRecord.rows,
                meta
            }
            const response = generateResponse(200, true, "Data fetched succesfully!", result.data, meta)
            res.status(200).json(response)

        }catch(err){
            console.log("err: ", err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const adminLeaveRequestApprove = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const {id} = req.credentials

            const requestId = req.params.id

            const user = await User.findByPk(id)

            if(!user){
                next(notFound("User not found with this id!"))
            }

            if(user.role_id !== 1){
                next(forbiddenError("You don't have adminstrative rights to access this resource"))
            }

            const leaveRecord = await LeaveRecord.findByPk(requestId)

            const leaveRequest = await LeaveRequest.findOne({
                leave_record_id: leaveRecord?.id,
                user_id: id,
                status: 1
            })

            if(!leaveRecord){
                next(notFound("Leave Record not found with this id!"))
            }

            if(!leaveRequest){
                next(notFound("There is not leave request of this leave record"))
            }

            const leaveRequests = await LeaveRequest.findAll({
                leave_record_id: leaveRecord?.id
            })

            await sequelize.transaction(async(t) => {
                
                leaveRequest.status = 2

                await leaveRequest.save({transaction: t})

                await leaveRecord.update({
                    status: 2,
                    last_action_by: user?.id
                }, {transaction: t})
    
                await LeaveRequestHistory.create({
                    leave_record_id: leaveRequest?.leave_record_id,
                    user_id: user?.id,
                    action: 'approved',
                    status_before: 1,
                    status_after: 2
                })
            })

            const response = generateResponse(200, true, "Leave request approved succesfully!", null, null)
            res.status(200).json(response)
        
        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    const adminLeaveRequestReject = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try{

            const {id} = req.credentials

            const requestId = req.params.id

            const user = await User.findByPk(id)

            if(!user){
                next(notFound("User not found with that id!"))
            }

            if(user.role_id !== 1){
                next(forbiddenError("You don't have administrative rights to access this resource"))
            }

            const leaveRecord = await LeaveRecord.findByPk(requestId)

            const leaveRequest = await LeaveRequest.findOne({
                leave_record_id: leaveRecord?.id,
                status: 1
            })

            if(!leaveRecord){
                next(notFound("There is no leave record with that id!"))
            }

            if(!leaveRequest){
                next(notFound("There is no leave request for this leave record"))
            }

            const leaveRequests = await LeaveRequest.findAll({
                leave_record_id: leaveRecord?.id
            })

            await sequelize.transaction(async(t) => {
                leaveRequest.status = 3

                await leaveRequest.save({transaction: t})

                await leaveRecord.update({
                    status: 3,
                    last_action_by: user?.id
                }, {transaction: t})

                await leaveRecord?.save({transaction: t})

                await LeaveRequestHistory.create({
                    leave_record_id: leaveRecord?.id,
                    user_id: id,
                    action: 'rejected',
                    status_before: 1,
                    status_after: 3
                }, {transaction: t})
            })

            const response = generateResponse(200, true, "Leave rejected succesfully!", null, null)
            res.status(200).json(response)

        }catch(err){
            next(internalServerError("Something went wrong!"))
        }
    }

    return { 
        getAll, 
        create, 
        destroy, 
        update, 
        getAllDropdown, 
        getById, 
        apply, 
        approve, 
        getRequest, 
        getLeaveRequests, 
        reject, 
        cancelRequest, 
        leaveHolidaySummary, 
        getSingleRecord, 
        getLeaveRequestedSummary, 
        editLeaveRecord, 
        deleteLeaveRecord, 
        getAdminLeaveRequests,
        getAdminLeaveRecords,
        adminLeaveRequestApprove,
        adminLeaveRequestReject
    }

}