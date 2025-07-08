import { Request, Response } from "express"
import { apiError } from "./ApiError.";
import { ApiError } from "../../utilities/type";

export const badRequest = ( message: string ):ApiError => {
    return apiError(400, message);
}