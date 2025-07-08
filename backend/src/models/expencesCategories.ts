import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import expensesCategoriesForms from "./expensesCategoriesForms";



class expencesCategories extends Model { }


expencesCategories.init({

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    category_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    expense_category_form_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: expensesCategoriesForms, key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'expencesCategories',
    tableName: 'expenses_categories'
})

export default expencesCategories