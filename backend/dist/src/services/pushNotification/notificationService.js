"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = void 0;
const firebaseConfig_1 = __importDefault(require("../../keys/firebaseConfig"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const models_1 = require("../../models");
const sequelize_1 = require("sequelize");
//@ts-ignore
const certPath = firebase_admin_1.default.credential.cert(firebaseConfig_1.default);
if (firebase_admin_1.default.app.length) {
    firebase_admin_1.default.initializeApp({
        credential: certPath
    });
}
const sendPushNotification = async (data) => {
    const vapidKeys = {
        publicKey: process.env.PUBLIC_VAPID_KEY,
        privateKey: process.env.PRIVATE_VAPID_KEY,
    };
    try {
        const user = await models_1.Refresh.findOne({
            where: {
                user_id: data.user_id,
                fcm_token: {
                    [sequelize_1.Op.not]: null
                }
            }
        });
        if (user) {
            const fcmToken = user.fcm_token;
            const mobilePushMessage = {
                "token": `${fcmToken}`,
                "notification": {
                    "title": 'HRMS',
                    "body": `${data.message}`
                    // "badge": `1`,
                    // "status": '',
                    // "sound": 'default',
                    // "type": `${data.path}`,
                    // "referenceId": `${data.reference_id}`
                },
                // "priority": 'high',
                "data": {
                    "click_action": 'FLUTTER_NOTIFICATION_CLICK',
                    "title": 'HRMS',
                    "body": `${data.message}`,
                    "badge": `1`,
                    "status": '',
                    "sound": 'default',
                    "type": `${data.path}`,
                    "referenceId": `${data.reference_id}`
                }
            };
            console.log(">>>>>>>>", mobilePushMessage);
            const messaging = firebase_admin_1.default.messaging();
            const responseMobile = await messaging.send(mobilePushMessage);
            console.log("RESPONSE MOBILE>>>>>>>", responseMobile);
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.sendPushNotification = sendPushNotification;
