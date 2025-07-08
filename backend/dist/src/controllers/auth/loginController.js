"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const masterController_1 = require("../masterController");
const SignInService_1 = require("../../services/auth/SignInService");
const models_1 = require("../../models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../utilities/config");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const Unauthorized_1 = require("../../services/error/Unauthorized");
const NotFound_1 = require("../../services/error/NotFound");
const bcrypt_1 = __importDefault(require("bcrypt"));
const BadRequest_1 = require("../../services/error/BadRequest");
const response_1 = require("../../services/response/response");
const LoginController = (model) => {
    const { getAll, getById, update, destroy, create, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const login = async (req, res, next) => {
        const { employee_official_email, password } = req.body;
        try {
            const authUser = await (0, SignInService_1.emailSignInProcess)(employee_official_email, password);
            if (authUser?.code === 401) {
                next((0, Unauthorized_1.unauthorized)(authUser?.message));
            }
            else {
                res.status(200).json(authUser?.response);
            }
        }
        catch (err) {
            res.status(500).json(err);
            console.log(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    };
    const mobileLogin = async (req, res, next) => {
        const { employee_official_email, password, fcm_token, device_id } = req.body;
        try {
            const authUser = await (0, SignInService_1.mobileEmailSignInProcess)(employee_official_email, password, fcm_token, device_id);
            if (authUser.code === 401) {
                next((0, Unauthorized_1.unauthorized)(authUser.message));
            }
            else {
                res.status(200).json(authUser.response);
            }
        }
        catch (err) {
            // res.status(500).json(err)
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something Went Wrong!"));
        }
    };
    const getByName = async (req, res, next) => {
        try {
            const { name } = req.params;
            const options = { where: { name } };
            const data = await model.findOne(options);
            res.status(200).json(data);
        }
        catch (err) {
            // res.status(500).json(err);
            next((0, InternalServerError_1.internalServerError)("Something Went Wrong!"));
        }
    };
    const refreshToken = async (req, res, next) => {
        try {
            const { refresh_token } = req.body;
            if (refresh_token) {
                const decoded = jsonwebtoken_1.default.decode(refresh_token);
                console.log(decoded);
                const existingToken = await models_1.Refresh.findOne({
                    where: {
                        user_id: decoded?.employee_id,
                        refresh_token: refresh_token
                    }
                });
                if (existingToken) {
                    const { exp } = decoded;
                    const currentTime = Date.now() / 1000;
                    if (exp && exp <= currentTime) {
                        await existingToken?.destroy();
                        // return res.status(401).json({message: 'The refresh Token has expired, Please login again.'})
                        next((0, Unauthorized_1.unauthorized)("The refresh Token has expired, Please login again."));
                    }
                    else {
                        const newAccessToken = jsonwebtoken_1.default.sign({
                            company_id: decoded?.company_id,
                            employee_id: decoded?.employee_id,
                            session_id: existingToken.session_id,
                            tokenType: 'access'
                        }, config_1.JWT_SECRET, {
                            algorithm: 'HS256',
                            expiresIn: '15m'
                        });
                        const newRefresh = jsonwebtoken_1.default.sign({
                            company_id: decoded.company_id,
                            employee_id: decoded.employee_id,
                            session_id: existingToken.session_id,
                            tokenType: 'refresh',
                        }, config_1.JWT_SECRET, {
                            algorithm: 'HS256',
                            expiresIn: '15d',
                        });
                        existingToken.update({ refresh_token: newRefresh })
                            .then(() => {
                            res.status(200).json({ token: newAccessToken, refresh: newRefresh });
                        })
                            .catch((error) => {
                            console.log(error);
                            next((0, InternalServerError_1.internalServerError)(error));
                        });
                    }
                }
                else {
                    next((0, NotFound_1.notFound)("No such session in DB"));
                }
            }
            else {
                next((0, BadRequest_1.badRequest)("No refresh token provided."));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something Went Wrong!"));
        }
    };
    const passwordChange = async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (token) {
                const decoded = jsonwebtoken_1.default.decode(token);
                const { employee_id } = decoded;
                const { currentPassword, newPassword } = req.body;
                const user = await models_1.User.findByPk(employee_id);
                if (!user) {
                    next((0, NotFound_1.notFound)("The user does not exist!"));
                }
                //check if the current password is valid
                const isPasswordValid = await bcrypt_1.default.compare(currentPassword, user?.employee_password);
                if (!isPasswordValid) {
                    next((0, BadRequest_1.badRequest)("Invalid Current Password"));
                }
                //update the user password
                user.employee_password = newPassword;
                user.password_changed = true;
                await user?.save();
                const response = (0, response_1.generateResponse)(200, true, "Password changed succesfully!");
                res.status(200).json(response);
            }
            else {
                next((0, Unauthorized_1.unauthorized)("The Token is missing!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something Went Wrong"));
        }
    };
    const mobileLogout = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            //@ts-ignore
            const { session_id } = req.session;
            const refreshTokenDetails = await models_1.Refresh.findOne({
                where: {
                    user_id: id,
                    session_id: session_id
                }
            });
            if (!refreshTokenDetails) {
                res.send((0, NotFound_1.notFound)('Login record not found, Please login again.'));
            }
            const removeRefreshTokenDetails = await models_1.Refresh.destroy({ where: { user_id: id, session_id: session_id } });
            if (removeRefreshTokenDetails == 1) {
                const response = (0, response_1.generateResponse)(200, true, "Logged out Successfully!");
                res.status(200).json(response);
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something Went Wrong!"));
        }
    };
    const logout = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            //@ts-ignore
            const { session_id } = req.session;
            const refreshTokenDetails = await models_1.Refresh.findOne({
                where: {
                    user_id: id,
                    session_id: session_id,
                }
            });
            console.log(">>>>>>", id, session_id);
            if (!refreshTokenDetails) {
                return next((0, BadRequest_1.badRequest)("There is no session with that user id in server!"));
            }
            await refreshTokenDetails.destroy();
            const response = (0, response_1.generateResponse)(200, true, "Session logged out succesfully!");
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
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
    };
};
exports.LoginController = LoginController;
