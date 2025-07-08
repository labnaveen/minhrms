"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveBalanceController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const models_1 = require("../../models");
const response_1 = require("../../services/response/response");
const InternalServerError_1 = require("../../services/mobileErrorHandling/InternalServerError");
const NotFound_1 = require("../../services/error/NotFound");
const LeaveBalanceController = (model) => {
    const { getAll, create, destroy, update, getAllDropdown, getById } = (0, masterController_1.MasterController)(model);
    const leaveBalance = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const leaveBalanceDetails = await models_1.LeaveBalance.findAll({
                attributes: ['leave_balance'],
                include: [
                    {
                        model: models_1.LeaveType,
                        attributes: ['id', 'leave_type_name'],
                        required: false
                    }
                ],
                raw: true,
                where: { user_id: id, is_deleted: 0 }
            });
            const usedLeaveDetails = await models_1.LeaveRecord.findAll({
                attributes: [
                    [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.literal(`
                        CASE
                            WHEN day_type_id = 1 THEN 0.5
                            ELSE DATEDIFF(end_date, start_date) + 1
                        END    
                    `)), 'usedLeave'],
                    'leave_type_id',
                    [sequelize_1.Sequelize.col('leave_type.leave_type_name'), 'leave_type_name'],
                ],
                include: [
                    {
                        model: models_1.LeaveType,
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
                else {
                    return {
                        ...item1,
                        usedLeave: 0
                    };
                }
            });
            const response = (0, response_1.generateResponse)(200, true, "Leave balance fetched Succesfully", mergedData);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)(false, "Something Went Wrong!"));
        }
    };
    const employeeLeaveBalance = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            if (user) {
                const leaveBalances = await models_1.LeaveBalance.findAll({
                    where: {
                        user_id: id
                    },
                    include: [
                        {
                            model: models_1.LeaveType,
                            attributes: ['id', 'leave_type_name']
                        }
                    ],
                    paranoid: true
                });
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", leaveBalances);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)('Cannot find employee with that id!'));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)(false, "Something went wrong!"));
        }
    };
    const getEmployeeLeaveBalance = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await models_1.User.findByPk(id);
            if (user) {
                const leaveBalance = await models_1.LeaveBalance.findAll({
                    where: {
                        user_id: id
                    },
                    include: [
                        {
                            model: models_1.LeaveType,
                            attributes: ['id', 'leave_type_name']
                        }
                    ],
                    paranoid: true
                });
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", leaveBalance);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find employee with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)(false, "Something went wrong!"));
        }
    };
    return { getAll, create, destroy, update, getAllDropdown, getById, leaveBalance, employeeLeaveBalance, getEmployeeLeaveBalance };
};
exports.LeaveBalanceController = LeaveBalanceController;
