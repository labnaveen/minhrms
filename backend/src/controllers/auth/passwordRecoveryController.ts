
import {FindOptions, Model,} from 'sequelize'
import { IMasterControllerOptions, MasterController } from "../masterController";
import { User } from "../../models";
import LeaveTypePolicy from "../../models/leaveTypePolicy";
import { NextFunction, Request, Response } from 'express';
import { internalServerError } from '../../services/error/InternalServerError';
import PasswordRecovery from '../../models/passwordRecovery';
import { badRequest } from '../../services/error/BadRequest';
import { generateOtp } from '../../services/otp/otpGenerator';
import moment from 'moment';
import { sequelize } from '../../utilities/db';
import { generateResponse } from '../../services/response/response';
import { MailSenderService } from '../../services/mail';
import { OtpEmailTemplate } from '../../utilities/otpEmailTemplate';
import { notFound } from '../../services/error/NotFound';
import { unauthorized } from '../../services/error/Unauthorized';

type PasswordRecoveryAttributes = {
    id: number,
    user_id: number,
    email: string,
    phone: string,
    otp: string,
    sent_at: Date,
    expires_at: Date
}

type PasswordRecoveryCreationAttributes = Omit<PasswordRecoveryAttributes, 'id'>;

type PasswordRecoveryModel = Model<PasswordRecoveryCreationAttributes, PasswordRecoveryCreationAttributes>;

type PasswordRecoveryController = MasterController<PasswordRecoveryModel> & {
    passwordRecoveryRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    otpVerification: (req: Request, res: Response, next: NextFunction, option?: FindOptions) => Promise<void>;
    passwordReset: (req: Request, res: Response, next: NextFunction, option?: FindOptions) => Promise<void>;
}

export const PasswordRecoveryController= (
    model: typeof Model & (new () => PasswordRecovery)
):PasswordRecoveryController => {

    const {create, getAll, getById, update, destroy, getAllDropdown} = MasterController<PasswordRecovery>(model);


    const passwordRecoveryRequest = async(req: Request, res: Response, next: NextFunction, options?:IMasterControllerOptions):Promise<void> => {
        try{
            const OTP_EXPIRES_IN_MINUTES = 5

            await sequelize.transaction(async (t) => {

                const {employee_official_email} = req.body

                const user = await User.findOne({
                    where:{
                        employee_official_email
                    }
                }) as any;


                if(!user){
                    console.log( "ABCD", user)
                    next(badRequest("There is no user with that email ID"))
                }else{
                    let recoveryRecord = await PasswordRecovery.findOne({
                        where:{
                            user_id: user.id
                        }
                    }) as any;
    
                    if(!recoveryRecord){
                        recoveryRecord = await PasswordRecovery.create({
                            user_id: user.id,
                            email: user.employee_official_email,
                            phone: user.phone? user?.phone : null,
                            otp: generateOtp(),
                            sent_at: moment().toDate(),
                            expires_at: moment().add(OTP_EXPIRES_IN_MINUTES, 'minutes').toDate()
                        }, {transaction: t})
                    }else{
                        recoveryRecord.otp = generateOtp()
                        recoveryRecord.sent_at = moment().toDate()
                        recoveryRecord.expires_at = moment().add(OTP_EXPIRES_IN_MINUTES, 'minutes').toDate()
                        await recoveryRecord.save({transaction: t})
                    }
                    
                    const mailData = {
                        email: employee_official_email,
                        subject: "Password recovery process",
                        html: OtpEmailTemplate.replace("{{ otp }}", recoveryRecord.otp)
                    }
    
                    await MailSenderService.sendToEmail(user?.employee_official_email, mailData)
    
                    // return {recoveryRecord}
    
    
                    const responseBody = {
                        otp_duration: OTP_EXPIRES_IN_MINUTES,
                        expire_at: moment(recoveryRecord.expires_at).format('hh:mm a')
                    }
    
                    const response = generateResponse(200, true, "Otp generated succesfully!", responseBody)
    
                    res.status(200).json(response)
                }

            })


        }catch(err){
            console.log(err)
            res.status(500).json(err)
            // next(internalServerError("Something went wrong!"))
        }
    }

    const otpVerification = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {employee_official_email, otp} = req.body


            const isRecoveryRecord = await PasswordRecovery.findOne({
                where: {
                    email: employee_official_email
                }
            }) as any; 

            console.log(isRecoveryRecord?.isExpired)


            if(!isRecoveryRecord){
                
                next(notFound("Password recovery process not initiated"))
            }

            

            if(isRecoveryRecord.otp === otp){
                if(isRecoveryRecord && !isRecoveryRecord?.isExpired){
                    const response = generateResponse(200, true, "OTP verified succesfully!")
                    res.status(200).json(response)
                }else{
                    next(unauthorized("OTP expired!"))
                }
            }else{
                next(unauthorized("OTP invalid!"))
            }


        }catch(err){

        }
    }

    const passwordReset = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            
            const {employee_official_email, otp, password} = req.body

            console.log(">>>>>", employee_official_email, otp, password)

            const recoveryRecord = await PasswordRecovery.findOne({
                where:{
                    email: employee_official_email
                }
            }) as any;

            console.log("RECOVERY RECORD>>>>>>>>>>>", recoveryRecord)

            const employee = await User.findByPk(recoveryRecord?.user_id) as any;

            if(!otp){
                next(badRequest("Invalid OTP"))
            }

            if(!recoveryRecord){
                next(unauthorized("Password Recovery process not initiated"))
            }
            
            if(recoveryRecord && recoveryRecord.otp == otp){
                console.log(recoveryRecord?.isExpired)
                if(recoveryRecord.isExpired === false){
                    employee.employee_password = password
                    await employee?.save()
                    recoveryRecord.expires_at = moment().toDate()
                    recoveryRecord?.save()
                    const response = generateResponse(200, true, "Password Reset succesfully!")
                    res.status(200).json(response)
                }else{
                    next(unauthorized("OTP Expired!"))
                }
            }else{
                next(unauthorized("Otp is invalid!"))
            }


        }
        catch(err){
            next(internalServerError("Something went wrong"))
        }
    }
    
    return{ passwordRecoveryRequest, create, getAll, getById, update, destroy, getAllDropdown, otpVerification, passwordReset }
}