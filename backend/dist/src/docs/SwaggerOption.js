"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
exports.swaggerOptions = {
    swaggerDefinition: {
        swagger: '2.0.0',
        info: {
            title: 'HRMS backend',
            description: 'This is the API for the HRMS Application',
            version: '1.0.0'
        },
        basePath: '/',
        schemes: ['http'],
        paths: {},
        definitions: {},
        securityDefinitions: {
            jwt: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            }
        },
        tags: [
            {
                name: 'Company',
                description: 'API Endpoints for the companies that are going to be the Customers.'
            },
            {
                name: 'Employee',
                description: 'API Endpoints for Employees of a particular company'
            },
            {
                name: 'Role',
                description: 'API Endpoints all the Roles in the system.'
            },
            {
                name: 'Attendance Policy',
                description: 'API Endpoints for the Attendance Policy of a company'
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/routes/auth/*.ts'] //Path to all the API routes.
};
