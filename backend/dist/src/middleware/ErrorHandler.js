"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const response_1 = require("../services/response/response");
const errorHandler = (err, req, res, next) => {
    if (err.name === 'ApiError') {
        const response = (0, response_1.generateResponse)(err.code, false, `${err.message}`);
        res.status(err.code).json(response);
        // res.status(err.code).json({
        //     "error":{
        //         "code": err.code,
        //         "message": err.message
        //     }
        // });
    }
    else if (err.name === 'MobileApiError') {
        //@ts-ignore
        res.status(err.status).json({
            //@ts-ignore  
            "status": err.status,
            //@ts-ignore
            "success": err.success,
            "message": err.message
        });
    }
    else {
        console.error(err);
        const response = (0, response_1.generateResponse)(500, false, "Internal Server Error");
        res.status(500).json(response);
        // res.status(500).json({
        //     "error":{
        //         "code": 500,
        //         "message": "Internal Server Error"
        //     }
        // })
    }
};
exports.errorHandler = errorHandler;
