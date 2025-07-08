import { io } from "../../server"

type Data = {
    user_id: number
    id: number,
    title: string,
    type: string,
    description: string,
}

export async function sendNotification(employeeId: string | number | any, data: Data){
    io.to(employeeId).emit('notification', data) 
}