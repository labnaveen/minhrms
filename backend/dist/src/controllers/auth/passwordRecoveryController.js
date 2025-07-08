"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordRecoveryController = void 0;
const masterController_1 = require("../masterController");
const models_1 = require("../../models");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const passwordRecovery_1 = __importDefault(require("../../models/passwordRecovery"));
const BadRequest_1 = require("../../services/error/BadRequest");
const otpGenerator_1 = require("../../services/otp/otpGenerator");
const moment_1 = __importDefault(require("moment"));
const db_1 = require("../../utilities/db");
const response_1 = require("../../services/response/response");
const mail_1 = require("../../services/mail");
const otpEmailTemplate_1 = require("../../utilities/otpEmailTemplate");
const NotFound_1 = require("../../services/error/NotFound");
const Unauthorized_1 = require("../../services/error/Unauthorized");
const PasswordRecoveryController = (model) => {
    const { create, getAll, getById, update, destroy, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const passwordRecoveryRequest = async (req, res, next, options) => {
        try {
            const OTP_EXPIRES_IN_MINUTES = 5;
            await db_1.sequelize.transaction(async (t) => {
                const { employee_official_email } = req.body;
                const user = await models_1.User.findOne({
                    where: {
                        employee_official_email
                    }
                });
                if (!user) {
                    console.log("ABCD", user);
                    next((0, BadRequest_1.badRequest)("There is no user with that email ID"));
                }
                else {
                    let recoveryRecord = await passwordRecovery_1.default.findOne({
                        where: {
                            user_id: user.id
                        }
                    });
                    if (!recoveryRecord) {
                        recoveryRecord = await passwordRecovery_1.default.create({
                            user_id: user.id,
                            email: user.employee_official_email,
                            phone: user.phone ? user?.phone : null,
                            otp: (0, otpGenerator_1.generateOtp)(),
                            sent_at: (0, moment_1.default)().toDate(),
                            expires_at: (0, moment_1.default)().add(OTP_EXPIRES_IN_MINUTES, 'minutes').toDate()
                        }, { transaction: t });
                    }
                    else {
                        recoveryRecord.otp = (0, otpGenerator_1.generateOtp)();
                        recoveryRecord.sent_at = (0, moment_1.default)().toDate();
                        recoveryRecord.expires_at = (0, moment_1.default)().add(OTP_EXPIRES_IN_MINUTES, 'minutes').toDate();
                        await recoveryRecord.save({ transaction: t });
                    }
                    const mailData = {
                        email: employee_official_email,
                        subject: "Password recovery process",
                        html: otpEmailTemplate_1.OtpEmailTemplate.replace("{{ otp }}", recoveryRecord.otp)
                    };
                    await mail_1.MailSenderService.sendToEmail(user?.employee_official_email, mailData);
                    // return {recoveryRecord}
                    const responseBody = {
                        otp_duration: OTP_EXPIRES_IN_MINUTES,
                        expire_at: (0, moment_1.default)(recoveryRecord.expires_at).format('hh:mm a')
                    };
                    const response = (0, response_1.generateResponse)(200, true, "Otp generated succesfully!", responseBody);
                    res.status(200).json(response);
                }
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    const otpVerification = async (req, res, next) => {
        try {
            const { employee_official_email, otp } = req.body;
            const isRecoveryRecord = await passwordRecovery_1.default.findOne({
                where: {
                    email: employee_official_email
                }
            });
            console.log(isRecoveryRecord?.isExpired);
            if (!isRecoveryRecord) {
                next((0, NotFound_1.notFound)("Password recovery process not initiated"));
            }
            if (isRecoveryRecord.otp === otp) {
                if (isRecoveryRecord && !isRecoveryRecord?.isExpired) {
                    const response = (0, response_1.generateResponse)(200, true, "OTP verified succesfully!");
                    res.status(200).json(response);
                }
                else {
                    next((0, Unauthorized_1.unauthorized)("OTP expired!"));
                }
            }
            else {
                next((0, Unauthorized_1.unauthorized)("OTP invalid!"));
            }
        }
        catch (err) {
        }
    };
    const passwordReset = async (req, res, next) => {
        try {
            const { employee_official_email, otp, password } = req.body;
            console.log(">>>>>", employee_official_email, otp, password);
            const recoveryRecord = await passwordRecovery_1.default.findOne({
                where: {
                    email: employee_official_email
                }
            });
            console.log("RECOVERY RECORD>>>>>>>>>>>", recoveryRecord);
            const employee = await models_1.User.findByPk(recoveryRecord?.user_id);
            if (!otp) {
                next((0, BadRequest_1.badRequest)("Invalid OTP"));
            }
            if (!recoveryRecord) {
                next((0, Unauthorized_1.unauthorized)("Password Recovery process not initiated"));
            }
            if (recoveryRecord && recoveryRecord.otp == otp) {
                console.log(recoveryRecord?.isExpired);
                if (recoveryRecord.isExpired === false) {
                    employee.employee_password = password;
                    await employee?.save();
                    recoveryRecord.expires_at = (0, moment_1.default)().toDate();
                    recoveryRecord?.save();
                    const response = (0, response_1.generateResponse)(200, true, "Password Reset succesfully!");
                    res.status(200).json(response);
                }
                else {
                    next((0, Unauthorized_1.unauthorized)("OTP Expired!"));
                }
            }
            else {
                next((0, Unauthorized_1.unauthorized)("Otp is invalid!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong"));
        }
    };
    return { passwordRecoveryRequest, create, getAll, getById, update, destroy, getAllDropdown, otpVerification, passwordReset };
};
exports.PasswordRecoveryController = PasswordRecoveryController;
