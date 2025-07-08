"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateForBulkUploadEmployees = void 0;
const InternalServerError_1 = require("../../services/error/InternalServerError");
const masterPolicy_1 = __importDefault(require("../../models/masterPolicy"));
const models_1 = require("../../models");
const gender_1 = __importDefault(require("../../models/dropdown/type/gender"));
const exceljs_1 = require("exceljs");
const templateForBulkUploadEmployees = async (req, res, next) => {
    try {
        const masterPolicy = await masterPolicy_1.default?.findAll();
        const role = await models_1.Roles.findAll();
        const gender = await gender_1.default?.findAll();
        let masterPolicyOptionsName = [];
        let roleOptions = [];
        let genderOptions = [];
        // const masterPolicyOptions = masterPolicy?.map(policy => ({value: policy.id, label: policy.name}));
        //@ts-ignore
        masterPolicy?.map(policy => masterPolicyOptionsName.push(policy?.policy_name));
        //@ts-ignore
        role?.map(role => roleOptions.push(role?.name));
        //@ts-ignore
        gender?.map(gender => genderOptions?.push(gender.name));
        const workbook = new exceljs_1.Workbook();
        const worksheet = workbook.addWorksheet('sheet1');
        const headers = [
            'employee_generated_id',
            'employee_name',
            'date_of_joining',
            'date_of_confirmation',
            'dob_adhaar',
            'dob_celebrated',
            'employee_personal_email',
            'employee_official_email',
            'phone',
            'alternate_contact',
            'role_id',
            'employee_password',
            'master_policy_id',
            'employee_gender_id'
        ];
        worksheet.addRow(headers);
        console.log(genderOptions);
        //@ts-ignore
        worksheet.dataValidations.model['M2:M9999'] = {
            allowBlank: true,
            error: "Please use the dropdown to select a valid value",
            errorTitle: 'Invalid Selection',
            formulae: ['"' + masterPolicyOptionsName.join(',') + '"'],
            showErrorMessage: true,
            type: 'list'
        };
        //@ts-ignore
        worksheet.dataValidations.model['N2:N9999'] = {
            allowBlank: true,
            error: "Please use the dropdown to select a valid value",
            errorTitle: 'Invalid Selection',
            formulae: ['"' + genderOptions.join(',') + '"'],
            showErrorMessage: true,
            type: 'list'
        };
        //@ts-ignore
        worksheet.dataValidations.model['K2:K9999'] = {
            allowBlank: true,
            error: "Please use the dropdown to select a valid value",
            errorTitle: 'Invalid Selection',
            formulae: ['"' + roleOptions.join(',') + '"'],
            showErrorMessage: true,
            type: 'list'
        };
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetm1.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=employee_bulk_upload.xlsx');
        await workbook.xlsx.write(res);
        res.status(200).end();
    }
    catch (err) {
        console.log(err);
        next((0, InternalServerError_1.internalServerError)('Something went wrong!'));
    }
};
exports.templateForBulkUploadEmployees = templateForBulkUploadEmployees;
