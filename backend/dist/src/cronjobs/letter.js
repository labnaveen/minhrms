"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.letterUpload = void 0;
const moment_1 = __importDefault(require("moment"));
const letter_1 = __importDefault(require("../models/letter"));
const notification_1 = __importDefault(require("../models/notification"));
const sendNotification_1 = require("../services/notification/sendNotification");
const notificationService_1 = require("../services/pushNotification/notificationService");
const letterUpload = async () => {
    const currentDate = (0, moment_1.default)().format('YYYY-MM-DD');
    const letters = await letter_1.default.findAll({
        where: {
            date: currentDate
        }
    });
    if (letters.length > 0) {
        for (const letter of letters) {
            const notificationData = {
                user_id: letter.user_id,
                title: 'Letter',
                type: 'letter_upload',
                description: `A letter for you has been uploaded!`,
            };
            let data = {
                user_id: letter.user_id,
                type: 'letter_upload',
                message: `A letter for you has been uploaded.`,
                path: 'letter_upload',
                reference_id: letter.id
            };
            await (0, notificationService_1.sendPushNotification)(data);
            const notification = await notification_1.default.create(notificationData);
            await (0, sendNotification_1.sendNotification)(letter.user_id, notification);
        }
    }
};
exports.letterUpload = letterUpload;
