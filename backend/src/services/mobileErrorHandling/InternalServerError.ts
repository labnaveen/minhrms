import { apiError } from "./ApiError."
import { MobileApiError } from "../../utilities/type"


export const internalServerError = (success: boolean, message: string): MobileApiError => {
    return apiError(500, success, message)
}