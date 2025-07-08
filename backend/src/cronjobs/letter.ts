import moment from "moment";
import { User } from "../models";
import Letter from "../models/letter";
import Notification from "../models/notification";
import { sendNotification } from "../services/notification/sendNotification";
import { sendPushNotification } from "../services/pushNotification/notificationService";



export const letterUpload = async() => {
    const currentDate = moment().format('YYYY-MM-DD')

    const letters = await Letter.findAll({
        where: {
            date: currentDate
        }
    }) as any;

    if(letters.length > 0){
        for (const letter of letters){
            const notificationData = {
                user_id: letter.user_id,
                title: 'Letter',
                type: 'letter_upload',
                description: `A letter for you has been uploaded!`,
            }

            let data = {
                user_id: letter.user_id,
                type: 'letter_upload',
                message:`A letter for you has been uploaded.`,
                path: 'letter_upload',
                reference_id: letter.id
            }

            await sendPushNotification(data)

            const notification = await Notification.create(notificationData) as any;
            await sendNotification(letter.user_id, notification)
        }
    }
}