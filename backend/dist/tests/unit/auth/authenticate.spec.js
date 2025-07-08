"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const authenticate_1 = require("../../../src/utilities/authenticate");
(0, mocha_1.describe)('Authenticating a user', () => {
    const user = {
        id: 1,
        company_id: 1,
        employee_name: 'Anugrah Bhatt',
        employee_generated_id: 'GV-123',
        date_of_joining: '2023-04-03',
        probation_period: '6 months',
        probation_due_date: '2023-10-03',
        designation: 'Software Engineer',
        department: 'IT',
        work_location: 'office',
        level: '',
        grade: '',
        cost_center: '',
        employee_official_email: 'anugrah.bhatt@glocalview.com',
        employee_personal_email: 'bhattanugrah@gmail.com',
        dob_adhaar: '1998-04-01',
        dob_celebrated: '1998-04-01',
        employee_gender: 'male',
        is_deleted: false,
        role_id: 1,
        status: true,
        employee_password: '$2a$10$MiLQDMtJmGQgX7oCFdlj8uceA1HtvwXXSNem.QSpe6fbrDz23rWZq'
    };
    (0, mocha_1.it)('Should return true if the credentials are right', async () => {
        const result = await (0, authenticate_1.authenticate)(user, 'Anugrah@123');
        (0, chai_1.expect)(result).to.be.true;
    });
    (0, mocha_1.it)('Should return false for invalid credentials', async () => {
        const result = await (0, authenticate_1.authenticate)(user, 'wrongpassword');
        (0, chai_1.expect)(result).to.be.false;
    });
});
