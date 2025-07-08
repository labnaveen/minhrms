import { Request, Response } from "express"
import { apiError } from "./ApiError.";
import { ApiError } from "../../utilities/type";

export const conflict = ( message: string ):ApiError => {
    return apiError(409, message);
}