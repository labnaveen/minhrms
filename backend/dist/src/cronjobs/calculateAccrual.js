"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accrualLeaves = void 0;
//@ts-nocheck
const moment_1 = __importDefault(require("moment"));
const models_1 = require("../models");
const getMasterPolicy_1 = require("../services/masterPolicy/getMasterPolicy");
const baseLeaveConfiguration_1 = __importDefault(require("../models/baseLeaveConfiguration"));
const leaveTypePolicy_1 = __importDefault(require("../models/leaveTypePolicy"));
const leaveAccrual_1 = require("../utilities/leaveAccrual");
const rounding_1 = __importDefault(require("../models/dropdown/type/rounding"));
const leaveAllocation_1 = __importDefault(require("../models/leaveAllocation"));
const accrualLeaves = async () => {
    const users = await models_1.User.findAll({
        where: {
            status: true
        }
    });
    // const currentMonth = moment().month() + 1
    const testingMinute = (0, moment_1.default)().minutes();
    const lastDigit = testingMinute / 5;
    let currentMonth;
    if (testingMinute == 0) {
        currentMonth = 12;
    }
    else {
        currentMonth = testingMinute / 5;
    }
    const quaterMonth = 3;
    const halfYearly = 6;
    const hasCompletedFirstCycle = (joinDate, currentMonth, accrualMonths) => {
        const year = (0, moment_1.default)(joinDate).get('year');
        const currentYear = (0, moment_1.default)().get('year');
        if (year === currentYear) {
            return true;
        }
        else {
            return false;
        }
    };
    await Promise.all(users.map(async (user) => {
        const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(user.id);
        const leaveTypePolicies = masterPolicy?.LeaveTypePolicies;
        const dateOfJoining = user.date_of_joining;
        const baseleaveConfiguration = await baseLeaveConfiguration_1.default.findByPk(masterPolicy?.base_leave_configuration_id);
        for (const policy of leaveTypePolicies) {
            const leaveTypePolicy = await leaveTypePolicy_1.default.findByPk(policy.id);
            const leaveType = await models_1.LeaveType.findByPk(policy.leave_type.id);
            const leaveBalance = await models_1.LeaveBalance.findOne({
                where: {
                    leave_type_id: leaveType?.id,
                    user_id: user?.id
                }
            });
            let carryForwardLeave;
            if (leaveBalance) {
                if (currentMonth === 1) {
                    if (leaveType?.carry_forward_yearly) {
                        const roundingFactor = parseFloat(leaveType?.carry_forward_rounding_factor);
                        const roundingType = await rounding_1.default.findByPk(leaveType?.carry_forward_rounding);
                        if (roundingType?.id == 1) {
                            carryForwardLeave = Math.round((parseFloat(leaveBalance?.leave_balance) / roundingFactor)) * roundingFactor;
                        }
                        if (roundingType?.id == 2) {
                            carryForwardLeave = Math.ceil((parseFloat(leaveBalance?.leave_balance) / roundingFactor)) * roundingFactor;
                        }
                        if (roundingType?.id == 3) {
                            carryForwardLeave = Math.floor((parseFloat(leaveBalance?.leave_balance) / roundingFactor)) * roundingFactor;
                        }
                        await leaveBalance.update({
                            leave_balance: carryForwardLeave
                        });
                    }
                    else {
                        await leaveBalance?.update({
                            leave_balance: 0
                        });
                    }
                }
            }
            const existRecord = await models_1.LeaveBalance.findOne({
                where: {
                    leave_type_id: leaveTypePolicy?.leave_type_id,
                    user_id: user.id
                }
            });
            if (leaveTypePolicy?.annual_breakup) {
                const leaveTypePolicyAllocation = await leaveAllocation_1.default.findAll({
                    where: {
                        leave_type_policy_id: leaveTypePolicy?.id
                    }
                });
                for (const policy of leaveTypePolicyAllocation) {
                    console.log("MONTHHH", currentMonth, policy?.month_number);
                    if (currentMonth == policy?.month_number) {
                        await leaveBalance?.update({
                            leave_balance: leaveBalance?.leave_balance + policy.allocated_leaves
                        });
                    }
                }
            }
            if (!leaveTypePolicy?.annual_breakup) {
                if (leaveTypePolicy?.accrual_frequency === 1) { //Accrual Monthly
                    console.log(">>>>>>>>>>>>>", hasCompletedFirstCycle(user?.date_of_joining, 2, [3, 2]));
                    const accrual = (0, leaveAccrual_1.calculateMonthlyAccrual)(leaveTypePolicy?.annual_eligibility);
                    if (existRecord) {
                        console.log("RECORD EXISTS!");
                        await existRecord.update({
                            leave_balance: existRecord?.leave_balance + accrual,
                            total_leaves: leaveTypePolicy?.annual_eligibility
                        });
                    }
                    else {
                        console.log("RECORD DOESN'T EXIST!");
                        await models_1.LeaveBalance.create({
                            user_id: user.id,
                            leave_type_id: leaveTypePolicy.leave_type_id,
                            leave_balance: accrual,
                            total_leaves: leaveTypePolicy.annual_eligibility
                        });
                    }
                }
                if (leaveTypePolicy?.accrual_frequency === 2) { //Accrual Quaterly
                    const accrual = (0, leaveAccrual_1.calculateQuaterlyAccrual)(leaveTypePolicy?.annual_eligibility);
                    if (leaveTypePolicy?.accrual_type === 1) { //Beginning of Cycle
                        if (currentMonth === 1 || currentMonth === 4 || currentMonth === 7 || currentMonth === 10) {
                            if (existRecord) {
                                await existRecord.update({
                                    leave_balance: existRecord?.leave_balance + accrual,
                                    total_leaves: leaveTypePolicy?.annual_eligibility
                                });
                            }
                            else {
                                await models_1.LeaveBalance.create({
                                    user_id: user.id,
                                    leave_type_id: leaveTypePolicy?.leave_type_id,
                                    leave_balance: accrual,
                                    total_leaves: leaveTypePolicy?.annual_eligibility
                                });
                            }
                        }
                    }
                    else if (leaveTypePolicy?.accrual_type === 2) { //End of Cycle
                        const _joiningYear = hasCompletedFirstCycle(user?.date_of_joining, currentMonth, [4, 7, 10, 1]);
                        const monthsArray = [1, 4, 7, 10];
                        const monthJoined = (0, moment_1.default)(user?.date_of_joining).get('months') + 1;
                        const onComingMonths = monthsArray.filter(item => item > monthJoined);
                        const joiningDate = (0, moment_1.default)(user?.date_of_joining).get('dates');
                        if (_joiningYear && (onComingMonths[0] === currentMonth)) {
                            let accrualLeaves;
                            if (joiningDate > 15) {
                                const leavesPerMonth = leaveTypePolicy?.annual_eligibility;
                                accrualLeaves = (currentMonth - (monthJoined + 1)) * leavesPerMonth;
                                if (existRecord) {
                                    await existRecord.update({
                                        leave_balance: existRecord?.leave_balance + accrualLeaves,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    });
                                }
                                else {
                                    await models_1.LeaveBalance.create({
                                        user_id: user?.id,
                                        leave_type_id: leaveTypePolicy?.leave_type_id,
                                        leave_balance: accrualLeaves,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    });
                                }
                            }
                            else {
                                const leavesPerMonth = leaveTypePolicy?.annual_eligibility / 12;
                                accrualLeaves = (currentMonth - monthJoined) * leavesPerMonth;
                                if (existRecord) {
                                    await existRecord.update({
                                        leave_balance: existRecord?.leave_balance + accrualLeaves,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    });
                                }
                            }
                        }
                        else {
                            if (currentMonth === 4 || currentMonth === 7 || currentMonth === 10 || currentMonth === 1) {
                                if (existRecord) {
                                    await existRecord.update({
                                        leave_balance: existRecord?.leave_balance + accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    });
                                }
                                else {
                                    await models_1.LeaveBalance.create({
                                        user_id: user.id,
                                        leave_type_id: leaveTypePolicy?.leave_type_id,
                                        leave_balance: accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    });
                                }
                            }
                        }
                    }
                }
                if (leaveTypePolicy?.accrual_frequency === 3) { //Accrual Half-Yearly
                    const accrual = (0, leaveAccrual_1.calculateHalfYearlyAccrual)(leaveTypePolicy?.annual_eligibility);
                    if (leaveTypePolicy?.accrual_type === 1) { //Beginning of Cycle
                        if (currentMonth === 1 || currentMonth === 7) {
                            if (existRecord) {
                                await existRecord.update({
                                    leave_balance: existRecord?.leave_balance + accrual,
                                    total_leaves: leaveTypePolicy?.annual_eligibility
                                });
                            }
                            else {
                                await models_1.LeaveBalance.create({
                                    user_id: user.id,
                                    leave_type_id: leaveTypePolicy?.leave_type_id,
                                    leave_balance: accrual,
                                    total_leaves: leaveTypePolicy?.annual_eligibility
                                });
                            }
                        }
                    }
                    else if (leaveTypePolicy?.accrual_type === 2) { //End of Cycle
                        const _joiningYear = hasCompletedFirstCycle(user?.date_of_joining, currentMonth, [1, 7]);
                        const monthsArray = [1, 7];
                        const monthJoined = (0, moment_1.default)(user?.date_of_joining).get('months') + 1;
                        const onComingMonths = monthsArray.filter(item => item > monthJoined);
                        const joiningDate = (0, moment_1.default)(user?.date_of_joining).get('dates');
                        if (_joiningYear && onComingMonths[0] === currentMonth) {
                            let accrualLeave;
                            if (joiningDate > 15) {
                                const leavesPerMonth = leaveTypePolicy?.annual_eligibility / 12;
                                accrualLeave = (currentMonth - (monthJoined + 1)) * leavesPerMonth;
                                if (existRecord) {
                                    await existRecord.update({
                                        leave_balance: existRecord?.leave_balance + accrualLeave,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    });
                                }
                                else {
                                    await models_1.LeaveBalance.create({
                                        user_id: user?.id,
                                        leave_type_id: leaveTypePolicy?.leave_type_id,
                                        leave_balance: accrualLeave,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    });
                                }
                            }
                            else {
                                const leavesPerMonth = leaveTypePolicy?.annual_eligibility / 12;
                                accrualLeave = (currentMonth - monthJoined) * leavesPerMonth;
                                if (existRecord) {
                                    await existRecord.update({
                                        leave_balance: existRecord?.leave_balance + accrualLeave,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    });
                                }
                            }
                        }
                        else {
                            if (currentMonth === 7 || currentMonth === 1) {
                                if (existRecord) {
                                    await existRecord.update({
                                        leave_balance: existRecord?.leave_balance + accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    });
                                }
                                else {
                                    await models_1.LeaveBalance.create({
                                        user_id: user.id,
                                        leave_type_id: leaveTypePolicy?.leave_type_id,
                                        leave_balance: accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    });
                                }
                            }
                        }
                    }
                }
                if (leaveTypePolicy?.accrual_frequency === 4) { // Accrual Yearly
                    const accrual = leaveTypePolicy?.annual_eligibility;
                    if (leaveTypePolicy?.accrual_type === 1) { //Beginning of Cycle
                        if (currentMonth === 1) {
                            if (existRecord) {
                                await existRecord.update({
                                    leave_balance: existRecord?.leave_balance + accrual,
                                    total_leaves: leaveTypePolicy?.annual_eligibility
                                });
                            }
                            else {
                                await models_1.LeaveBalance.create({
                                    user_id: user.id,
                                    leave_type_id: leaveTypePolicy?.leave_type_id,
                                    leave_balance: accrual,
                                    total_leaves: leaveTypePolicy?.annual_eligibility
                                });
                            }
                        }
                    }
                    else if (leaveTypePolicy?.accrual_type === 2) { //End of Cycle
                        if (currentMonth === 1) {
                            if (existRecord) {
                                console.log("ISME GAYA", accrual);
                                await existRecord.update({
                                    leave_balance: existRecord?.leave_balance + accrual,
                                    total_leaves: leaveTypePolicy?.annual_eligibility
                                });
                            }
                            else {
                                console.log("CREATE HUA");
                                await models_1.LeaveBalance.create({
                                    user_id: user.id,
                                    leave_type_id: leaveTypePolicy?.leave_type_id,
                                    leave_balance: accrual,
                                    total_leaves: leaveTypePolicy?.annual_eligibility
                                });
                            }
                        }
                    }
                }
            }
        }
    }));
};
exports.accrualLeaves = accrualLeaves;
