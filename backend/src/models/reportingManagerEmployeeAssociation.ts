
import { Model } from 'sequelize';
import { sequelize } from '../utilities/db';
import { DataType } from 'sequelize-typescript';
import User from './user';
import ReportingRole from './reportingRole';
import ReportingManagers from './reportingManagers';


class ReportingManagerEmployeeAssociation extends Model{};


ReportingManagerEmployeeAssociation.init({
    id:{
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    user_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {model: User, key: 'id'}
    },
    reporting_role_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {model: ReportingRole, key: 'id'}
    },
    reporting_manager_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {model: ReportingManagers, key: 'id'}
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'reporting_manager_employee_association',
    modelName: 'reporting_manager_employee_association'
})

export default ReportingManagerEmployeeAssociation;