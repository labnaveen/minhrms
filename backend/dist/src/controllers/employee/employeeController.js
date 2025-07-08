"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const sequelize_1 = require("sequelize");
const masterController_1 = require("../masterController");
const models_1 = require("../../models");
const RandomPassword_1 = require("../../services/auth/RandomPassword");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const InternalServerError_1 = require("../../services/error/InternalServerError");
const Unauthorized_1 = require("../../services/error/Unauthorized");
const NotFound_1 = require("../../services/error/NotFound");
const masterPolicy_1 = __importDefault(require("../../models/masterPolicy"));
const db_1 = require("../../utilities/db");
const userDivision_1 = __importDefault(require("../../models/userDivision"));
const response_1 = require("../../services/response/response");
const divisionUnits_1 = __importDefault(require("../../models/divisionUnits"));
const BadRequest_1 = require("../../services/error/BadRequest");
const asset_1 = __importDefault(require("../../models/asset"));
const assignedAsset_1 = __importDefault(require("../../models/assignedAsset"));
const division_1 = __importDefault(require("../../models/division"));
const mail_1 = require("../../services/mail");
const EmailTemplate_1 = require("../../utilities/EmailTemplate");
const gender_1 = __importDefault(require("../../models/dropdown/type/gender"));
const reportingManagerEmployeeAssociation_1 = __importDefault(require("../../models/reportingManagerEmployeeAssociation"));
const reportingManagers_1 = __importDefault(require("../../models/reportingManagers"));
const reportingRole_1 = __importDefault(require("../../models/reportingRole"));
const familyMember_1 = __importDefault(require("../../models/familyMember"));
const relation_1 = __importDefault(require("../../models/dropdown/relation/relation"));
const experience_1 = __importDefault(require("../../models/experience"));
const education_1 = __importDefault(require("../../models/education"));
const employment_1 = __importDefault(require("../../models/dropdown/type/employment"));
const educationType_1 = __importDefault(require("../../models/dropdown/type/educationType"));
const profileImages_1 = __importDefault(require("../../models/profileImages"));
const getMasterPolicy_1 = require("../../services/masterPolicy/getMasterPolicy");
const attendancePolicy_1 = __importDefault(require("../../models/attendancePolicy"));
const shiftPolicy_1 = __importDefault(require("../../models/shiftPolicy"));
const moment_1 = __importDefault(require("moment"));
const dayType_1 = __importDefault(require("../../models/dropdown/dayType/dayType"));
const approval_1 = __importDefault(require("../../models/dropdown/status/approval"));
const regularizationRecord_1 = __importDefault(require("../../models/regularizationRecord"));
const regularisationStatus_1 = __importDefault(require("../../models/regularisationStatus"));
const regularizationRequestStatus_1 = __importDefault(require("../../models/regularizationRequestStatus"));
const profileChangeRecord_1 = __importDefault(require("../../models/profileChangeRecord"));
const approvalFlow_1 = __importDefault(require("../../models/approvalFlow"));
const profileChangeRequests_1 = __importDefault(require("../../models/profileChangeRequests"));
const sendNotification_1 = require("../../services/notification/sendNotification");
const notification_1 = __importDefault(require("../../models/notification"));
const leaveTypePolicy_1 = __importDefault(require("../../models/leaveTypePolicy"));
const approvalFlowType_1 = __importDefault(require("../../models/dropdown/type/approvalFlowType"));
const Forbidden_1 = require("../../services/error/Forbidden");
const fs_1 = __importDefault(require("fs"));
const csvtojson_1 = __importDefault(require("csvtojson"));
const formidable_1 = __importDefault(require("formidable"));
const helpers_1 = require("../../helpers");
const PermissionService_1 = require("../../services/auth/PermissionService");
const notificationService_1 = require("../../services/pushNotification/notificationService");
const axios_1 = __importDefault(require("axios"));
const punchLocation_1 = __importDefault(require("../../models/punchLocation"));
const imageAttachment = fs_1.default.readFileSync('./src/assets/birthday-banner.png').toString('base64');
const appUrl = process.env.APP_URL;
const EmployeeController = (model) => {
    const { destroy, getAllDropdown } = (0, masterController_1.MasterController)(model);
    const getAll = async (req, res, next, options) => {
        try {
            const findOptions = options || {}; //Can add Options such as where, attributes, etc.
            const { page, records, search_term } = req.query;
            const { unit_id, role, sortBy, sortOrder, month, year } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            findOptions.searchBy = options?.searchBy;
            findOptions.included = options?.included;
            findOptions.order = options?.sortBy?.map((field) => [field, 'DESC']);
            findOptions.offset = offset;
            findOptions.limit = recordsPerPage;
            findOptions.distinct = true;
            findOptions.order = [];
            if (req.query.search_term) {
                findOptions.where = {
                    [sequelize_1.Op.or]: [
                        { employee_name: { [sequelize_1.Op.like]: `%${search_term}%` } },
                        { employee_generated_id: { [sequelize_1.Op.like]: `%${search_term}%` } },
                        { employee_official_email: { [sequelize_1.Op.like]: `%${search_term}%` } },
                        { phone: { [sequelize_1.Op.like]: `%${search_term}%` } }
                    ]
                };
            }
            if (role) {
                findOptions.where = {
                    role_id: role
                };
            }
            if (sortBy && sortOrder) {
                if (sortBy === 'name') {
                    findOptions.order?.push(['employee_name', sortOrder]);
                }
                if (sortBy === 'employee_id') {
                    findOptions.order?.push(['employee_generated_id', sortOrder]);
                }
                if (sortBy === 'role') {
                    findOptions.order?.push([{ model: models_1.Roles, as: 'role' }, 'name', sortOrder]);
                }
                if (sortBy === 'contact') {
                    findOptions.order?.push(['phone', sortOrder]);
                }
            }
            console.log(">>>>>>>>>>>>>>>>>", findOptions.order);
            findOptions.include = [
                {
                    model: masterPolicy_1.default,
                    attributes: ['id', 'policy_name', 'policy_description']
                },
                {
                    model: models_1.Roles,
                    as: 'role',
                    attributes: ['id', 'name', 'alias']
                },
                {
                    model: familyMember_1.default,
                    include: [{ model: relation_1.default, attributes: ['id', 'name'] }],
                    attributes: ['id', 'name', 'dob', 'relation_id', 'occupation', 'phone', 'email'],
                }
            ];
            if (unit_id) {
                findOptions.include.push({
                    model: divisionUnits_1.default,
                    where: { id: unit_id }
                });
            }
            else {
                findOptions.include.push({
                    model: divisionUnits_1.default,
                    include: [
                        { model: division_1.default }
                    ]
                });
            }
            findOptions.attributes = {
                exclude: ['employee_password']
            };
            const data = await models_1.User.findAndCountAll(findOptions);
            const totalPages = Math.ceil(data.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: data.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const updatedData = await Promise.all(data.rows.map(async (employee) => {
                const unit = await userDivision_1.default.findAll({
                    where: {
                        user_id: employee.id
                    },
                });
                const department = await Promise.all(unit.map(async (unit) => {
                    const division_unit = await divisionUnits_1.default.findByPk(unit.id);
                    if (division_unit?.division_id === 2) {
                        return ({
                            name: division_unit?.unit_name
                        });
                    }
                }));
                const designation = await Promise.all(unit.map(async (unit) => {
                    const division_unit = await divisionUnits_1.default.findByPk(unit.id);
                    if (division_unit?.division_id === 1) {
                        return ({
                            id: division_unit?.id,
                            name: division_unit?.unit_name
                        });
                    }
                }));
                const employeeResponse = employee.toJSON();
                employeeResponse.department = department[0];
                employeeResponse.designation = designation[0];
                return employeeResponse;
            }));
            const result = {
                data: updatedData,
                meta
            };
            const response = (0, response_1.generateResponse)(200, true, "Data Fetched Succesfully!", updatedData, meta);
            if (data) {
                res.status(200).json(response);
            }
            else {
                // res.status(404).json({error: 'There are no companies!'})
                next((0, BadRequest_1.badRequest)("There are no companies!"));
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    };
    const getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const employee = await models_1.User.findByPk(id, {
                include: [
                    {
                        model: models_1.Company,
                        attributes: ['id', 'company_name']
                    },
                    {
                        model: masterPolicy_1.default,
                        attributes: ['id', 'policy_name']
                    },
                    {
                        model: models_1.Roles,
                        as: 'role',
                        attributes: ['id', 'name', 'alias']
                    },
                    {
                        model: divisionUnits_1.default,
                        include: [{ model: division_1.default }]
                    },
                    {
                        model: gender_1.default,
                        attributes: ['id', 'name']
                    },
                    {
                        model: reportingManagers_1.default,
                        as: 'Managers',
                        include: [
                            { model: models_1.User, attributes: ['id', 'employee_generated_id', 'employee_name'] }
                        ],
                        attributes: ['id', 'user_id', 'reporting_role_id'],
                        through: {
                            attributes: []
                        }
                    }
                ],
                attributes: {
                    exclude: ['employee_password', 'createdAt', 'updatedAt']
                }
            });
            if (employee) {
                const unit = await userDivision_1.default.findAll({
                    where: {
                        user_id: id
                    },
                });
                const department = await Promise.all(unit.map(async (unit) => {
                    const division_unit = await divisionUnits_1.default.findByPk(unit.id);
                    if (division_unit?.division_id === 2) {
                        return ({
                            name: division_unit?.unit_name
                        });
                    }
                }));
                const designation = await Promise.all(unit.map(async (unit) => {
                    const division_unit = await divisionUnits_1.default.findByPk(unit.id);
                    if (division_unit?.division_id === 1) {
                        return ({
                            name: division_unit?.unit_name
                        });
                    }
                }));
                const employeeResponse = employee.toJSON();
                employeeResponse.department = department[0];
                employeeResponse.designation = designation[0];
                const response = (0, response_1.generateResponse)(200, true, "Data fetched Succesfully!", employeeResponse);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Employee not found"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const create = async (req, res, next) => {
        try {
            const { employee_name, employee_generated_id, phone, date_of_joining, probation_period, units, probation_due_date, work_location, level, grade, cost_center, employee_official_email, employee_personal_email, dob_adhaar, dob_celebrated, employee_gender_id, role_id, master_policy_id, reporting_managers } = req.body;
            const existingEmployee = await models_1.User.findOne({
                where: {
                    employee_generated_id: employee_generated_id
                }
            });
            const existingEmployeeEmail = await models_1.User.findOne({
                where: {
                    employee_official_email: employee_official_email
                }
            });
            const existingPhone = await models_1.User.findOne({
                where: {
                    phone: phone
                }
            });
            const dob = req.body.dob_adhaar;
            const currentDate = (0, moment_1.default)();
            const userAge = currentDate.diff(dob, 'years');
            if (userAge < 18) {
                return next((0, BadRequest_1.badRequest)("The employee cannot be less than 18 years of age!"));
            }
            if (existingEmployee) {
                return next((0, BadRequest_1.badRequest)("An employee with that employee ID already exists!"));
            }
            if (existingEmployeeEmail) {
                return next((0, BadRequest_1.badRequest)("An employee with that official email ID already exists!"));
            }
            if (existingPhone) {
                return next((0, BadRequest_1.badRequest)("An employee with that same phone number already exists!"));
            }
            // const {employee_present_address, employee_present_pincode, employee_present_city, employee_present_state, employee_present_country_id, employee_present_mobile, employee_permanent_address, employee_permanent_pincode, employee_permanent_city, employee_permanent_state, employee_permanent_country_id, employee_permanent_mobile} = req.body
            const transaction = await db_1.sequelize.transaction(async (t) => {
                const employee_password = (0, RandomPassword_1.generatePassword)();
                const token = req.headers.authorization?.split(' ')[1];
                if (!token) {
                    // res.status(401).json('There is no Token provided.')
                    next((0, Unauthorized_1.unauthorized)('There is no token provided'));
                }
                if (token) {
                    const decodedToken = jsonwebtoken_1.default.decode(token);
                    const companyId = decodedToken?.company_id;
                    const employeeData = {
                        company_id: companyId,
                        employee_name,
                        employee_generated_id,
                        date_of_joining,
                        probation_period,
                        probation_due_date,
                        work_location,
                        level,
                        grade,
                        cost_center,
                        employee_official_email,
                        employee_personal_email,
                        dob_adhaar,
                        dob_celebrated,
                        employee_gender_id,
                        employee_password,
                        role_id,
                        master_policy_id,
                        phone,
                    };
                    const employee = await models_1.User.create(employeeData, { transaction: t });
                    // const employeeAddressData = {
                    //     employee_present_address,
                    //     employee_present_pincode,
                    //     employee_present_city,
                    //     employee_present_state,
                    //     employee_present_country_id,
                    //     employee_present_mobile,
                    //     employee_permanent_address,
                    //     employee_permanent_pincode,
                    //     employee_permanent_city,
                    //     employee_permanent_state,
                    //     employee_permanent_country_id,
                    //     employee_permanent_mobile,
                    //     user_id: employee.id
                    // }
                    // const employeeAddress = await EmployeeAddress.create(employeeAddressData, {transaction: t})
                    if (units.length > 0) {
                        await Promise.all(units.map(async (unitId) => {
                            if (typeof unitId !== 'number') {
                                throw new Error('Invalid statusId in regularisation_status array');
                            }
                            const Unit = await divisionUnits_1.default.findByPk(unitId);
                            const divisionId = Unit?.division_id;
                            await userDivision_1.default.create({
                                user_id: employee.id,
                                unit_id: unitId,
                                division_id: divisionId
                            }, { transaction: t });
                        }));
                    }
                    if (reporting_managers) {
                        await Promise.all(reporting_managers.map(async (reportingManagerId) => {
                            if (typeof reportingManagerId !== 'number') {
                                throw new Error('Invalid Reporting Manager id in regularisation_status array');
                            }
                            const reportingManager = await reportingManagers_1.default.findByPk(reportingManagerId);
                            if (reportingManager) {
                                await reportingManagerEmployeeAssociation_1.default.create({
                                    user_id: employee.id,
                                    reporting_role_id: reportingManager.reporting_role_id,
                                    reporting_manager_id: reportingManager.id
                                }, { transaction: t });
                            }
                        }));
                    }
                    const masterPolicy = await masterPolicy_1.default.findByPk(master_policy_id, {
                        include: [
                            {
                                model: leaveTypePolicy_1.default,
                                as: 'LeaveTypePolicies',
                                attributes: ['id', 'leave_policy_name', 'description'],
                                include: [{ model: models_1.LeaveType, attributes: ['id', 'leave_type_name'] }],
                                through: {
                                    attributes: []
                                }
                            }
                        ]
                    });
                    if (masterPolicy && masterPolicy.LeaveTypePolicies.length > 0) {
                        const leaveTypePolicies = masterPolicy?.LeaveTypePolicies;
                        for (const policy of leaveTypePolicies) {
                            const leaveTypePolicy = await leaveTypePolicy_1.default.findByPk(policy?.id);
                            const leaveType = await models_1.LeaveType?.findByPk(policy?.leave_type?.id);
                            await models_1.LeaveBalance.create({
                                user_id: employee?.id,
                                leave_type_id: policy.leave_type.id,
                                leave_balance: 0,
                                total_leaves: leaveTypePolicy?.annual_eligibility
                            }, { transaction: t });
                        }
                    }
                    return { employee, employee_password };
                }
            });
            const credentialData = {
                email: employee_official_email,
                subject: "Login Credentials for HRMS",
                html: EmailTemplate_1.EmailTemplate.replace("{{ email }}", employee_official_email).replace("{{ password }}", transaction?.employee_password)
            };
            await mail_1.MailSenderService.sendToEmail(employee_official_email, credentialData);
            const data = {
                employee: transaction?.employee,
                // employeeAddress: transaction?.employeeAddress
            };
            const response = (0, response_1.generateResponse)(201, true, "Employee Created Succesfully", data);
            res.status(201).json(response);
        }
        catch (err) {
            res.status(500).json(err);
            console.log(err);
            // next(internalServerError("Something Went Wrong!"))
        }
    };
    const update = async (req, res, next) => {
        try {
            const employee_id = req.params.id;
            const { id } = req.credentials;
            const employeeBeforeChange = await models_1.User.findByPk(employee_id);
            const employee = await models_1.User.findByPk(employee_id, {
                include: {
                    model: models_1.Roles,
                    as: 'role',
                    attributes: { exclude: ['employee_password'] }
                },
            });
            const existingEmployeeId = await models_1.User.findOne({
                where: {
                    employee_generated_id: req.body.employee_generated_id,
                    id: {
                        [sequelize_1.Op.not]: employee_id
                    }
                }
            });
            if (req.body.phone) {
                const existingPhone = await models_1.User.findOne({
                    where: {
                        phone: req.body.phone,
                        id: {
                            [sequelize_1.Op.not]: employee_id
                        }
                    }
                });
                if (existingPhone) {
                    return next((0, BadRequest_1.badRequest)("An employee with that phone number already exists!"));
                }
            }
            const existingEmail = await models_1.User.findOne({
                where: {
                    employee_official_email: req.body.employee_official_email,
                    id: {
                        [sequelize_1.Op.not]: employee_id
                    }
                }
            });
            if (existingEmail) {
                return next((0, BadRequest_1.badRequest)("An employee with that email ID already exists!"));
            }
            if (existingEmployeeId) {
                return next((0, BadRequest_1.badRequest)("An employee with that emplpyee ID already exists!"));
            }
            if (req.body.role_id && employee.id == id && employee.role_id !== req.body.role_id) {
                return next((0, BadRequest_1.badRequest)("Cannot change your own role!"));
            }
            await db_1.sequelize.transaction(async (t) => {
                if (!employee) {
                    return next((0, NotFound_1.notFound)("There is no Employee with that id"));
                }
                else {
                    const { master_policy_id, role_id, employee_generated_id, date_of_joining, probation_due_date, probation_period, work_location, level, grade, cost_center, employee_official_email, status, phone, units, reporting_managers, dob_adhaar, dob_celebrated, employee_gender_id, employee_name } = req.body;
                    const formData = {
                        master_policy_id,
                        role_id,
                        employee_generated_id
                    };
                    if (master_policy_id) {
                        employee.master_policy_id = master_policy_id;
                    }
                    if (role_id) {
                        employee.role_id = role_id;
                    }
                    if (employee_name) {
                        employee.employee_name = employee_name;
                    }
                    if (employee_gender_id) {
                        employee.employee_gender_id = employee_gender_id;
                    }
                    if (employee_generated_id && employee_generated_id.trim() !== '') {
                        employee.employee_generated_id = employee_generated_id;
                    }
                    if (date_of_joining && date_of_joining.trim() !== '') {
                        employee.date_of_joining = date_of_joining;
                    }
                    if (probation_due_date && probation_due_date.trim() !== '') {
                        employee.probation_due_date = probation_due_date;
                    }
                    if (probation_period && probation_period.trim() !== '') {
                        employee.probation_period = probation_period;
                    }
                    if (work_location && work_location.trim() !== '') {
                        employee.work_location = work_location;
                    }
                    if (level && level.trim() !== '') {
                        employee.level = level;
                    }
                    if (grade && grade.trim() !== '') {
                        employee.grade = grade;
                    }
                    if (cost_center && cost_center.trim() !== '') {
                        employee.cost_center = cost_center;
                    }
                    if (employee_official_email && employee_official_email.trim() !== '') {
                        employee.employee_official_email = employee_official_email;
                    }
                    if (dob_celebrated && dob_celebrated.trim() !== '') {
                        employee.dob_celebrated = dob_celebrated;
                    }
                    if (dob_adhaar && dob_adhaar.trim() !== '') {
                        employee.dob_adhaar = dob_adhaar;
                    }
                    if (status) {
                        employee.status = status;
                    }
                    if (phone) {
                        employee.phone = phone;
                    }
                    await userDivision_1.default.destroy({
                        where: {
                            user_id: employee_id
                        },
                        transaction: t
                    });
                    if (units.length > 0) {
                        await Promise.all(units.map(async (unitId) => {
                            const unit = await divisionUnits_1.default.findByPk(unitId);
                            // const association = await UserDivision.findOne({
                            //     where:{
                            //         user_id: employee_id,
                            //         division_id: unit?.division_id
                            //     }
                            // })
                            // console.log(">>>>>>>ASSOCIATION", association)
                            // if(association){
                            //     await association.destroy({transaction: t})
                            // }
                            await userDivision_1.default.create({
                                user_id: employee_id,
                                unit_id: unitId,
                                division_id: unit?.division_id
                            }, { transaction: t });
                        }));
                    }
                    await reportingManagerEmployeeAssociation_1.default.destroy({
                        where: {
                            user_id: employee?.id
                        },
                        transaction: t
                    });
                    if (reporting_managers?.length > 0) {
                        await Promise.all(reporting_managers.map(async (reportingManagerId) => {
                            if (typeof reportingManagerId !== 'number') {
                                throw new Error('Invalid Reporting Manager id in reporting manager array');
                            }
                            const reportingManager = await reportingManagers_1.default.findByPk(reportingManagerId);
                            // const association = await ReportingManagerEmployeeAssociation.findOne({
                            //     where: {
                            //         user_id: employee.id,
                            //         reporting_role_id: reportingManager?.reporting_role_id
                            //     }
                            // })
                            // console.log(association)
                            // if(association){
                            //     association.destroy({transaction: t})
                            // }
                            if (reportingManager) {
                                await reportingManagerEmployeeAssociation_1.default.create({
                                    user_id: employee.id,
                                    reporting_role_id: reportingManager.reporting_role_id,
                                    reporting_manager_id: reportingManager.id
                                }, { transaction: t });
                            }
                        }));
                    }
                    if (master_policy_id !== employeeBeforeChange?.master_policy_id) {
                        await models_1.LeaveBalance.destroy({
                            where: {
                                user_id: employee?.id
                            },
                            transaction: t
                        });
                        const masterPolicy = await masterPolicy_1.default.findByPk(master_policy_id, {
                            include: [
                                {
                                    model: leaveTypePolicy_1.default,
                                    as: 'LeaveTypePolicies',
                                    attributes: ['id', 'leave_policy_name', 'description'],
                                    include: [
                                        { model: models_1.LeaveType, attributes: ['id', 'leave_type_name'] }
                                    ],
                                    through: {
                                        attributes: []
                                    }
                                }
                            ]
                        });
                        if (masterPolicy) {
                            const leaveTypePolicies = masterPolicy?.LeaveTypePolicies;
                            console.log(">>>>>>>>>>>>>>>", leaveTypePolicies);
                            if (leaveTypePolicies.length > 0) {
                                for (const policy of leaveTypePolicies) {
                                    const leaveTypePolicy = await leaveTypePolicy_1.default.findByPk(policy?.id);
                                    const leaveType = await models_1.LeaveType?.findByPk(policy?.leave_type?.id);
                                    await models_1.LeaveBalance.create({
                                        user_id: employee?.id,
                                        leave_type_id: policy.leave_type.id,
                                        leave_balance: 0,
                                        total_leaves: leaveTypePolicy?.annual_eligibility
                                    }, { transaction: t });
                                }
                            }
                        }
                    }
                    await employee.save({ transaction: t });
                    const response = (0, response_1.generateResponse)(200, true, "Data Updated succesfully!");
                    res.status(200).json(response);
                }
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // return next(internalServerError("Something went wrong!"))
        }
    };
    const updateProfile = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const employee = await models_1.User.findByPk(id, {
                include: [
                    {
                        model: gender_1.default,
                        attributes: ['id', 'name']
                    }
                ]
            });
            if (employee) {
                await db_1.sequelize.transaction(async (t) => {
                    const { employee_name, employee_personal_email, dob_adhaar, dob_celebrated, employee_gender_id, blood_group, nationality, mother_tongue, alternate_email, alternate_contact, religion, bank_name, bank_branch, account_number, ifsc_code, payroll_details, account_holder_name, pan_number, adhaar_number, phone, } = req.body;
                    const formData = {};
                    const previous = {
                        employee_name: employee.employee_name,
                        employee_personal_email: employee.employee_personal_email,
                        dob_adhaar: employee.dob_adhaar,
                        dob_celebrated: employee.dob_celebrated,
                        employee_gender_id: employee.gender,
                        blood_group: employee.blood_group,
                        nationality: employee.nationality,
                        mother_tongue: employee.mother_tongue,
                        alternate_email: employee.alternate_email,
                        alternate_contact: employee.alternate_contact,
                        religion: employee.religion,
                        bank_name: employee.bank_name,
                        bank_branch: employee.bank_branch,
                        account_number: employee.account_number,
                        ifsc_code: employee.ifsc_code,
                        payroll_details: employee.payroll_details,
                        account_holder_name: employee.account_holder_name,
                        pan_number: employee.pan_number,
                        adhaar_number: employee.adhaar_number,
                        phone: employee.phone,
                    };
                    if (employee_name && employee_name.trim() !== '') {
                        formData.employee_name = employee_name;
                    }
                    if (employee_personal_email && employee_personal_email.trim() !== '') {
                        formData.employee_personal_email = employee_personal_email;
                    }
                    if (dob_adhaar && dob_adhaar.trim() !== '') {
                        formData.dob_adhaar = dob_adhaar;
                    }
                    if (dob_celebrated && dob_celebrated.trim() !== '') {
                        formData.dob_celebrated = dob_celebrated;
                    }
                    if (employee_gender_id) {
                        formData.employee_gender_id = employee_gender_id;
                    }
                    // if(blood_group.trim() !== ''){
                    formData.blood_group = blood_group;
                    // }
                    formData.nationality = nationality;
                    if (mother_tongue && mother_tongue.trim() !== '') {
                        formData.mother_tongue = mother_tongue;
                    }
                    if (alternate_email && alternate_email.trim() !== '') {
                        formData.alternate_email = alternate_email;
                    }
                    if (alternate_contact && alternate_contact.trim() !== '') {
                        formData.alternate_contact = alternate_contact;
                    }
                    // if(religion.trim() !== ''){
                    formData.religion = religion;
                    // }
                    if (bank_name && bank_name.trim() !== '') {
                        formData.bank_name = bank_name;
                    }
                    if (bank_branch && bank_branch.trim() !== '') {
                        formData.bank_branch = bank_branch;
                    }
                    if (account_number && account_number.trim() !== '') {
                        formData.account_number = account_number;
                    }
                    if (ifsc_code && ifsc_code.trim() !== '') {
                        formData.ifsc_code = ifsc_code;
                    }
                    if (payroll_details && payroll_details.trim() !== '') {
                        formData.payroll_details = payroll_details;
                    }
                    if (account_holder_name && account_holder_name.trim() !== '') {
                        formData.account_holder_name = account_holder_name;
                    }
                    if (pan_number && pan_number.trim() !== '') {
                        formData.pan_number = pan_number;
                    }
                    if (adhaar_number && adhaar_number.trim() !== '') {
                        formData.adhaar_number = adhaar_number;
                    }
                    if (phone && phone.trim() !== '') {
                        formData.phone = phone;
                    }
                    // await employee.save({transaction: t})
                    if (req.body.employee_gender_id) {
                        const gender = await gender_1.default.findByPk(req.body.employee_gender_id, { attributes: ['id', 'name'] });
                        req.body.employee_gender_id = gender;
                    }
                    const filterObject = (originalObject, filterObject) => {
                        const filteredObject = {};
                        Object.keys(originalObject).forEach((key) => {
                            if (filterObject.hasOwnProperty(key)) {
                                filteredObject[key] = originalObject[key];
                            }
                        });
                        return filteredObject;
                    };
                    const previousValues = filterObject(previous, req.body);
                    const profileChangeRecord = await profileChangeRecord_1.default.create({
                        user_id: id,
                        section: req.body.section,
                        previous: previousValues,
                        change: JSON.stringify(req.body)
                    }, { transaction: t });
                    console.log("PROFILE CHANGEEE RECORRDDDD", profileChangeRecord);
                    const user = await models_1.User.findByPk(id, {
                        include: [{ model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] }, { model: reportingRole_1.default }] }],
                        attributes: ['id', 'employee_name']
                    });
                    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                    const profileChangeWorkflow = masterPolicy.profile_change_workflow;
                    const approvalWorkflow = await approvalFlow_1.default.findByPk(profileChangeWorkflow, {
                        include: [
                            {
                                model: reportingRole_1.default,
                                as: 'direct',
                                through: { attributes: [] },
                                include: [
                                    {
                                        model: reportingManagers_1.default
                                    }
                                ]
                            },
                            {
                                model: approvalFlowType_1.default,
                            }
                        ]
                    });
                    if (user?.Manager && user?.Manager.length > 0) {
                        if (approvalWorkflow?.approval_flow_type?.id === 2) { //Sequential Approval Flow
                            const reportingManagers = user?.Manager;
                            console.log("MANAGERRRSSSS", reportingManagers);
                            const sortedManagers = approvalWorkflow?.direct.sort((a, b) => b.priority - a.priority);
                            const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
                            const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);
                            console.log("MIN PRIORITY MANAGERSSS", minPriorityManagers);
                            for (const manager of minPriorityManagers) {
                                console.log("HATKEEE", manager?.reporting_managers);
                                await Promise.all(manager?.reporting_managers?.map(async (item) => {
                                    console.log("ITEEEEMMM", item);
                                    try {
                                        if (reportingManagers.some(manager => manager.id === item.id)) {
                                            const profileChangeRequest = await profileChangeRequests_1.default.create({
                                                profile_change_record_id: profileChangeRecord?.id,
                                                reporting_manager_id: item.id,
                                                status: 1,
                                                priority: manager.priority
                                            }, { transaction: t });
                                            const notificationData = {
                                                user_id: item.user_id,
                                                title: 'Profile Change Request',
                                                type: 'profile_change_creation',
                                                description: `${user?.employee_name} has applied for a profile details change request`,
                                            };
                                            const notification = await notification_1.default.create(notificationData, { transaction: t });
                                            await (0, sendNotification_1.sendNotification)(manager.id, notification);
                                            let data = {
                                                user_id: item.user_id,
                                                type: 'Profile Change Request',
                                                message: `${user?.employee_name} has applied for a profile details change request`,
                                                path: 'profile_change_creation',
                                                reference_id: profileChangeRequest?.id
                                            };
                                            console.log("HERE IS THE NOTFICATION PART!!!!");
                                            await (0, notificationService_1.sendPushNotification)(data);
                                        }
                                    }
                                    catch (err) {
                                        console.log(err);
                                    }
                                }));
                            }
                        }
                        else if (approvalWorkflow?.approval_flow_type?.id === 1) { //Parallel Approval Flow
                            const reportingManagers = user?.Manager;
                            const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id));
                            console.log("POLICYYY", approvalWorkflow);
                            console.log("FILTERED MANAGERSSSS", filteredManagers);
                            await Promise.all(filteredManagers.map(async (item) => {
                                if (reportingManagers.some(manager => manager.id === item.id)) {
                                    const profileChangeRequest = await profileChangeRequests_1.default.create({
                                        profile_change_record_id: profileChangeRecord?.id,
                                        reporting_manager_id: item.id,
                                        status: 1,
                                        priority: 1
                                    }, { transaction: t });
                                    const notificationData = {
                                        user_id: item.user_id,
                                        title: 'Profile Change Request',
                                        type: 'profile_change_creation',
                                        description: `${user?.employee_name} has applied for a profile details change request`,
                                    };
                                    const notification = await notification_1.default.create(notificationData, { transaction: t });
                                    await (0, sendNotification_1.sendNotification)(item.user_id, notification);
                                    let data = {
                                        user_id: item.user_id,
                                        type: 'Profile Change Request',
                                        message: `${user?.employee_name} has applied for a profile details change request`,
                                        path: 'profile_change_creation',
                                        reference_id: profileChangeRequest?.id
                                    };
                                    console.log("HERE IS THE NOTFICATION PART!!!!");
                                    await (0, notificationService_1.sendPushNotification)(data);
                                }
                            }));
                        }
                        const response = (0, response_1.generateResponse)(200, true, "Profile Change Request created succesfully!");
                        res.status(200).json(response);
                    }
                    else {
                        const user = await models_1.User.findByPk(id);
                        if (user) {
                            console.log(formData);
                            await user.update(formData, { transaction: t });
                            const response = (0, response_1.generateResponse)(200, true, "Profile updated succesfully!");
                            res.status(200).json(response);
                        }
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    const dropdown = async (req, res, next, options) => {
        try {
            const findOptions = options || {};
            findOptions.searchBy = options?.searchBy;
            findOptions.included = options?.included;
            findOptions.order = options?.sortBy?.map((field) => [field, 'DESC']);
            const { role_id } = req.query;
            if (role_id) {
                const roleExists = await models_1.Roles.findByPk(role_id);
                if (roleExists) {
                    findOptions.where = {
                        ...options?.where,
                        role_id: roleExists.id
                    };
                }
                else {
                    next((0, BadRequest_1.badRequest)("There is no role with that name"));
                }
            }
            else {
                findOptions.where = {
                    ...options?.where
                };
            }
            if (options?.searchBy && options.searchBy.length > 0 && (role_id || req.query.searchTerm)) {
                const searchConditions = options.searchBy.map((field) => ({
                    [field]: { [sequelize_1.Op.startsWith]: req.query?.searchTerm || '' },
                }));
                findOptions.where = {
                    ...options.where,
                    ...findOptions.where,
                    [sequelize_1.Op.or]: searchConditions
                };
            }
            if (options?.included) {
                findOptions.include = options.included.map((relation) => {
                    const nestedIncluded = options.nestedIncluded?.[relation];
                    const attributes = options.attributes?.[relation];
                    if (nestedIncluded) {
                        return {
                            model: model.sequelize?.model(relation),
                            include: nestedIncluded.map((nestedRelation) => ({
                                model: model.sequelize?.model(nestedRelation),
                            })),
                        };
                    }
                    else if (attributes) {
                        return {
                            model: model.sequelize?.model(relation),
                            attributes: attributes.map((attribute) => {
                                return attribute;
                            })
                        };
                    }
                    else {
                        return {
                            model: model.sequelize?.model(relation)
                        };
                    }
                });
            }
            if (options?.attribute) {
                findOptions.attributes = options.attribute;
            }
            console.log(findOptions);
            const data = await model.findAndCountAll(findOptions);
            const result = {
                data: data.rows,
            };
            if (data) {
                res.status(200).json(result);
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)('Something Went Wrong!'));
        }
    };
    const getProfile = async (req, res, next) => {
        try {
            const { id } = req.params;
            const assignedAsset = await assignedAsset_1.default.findAll({
                where: {
                    user_id: id,
                    deleted_at: null,
                    date_of_return: null
                },
                include: [
                    {
                        model: asset_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: models_1.User,
                        attributes: ['id', 'employee_name', 'employee_generated_id']
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });
            const employee = await models_1.User.findByPk(id, {
                include: [
                    {
                        model: models_1.Company,
                        attributes: ['id', 'company_name']
                    },
                    {
                        model: masterPolicy_1.default,
                        attributes: ['id', 'policy_name']
                    },
                    {
                        model: models_1.Roles,
                        as: 'role',
                        attributes: ['id', 'name', 'alias']
                    },
                    {
                        model: divisionUnits_1.default,
                        include: [{ model: division_1.default }]
                    },
                    {
                        model: gender_1.default,
                        attributes: ['id', 'name']
                    },
                    {
                        model: reportingManagers_1.default,
                        as: 'Managers',
                        include: [
                            { model: models_1.User, attributes: ['id', 'employee_generated_id', 'employee_name'] }
                        ],
                        attributes: ['id', 'user_id', 'reporting_role_id'],
                        through: {
                            attributes: []
                        }
                    },
                    {
                        model: familyMember_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        },
                        include: [
                            {
                                model: relation_1.default,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            }
                        ]
                    },
                    {
                        model: experience_1.default,
                        include: [
                            {
                                model: employment_1.default,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            }
                        ],
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: education_1.default,
                        include: [
                            {
                                model: educationType_1.default,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            }
                        ],
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    // {
                    //     model: Asset,
                    //     where: {
                    //         is_assigned: true
                    //     },
                    //     required: false,
                    //     attributes:{
                    //         exclude: ['createdAt', 'updatedAt']
                    //     },
                    //     through: {
                    //         attributes: []
                    //     }
                    // },
                    {
                        model: profileImages_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                attributes: {
                    exclude: ['employee_password', 'createdAt', 'updatedAt']
                }
            });
            const scope = await (0, PermissionService_1.getUserRoles)(employee?.role_id);
            if (employee) {
                const unit = await userDivision_1.default.findAll({
                    where: {
                        user_id: id
                    },
                });
                let departmentName;
                let designationName;
                const department = await Promise.all(unit.map(async (unit) => {
                    const division_unit = await divisionUnits_1.default.findByPk(unit.unit_id);
                    if (division_unit?.division_id === 2) {
                        departmentName = division_unit?.unit_name;
                    }
                }));
                const designation = await Promise.all(unit.map(async (unit) => {
                    const division_unit = await divisionUnits_1.default.findByPk(unit.unit_id);
                    if (division_unit?.division_id === 1) {
                        designationName = division_unit?.unit_name;
                    }
                }));
                const employeeResponse = employee.toJSON();
                employeeResponse.department = departmentName ? departmentName : null;
                employeeResponse.designation = designationName ? designationName : null;
                employeeResponse.asset = assignedAsset;
                employeeResponse.scope = scope.permissions;
                const response = (0, response_1.generateResponse)(200, true, "Data fetched Succesfully!", employeeResponse);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("No Employee with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    const changeStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const employee = await models_1.User.findByPk(id);
            if (!employee) {
                next((0, BadRequest_1.badRequest)("Employee with that id doesn't exist"));
            }
            employee.status = !employee.status;
            await employee?.save();
            const response = (0, response_1.generateResponse)(200, true, "Status changed succesfully!");
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong"));
        }
    };
    const getPunchDetails = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const employee = await models_1.User.findByPk(id);
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
            const attendancePolicy = await attendancePolicy_1.default.findByPk(masterPolicy.attendance_policy_id);
            const shiftPolicy = await shiftPolicy_1.default.findByPk(masterPolicy.shift_policy_id);
            const todayDate = (0, moment_1.default)().format('YYYY-MM-DD');
            const attendanceRecord = await models_1.Attendance.findOne({
                where: {
                    user_id: id,
                    date: new Date(todayDate)
                }
            });
            let total_working_hours;
            if (shiftPolicy?.shift_type_id == 1) {
                const shift_start_time = shiftPolicy?.shift_start_time;
                const shift_end_time = shiftPolicy?.shift_end_time;
                const shiftStartDateTime = (0, moment_1.default)(shift_start_time, 'HH:mm:ss');
                const shiftEndDateTime = (0, moment_1.default)(shift_end_time, 'HH:mm:ss');
                const workingHours = moment_1.default.duration(shiftEndDateTime.diff(shiftStartDateTime));
                const totalHours = workingHours.hours() + workingHours.minutes() / 60;
                total_working_hours = totalHours;
            }
            else {
                const totalWorkingHours = shiftPolicy?.base_working_hours / 60;
                total_working_hours = totalWorkingHours;
            }
            const lastPunchRecord = await models_1.Attendance.findOne({
                where: {
                    user_id: id,
                    punch_out_time: {
                        [sequelize_1.Op.ne]: null,
                    },
                },
                order: [['id', 'DESC']],
                limit: 1
            });
            const punch_location = await punchLocation_1.default.findOne({
                where: {
                    attendance_log_id: lastPunchRecord?.id
                },
                order: [["punch_time", "DESC"]]
            });
            const responseBody = {
                punch_in_time: attendanceRecord?.punch_in_time ? attendanceRecord?.punch_in_time : null,
                last_punch_out: lastPunchRecord?.punch_out_time && lastPunchRecord?.date ? ` ${lastPunchRecord?.date} ${lastPunchRecord?.punch_out_time}` : null,
                total_working_hours: total_working_hours,
                punch_location: punch_location ? punch_location : null
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", responseBody);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getLeaveRequests = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { status } = req.query;
            const { page, records, leave_type, day_type, sortBy, sortOrder, month, year } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const startOfMonth = (0, moment_1.default)(`${year}-${month}-01`).startOf('month');
            const endOfMonth = (0, moment_1.default)(startOfMonth).endOf('month');
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const whereClause = {
                user_id: id
            };
            if (status) {
                whereClause.status = status;
            }
            if (leave_type) {
                whereClause.leave_type_id = leave_type;
            }
            if (day_type) {
                whereClause.day_type_id = day_type;
            }
            let orderOptions = [];
            if (sortBy && sortOrder) {
                orderOptions.push([sortBy, sortOrder]);
            }
            if (month && year) {
                whereClause[sequelize_1.Op.or] = [
                    {
                        start_date: {
                            [sequelize_1.Op.gte]: startOfMonth,
                            [sequelize_1.Op.lte]: endOfMonth
                        }
                    }
                ];
            }
            const leaveRecord = await models_1.LeaveRecord.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: models_1.LeaveType,
                        attributes: ['id', 'leave_type_name']
                    },
                    {
                        model: dayType_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: approval_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                offset: offset,
                limit: recordsPerPage,
                order: orderOptions
            });
            const totalPages = Math.ceil(leaveRecord.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: leaveRecord.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const result = {
                data: leaveRecord.rows,
                meta
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", result.data, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getRegularizationRequests = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const status = req.query.status;
            const where = {
                user_id: id
            };
            if (status) {
                where.status = status;
            }
            const regularizationRequests = await regularizationRecord_1.default.findAll({
                where: where,
                include: [
                    {
                        model: regularisationStatus_1.default,
                    },
                    {
                        model: regularizationRequestStatus_1.default
                    }
                ]
            });
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", regularizationRequests);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const approveProfileChangeRequest = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.credentials;
                const requestId = req.params.id;
                const manager = await reportingManagers_1.default.findAll({
                    where: {
                        user_id: id
                    }
                });
                const user = await models_1.User.findByPk(id);
                const managerUser = await models_1.User.findByPk(manager?.user_id);
                const managerIds = manager.map((item) => item.reporting_role_id);
                const profileChangeRequest = await profileChangeRequests_1.default.findByPk(requestId);
                const profileChangeRecord = await profileChangeRecord_1.default.findByPk(profileChangeRequest?.profile_change_record_id);
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(profileChangeRecord?.user_id);
                const profileChangeWorkflow = masterPolicy.profile_change_workflow;
                const approvalWorkflow = await approvalFlow_1.default.findByPk(profileChangeWorkflow, {
                    include: [
                        {
                            model: reportingRole_1.default,
                            as: 'direct',
                            through: { attributes: [] },
                            include: [{
                                    model: reportingManagers_1.default,
                                }]
                        },
                        {
                            model: approvalFlowType_1.default,
                        }
                    ]
                });
                const reportingRoleIds = approvalWorkflow?.direct.map(item => item.id);
                const isManager = managerIds.some(id => reportingRoleIds.includes(id));
                if (user && manager && (isManager) && profileChangeRecord) {
                    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(profileChangeRecord?.user_id);
                    const profileChangeWorkflow = masterPolicy.profile_change_workflow;
                    const approvalWorkflow = await approvalFlow_1.default.findByPk(profileChangeWorkflow);
                    if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1) { //Parallel Approval Workflow
                        const profileChangeRequest = await profileChangeRequests_1.default.findAll({
                            where: {
                                profile_change_record_id: profileChangeRecord?.id,
                            }
                        });
                        await Promise.all(profileChangeRequest.map(async (request) => {
                            const profileChangeRecord = await profileChangeRecord_1.default.findByPk(request.profile_change_record_id);
                            // request.status = regularizationRecord?.request_status
                            request.status = 2;
                            await request.save({ transaction: t });
                        }));
                        if (profileChangeRecord) {
                            await profileChangeRecord.update({
                                status: 2
                            }, { transaction: t });
                            const changeValues = profileChangeRecord.change;
                            console.log(">>>>>>>>>>>>", changeValues);
                            Object.keys(changeValues).map((key) => {
                                if (key === 'section') {
                                    delete changeValues[key];
                                }
                                if (key === 'employee_gender_id') {
                                    changeValues[key] = changeValues[key].id;
                                }
                            });
                            const user = await models_1.User.findByPk(profileChangeRecord?.user_id);
                            await user?.update(changeValues, { transaction: t });
                            const approvalManager = await models_1.User.findByPk(id);
                            const notification = await notification_1.default.create({
                                user_id: profileChangeRecord?.user_id,
                                title: 'Profile Change',
                                type: 'profile_change_approval',
                                description: `${approvalManager?.employee_name} has succesfully approved your profile change request`
                            }, { transaction: t });
                            await (0, sendNotification_1.sendNotification)(user?.id, notification);
                            let data = {
                                user_id: profileChangeRecord?.user_id,
                                type: 'profile_change_approval',
                                message: `${approvalManager?.employee_name} has succesfully approved your profile change request`,
                                path: 'profile_change_approval',
                                reference_id: profileChangeRecord?.id
                            };
                            console.log("HERE IS THE NOTFICATION PART!!!!");
                            await (0, notificationService_1.sendPushNotification)(data);
                            const response = (0, response_1.generateResponse)(200, true, "Request approved succesfully!");
                            res.status(200).json(response);
                        }
                    }
                    else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2) {
                        const profileChangeRequests = await profileChangeRequests_1.default.findAll({
                            where: {
                                profile_change_record_id: profileChangeRecord?.id
                            }
                        });
                        const user = await models_1.User.findByPk(profileChangeRecord?.user_id, {
                            include: [{ model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] }, { model: reportingRole_1.default }] }],
                            attributes: ['id', 'employee_generated_id']
                        });
                        const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                        const profileChangeWorkflow = masterPolicy.profile_change_workflow;
                        const approvalWorkflow = await approvalFlow_1.default.findByPk(profileChangeWorkflow, {
                            include: [
                                {
                                    model: reportingRole_1.default,
                                    as: 'direct',
                                    through: { attributes: [] },
                                    include: [{
                                            model: reportingManagers_1.default,
                                        }]
                                },
                                {
                                    model: approvalFlowType_1.default,
                                }
                            ]
                        });
                        const reportingManager = user?.Manager;
                        console.log("ahdlahsdhasld", approvalWorkflow?.direct);
                        const filteredManagers = reportingManager.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id));
                        console.log("REPORTING MANAGERS >>>>>", reportingManager);
                        console.log("FILTERED MANAGERSSS", filteredManagers);
                        // const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
                        // const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority)
                        const existingRequests = await profileChangeRequests_1.default.findAll({
                            where: {
                                profile_change_record_id: profileChangeRecord?.id,
                            }
                        });
                        if (existingRequests.length > 0) {
                            const approvedManagerIds = existingRequests.map(request => request.reporting_manager_id);
                            const remainingManagers = filteredManagers.filter(manager => !approvedManagerIds.includes(manager.id));
                            console.log("REMAINING MANAGERSSSSS", remainingManagers);
                            console.log("APPROVEDMANAGERIDSSS", approvedManagerIds);
                            if (remainingManagers.length > 0) {
                                const minPriority = Math.max(...remainingManagers.map(manager => manager.reporting_role.priority));
                                const minPriorityManagers = remainingManagers.filter(manager => manager.reporting_role.priority === minPriority);
                                console.log("MIN PRIORITYYYYY", minPriority);
                                console.log("MIN PRIORITY MANAGERSSSSS", minPriorityManagers);
                                for (const manager of minPriorityManagers) {
                                    await profileChangeRequests_1.default.create({
                                        profile_change_record_id: profileChangeRecord?.id,
                                        reporting_manager_id: manager.id,
                                        status: 1,
                                        priority: manager.reporting_role.priority
                                    }, { transaction: t });
                                }
                            }
                            else {
                                await profileChangeRecord.update({
                                    status: 2
                                }, {
                                    where: {
                                        id: profileChangeRecord?.id
                                    }
                                });
                                await profileChangeRecord.update({
                                    status: 2
                                }, { transaction: t });
                                const changeValues = profileChangeRecord.change;
                                Object.keys(changeValues).map((key) => {
                                    if (key === 'section') {
                                        delete changeValues[key];
                                    }
                                    if (key === 'employee_gender_id') {
                                        changeValues[key] = changeValues[key].id;
                                    }
                                });
                                const user = await models_1.User.findByPk(profileChangeRecord?.user_id);
                                await user?.update(changeValues, { transaction: t });
                                const approvalManager = await models_1.User.findByPk(id);
                                const notification = await notification_1.default.create({
                                    user_id: profileChangeRecord?.user_id,
                                    title: 'Profile Change Request',
                                    type: 'profile_change_creation',
                                    description: `${approvalManager?.employee_name} has approved your profile Change Request`
                                }, { transaction: t });
                                await (0, sendNotification_1.sendNotification)(profileChangeRecord?.user_id, notification);
                                let data = {
                                    user_id: profileChangeRecord?.user_id,
                                    type: 'profile_change_approval',
                                    message: `${approvalManager?.employee_name} has succesfully approved your profile change request`,
                                    path: 'profile_change_approval',
                                    reference_id: profileChangeRecord?.id
                                };
                                console.log("HERE IS THE NOTFICATION PART!!!!");
                                await (0, notificationService_1.sendPushNotification)(data);
                            }
                            await Promise.all(existingRequests.map(async (request) => {
                                await request.update({
                                    status: 2
                                }, { transaction: t });
                            }));
                            const response = (0, response_1.generateResponse)(200, true, "Regularization Approved succesfully", profileChangeRequests);
                            res.status(200).json(response);
                        }
                    }
                }
                else {
                    next((0, BadRequest_1.badRequest)("You're not the authorized user to approve the leave!"));
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const rejectProfileChangeRequest = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.credentials;
                const requestId = req.params.id;
                const manager = await reportingManagers_1.default.findOne({
                    where: {
                        user_id: id
                    }
                });
                const managerUser = await models_1.User.findByPk(manager?.user_id);
                const user = await models_1.User.findByPk(id);
                const profileChangeRequest = await profileChangeRequests_1.default.findByPk(requestId);
                const profileChangeRecord = await profileChangeRecord_1.default.findByPk(profileChangeRequest?.profile_change_record_id);
                if (user && manager && (profileChangeRequest?.reporting_manager_id === manager.id) && profileChangeRecord) {
                    await profileChangeRequest?.update({
                        status: 3,
                    }, { transaction: t });
                    await profileChangeRecord.update({
                        status: 3
                    }, { transaction: t });
                    const user = await models_1.User.findByPk(profileChangeRecord?.user_id);
                    const notification = await notification_1.default.create({
                        user_id: profileChangeRecord?.user_id,
                        title: 'Profile Change',
                        type: 'profile_change_rejection',
                        description: `${managerUser?.employee_name} has rejected your profile change request`
                    }, { transaction: t });
                    await (0, sendNotification_1.sendNotification)(user?.id, notification);
                    let data = {
                        user_id: profileChangeRecord?.user_id,
                        type: 'profile_change_rejection',
                        message: `${managerUser?.employee_name} has rejected your profile change request`,
                        path: 'profile_change_rejection',
                        reference_id: profileChangeRecord?.id
                    };
                    await (0, notificationService_1.sendPushNotification)(data);
                    const response = (0, response_1.generateResponse)(200, true, "Request rejected succesfully!");
                    res.status(200).json(response);
                }
                else {
                    next((0, BadRequest_1.badRequest)("You're not the authorized user to approve the leave!"));
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getProfileChangeRequests = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { page, records } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const user = await models_1.User.findByPk(id);
            const profileChangeRecord = await profileChangeRecord_1.default.findAndCountAll({
                where: {
                    user_id: id,
                },
                include: [
                    {
                        model: approval_1.default,
                        attributes: ['id', 'name']
                    }
                ],
                offset: offset,
                limit: recordsPerPage
            });
            const totalPages = Math.ceil(profileChangeRecord.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: profileChangeRecord.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const result = {
                data: profileChangeRecord.rows,
                meta
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully", result.data, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const creditLeaves = async (req, res, next) => {
        try {
            const employeeId = req.params.user_id;
            const leave_type_id = req.params.leave_type_id;
            const user = await models_1.User.findByPk(employeeId);
            const leaveType = await models_1.LeaveType.findByPk(leave_type_id);
            const { leave_balance } = req.body;
            if (user) {
                await db_1.sequelize.transaction(async (t) => {
                    for (const leaveTypeId of Object.keys(leave_balance)) {
                        const leaveBalance = await models_1.LeaveBalance.findOne({
                            where: {
                                user_id: user.id,
                                leave_type_id: parseInt(leaveTypeId)
                            }
                        });
                        await leaveBalance?.update({
                            leave_balance: leave_balance[leaveTypeId]
                        }, { transaction: t });
                    }
                });
                const response = (0, response_1.generateResponse)(200, true, "Leave balance credited succsfully!");
                res.status(200).json(response);
                // if(leaveType){
                //     const masterPolicy = await getMasterPolicy(employeeId)
                //     const leaveBalance = await LeaveBalance.findOne({
                //         where: {
                //             user_id: employeeId,
                //             leave_type_id: leave_type_id
                //         }
                //     })
                //     if(leaveBalance){
                //         await leaveBalance.update({
                //             leave_balance: leaves
                //         })
                //         const response = generateResponse(200, true, "Leave Balance updated succesfully!", leaveBalance)
                //         res.status(200).json(response)
                //     }else{
                //         const leaveBalance = await LeaveBalance.create({
                //             user_id: employeeId,
                //             leave_type_id: leave_type_id,
                //             leave_balance: leaves
                //         })
                //         const response = generateResponse(200, true, "Leaves credited succesfully!", leaveBalance)
                //         res.status(201).json(response)
                //     }
                // }else{
                //     next(notFound("Cannot find leave type with that id!"))
                // }                
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find employee"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const deleteEmployee = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await models_1.User.findByPk(id);
            if (user) {
                await db_1.sequelize.transaction(async (t) => {
                    const manager = await reportingManagers_1.default.findAll({
                        where: {
                            user_id: id,
                            deleted_at: null
                        }
                    });
                    if (manager.length > 0) {
                        next((0, Forbidden_1.forbiddenError)('You cannot delete this employee, since it is a reporting manager and have several employees reporting to them, replace this employee as a manager and then delete.'));
                    }
                    await user.destroy({ transaction: t });
                    const response = (0, response_1.generateResponse)(200, true, "Employee deleted succesfully!");
                    res.status(200).json(response);
                });
            }
            else {
                next((0, NotFound_1.notFound)('There is no employee with that id!'));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)('Something went wrong!'));
        }
    };
    const bulkUpload = async (req, res, next) => {
        try {
            const form = (0, formidable_1.default)();
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error('Error parsing form:', err);
                    next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
                    return;
                }
                const csvFile = files.file;
                if (!csvFile) {
                    next((0, BadRequest_1.badRequest)('No CSV File uploaded!'));
                }
                let result = [];
                (0, csvtojson_1.default)()
                    .fromFile(csvFile[0].filepath)
                    .then(async (jsonObj) => {
                    for (const row of jsonObj) {
                        const employee_password = (0, RandomPassword_1.generatePassword)();
                        let roleId;
                        let genderId;
                        const { employee_generated_id, employee_name, date_of_joining, date_of_confirmation, dob_celebrated, dob_adhaar, employee_personal_email, employee_official_email, alternate_contact, phone, role_id, master_policy_id, employee_gender_id } = row;
                        if (role_id == 'HR') {
                            roleId = 1;
                        }
                        else if (role_id == 'Supervisor') {
                            roleId = 2;
                        }
                        else if (role_id == 'Employee') {
                            roleId = 3;
                        }
                        if (employee_gender_id == 'Male') {
                            genderId = 1;
                        }
                        else if (employee_gender_id == 'Female') {
                            genderId = 2;
                        }
                        else if (employee_gender_id == 'Others') {
                            genderId = 3;
                        }
                        const responseBody = {
                            employee_generated_id,
                            employee_name,
                            date_of_joining,
                            date_of_confirmation,
                            dob_celebrated,
                            dob_adhaar,
                            employee_personal_email,
                            employee_official_email,
                            alternate_contact,
                            phone,
                            role_id: roleId,
                            employee_password: employee_password,
                            master_policy_id,
                            employee_gender_id: genderId,
                            company_id: user?.company_id,
                        };
                        const ifExists = await models_1.User.findOne({
                            where: {
                                employee_generated_id: employee_generated_id
                            }
                        });
                        if (!ifExists) {
                            result.push(responseBody);
                            const credentialData = {
                                email: employee_official_email,
                                subject: "Login Credentials for HRMS",
                                html: EmailTemplate_1.EmailTemplate.replace("{{ email }}", employee_official_email).replace("{{ password }}", employee_password)
                            };
                            await mail_1.MailSenderService.sendToEmail(employee_official_email, credentialData);
                        }
                    }
                })
                    .then(async () => {
                    await models_1.User.bulkCreate(result);
                    const response = (0, response_1.generateResponse)(200, true, "Employees uploaded succesfully!");
                    res.status(200).json(response);
                });
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const employeeStatistics = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await models_1.User.findByPk(id);
            if (user) {
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                const shiftPolicy = await shiftPolicy_1.default.findByPk(masterPolicy?.shift_policy_id);
                let baseWorkingHours;
                let hoursInAWeek;
                let hoursInAMonth;
                let currentMonth = (0, moment_1.default)().get('months') + 1;
                let overtimeHoursInAMonth;
                const month = (0, moment_1.default)().get('month');
                const year = (0, moment_1.default)().get('year');
                const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
                const endDate = (0, moment_1.default)(startDate).endOf('month').toDate();
                if (shiftPolicy?.shift_type_id == 1) {
                    const shift_start_time = (0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 });
                    const shift_end_time = (0, moment_1.default)(shiftPolicy?.shift_end_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 });
                    baseWorkingHours = moment_1.default.duration(shift_end_time.diff(shift_start_time)).asHours();
                }
                else {
                    baseWorkingHours = shiftPolicy?.base_working_hours;
                }
                const workingDaysInAMonth = await (0, helpers_1.getWorkingDaysInAMonth)(masterPolicy?.weekly_off_policy_id);
                const workingDaysInAWeek = await (0, helpers_1.getTotalWorkingDaysInCurrentWeek)(masterPolicy?.weekly_off_policy_id);
                hoursInAWeek = workingDaysInAWeek * baseWorkingHours;
                hoursInAMonth = workingDaysInAMonth * baseWorkingHours;
                const totalWorkingHoursForAMonth = await (0, helpers_1.getTotalCompletedHoursForMonth)(year, currentMonth, user?.id);
                const totalWorkingHoursForAWeek = await (0, helpers_1.getTotalCompletedHoursForWeek)(year, currentMonth, user?.id);
                const attendanceLogs = await models_1.Attendance.findAll({
                    where: {
                        user_id: id,
                        date: {
                            [sequelize_1.Op.between]: [startDate, endDate]
                        }
                    }
                });
                const todayPunchInTime = await models_1.Attendance.findOne({
                    where: {
                        date: (0, moment_1.default)().toDate(),
                        user_id: id
                    }
                });
                overtimeHoursInAMonth = await (0, helpers_1.calcualteOvertimeHours)(attendanceLogs, hoursInAMonth);
                const responseBody = {
                    month: {
                        total_working_hours: hoursInAMonth.toFixed(2),
                        hours_worked: totalWorkingHoursForAMonth.toFixed(2),
                        overtime_hours: overtimeHoursInAMonth.toFixed(2)
                    },
                    week: {
                        total_working_hours: hoursInAWeek.toFixed(2),
                        hours_worked: totalWorkingHoursForAWeek.toFixed(2)
                    },
                    today: {
                        total_working_hours: baseWorkingHours,
                        punch_in_time: todayPunchInTime ? todayPunchInTime.punch_in_time : null
                    }
                };
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succefully!", responseBody);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find an employee with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)('Something went wrong!'));
        }
    };
    const wishEmployeeBirthday = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await models_1.User.findByPk(id, {
                include: [
                    { model: profileImages_1.default }
                ]
            });
            if (user) {
                const allActiveEmployees = await models_1.User.findAll({
                    where: {
                        status: true
                    },
                    attributes: ['id', 'employee_official_email']
                });
                const ccEmail = allActiveEmployees.filter(email => email.employee_official_email !== user.employee_official_email).map(email => email.employee_official_email);
                const image = appUrl + user?.profile_image?.public_url;
                const imageRes = await axios_1.default.get(image, { responseType: 'arraybuffer' });
                const imageData = Buffer.from(imageRes.data).toString('base64');
                const emailData = {
                    email: user?.employee_official_email,
                    subject: `Happy Birthday ${user?.employee_name}`,
                    html: EmailTemplate_1.BirthdayTemplate.replace("{{Username}}", user?.employee_name),
                    // cc: ccEmail,
                    attachments: [
                        {
                            content: imageAttachment,
                            filename: 'image.png',
                            type: 'image/png',
                            disposition: 'inline',
                            content_id: 'birthdayBanner' // same cid value as in the HTML img src
                        },
                        {
                            content: imageData,
                            filename: 'profile.png',
                            type: 'image/png',
                            disposition: 'inline',
                            content_id: 'profileImage'
                        }
                    ]
                };
                const mailRes = mail_1.MailSenderService.sendToEmail(user?.employee_official_email, emailData);
                const response = (0, response_1.generateResponse)(200, true, "Mail sent succesfully!");
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("No employee with that id!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const wishEmployeeAnniversary = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await models_1.User.findByPk(id);
            if (user) {
                const emailData = {
                    email: user?.employee_official_email,
                    subject: `Happy Work Anniversary ${user?.employee_name}`,
                    html: EmailTemplate_1.AnniversaryTemplate.replace("{{Username}}", user?.employee_name),
                    attachment: [{
                            filename: 'image.png',
                            path: 'src/assets/birthday-banner.png',
                            cid: 'birthdayBanner' // same cid value as in the HTML img src
                        }]
                };
                const mailRes = mail_1.MailSenderService.sendToEmail(user?.employee_official_email, emailData);
                const response = (0, response_1.generateResponse)(200, true, "Mail sent succesfully!");
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("No employee with that id found!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return {
        create,
        getAll,
        getById,
        destroy,
        update,
        updateProfile,
        dropdown,
        getAllDropdown,
        getProfile,
        changeStatus,
        getPunchDetails,
        getLeaveRequests,
        getRegularizationRequests,
        approveProfileChangeRequest,
        rejectProfileChangeRequest,
        getProfileChangeRequests,
        creditLeaves,
        deleteEmployee,
        bulkUpload,
        employeeStatistics,
        wishEmployeeBirthday,
        wishEmployeeAnniversary
    };
};
exports.EmployeeController = EmployeeController;
