import firebaseConfig from "../../keys/firebaseConfig"
import admin from "firebase-admin"
import { Refresh, User } from "../../models"
import { Op } from "sequelize"


//@ts-ignore
const certPath = admin.credential.cert(firebaseConfig)


if(admin.app.length){
    admin.initializeApp({
        credential: certPath
    })
}


export const sendPushNotification = async (data: any) => {
    const vapidKeys = {
        publicKey: process.env.PUBLIC_VAPID_KEY,
        privateKey: process.env.PRIVATE_VAPID_KEY,
    }
    try{
        const user = await Refresh.findOne({
            where : {
                user_id: data.user_id,
                fcm_token: {
                    [Op.not]: null
                }
            }
        }) as any;

        if(user){
            const fcmToken = user.fcm_token
            const mobilePushMessage = {
                "token": `${fcmToken}`,
                "notification":{
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
            }
            console.log(">>>>>>>>", mobilePushMessage)
            const messaging = admin.messaging()
            const responseMobile = await messaging.send(mobilePushMessage)
            console.log("RESPONSE MOBILE>>>>>>>", responseMobile)
        }
    }catch(err){
        console.log(err)
    }
}