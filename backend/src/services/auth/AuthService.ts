//@ts-nocheck
import JWT from 'jsonwebtoken'
import { Company, Refresh, User } from '../../models'
import RedisCacheManager from '../cache/Redis'
import { AuthUserJWT, AuthUserJWTVerify, ResetToken } from './IFace'
import {getUserRoles} from './PermissionService'
import { generateResponse } from '../response/response'
import { v4 as uuidv4 } from 'uuid'

const { NODE_ENV, JWT_SECRET } = process.env

function getJWTExpireTime() {
	switch (NODE_ENV) {
		case 'development':
			return '1y'
		case 'testing':
			return '24h'
		default:
			return '12h'
	}
}

const scopeCache = new RedisCacheManager('scope')
const SCOPE_CACHE_EXPIRES_IN_SECONDS = 600


export async function authorize(user: User){
	const scope = await getUserRoles(user.role_id)

	const session_id = uuidv4()

	console.log(">>>>>>>>>>SESSION", session_id)

	const token = JWT.sign(
		{
			company_id: user.company_id,
			employee_id: user.id,
			session_id: session_id,
			tokenType: 'access'
		},
		JWT_SECRET as string,
		{
			algorithm: 'HS256',
			expiresIn: '15m'
		}
	)
	const refresh = JWT.sign(
		{
			company_id: user.company_id,
			employee_id: user.id,
			session_id: session_id,
			tokenType: 'refresh',
		},
		JWT_SECRET as string,
		{
			algorithm: 'HS256',
			expiresIn: '15d',
		}
	)

	const refreshData = {
		user_id: user.id,
		session_id: session_id,
		refresh_token: refresh,
		fcm_token: user.fcm_token? user.fcm_token : null,
		device_id: user.device_id? user.device_id : null
	}

	const newRefreshEntry = await Refresh.create(refreshData)

	const userResponse = {
		id: user.id,
		company_id: user.company_id, 
		employee_name: user.employee_name,
		employee_generated_id: user.employee_generated_id,
		date_of_joining: user.date_of_joining,
		probation_period: user.probation_period,
		probation_due_date: user.probation_due_date,
		work_location: user.work_location,
		leve: user.level,
		grade: user.grade,
		cost_center: user.cost_center,
		employee_official_email: user.employee_official_email,
		employee_personal_email: user.employee_personal_email,
		dob_adhaar: user.dob_adhaar,
		dob_celebrated: user.dob_celebrated,
		employee_gender_id: user.employee_gender_id,
		is_deleted: user.is_deleted,
		role_id: user.role_id,
		status: user.status,
		companyId: user.companyId,
		password_changed: user.password_changed
	}

	const responseData = {
		userResponse,
		scope,
		token,
		refresh,
		fcm_token: newRefreshEntry.fcm_token,
		device_id: newRefreshEntry.device_id

	}

	const response = generateResponse(200, true, "User logged In Succesfully", responseData)


	return{
		response
	}
}

export function refresh(token: string): AuthUserJWT{
	const payload = JWT.verify(token, JWT_SECRET as string)
	if(typeof payload !== 'object'){
		throw new Error('JWT payload is not an object')
	}

	const objectPayload: AuthUserJWT = payload as any
	if(!objectPayload.tokenType){
		throw new Error('Malformed JWT payload')
	}
	return objectPayload
}

export async function verify (toVerify: AuthUserJWT):Promise<AuthUserJWTVerify>{
	const {company_id, tokenType} = toVerify

	const company = Company.findByPk(company_id)

	if(tokenType !== 'access' || !company){
		return { isValid: false }
	}

	// let scope: string[] | null = await getScope(user, scopeKey)
	// if(!scope){
	// 	scope = await getUserRoles(user.id)
	// }

	return { isValid: true, credentials: {company_id, tokenType}}
}

export async function sendVerificationToken(user: User):Promise<ResetToken>{
	return{name: user.employee_name as string, email: ''}
}

// export async function secureScope(user: User, scope: string[], hashKey?: string):Promise<string>{
// 	const scopeKey = hashKey || cryptoRandomString({length: 10, type: 'alphanumeric'})
// 	const serializedScope = serializeScope(scope)
// 	await scopeCache.set(`${user.id}:${scopeKey}`, await serializedScope, SCOPE_CACHE_EXPIRES_IN_SECONDS)
// 	return scopeKey
// }

export async function getScope(user: User, scopeKey: string):Promise<string[] | null>{
	const serializedScope = await scopeCache.get(`${user.id}:${scopeKey}`)
	if(!serializedScope){
		return null
	}
	return (serializedScope)
}

// export async function serializeScope(scope: string[]): Promise<string>{
// 	return zlib.brotliCompressSync(JSON.stringify(scope)).toString('base64')
// }

// export async function deserializeScope(serializedScope: string): Promise<string[]>{
// 	return JSON.parse(zlib.brotliDecompressSync(Buffer.from(serializedScope, 'base64')).toString('utf-8')) as string[]
// }
