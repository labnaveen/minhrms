import { MobileApiError } from "../../utilities/type";
import { apiError } from "./ApiError.";




export const unauthorized = (success: boolean, message: string): MobileApiError => {
    return apiError(401, success, message)
}