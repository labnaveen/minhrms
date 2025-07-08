//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('expenses', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            user_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'user', key: 'id'}
            },
            category_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'expenses_categories', key: 'id'}
            },
            status_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'expenses_approval_status', key: 'id'}
            },
            purpose_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'expense_purpuse', key: 'id'}
            },
            transaction_date:{
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            billing_status:{
                type: DataTypes.STRING,
                allowNull: false
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
            }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('expenses')
    }
}