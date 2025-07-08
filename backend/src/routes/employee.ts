import express, { NextFunction } from 'express'
import { User } from '../models'
import { EmployeeController } from '../controllers/employee/employeeController'
import { Authorize } from '../middleware/Authorize'
import { validate } from '../middleware/RequestValidate'
import { ProfileUpdationSchema, UserUpdationSchema } from '../schemas/user'
import { AuthUserJWT } from '../services/auth/IFace'
import jwt, { JwtPayload, decode, verify } from 'jsonwebtoken'
import { unauthorized } from '../services/error/Unauthorized'
import { FamilyMemberController } from '../controllers/familyMember/familyMemberController'
import FamilyMember from '../models/familyMember'
import { FamilyMemberCreationSchema } from '../schemas/familyMemberSchema'
import { ExperienceController } from '../controllers/experience/experienceController'
import Experience from '../models/experience'
import { ExperienceCreationSchema } from '../schemas/experience'
import { EducationController } from '../controllers/education/educationController'
import Education from '../models/education'
import { EducationUpdationSchema } from '../schemas/education'
import { BaseLeaveConfigurationController } from '../controllers/leavePolicy/baseLeaveConfigurationController'
import BaseLeaveConfiguration from '../models/baseLeaveConfiguration'
import { ManualLeaveCreationSchema } from '../schemas/leave'
import documentController from '../controllers/documents/documentController'



var router = express.Router()


const employeeController = EmployeeController(User)
const familyMemberController = FamilyMemberController(FamilyMember)
const experienceController = ExperienceController(Experience)
const educationController = EducationController(Education)
const baseLeaveConfigurationController = BaseLeaveConfigurationController(BaseLeaveConfiguration)



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
router.get('/', Authorize('employee_list.view'), (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1] as any
    const decoded = jwt.decode(token) as AuthUserJWT | any
    const{company_id} = decoded
    const options = {
        where:{
            company_id: company_id,
        },
    }
    if(token){
        employeeController.getAll(req, res, next, options)
    }else{
        next(unauthorized("Token is missing!"))
    }
})


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
router.post('/', Authorize('employee_list.add'), (req, res, next) => employeeController.create(req, res, next))

//Bulk Upload Employees
router.post('/upload', Authorize('employee_list.add'), (req, res, next) => employeeController.bulkUpload(req, res, next))

//Dropdown
router.get('/dropdown', Authorize('employee_list.view'), (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if(token){
        const {company_id} = jwt.decode(token) as AuthUserJWT
        const options = {
            where:{
                company_id: company_id,
            },
            attribute: ['id', 'employee_name', 'employee_generated_id'],
            searchBy: ['employee_name', 'employee_generated_id']
        } as any;

        // DropdownController(User).getAllDropdown(req, res, next, options)
        //@ts-ignore
        employeeController.dropdown(req, res, next, options)
    }else{
        next(unauthorized("Token is missing"))
    }
})



//Leave Request for a particular user
router.get('/leave-request', Authorize('employee_leaves.view'), (req, res, next) =>{employeeController.getLeaveRequests(req, res, next)})

router.get('/regularization-request', Authorize('regularisation_requests.view'), (req, res, next) => employeeController.getRegularizationRequests(req, res, next))


//Employe Attendance Data APi
router.get('/punch-data', Authorize('employee_dashboard.edit'), (req, res, next) => employeeController.getPunchDetails(req, res, next))



//User can edit profile
router.put('/profile', Authorize('employee_profile.edit'), validate(ProfileUpdationSchema, 'body'), (req, res, next) => employeeController.updateProfile(req, res , next))

router.get('/profile-change-request', Authorize('profile_update_requests.view'), (req, res, next) => employeeController.getProfileChangeRequests(req, res, next))


//API To view our own letters
router.get('/letters', Authorize('employee_dashboard.view'), (req, res, next) => documentController.getEmployeeLetters(req, res, next))

router.put('/letters/accept/:id', Authorize('employee_profile.view'), (req, res, next) => documentController.acceptLetter(req, res, next))

router.put('/letters/reject/:id', Authorize('employee_profile.view'), (req, res, next) => documentController.rejectLetter(req, res, next))

