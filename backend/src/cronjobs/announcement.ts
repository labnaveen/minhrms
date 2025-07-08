import { NextFunction } from "express";
import { EmployeeResponseType } from "../interface/employee";
import { User } from "../models";
import moment from "moment";
import DivisionUnits from "../models/divisionUnits";
import Announcement from "../models/announcements";
import { Op } from "sequelize";
import Notification from "../models/notification";
import { sendNotification } from "../services/notification/sendNotification";




export const AnnouncementNotification = async(): Promise<void> => {
    try{

        const activeUsers = await User.findAll({
            where: {
                status: true
            },
            attributes: ['id', 'employee_generated_id'],
            raw: true
        }) as any

        for (const user of activeUsers){
            
            const employee = await User.findByPk(user?.id, {
                include: [
                    {
                        model: DivisionUnits,
                    }
                ]
            }) as EmployeeResponseType | null
    
            const divisionUnit = employee?.division_units?.map((unit) => unit.id)
    
    
            const _announcement = await Announcement.findAll({
                attributes: ['id'],
                where: {
                    [Op.or]: [
                        {
                            group_specific: false,
                        },
                        {
                            group_specific: true,
                            '$division_units.id$':{
                                [Op.in]: divisionUnit
                            }
                        },
                    ]
                },
                include: [
                    {
                        model: DivisionUnits,
                        through: { attributes: [] },
                        as: 'division_units',
                        attributes: ['id'],
                        where: {
                            id: {
                                [Op.in]: divisionUnit
                            }
                        }
                    }
                ]
            }) as any
    
            //@ts-ignore
            const announcementIdsArray = _announcement.map(item => item.id );
    
            const announcements = await Announcement.findAll({
                where: {
                    [Op.or]: [
                        {
                            [Op.and]: [
                                {
                                    id:{
                                        [Op.in]: announcementIdsArray
                                    },
                                    suspendable: true,
                                    start_date: { [Op.lte]: moment().format("YYYY-MM-DD")},
                                    end_date: { [Op.gte]: moment().format('YYYY-MM-DD')},
                                }
                            ]
    
                        },
                        // {
                        //     group_specific: false,
                        //     suspendable: false
                        // },
                        // {
                        //     [Op.and]: [
                        //         {suspendable: false},
                        //         {start_date: null},
                        //         {end_date: null}
                        //     ]
                        // },
                        {
                            [Op.and]: [
                                { suspendable: true },
                                { start_date: { [Op.lte]: moment().format("YYYY-MM-DD") } },
                                { end_date: { [Op.gte]: moment().format('YYYY-MM-DD')} }
                            ]
                        }
                    ]
                    
                },
                include:[
                    {
                        model: DivisionUnits,
                        as: 'division_units',
                        through: {
                            attributes: [],
                        },
                        // where:{
                        //     id: {
                        //         [Op.in]: divisionUnit
                        //     }
                        // },
                        attributes: []
                    }
                ],
                order: [['id', 'DESC']]
            })

            if(announcements.length > 0){

                for(let announcement of announcements){
                    const notificationData = {
                        user_id: user?.id,
                        title: 'Announcement',
                        type: 'announcement',
                        description: 'An announcement has been created!'
                    } as any
        
                    const notification = await Notification.create(notificationData)
        
                    console.log("Announcement>>>>>>>>>>>>", announcement)
        
                    await sendNotification(user?.id, notificationData)
                }
            }
        }

    }catch(err){
        console.error(err)
    }

}