import { apiError } from "./ApiError."
import { MobileApiError } from "../../utilities/type"



export const notFound = (success: boolean, message: string):MobileApiError => {
    return apiError(200, success, message)
}