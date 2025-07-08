import { ApiError } from "../../utilities/type";


export const apiError = (code: number, message: string): ApiError => ({
    code,
    message,
    name: 'ApiError'
})