import { ApiError } from "../../utilities/type";
import { apiError } from "./ApiError.";


export const forbiddenError = (message: string):ApiError => {
    return apiError(403, message)
}