import { Request, Response, NextFunction } from "express";
import { generateResponse } from "../services/response/response";


interface ApiError {
    code: number;
    message: string;
    name: string;
}

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    if(err.name === 'ApiError'){
        const response = generateResponse(err.code, false, `${err.message}`)
        res.status(err.code).json(response)
        // res.status(err.code).json({
        //     "error":{
        //         "code": err.code,
        //         "message": err.message
        //     }
        // });

    } else if(err.name === 'MobileApiError'){
        //@ts-ignore
        res.status(err.status).json({          
                //@ts-ignore  
                "status": err.status,
                //@ts-ignore
                "success": err.success,
                "message": err.message
        });

    } else{
        console.error(err);
        const response = generateResponse(500, false, "Internal Server Error")
        res.status(500).json(response)
        // res.status(500).json({
        //     "error":{
        //         "code": 500,
        //         "message": "Internal Server Error"
        //     }
        // })
    }
}

