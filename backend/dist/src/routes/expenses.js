"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseCategoriesController_1 = require("../controllers/expenses/expenseCategoriesController");
const Authorize_1 = require("../middleware/Authorize");
const models_1 = require("../models");
let router = express_1.default.Router();
const expenseCategoriesController = (0, expenseCategoriesController_1.ExpensesController)(models_1.expencesCategories);
const approvalStatus = (0, expenseCategoriesController_1.ExpensesController)(models_1.expencesApprovalStatus);
const purpuse = (0, expenseCategoriesController_1.ExpensesController)(models_1.expencesPurpuse);
const expensesController = (0, expenseCategoriesController_1.ExpensesController)(models_1.expenses);
// router.get('/categories', Authorize('users.show'), (req, res, next) => expenseCategoriesController.getAllDropdown(req, res, next))
router.get('/approvalstatus', (0, Authorize_1.Authorize)('employee_expense.view'), (req, res, next) => approvalStatus.getAllDropdown(req, res, next));
// router.get('/expensepurpuses', Authorize('users.show'), (req, res, next) => purpuse.getAllDropdown(req, res, next))
router.get('/dropdowns', (0, Authorize_1.Authorize)('employee_expense.view'), (req, res, next) => expensesController.getDropDowns(req, res, next));
router.post('/addexpense', (0, Authorize_1.Authorize)('employee_expense.add'), (req, res, next) => expensesController.create(req, res, next));
router.get('/getexpenseslists', (0, Authorize_1.Authorize)('employee_expense.view'), (req, res, next) => expensesController.getExpensesList(req, res, next));
router.put('/updateexpense', (0, Authorize_1.Authorize)('employee_expense.edit'), (req, res, next) => expensesController.updateExpenses(req, res, next));
router.delete('/removeexpense', (0, Authorize_1.Authorize)('employee_expense.delete'), (req, res, next) => expensesController.deleteExpenses(req, res, next));
router.get('/getexpensedetails', (0, Authorize_1.Authorize)('employee_expense.view'), (req, res, next) => expensesController.getExpenseDetails(req, res, next));
router.get('/getexpensesdashboard', (0, Authorize_1.Authorize)('employee_expense.view'), (req, res, next) => expensesController.getExpensesDashboard(req, res, next));
router.put('/submitexpense', (0, Authorize_1.Authorize)('employee_expense.edit'), (req, res, next) => expensesController.updateApprovalStatus(req, res, next));
router.get('/employee/summary', (0, Authorize_1.Authorize)('employee_expense.view'), (req, res, next) => expensesController.employeeSummary(req, res, next));
router.get('/employee/summary/month-wise', (0, Authorize_1.Authorize)('employee_expense.view'), (req, res, next) => expensesController.getTotalExpensesByMonth(req, res, next));
router.get('/manager/expense-list', (0, Authorize_1.Authorize)('reimbursements_requests.view'), (req, res, next) => expensesController.getManagerExpenseList(req, res, next));
router.put('/:id/approve', (0, Authorize_1.Authorize)('reimbursements_requests.edit'), (req, res, next) => expensesController.approveExpenseRequest(req, res, next));
router.put('/:id/reject', (0, Authorize_1.Authorize)('reimbursements_requests.edit'), (req, res, next) => expenseCategoriesController.rejectExpenseRequest(req, res, next));
router.get('/manager/summary', (0, Authorize_1.Authorize)('reimbursements_requests.view'), (req, res, next) => expensesController.getManagerExpensesSummary(req, res, next));
exports.default = router;
