import { NextFunction, Request, Response } from "express"
import jwt, { TokenExpiredError } from "jsonwebtoken"
import { JWT_SECRET } from "../utilities/config"
import { AuthUserJWT } from "../services/auth/IFace"
import { User } from "../models"
import { getUserRoles } from "../services/auth/PermissionService"
import { unauthorized } from "../services/error/Unauthorized"
import { forbiddenError } from "../services/error/Forbidden"
import { internalServerError } from "../services/error/InternalServerError"

export const Authorize = (permission: string) => async (
    req: Request, res: Response, next: NextFunction,
) => {
    try {

        // console.log(permission)

        const token = req.headers.authorization?.split(' ')[1]
        // const token = req.headers.authorization

        if (!token) {
            // return res.status(401).json("The token is missing!")
            return next(unauthorized("The token is missing!"))
        }

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET) as AuthUserJWT as any;

            const userId = decoded.employee_id
            const sessionId = decoded.session_id

            const employee = await User.findOne({
                where: { id: userId }
            }) as any;

            const scope = await getUserRoles(employee?.role_id) as any;

            const obj = scope.permissions.find((item: any )=> item.name === permission)

            if (decoded) {
                if (obj !== undefined) {
                    //@ts-ignore
                    req.credentials = { id: userId }
                    //@ts-ignore
                    req.session = { session_id: sessionId}
                    return next()
                } else {
                    // return res.status(403).json("You don't have permission to access this resource.")
                    next(forbiddenError("You don't have permission to access this resource."))
                }
            }
            else {
                // return res.status(401).json('Invalid or expired token! Please login again.')
                next(unauthorized("Invalid or expired token! Please login again."))
            }
        }
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            next(unauthorized(err.message))
        } else {
            next(internalServerError("Something Went Wrong!"))
            // res.status(500).json(err)
        }
    }
}