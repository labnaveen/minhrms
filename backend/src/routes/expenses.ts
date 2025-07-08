import express from 'express'
import { ExpensesController } from '../controllers/expenses/expenseCategoriesController'
import { Authorize } from '../middleware/Authorize'
import { expencesCategories, expencesApprovalStatus, expencesPurpuse, expenses } from '../models'


let router = express.Router()


const expenseCategoriesController = ExpensesController(expencesCategories)
const approvalStatus = ExpensesController(expencesApprovalStatus)
const purpuse = ExpensesController(expencesPurpuse)
const expensesController = ExpensesController(expenses)

// router.get('/categories', Authorize('users.show'), (req, res, next) => expenseCategoriesController.getAllDropdown(req, res, next))
router.get('/approvalstatus', Authorize('employee_expense.view'), (req, res, next) => approvalStatus.getAllDropdown(req, res, next))
// router.get('/expensepurpuses', Authorize('users.show'), (req, res, next) => purpuse.getAllDropdown(req, res, next))
router.get('/dropdowns', Authorize('employee_expense.view'), (req, res, next) => expensesController.getDropDowns(req, res, next))
router.post('/addexpense', Authorize('employee_expense.add'), (req, res, next) => expensesController.create(req, res, next))
router.get('/getexpenseslists', Authorize('employee_expense.view'), (req, res, next) => expensesController.getExpensesList(req, res, next))
router.put('/updateexpense', Authorize('employee_expense.edit'), (req, res, next) => expensesController.updateExpenses(req, res, next))
router.delete('/removeexpense', Authorize('employee_expense.delete'), (req, res, next) => expensesController.deleteExpenses(req, res, next))
router.get('/getexpensedetails', Authorize('employee_expense.view'), (req, res, next) => expensesController.getExpenseDetails(req, res, next))
router.get('/getexpensesdashboard', Authorize('employee_expense.view'), (req, res, next) => expensesController.getExpensesDashboard(req, res, next))
router.put('/submitexpense', Authorize('employee_expense.edit'), (req, res, next) => expensesController.updateApprovalStatus(req, res, next))
router.get('/employee/summary', Authorize('employee_expense.view'), (req, res, next) => expensesController.employeeSummary(req, res, next))
router.get('/employee/summary/month-wise', Authorize('employee_expense.view'), (req, res, next) => expensesController.getTotalExpensesByMonth(req, res, next))
router.get('/manager/expense-list', Authorize('reimbursements_requests.view'), (req, res, next) => expensesController.getManagerExpenseList(req, res, next))
router.put('/:id/approve', Authorize('reimbursements_requests.edit'), (req, res, next) => expensesController.approveExpenseRequest(req, res, next))
router.put('/:id/reject', Authorize('reimbursements_requests.edit'), (req, res, next) => expenseCategoriesController.rejectExpenseRequest(req, res, next))
router.get('/manager/summary', Authorize('reimbursements_requests.view'), (req, res, next) => expensesController.getManagerExpensesSummary(req, res, next))

//API to get admin's expenses requests
router.get('/admin/requests', Authorize('reimbursements_requests.view'), (req, res, next) => expensesController.getAdminExpensesRequests(req, res, next))
//API to get all the records of expenses for admin's history
router.get('/admin/expense-records', Authorize('reimbursements_requests.view'), (req, res, next) => expensesController.getAdminExpensesRecords(req, res, next))

//API to approve expense requests by admin
router.put('/admin/:id/approve', Authorize('reimbursements_requests.edit'), (req, res, next) => expensesController.adminExpenseRequestApproval(req, res, next))

//API to reject expense requests by Admin
router.put('/admin/:id/reject', Authorize('reimbursements_requests.edit'), (req, res, next) => expensesController.adminExpenseRequestRejection(req, res, next))

export default router;