import { apiError } from "./ApiError."
import { ApiError } from "../../utilities/type"


export const internalServerError = (message: string): ApiError => {
    return apiError(500, message)
}