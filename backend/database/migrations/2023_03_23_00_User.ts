//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.createTable('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employee_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        employee_generated_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_of_joining: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        probation_period: {
            type: DataTypes.STRING,
            allowNull: true
        },
        probation_due_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        designation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true
        },
        work_location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        level: {
            type: DataTypes.STRING,
            allowNull: true
        },
        grade: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cost_center: {
            type: DataTypes.STRING,
            allowNull: true
        },
        employee_official_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        employee_personal_email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dob_adhaar: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        dob_celebrated: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        employee_gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        role_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        employee_password:{
            type: DataTypes.STRING,
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
        created_at:{
            type: DataTypes.DATE
        },
        updated_at:{
            type: DataTypes.DATE
        },
        deleted_at:{
            type: DataTypes.DATE
        }
      })
    },
    down: async ({context: queryInterface}) => {
      // logic for reverting the changes
      await queryInterface.dropTable('user')
    }
}