import bcrypt from 'bcrypt'
import { User } from '../models'

export async function authenticate(user: User, password: string){
    //@ts-ignore
    const userPassword = user.employee_password
    console.log(userPassword)
    if (!userPassword) {
      return false
    }


    const validPassword = await bcrypt.compare(password, userPassword as string)

    if (!validPassword) {
      return false
    }

    if(validPassword){
      return true 
    }
}