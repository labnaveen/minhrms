"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const employeeController_1 = require("../controllers/employee/employeeController");
const Authorize_1 = require("../middleware/Authorize");
const RequestValidate_1 = require("../middleware/RequestValidate");
const user_1 = require("../schemas/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Unauthorized_1 = require("../services/error/Unauthorized");
const familyMemberController_1 = require("../controllers/familyMember/familyMemberController");
const familyMember_1 = __importDefault(require("../models/familyMember"));
const familyMemberSchema_1 = require("../schemas/familyMemberSchema");
const experienceController_1 = require("../controllers/experience/experienceController");
const experience_1 = __importDefault(require("../models/experience"));
const experience_2 = require("../schemas/experience");
const educationController_1 = require("../controllers/education/educationController");
const education_1 = __importDefault(require("../models/education"));
const education_2 = require("../schemas/education");
const baseLeaveConfigurationController_1 = require("../controllers/leavePolicy/baseLeaveConfigurationController");
const baseLeaveConfiguration_1 = __importDefault(require("../models/baseLeaveConfiguration"));
const leave_1 = require("../schemas/leave");
const documentController_1 = __importDefault(require("../controllers/documents/documentController"));
var router = express_1.default.Router();
const employeeController = (0, employeeController_1.EmployeeController)(models_1.User);
const familyMemberController = (0, familyMemberController_1.FamilyMemberController)(familyMember_1.default);
const experienceController = (0, experienceController_1.ExperienceController)(experience_1.default);
const educationController = (0, educationController_1.EducationController)(education_1.default);
const baseLeaveConfigurationController = (0, baseLeaveConfigurationController_1.BaseLeaveConfigurationController)(baseLeaveConfiguration_1.default);
/**
 * @swagger
 * /api/employee:
 *   get:
 *      summary: Get a list of all Employees
 *      tags:
 *        - Employee
 *      description: Get a list of all Employees
 *      security:
 *        - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Getting a list of all Company 
router.get('/', (0, Authorize_1.Authorize)('employee_list.view'), (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jsonwebtoken_1.default.decode(token);
    const { company_id } = decoded;
    const options = {
        where: {
            company_id: company_id,
        },
    };
    if (token) {
        employeeController.getAll(req, res, next, options);
    }
    else {
        next((0, Unauthorized_1.unauthorized)("Token is missing!"));
    }
});
/**
 * @swagger
 * /api/employee:
 *   post:
 *      summary: Creating an employee
 *      tags:
 *        - Employee
 *      parameters:
 *        -in
 *      description: API to create a new employee
 *      security:
 *        - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Creating a new Employee
router.post('/', (0, Authorize_1.Authorize)('employee_list.add'), (req, res, next) => employeeController.create(req, res, next));
//Bulk Upload Employees
router.post('/upload', (0, Authorize_1.Authorize)('employee_list.add'), (req, res, next) => employeeController.bulkUpload(req, res, next));
//Dropdown
router.get('/dropdown', (0, Authorize_1.Authorize)('employee_list.view'), (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        const { company_id } = jsonwebtoken_1.default.decode(token);
        const options = {
            where: {
                company_id: company_id,
            },
            attribute: ['id', 'employee_name', 'employee_generated_id'],
            searchBy: ['employee_name', 'employee_generated_id']
        };
        // DropdownController(User).getAllDropdown(req, res, next, options)
        //@ts-ignore
        employeeController.dropdown(req, res, next, options);
    }
    else {
        next((0, Unauthorized_1.unauthorized)("Token is missing"));
    }
});
//Leave Request for a particular user
router.get('/leave-request', (0, Authorize_1.Authorize)('employee_leaves.view'), (req, res, next) => { employeeController.getLeaveRequests(req, res, next); });
router.get('/regularization-request', (0, Authorize_1.Authorize)('regularisation_requests.view'), (req, res, next) => employeeController.getRegularizationRequests(req, res, next));
//Employe Attendance Data APi
router.get('/punch-data', (0, Authorize_1.Authorize)('employee_dashboard.edit'), (req, res, next) => employeeController.getPunchDetails(req, res, next));
//User can edit profile
router.put('/profile', (0, Authorize_1.Authorize)('employee_profile.edit'), (0, RequestValidate_1.validate)(user_1.ProfileUpdationSchema, 'body'), (req, res, next) => employeeController.updateProfile(req, res, next));
router.get('/profile-change-request', (0, Authorize_1.Authorize)('profile_update_requests.view'), (req, res, next) => employeeController.getProfileChangeRequests(req, res, next));
//API To view our own letters
router.get('/letters', (0, Authorize_1.Authorize)('employee_dashboard.view'), (req, res, next) => documentController_1.default.getEmployeeLetters(req, res, next));
router.put('/letters/accept/:id', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => documentController_1.default.acceptLetter(req, res, next));
router.put('/letters/reject/:id', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => documentController_1.default.rejectLetter(req, res, next));
//Get the applied base-leave-configuration
router.get('/base-leave-configuration', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => baseLeaveConfigurationController.getAppliedConfiguration(req, res, next));
//User profile
router.get('/:id/profile', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => { employeeController.getProfile(req, res, next); });
//Get a single Employee Data
router.get('/:id', (0, Authorize_1.Authorize)('employee_list.view'), (req, res, next) => {
    employeeController.getById(req, res, next);
});
//Update Specific Employee
router.put('/:id', (0, Authorize_1.Authorize)('other_employee.edit'), (0, RequestValidate_1.validate)(user_1.UserUpdationSchema, 'body'), (req, res, next) => employeeController.update(req, res, next));
//Creating new Family Member
router.post('/family', (0, Authorize_1.Authorize)('employee_profile.edit'), (0, RequestValidate_1.validate)(familyMemberSchema_1.FamilyMemberCreationSchema, 'body'), (req, res, next) => { familyMemberController.createFamilyMember(req, res, next); });
router.get('/family/:id', (0, Authorize_1.Authorize)('employee_profile.edit'), (req, res, next) => { familyMemberController.getById(req, res, next); });
router.put('/family/:id', (0, Authorize_1.Authorize)('employee_profile.edit'), (req, res, next) => { familyMemberController.updateFamilyMember(req, res, next); });
router.delete('/family/:family_member_id', (0, Authorize_1.Authorize)('employee_profile.edit'), (req, res, next) => { familyMemberController.deleteFamilyMember(req, res, next); });
router.get('/:id/family', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => familyMemberController.getFamilyForEmployee(req, res, next));
//Changing status of an employee api
router.patch('/:id/status', (0, Authorize_1.Authorize)("employee_profile.edit"), (req, res, next) => employeeController.changeStatus(req, res, next));
//Deleting an employee by the HR
router.delete('/:id', (0, Authorize_1.Authorize)('employee_profile.delete'), (req, res, next) => employeeController.deleteEmployee(req, res, next));
//EXPERIENCE API'S START
router.post('/experience', (0, Authorize_1.Authorize)('employee_profile.edit'), (0, RequestValidate_1.validate)(experience_2.ExperienceCreationSchema, "body"), (req, res, next) => experienceController.create(req, res, next));
router.get('/experience', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => {
    const options = {
        included: ['employment_type']
    };
    experienceController.getAll(req, res, next, options);
});
router.get('/experience/:id', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => {
    const options = {
        included: ['employement_type']
    };
    experienceController.getById(req, res, next, options);
});
router.put('/experience/:id', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => experienceController.update(req, res, next));
router.delete('/experience/:id', (0, Authorize_1.Authorize)('employee_profile.delete'), (req, res, next) => experienceController.destroy(req, res, next));
//EXPERIENCE API END
//EDUCATION API START
router.post('/education', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => educationController.create(req, res, next));
router.put('/education/:id', (0, Authorize_1.Authorize)('employee_profile.edit'), (0, RequestValidate_1.validate)(education_2.EducationUpdationSchema, 'body'), (req, res, next) => educationController.update(req, res, next));
router.get('/education/:id', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => educationController.getById(req, res, next));
router.delete('/education/:id', (0, Authorize_1.Authorize)('employee_profile.edit'), (req, res, next) => educationController.destroy(req, res, next));
//EDUCATION API END
//Profile Change Approval API
router.put('/profile-request/:id/approve', (0, Authorize_1.Authorize)('profile_update_requests.edit'), (req, res, next) => employeeController.approveProfileChangeRequest(req, res, next));
router.put('/profile-request/:id/reject', (0, Authorize_1.Authorize)('profile_update_requests.edit'), (req, res, next) => employeeController.rejectProfileChangeRequest(req, res, next));
//Credit leave balance to an employee
router.put('/:user_id/leave-balance', (0, Authorize_1.Authorize)('leave_policies.edit'), (0, RequestValidate_1.validate)(leave_1.ManualLeaveCreationSchema, 'body'), (req, res, next) => employeeController.creditLeaves(req, res, next));
//APi for an employee statistics
router.get('/statistics/:id', (0, Authorize_1.Authorize)('employee_profile.view'), (req, res, next) => employeeController.employeeStatistics(req, res, next));
//API to birthday wish employee
router.post('/:id/birthday-wish', (0, Authorize_1.Authorize)('admin_dashboard.edit'), (req, res, next) => employeeController.wishEmployeeBirthday(req, res, next));
//API to wish anniversary employee
router.post('/:id/anniversary-wish', (req, res, next) => employeeController.wishEmployeeAnniversary(req, res, next));
exports.default = router;
