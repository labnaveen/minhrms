import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import bcrypt from 'bcrypt'
import DivisionUnits from "./divisionUnits";


class User extends Model{}

User.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'company', key:'id'}
    },
    employee_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    employee_generated_id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_image_id:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    date_of_joining:{
        type: DataTypes.DATE,
        allowNull: false
    },
    probation_period:{
        type: DataTypes.STRING,
        allowNull: true
    },
    probation_due_date:{
        type: DataTypes.DATE,
        allowNull: true
    },
    work_location:{
        type: DataTypes.STRING,
        allowNull: true
    },
    level:{
        type: DataTypes.STRING,
        allowNull: true
    },
    grade:{
        type: DataTypes.STRING,
        allowNull: true
    },
    cost_center:{
        type: DataTypes.STRING,
        allowNull: true
    },
    employee_official_email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    employee_personal_email:{
        type: DataTypes.STRING,
        allowNull: true
    },
    dob_adhaar:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    dob_celebrated:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    employee_gender_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    blood_group:{
        type: DataTypes.STRING,
        allowNull: true
    },
    nationality:{
        type: DataTypes.STRING,
        allowNull: true
    },
    mother_tongue:{
        type: DataTypes.STRING,
        allowNull: true
    },
    alternate_email:{
        type: DataTypes.STRING,
        allowNull: true
    },
    alternate_contact:{
        type: DataTypes.STRING,
        allowNull: true
    },
    religion:{
        type: DataTypes.STRING,
        allowNull: true
    },
    bank_name:{
        type: DataTypes.STRING,
        allowNull: true
    },
    bank_branch:{
        type: DataTypes.STRING,
        allowNull: true
    },
    account_number:{
        type: DataTypes.STRING,
        allowNull: true
    },
    ifsc_code:{
        type: DataTypes.STRING,
        allowNull: true
    },
    payroll_details:{
        type: DataTypes.STRING,
        allowNull: true
    },
    account_holder_name:{
        type: DataTypes.STRING,
        allowNull: true
    },
    pan_number:{
        type: DataTypes.STRING,
        allowNull: true
    },
    adhaar_number:{
        type: DataTypes.STRING,
        allowNull: true
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    role_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'roles', key: 'id'}
    },
    status:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    employee_password:{
        type: DataTypes.STRING,
        allowNull: false,
        set(val: string) {
            if(val){
                const hash = bcrypt.hashSync(val, 10);
                this.setDataValue('employee_password', hash);
            }
        },
    },
    master_policy_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'master_policy', key: 'id'}
    },
    password_changed:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    reporting_role_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {model: 'reporting_role', key: 'id'}
    },
    reporting_manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {model: 'reporting_managers', key: 'id'}
    }
},{
    sequelize,
    underscored: true,
    timestamps:true,
    modelName: 'user',
    tableName: 'user',
    paranoid: true,
    deletedAt: 'deleted_at'
})


export default User