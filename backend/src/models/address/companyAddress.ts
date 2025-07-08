import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../utilities/db";


class CompanyAddress extends Model{}

CompanyAddress.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    company_present_address:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    company_present_pincode:{
        type: DataTypes.NUMBER,
        allowNull: false
    },
    company_present_city:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    company_present_state:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    company_present_country_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    company_present_mobile:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    company_permanent_address:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    company_permanent_pincode:{
        type: DataTypes.NUMBER,
        allowNull: false
    },
    company_permanent_city:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    company_permanent_state:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    company_permanent_country_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    company_permanent_mobile: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    company_id:{
        type: DataTypes.INTEGER,
        references:{model: 'company', key: 'id'}
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'company_address',
    tableName: 'company_address',
    freezeTableName: true 
})

export default CompanyAddress;