"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementNotification = void 0;
const models_1 = require("../models");
const moment_1 = __importDefault(require("moment"));
const divisionUnits_1 = __importDefault(require("../models/divisionUnits"));
const announcements_1 = __importDefault(require("../models/announcements"));
const sequelize_1 = require("sequelize");
const notification_1 = __importDefault(require("../models/notification"));
const sendNotification_1 = require("../services/notification/sendNotification");
const AnnouncementNotification = async () => {
    try {
        const activeUsers = await models_1.User.findAll({
            where: {
                status: true
            },
            attributes: ['id', 'employee_generated_id'],
            raw: true
        });
        for (const user of activeUsers) {
            const employee = await models_1.User.findByPk(user?.id, {
                include: [
                    {
                        model: divisionUnits_1.default,
                    }
                ]
            });
            const divisionUnit = employee?.division_units?.map((unit) => unit.id);
            const _announcement = await announcements_1.default.findAll({
                attributes: ['id'],
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            group_specific: false,
                        },
                        {
                            group_specific: true,
                            '$division_units.id$': {
                                [sequelize_1.Op.in]: divisionUnit
                            }
                        },
                    ]
                },
                include: [
                    {
                        model: divisionUnits_1.default,
                        through: { attributes: [] },
                        as: 'division_units',
                        attributes: ['id'],
                        where: {
                            id: {
                                [sequelize_1.Op.in]: divisionUnit
                            }
                        }
                    }
                ]
            });
            //@ts-ignore
            const announcementIdsArray = _announcement.map(item => item.id);
            const announcements = await announcements_1.default.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            [sequelize_1.Op.and]: [
                                {
                                    id: {
                                        [sequelize_1.Op.in]: announcementIdsArray
                                    },
                                    suspendable: true,
                                    start_date: { [sequelize_1.Op.lte]: (0, moment_1.default)().format("YYYY-MM-DD") },
                                    end_date: { [sequelize_1.Op.gte]: (0, moment_1.default)().format('YYYY-MM-DD') },
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
                            [sequelize_1.Op.and]: [
                                { suspendable: true },
                                { start_date: { [sequelize_1.Op.lte]: (0, moment_1.default)().format("YYYY-MM-DD") } },
                                { end_date: { [sequelize_1.Op.gte]: (0, moment_1.default)().format('YYYY-MM-DD') } }
                            ]
                        }
                    ]
                },
                include: [
                    {
                        model: divisionUnits_1.default,
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
            });
            if (announcements.length > 0) {
                for (let announcement of announcements) {
                    const notificationData = {
                        user_id: user?.id,
                        title: 'Announcement',
                        type: 'announcement',
                        description: 'An announcement has been created!'
                    };
                    const notification = await notification_1.default.create(notificationData);
                    console.log("Announcement>>>>>>>>>>>>", announcement);
                    await (0, sendNotification_1.sendNotification)(user?.id, notificationData);
                }
            }
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.AnnouncementNotification = AnnouncementNotification;
