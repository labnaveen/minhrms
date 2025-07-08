//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.createTable("leave_type", {
        id:{
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        base_leave_configuration_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        leave_type_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        negative_balance:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        max_leave_allowed_in_negative_balance:{
            type: DataTypes.INTEGER,
        },
        max_days_per_leave:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        max_days_per_month:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        allow_half_days:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        application_on_holidays:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        restriction_for_application:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        limit_back_dated_application:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        notice_for_application:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        auto_approval:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        auto_action_after:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        auto_approval_action:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        supporting_document_mandatory:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        prorated_accrual_first_month:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        prorated_rounding:{
            type: DataTypes.INTEGER,
        },
        prorated_rounding_factor:{
            type: DataTypes.DECIMAL,
        },
        encashment_yearly:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        max_leaves_for_encashment:{
            type: DataTypes.DECIMAL,
        },
        carry_forward_yearly:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        carry_forward_rounding:{
            type: DataTypes.INTEGER
        },
        carry_forward_rounding_factor:{
            type: DataTypes.DECIMAL
        },
        intra_cycle_carry_forward:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        prefix_postfix_weekly_off_sandwhich_rule:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        prefix_postfix_holiday_sandwhich_rule:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        inbetween_weekly_off_sandwhich_rule:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
        },
        updated_at: {
            type: DataTypes.DATE,
        },
    });
  },

  down: async({context: queryInterface}) => {
    await queryInterface.dropTable("leave_type");
  },
};


