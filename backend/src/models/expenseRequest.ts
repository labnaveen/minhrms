import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";

class ExpenseRequest extends Model{};


ExpenseRequest.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        unique: true
    },
    expense_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'expenses', key: 'id' }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user_id', key:'id' }
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model:'approval_status', key: 'id'},
        defaultValue: 1
    },
    priority:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'expense_request',
    modelName: 'expense_request'
})


export default ExpenseRequest;