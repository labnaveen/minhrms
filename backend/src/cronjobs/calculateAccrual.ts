//@ts-nocheck
import moment from "moment"
import { LeaveBalance, LeaveType, User } from "../models"
import { getMasterPolicy } from "../services/masterPolicy/getMasterPolicy"
import BaseLeaveConfiguration from "../models/baseLeaveConfiguration"
import LeaveTypePolicy from "../models/leaveTypePolicy"
import { calculateHalfYearlyAccrual, calculateMonthlyAccrual, calculateQuaterlyAccrual } from "../utilities/leaveAccrual"
import Rounding from "../models/dropdown/type/rounding"
import LeaveAllocation from "../models/leaveAllocation"





export const accrualLeaves = async() => {

    const users = await User.findAll({
        where: {
            status: true
        }
    })

    // const currentMonth = moment().month() + 1
    const testingMinute = moment().minutes()
    const lastDigit = testingMinute/5;
    let currentMonth: number;


    if(testingMinute == 0){
        currentMonth = 12
    }else{
        currentMonth = testingMinute / 5
    }

    const quaterMonth = 3
    const halfYearly = 6

    const hasCompletedFirstCycle = (joinDate: Date, currentMonth: number, accrualMonths: number[]): boolean | string | number => {
        const year = moment(joinDate).get('year');
        const currentYear = moment().get('year')
        if(year === currentYear){
            return true
        }else{
            return false
        }
    };

    await Promise.all(
        users.map(async(user) => {

            const masterPolicy = await getMasterPolicy(user.id)
            
            const leaveTypePolicies = masterPolicy?.LeaveTypePolicies

            const dateOfJoining = user.date_of_joining

            const baseleaveConfiguration = await BaseLeaveConfiguration.findByPk(masterPolicy?.base_leave_configuration_id)

            for (const policy of leaveTypePolicies){
                const leaveTypePolicy = await LeaveTypePolicy.findByPk(policy.id)
                const leaveType = await LeaveType.findByPk(policy.leave_type.id)
                const leaveBalance = await LeaveBalance.findOne({
                    where: {
                        leave_type_id: leaveType?.id,
                        user_id: user?.id
                    }
                })

                let carryForwardLeave;

                if(leaveBalance){
                    if(currentMonth === 1){
                        if(leaveType?.carry_forward_yearly){
                            const roundingFactor = parseFloat(leaveType?.carry_forward_rounding_factor)
                            const roundingType = await Rounding.findByPk(leaveType?.carry_forward_rounding) as number | unknown
                            if(roundingType?.id == 1){
                                carryForwardLeave = Math.round((parseFloat(leaveBalance?.leave_balance) / roundingFactor)) * roundingFactor
                            }
                            if(roundingType?.id == 2){
                                carryForwardLeave = Math.ceil((parseFloat(leaveBalance?.leave_balance) / roundingFactor)) * roundingFactor
                            }
                            if(roundingType?.id == 3){
                                carryForwardLeave = Math.floor((parseFloat(leaveBalance?.leave_balance) / roundingFactor)) * roundingFactor
                            }

                            await leaveBalance.update({
                                leave_balance: carryForwardLeave
                            })
                        }else{
                            await leaveBalance?.update({
                                leave_balance: 0
                            })
                        }
                    }
                }

                const existRecord = await LeaveBalance.findOne({
                    where: {
                        leave_type_id: leaveTypePolicy?.leave_type_id,
                        user_id: user.id 
                    }
                })


                if(leaveTypePolicy?.annual_breakup){
                    const leaveTypePolicyAllocation = await LeaveAllocation.findAll({
                        where: {
                            leave_type_policy_id: leaveTypePolicy?.id
                        }
                    })

                    for(const policy of leaveTypePolicyAllocation){
                        console.log("MONTHHH", currentMonth, policy?.month_number)
                        if(currentMonth == policy?.month_number){
                            await leaveBalance?.update({
                                leave_balance: leaveBalance?.leave_balance + policy.allocated_leaves
                            })
                        }
                    }
                }

                if(!leaveTypePolicy?.annual_breakup){
                    if(leaveTypePolicy?.accrual_frequency === 1){ //Accrual Monthly

                        

                        console.log(">>>>>>>>>>>>>", hasCompletedFirstCycle(user?.date_of_joining, 2, [3, 2]))


                        const accrual = calculateMonthlyAccrual(leaveTypePolicy?.annual_eligibility)
                        if(existRecord){
                            console.log("RECORD EXISTS!")
                            await existRecord.update({
                                leave_balance: existRecord?.leave_balance + accrual,
                                total_leaves: leaveTypePolicy?.annual_eligibility
                            })
                        }else{
                            console.log("RECORD DOESN'T EXIST!")
                            await LeaveBalance.create({
                                user_id: user.id,
                                leave_type_id: leaveTypePolicy.leave_type_id,
                                leave_balance: accrual,
                                total_leaves: leaveTypePolicy.annual_eligibility
                            })
                        }
                    }

                    if(leaveTypePolicy?.accrual_frequency === 2){//Accrual Quaterly
                        const accrual = calculateQuaterlyAccrual(leaveTypePolicy?.annual_eligibility)

                        if(leaveTypePolicy?.accrual_type === 1){//Beginning of Cycle
                            if(currentMonth === 1 || currentMonth === 4 || currentMonth === 7 || currentMonth === 10){
                                if(existRecord){
                                    await existRecord.update({
                                        leave_balance: existRecord?.leave_balance + accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    })
                                }else{
                                    await LeaveBalance.create({
                                        user_id: user.id,
                                        leave_type_id: leaveTypePolicy?.leave_type_id,
                                        leave_balance: accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    })
                                }
                            }
                        }else if(leaveTypePolicy?.accrual_type === 2){//End of Cycle
                            
                            const _joiningYear = hasCompletedFirstCycle(user?.date_of_joining, currentMonth, [4, 7, 10, 1])
                            const monthsArray = [1, 4, 7, 10]
                            const monthJoined = moment(user?.date_of_joining).get('months') + 1;
                            const onComingMonths = monthsArray.filter(item => item > monthJoined)
                            const joiningDate = moment(user?.date_of_joining).get('dates');
                            if(_joiningYear && (onComingMonths[0] === currentMonth)){
                                let accrualLeaves;
                                if(joiningDate > 15){
                                    const leavesPerMonth = leaveTypePolicy?.annual_eligibility
                                    accrualLeaves = (currentMonth - (monthJoined + 1)) * leavesPerMonth
                                    if(existRecord){
                                        await existRecord.update({
                                            leave_balance: existRecord?.leave_balance + accrualLeaves,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        })
                                    }else{
                                        await LeaveBalance.create({
                                            user_id: user?.id,
                                            leave_type_id: leaveTypePolicy?.leave_type_id,
                                            leave_balance: accrualLeaves,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        })
                                    }
                                }else{
                                    const leavesPerMonth = leaveTypePolicy?.annual_eligibility / 12
                                    accrualLeaves = (currentMonth - monthJoined) * leavesPerMonth
                                    if(existRecord){
                                        await existRecord.update({
                                            leave_balance: existRecord?.leave_balance + accrualLeaves,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        })
                                    }
                                }
                            }else{
                                if(currentMonth === 4 || currentMonth === 7 || currentMonth === 10 || currentMonth === 1){
                                    if(existRecord){
                                        await existRecord.update({
                                            leave_balance: existRecord?.leave_balance + accrual,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        })
                                    }else{
                                        await LeaveBalance.create({
                                            user_id: user.id,
                                            leave_type_id: leaveTypePolicy?.leave_type_id,
                                            leave_balance: accrual,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        })
                                    }
                                }
                            }
                        }
                    }

                    if(leaveTypePolicy?.accrual_frequency === 3){   //Accrual Half-Yearly

                        const accrual = calculateHalfYearlyAccrual(leaveTypePolicy?.annual_eligibility)

                        if(leaveTypePolicy?.accrual_type === 1){//Beginning of Cycle
                            if(currentMonth === 1 || currentMonth === 7){
                                if(existRecord){
                                    await existRecord.update({
                                        leave_balance: existRecord?.leave_balance + accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    })
                                }else{
                                    await LeaveBalance.create({
                                        user_id: user.id,
                                        leave_type_id: leaveTypePolicy?.leave_type_id,
                                        leave_balance: accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    })
                                }                                      
                            }
                        }else if(leaveTypePolicy?.accrual_type === 2){//End of Cycle
                            const _joiningYear = hasCompletedFirstCycle(user?.date_of_joining, currentMonth, [1, 7])
                            const monthsArray = [1, 7]
                            const monthJoined = moment(user?.date_of_joining).get('months') + 1;
                            const onComingMonths = monthsArray.filter(item => item > monthJoined)
                            const joiningDate = moment(user?.date_of_joining).get('dates');
                            if(_joiningYear && onComingMonths[0] === currentMonth){
                                let accrualLeave;
                                if(joiningDate > 15){
                                    const leavesPerMonth = leaveTypePolicy?.annual_eligibility / 12;
                                    accrualLeave = (currentMonth - (monthJoined + 1)) * leavesPerMonth
                                    if(existRecord){
                                        await existRecord.update({
                                            leave_balance: existRecord?.leave_balance + accrualLeave,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        })
                                    }else{
                                        await LeaveBalance.create({
                                            user_id: user?.id,
                                            leave_type_id: leaveTypePolicy?.leave_type_id,
                                            leave_balance: accrualLeave,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        })
                                    }
                                }else{
                                    const leavesPerMonth = leaveTypePolicy?.annual_eligibility / 12;
                                    accrualLeave = (currentMonth - monthJoined) * leavesPerMonth
                                    if(existRecord){
                                        await existRecord.update({
                                            leave_balance: existRecord?.leave_balance + accrualLeave,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        })
                                    }
                                }
                            }else{
                                if(currentMonth === 7 || currentMonth === 1){
                                    if(existRecord){
                                        await existRecord.update({
                                            leave_balance: existRecord?.leave_balance + accrual,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        })
                                    }else{
                                        await LeaveBalance.create({
                                            user_id: user.id,
                                            leave_type_id: leaveTypePolicy?.leave_type_id,
                                            leave_balance: accrual,
                                            total_leaves: leaveTypePolicy?.annual_eligibility
                                        })
                                    }
                                }
                            }
                        }
                    }

                    if(leaveTypePolicy?.accrual_frequency === 4){ // Accrual Yearly
                        const accrual = leaveTypePolicy?.annual_eligibility

                        if(leaveTypePolicy?.accrual_type === 1){//Beginning of Cycle
                            if(currentMonth === 1){
                                if(existRecord){
                                    await existRecord.update({
                                        leave_balance: existRecord?.leave_balance + accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    })
                                }else{
                                    await LeaveBalance.create({
                                        user_id: user.id,
                                        leave_type_id: leaveTypePolicy?.leave_type_id,
                                        leave_balance: accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    })
                                }                                      
                            }
                        }else if(leaveTypePolicy?.accrual_type === 2){//End of Cycle
                            if(currentMonth === 1){
                                if(existRecord){
                                    console.log("ISME GAYA", accrual)
                                    await existRecord.update({
                                        leave_balance: existRecord?.leave_balance + accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    })
                                }else{
                                    console.log("CREATE HUA")
                                    await LeaveBalance.create({
                                        user_id: user.id,
                                        leave_type_id: leaveTypePolicy?.leave_type_id,
                                        leave_balance: accrual,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    })
                                }
                            }
                        }
                    }       
                }
            }
        })
    )
}