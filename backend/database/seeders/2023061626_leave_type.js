'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('leave_type', [{
        leave_type_name: "Casual Leave",
        negative_balance: true,
        max_leave_allowed_in_negative_balance: 2,
        max_days_per_leave: 5,
        max_days_per_month: 4,
        allow_half_days: true,
        leave_application_after: 1,
        application_on_holidays: true, 
        restriction_for_application: false, 
        limit_back_dated_application: 20, 
        notice_for_application: 5, 
        auto_approval: false, 
        auto_action_after: 4, 
        auto_approval_action: 1, 
        supporting_document_mandatory: false, 
        prorated_accrual_first_month: false, 
        prorated_rounding: 1, 
        prorated_rounding_factor: 0.1, 
        encashment_yearly: true, 
        max_leaves_for_encashment: 0.1, 
        carry_forward_yearly: false, 
        carry_forward_rounding: 1, 
        carry_forward_rounding_factor: 0.01, 
        intra_cycle_carry_forward: false, 
        prefix_postfix_weekly_off_sandwhich_rule: false, 
        prefix_postfix_holiday_sandwhich_rule: true, 
        inbetween_weekly_off_sandwhich_rule: true,
        created_at: new Date(),
        updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('leave_type', null, {});
  }
};
