import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import {User, expencesCategories, expencesApprovalStatus, expencesPurpuse} from "../models/";
import Documents from "./documents";


class expenses extends Model{}


expenses.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        references: {model: User, key: 'id'}
    },
    category_id:{
        type: DataTypes.INTEGER,
        references: {model: expencesCategories, key: 'id'}
    },
    status_id:{
        type: DataTypes.INTEGER,
        references: {model: expencesApprovalStatus, key: 'id'}
    },
    purpose_id:{
        type: DataTypes.INTEGER,
        references: {model: expencesPurpuse, key: 'id'}
    },
    transaction_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    billing_status:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    bill_no:{
        type: DataTypes.STRING,
        allowNull: true
    },
    from_location:{
        type: DataTypes.STRING,
        allowNull: true
    },
    to_location:{
        type: DataTypes.STRING,
        allowNull: true
    },
    from_latitude:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    from_longitude:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    to_latitude:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    to_longitude:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    total_distance:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    merchant_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    amount:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    note:{
        type: DataTypes.STRING,
        allowNull: true
    }, 
    purpose_text:{
        type: DataTypes.STRING,
        allowNull: true
    }, 
    supporting_doc_url:{
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at:{
        type: DataTypes.DATE
    },
    updated_at:{
        type: DataTypes.DATE
    },
    stay_from_date:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    stay_to_date:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    document_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {model: Documents, key: 'id'}
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'expenses',
    tableName: 'expenses'
})

export default expenses