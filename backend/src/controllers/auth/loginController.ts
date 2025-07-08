import { NextFunction, Request, Response } from "express";
import { Model, Op } from 'sequelize'
import { MasterController } from "../masterController";
import { emailSignInProcess, mobileEmailSignInProcess } from "../../services/auth/SignInService";
import { Refresh, User } from "../../models";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from "../../utilities/config";
import { internalServerError } from "../../services/error/InternalServerError";
import { unauthorized } from "../../services/error/Unauthorized";
import { notFound } from "../../services/error/NotFound";
import { ApiError } from "../../utilities/type";
import bcrypt from 'bcrypt'
import { badRequest } from "../../services/error/BadRequest";
import { AuthUserJWT } from "../../services/auth/IFace";
import MasterPolicy from "../../models/masterPolicy";
import AttendancePolicy from "../../models/attendancePolicy";
import { classToInvokable } from "sequelize/types/utils";
import { generateResponse } from "../../services/response/response";

type UserAttributes = {
    id: number,
    company_name: string,
    company_email: string,
    company_mobile: string,
    teamsize: number,
    industry: string,
    domain: string,
    pan: string,
    gst: string,
    company_prefix: string
}

type UserLoginAttributes = Omit<UserAttributes, 'id'>;

type UserModel = Model<UserAttributes, UserLoginAttributes>;

type LoginController = MasterController<UserModel> & {
    getByName: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    passwordChange: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mobileLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mobileLogout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const LoginController = (
    model: typeof Model & {
        new(): User;
    }
): LoginController => {

    const { getAll, getById, update, destroy, create, getAllDropdown } = MasterController<User>(model);

    const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { employee_official_email, password } = req.body
        try {
            const authUser = await emailSignInProcess(employee_official_email, password) as any;
            if (authUser?.code === 401) {
                next(unauthorized(authUser?.message))
            } else {
                res.status(200).json(authUser?.response)
            }

        } catch (err) {
            res.status(500).json(err)
            console.log(err)
            // next(internalServerError("Something Went Wrong!"))
        }
    }

    const mobileLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { employee_official_email, password, fcm_token, device_id } = req.body
        try {
            const authUser = await mobileEmailSignInProcess(employee_official_email, password, fcm_token, device_id) as any;
            if (authUser.code === 401) {
                next(unauthorized(authUser.message))
            } else {
                res.status(200).json(authUser.response)
            }

        } catch (err) {
            // res.status(500).json(err)
            console.log(err)
            next(internalServerError("Something Went Wrong!"))
        }
    }

    const getByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name } = req.params;
            const options = { where: { name } };
            const data = await model.findOne(options)
            res.status(200).json(data);
        } catch (err) {
            // res.status(500).json(err);
            next(internalServerError("Something Went Wrong!"))

        }
    }

    const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { refresh_token } = req.body


            if (refresh_token) {

                const decoded = jwt.decode(refresh_token) as any;

                console.log(decoded)

                const existingToken = await Refresh.findOne({
                    where: {
                        user_id: decoded?.employee_id,
                        refresh_token: refresh_token
                    }
                }) as any;

                if (existingToken) {

                    const { exp } = decoded as JwtPayload;
                    const currentTime = Date.now() / 1000;
                    if (exp && exp <= currentTime) {
                        await existingToken?.destroy()
                        // return res.status(401).json({message: 'The refresh Token has expired, Please login again.'})
                        next(unauthorized("The refresh Token has expired, Please login again."))
                    } else {
                        const newAccessToken = jwt.sign(
                            {
                                company_id: decoded?.company_id,
                                employee_id: decoded?.employee_id,
                                session_id: existingToken.session_id,
                                tokenType: 'access'
                            },
                            JWT_SECRET,
                            {
                                algorithm: 'HS256',
                                expiresIn: '15m'
                            }
                        )

                        const newRefresh = jwt.sign(
                            {
                                company_id: decoded.company_id,
                                employee_id: decoded.employee_id,
                                session_id: existingToken.session_id,
                                tokenType: 'refresh',
                            },
                            JWT_SECRET as string,
                            {
                                algorithm: 'HS256',
                                expiresIn: '15d',
                            }
                        )

                        existingToken.update({ refresh_token: newRefresh })
                            .then(() => {
                                res.status(200).json({ token: newAccessToken, refresh: newRefresh })
                            })
                            .catch((error: any) => {
                                console.log(error)
                                next(internalServerError(error as string))
                            })
                    }

                } else {
                    next(notFound("No such session in DB"))
                }
            } else {
                next(badRequest("No refresh token provided."))
            }
        } catch (err) {
            next(internalServerError("Something Went Wrong!"))
        }
    }

    const passwordChange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(" ")[1]
            if (token) {
                const decoded = jwt.decode(token) as AuthUserJWT
                const { employee_id } = decoded

                const { currentPassword, newPassword } = req.body

                const user = await User.findByPk(employee_id) as any;

                if (!user) {
                    next(notFound("The user does not exist!"))
                }


                //check if the current password is valid
                const isPasswordValid = await bcrypt.compare(currentPassword, user?.employee_password)
                if (!isPasswordValid) {
                    next(badRequest("Invalid Current Password"))
                }

                //update the user password
                user.employee_password = newPassword

                user.password_changed = true


                await user?.save()

                const response = generateResponse(200, true, "Password changed succesfully!")

                res.status(200).json(response)


            } else {
                next(unauthorized("The Token is missing!"))
            }

        } catch (err) {
            next(internalServerError("Something Went Wrong"))
        }
    }

    const mobileLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            //@ts-ignore
            const { id } = req.credentials
            //@ts-ignore
            const {session_id} = req.session
            const refreshTokenDetails = await Refresh.findOne(
                { 
                    where: {
                        user_id: id,
                        session_id: session_id 
                    } 
                }
            )
            
            if (!refreshTokenDetails) {
                res.send(notFound('Login record not found, Please login again.'))
            }

            const removeRefreshTokenDetails = await Refresh.destroy({ where: { user_id: id, session_id: session_id } })

            if (removeRefreshTokenDetails == 1) {
                const response = generateResponse(200, true, "Logged out Successfully!")
                res.status(200).json(response)
            }

        } catch (err) {
            console.log(err)
            next(internalServerError("Something Went Wrong!"))
        }
    }

    const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{

            //@ts-ignore
            const {id} = req.credentials
            //@ts-ignore
            const {session_id} = req.session

            const refreshTokenDetails = await Refresh.findOne({
                where: {
                    user_id: id,
                    session_id: session_id,
                }
            })

            console.log(">>>>>>", id, session_id)

            if(!refreshTokenDetails){
                return next(badRequest("There is no session with that user id in server!"))
            }

            await refreshTokenDetails.destroy()
            
            const response = generateResponse(200, true, "Session logged out succesfully!")

            res.status(200).json(response)

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    return { 
        getAll, 
        getById, 
        update, 
        destroy, 
        getByName, 
        login, 
        refreshToken, 
        create, 
        passwordChange, 
        getAllDropdown, 
        mobileLogin, 
        mobileLogout,
        logout 
    }
}