//Get the applied base-leave-configuration
router.get('/base-leave-configuration', Authorize('employee_profile.view'), (req, res, next) => baseLeaveConfigurationController.getAppliedConfiguration(req, res, next) )

//User profile
router.get('/:id/profile', Authorize('employee_profile.view'), (req, res, next) => { employeeController.getProfile(req, res, next)})

//Get a single Employee Data
router.get('/:id', Authorize('employee_list.view'), (req, res, next) => {
    employeeController.getById(req, res, next)
})


//Update Specific Employee
router.put('/:id', Authorize('other_employee.edit'), validate(UserUpdationSchema, 'body'), (req, res, next) => employeeController.update(req, res, next))


//Creating new Family Member
router.post('/family', Authorize('employee_profile.edit'),  validate(FamilyMemberCreationSchema, 'body'),  (req, res, next) => { familyMemberController.createFamilyMember(req, res, next)})

router.get('/family/:id', Authorize('employee_profile.edit'), (req, res, next) => { familyMemberController.getById(req, res, next)})

router.put('/family/:id', Authorize('employee_profile.edit'), (req, res, next) => { familyMemberController.updateFamilyMember(req, res, next)})

router.delete('/family/:family_member_id', Authorize('employee_profile.edit'), (req, res, next) =>  {familyMemberController.deleteFamilyMember(req, res, next)})

router.get('/:id/family', Authorize('employee_profile.view'), (req, res, next) => familyMemberController.getFamilyForEmployee(req, res, next))

//Changing status of an employee api
router.patch('/:id/status', Authorize("employee_profile.edit"), (req, res, next) => employeeController.changeStatus(req, res, next))

//Deleting an employee by the HR
router.delete('/:id', Authorize('employee_profile.delete'), (req, res, next) => employeeController.deleteEmployee(req, res, next))

//EXPERIENCE API'S START
router.post('/experience', Authorize('employee_profile.edit'), validate(ExperienceCreationSchema, "body"), (req, res, next) => experienceController.create(req, res, next))

router.get('/experience', Authorize('employee_profile.view'), (req, res, next) => {

    const options = {
        included:['employment_type']
    }

    experienceController.getAll(req, res, next, options)
})



router.get('/experience/:id', Authorize('employee_profile.view'), (req, res, next) => {

    const options = {
        included:['employement_type']
    }

    experienceController.getById(req, res, next, options)
})

router.put('/experience/:id', Authorize('employee_profile.view'), (req, res, next) => experienceController.update(req, res, next))
router.delete('/experience/:id', Authorize('employee_profile.delete'), (req, res, next) => experienceController.destroy(req, res, next))

//EXPERIENCE API END


//EDUCATION API START

router.post('/education', Authorize('employee_profile.view'), (req, res, next) => educationController.create(req, res, next))
router.put('/education/:id', Authorize('employee_profile.edit'), validate(EducationUpdationSchema, 'body'), (req, res, next) => educationController.update(req, res , next))
router.get('/education/:id', Authorize('employee_profile.view'), (req, res, next) => educationController.getById(req, res, next))
router.delete('/education/:id', Authorize('employee_profile.edit'), (req, res, next) => educationController.destroy(req, res, next))

//EDUCATION API END


//Profile Change Approval API

router.put('/profile-request/:id/approve', Authorize('profile_update_requests.edit'), (req, res, next) => employeeController.approveProfileChangeRequest(req, res, next))
router.put('/profile-request/:id/reject', Authorize('profile_update_requests.edit'), (req, res, next) => employeeController.rejectProfileChangeRequest(req, res, next))


//Credit leave balance to an employee
router.put('/:user_id/leave-balance', Authorize('leave_policies.edit'), validate(ManualLeaveCreationSchema, 'body'), (req, res, next) => employeeController.creditLeaves(req, res, next))

//APi for an employee statistics
router.get('/statistics/:id', Authorize('employee_profile.view'), (req, res, next) => employeeController.employeeStatistics(req, res, next))


//API to birthday wish employee
router.post('/:id/birthday-wish', Authorize('admin_dashboard.edit'), (req, res, next) => employeeController.wishEmployeeBirthday(req, res, next))

//API to wish anniversary employee
router.post('/:id/anniversary-wish', (req, res, next) => employeeController.wishEmployeeAnniversary(req, res, next))





export default router

