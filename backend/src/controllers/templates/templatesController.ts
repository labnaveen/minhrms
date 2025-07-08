import { NextFunction, Response, Request } from "express";
import { internalServerError } from "../../services/error/InternalServerError";
import MasterPolicy from "../../models/masterPolicy";
import { Roles } from "../../models";
import Gender from "../../models/dropdown/type/gender";
import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import { Workbook, Worksheet } from 'exceljs'
import {DataValidation} from 'exceljs'


export const templateForBulkUploadEmployees = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const masterPolicy = await MasterPolicy?.findAll()
        const role = await Roles.findAll() as any
        const gender = await Gender?.findAll()

        let masterPolicyOptionsName: any[] = [];
        let roleOptions: any[] = []
        let genderOptions: any[] = []
        // const masterPolicyOptions = masterPolicy?.map(policy => ({value: policy.id, label: policy.name}));
        //@ts-ignore
        masterPolicy?.map(policy  => masterPolicyOptionsName.push(policy?.policy_name))
        //@ts-ignore
        role?.map(role => roleOptions.push(role?.name))
        //@ts-ignore
        gender?.map(gender => genderOptions?.push(gender.name))

        const workbook = new Workbook();
        const worksheet: Worksheet = workbook.addWorksheet('sheet1');


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

        console.log(genderOptions)

        //@ts-ignore
        worksheet.dataValidations.model['M2:M9999'] = {
            allowBlank: true,
            error: "Please use the dropdown to select a valid value",
            errorTitle: 'Invalid Selection',
            formulae: ['"' + masterPolicyOptionsName.join(',') + '"'],
            showErrorMessage: true,
            type: 'list'
        }

        //@ts-ignore
        worksheet.dataValidations.model['N2:N9999'] = {
            allowBlank: true,
            error: "Please use the dropdown to select a valid value",
            errorTitle: 'Invalid Selection',
            formulae: ['"' + genderOptions.join(',') + '"'],
            showErrorMessage: true,
            type: 'list'
        }
        
        //@ts-ignore
        worksheet.dataValidations.model['K2:K9999'] = {
            allowBlank: true,
            error: "Please use the dropdown to select a valid value",
            errorTitle: 'Invalid Selection',
            formulae: ['"' + roleOptions.join(',') + '"'],
            showErrorMessage: true,
            type: 'list'
        }

        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetm1.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=employee_bulk_upload.xlsx');

        await workbook.xlsx.write(res);        

        res.status(200).end()

    }catch(err){
        console.log(err)
        next(internalServerError('Something went wrong!'))
    }
}