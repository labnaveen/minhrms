import { Request, Response, NextFunction } from "express"
import { Schema } from "joi"

interface MyRequest extends Request {
    [key: string]: any;
  }

export const validate = (schema: Schema, property: string) => {
    return(req: MyRequest, res: Response, next: NextFunction)=>{
        const {error} = schema.validate(req[property])
        if(error === undefined){
            next()
        }else{
            const message = error.details.map((i) => i.message).join(',')
            res.status(422).json({
                status: 422,
                message: message.replace(/[\\"]/g, ''),
                data:{},
                purpose: 'Validation Error'
            })
        }
    }
}