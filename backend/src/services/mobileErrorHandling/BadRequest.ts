import { Request, Response } from "express"
import { apiError } from "./ApiError.";
import { MobileApiError } from "../../utilities/type";

export const badRequest = (success: boolean, message: string ):MobileApiError => {
    return apiError(200, success, message);
}