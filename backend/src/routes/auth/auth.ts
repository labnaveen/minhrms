import express, { NextFunction } from 'express'
import { LoginController } from '../../controllers/auth/loginController'
import { User } from '../../models'
import { Authorize } from '../../middleware/Authorize'
import bcrypt from 'bcrypt';
import { PasswordRecoveryController } from '../../controllers/auth/passwordRecoveryController';
import PasswordRecovery from '../../models/passwordRecovery';

var router = express.Router()



const loginController = LoginController(User)

const passwordRecoveryController = PasswordRecoveryController(PasswordRecovery)


/**
 * @swagger
 * /api/auth/mobilelogin:
 *   post:
 *      summary: Login as an Employee using mobile
 *      tags:
 *        - Employee
 *      parameters:
 *         - in: body
 *           name: body
 *           required: true
 *           schema:
 *              type: object
 *              properties:
 *                  employee_official_email:
 *                      type: string
 *                  password:
 *                      type: string
 *                  fcm_token:
 *                      type: string
 *                  device_id:
 *                      type: string
 *              required:
 *                  - employee_official_email
 *                  - password
 *              example:
 *                  employee_official_email: anugrah.bhatt@glocalview.com
 *                  password: Anugrah@123
 *      description: Authenticating as an Employee and creating a Token.
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Getting a list of all Company 
router.post('/mobilelogin', loginController.mobileLogin)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *      summary: Login as an Employee
 *      tags:
 *        - Employee
 *      parameters:
 *         - in: body
 *           name: body
 *           required: true
 *           schema:
 *              type: object
 *              properties:
 *                  employee_official_email:
 *                      type: string
 *                  password:
 *                      type: string
 *              required:
 *                  - employee_official_email
 *                  - password
 *              example:
 *                  employee_official_email: anugrah.bhatt@glocalview.com
 *                  password: Anugrah@123
 *      description: Authenticating as an Employee and creating a Token.
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Getting a list of all Company 
router.post('/login', loginController.login)

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *      summary: Getting a new access token using a refresh token
 *      tags:
 *        - Employee
 *      parameters:
 *         - in: body
 *           name: body
 *           required: true
 *           schema:
 *              type: object
 *              properties:
 *                  refresh_token:
 *                      type: string
 *              required:
 *                  - refresh_token
 *              example:
 *                  refresh_token: string
 *      description: Getting a new access token using the refresh token.
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Getting a new access token by the help of refresh
router.post('/refresh', loginController.refreshToken)

router.post('/passwordChange', loginController.passwordChange)

router.post('/forget-password', (req, res, next) => passwordRecoveryController.passwordRecoveryRequest(req, res, next))

router.post('/otp-verify', (req, res, next) => passwordRecoveryController.otpVerification(req, res, next))

router.post('/reset-password', (req, res, next) => passwordRecoveryController.passwordReset(req, res, next))

router.post('/mobile/logout', Authorize('employee_dashboard.view'), (req, res, next) => loginController.mobileLogout(req, res, next))

router.post('/logout', Authorize('employee_dashboard.view'), (req, res, next) => loginController.logout(req, res, next))

export default router

