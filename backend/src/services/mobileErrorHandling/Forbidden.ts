import { MobileApiError } from "../../utilities/type";
import { apiError } from "./ApiError.";


export const forbiddenError = (succuss:boolean, message: string):MobileApiError => {
    return apiError(403, succuss, message)
}