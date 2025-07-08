

export const generateResponse = (status: number, success: boolean, message: string, data?: any, meta?: any, ) => ({
    status: status,
    success: success,
    data: data,
    meta: meta,
    message: message
})