import { Request, Response } from "express"
import { apiError } from "./ApiError.";
import { MobileApiError } from "../../utilities/type";

export const conflict = (succuss:boolean, message: string ):MobileApiError => {
    return apiError(409,succuss, message);
}