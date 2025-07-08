"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'company', key: 'id' }
    },
    employee_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    employee_generated_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    profile_image_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    date_of_joining: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    probation_period: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    probation_due_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    work_location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    level: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    grade: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    cost_center: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    employee_official_email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    employee_personal_email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    dob_adhaar: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    dob_celebrated: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true
    },
    employee_gender_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    blood_group: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    nationality: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    mother_tongue: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    alternate_email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    alternate_contact: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    religion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    bank_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    bank_branch: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    account_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    ifsc_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    payroll_details: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    account_holder_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    pan_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    adhaar_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    role_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' }
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    employee_password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        set(val) {
            if (val) {
                const hash = bcrypt_1.default.hashSync(val, 10);
                this.setDataValue('employee_password', hash);
            }
        },
    },
    master_policy_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'master_policy', key: 'id' }
    },
    password_changed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    reporting_role_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'reporting_role', key: 'id' }
    },
    reporting_manager_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'reporting_managers', key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user',
    tableName: 'user',
    paranoid: true,
    deletedAt: 'deleted_at'
});
exports.default = User;
