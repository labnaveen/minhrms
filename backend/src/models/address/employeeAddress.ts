import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../utilities/db";


class EmployeeAddress extends Model{}

EmployeeAddress.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    employee_present_address:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    employee_present_pincode:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    employee_present_city:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    employee_present_state:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    employee_present_country_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    employee_present_mobile:{
        type: DataTypes.NUMBER,
        allowNull: false
    },
    employee_permanent_address:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    employee_permanent_pincode:{
        type: DataTypes.NUMBER,
        allowNull: false
    },
    employee_permanent_city:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    employee_permanent_state:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    employee_permanent_country_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    employee_permanent_mobile: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    user_id:{
        type: DataTypes.INTEGER,
        references:{model: 'user', key: 'id'}
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName:'employee_address',
    tableName:'employee_address'
})


export default EmployeeAddress;