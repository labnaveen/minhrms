"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);
        if (error === undefined) {
            next();
        }
        else {
            const message = error.details.map((i) => i.message).join(',');
            res.status(422).json({
                status: 422,
                message: message.replace(/[\\"]/g, ''),
                data: {},
                purpose: 'Validation Error'
            });
        }
    };
};
exports.validate = validate;
