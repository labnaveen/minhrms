import { User } from "../../models";
import { authenticate } from "../../utilities/authenticate";
import { unauthorized } from "../error/Unauthorized";
import { authorize } from "./AuthService";
import { AuthUser } from "./IFace";



export async function emailSignInProcess(email: string, password: string){
    const user = await User.findOne({where: {employee_official_email: email}}) as any;
    if(!user){
        // throw new Error('User Does Not Exist')
        return { code: 401, message: 'User Does Not Exist' }
    }

    if(!user.status){
        // throw new Error('User Not Active')
        return { code: 401, message: 'User is not Active' }
    }


    const isValid = await authenticate(user, password)


    if(!isValid){
        // throw new Error('Invalid Credentials')
        return { code: 401, message: 'Invalid Credentials' }
    }

    if(isValid){
        return authorize(user)
    }
}
export async function mobileEmailSignInProcess(email: string, password: string, fcm_token: string, device_id: string){
    const user = await User.findOne({where: {employee_official_email: email}}) as any;
    if(!user){
        // throw new Error('User Does Not Exist')
        return { code: 401, message: 'User Does Not Exist' }
    }

    if(!user.status){
        // throw new Error('User Not Active')
        return { code: 401, message: 'User is not Active' }
    }


    const isValid = await authenticate(user, password)


    if(!isValid){
        // throw new Error('Invalid Credentials')
        return { code: 401, message: 'Invalid Credentials' }
    }

    if(isValid){
        user.fcm_token = fcm_token
        user.device_id = device_id
        return authorize(user)
    }
}

export async function refresh(refreshToken: string):Promise<AuthUser>{
    let decoded
    try{
        decoded = refresh(refreshToken)
    }catch(_err){
        const err: any = _err
        throw new Error(err.message)
    }

    
    const{
        //@ts-ignore
        user: {id: userId},
        //@ts-ignore
        tokenType
    } = decoded
    if(tokenType !== 'refresh'){
        throw new Error('Only refresh tokens are accepted')
    }

    const user = await User.findByPk(userId)
    if(!user){
        throw new Error('User not found')
    }
    //@ts-ignore
    return authorize(user)
}