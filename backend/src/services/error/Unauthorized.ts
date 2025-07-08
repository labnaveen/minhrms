import { ApiError } from "../../utilities/type";
import { apiError } from "./ApiError.";




export const unauthorized = (message: string): ApiError => {
    return apiError(401, message)
}