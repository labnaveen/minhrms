//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("approval_flow_reporting_role", "approval_flow_id", {
        type: DataTypes.INTEGER,
        references: {model: 'approval_flow', key: 'id'}
    });
    await queryInterface.changeColumn("approval_flow_reporting_role", "reporting_role_id", {
        type: DataTypes.INTEGER,
        references: {model: 'reporting_role', key: 'id'}
    } )
  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("approval_flow_reporting_role", "approval_flow_id", {
        type: DataTypes.INTEGER,
        references: {model: 'approval_flow_reporting_role', key: 'id'}
    });
    await queryInterface.changeColumn("approval_flow_reporting_role", "reporting_role_id", {
        type: DataTypes.INTEGER,
        references: {model: 'approval_flow_reporting_role', key: 'id'}
    } );
  },
};


