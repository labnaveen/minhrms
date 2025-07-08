import { MobileApiError } from "../../utilities/type";


export const apiError = (status: number, success: boolean, message: string): MobileApiError => ({
    status,
    success,
    message,
    name: 'MobileApiError'
})