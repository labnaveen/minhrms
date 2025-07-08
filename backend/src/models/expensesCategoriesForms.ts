import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";

class expensesCategoriesForms extends Model { }
expensesCategoriesForms.init({

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    category_form_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'expencesCategoriesForms',
    tableName: 'expenses_categories_forms'
})

export default expensesCategoriesForms