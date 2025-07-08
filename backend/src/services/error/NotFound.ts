import { apiError } from "./ApiError."
import { ApiError } from "../../utilities/type"



export const notFound = (message: string):ApiError => {
    return apiError(404, message)
}