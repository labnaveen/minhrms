//@ts-nocheck
import { DataTypes, Sequelize, UUIDV4 } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("expenses", "document_id", {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: 'documents', key: 'id'}
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("expenses", "document_id");
    }
}