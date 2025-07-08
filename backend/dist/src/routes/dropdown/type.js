"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dropdownController_1 = require("../../controllers/dropdown/dropdownController");
const accrual_1 = __importDefault(require("../../models/dropdown/type/accrual"));
const rounding_1 = __importDefault(require("../../models/dropdown/type/rounding"));
const shift_1 = __importDefault(require("../../models/dropdown/type/shift"));
const Authorize_1 = require("../../middleware/Authorize");
const approvalFlowType_1 = __importDefault(require("../../models/dropdown/type/approvalFlowType"));
const gender_1 = __importDefault(require("../../models/dropdown/type/gender"));
const employment_1 = __importDefault(require("../../models/dropdown/type/employment"));
const educationType_1 = __importDefault(require("../../models/dropdown/type/educationType"));
const relation_1 = __importDefault(require("../../models/dropdown/relation/relation"));
const dayType_1 = __importDefault(require("../../models/dropdown/dayType/dayType"));
const halfDayType_1 = __importDefault(require("../../models/dropdown/dayType/halfDayType"));
const leaveTypeController_1 = require("../../controllers/leavePolicy/leaveTypeController");
const models_1 = require("../../models");
var router = express_1.default.Router();
const AccuralsDropdownController = (0, dropdownController_1.DropdownController)(accrual_1.default);
const MarkingDropdownController = (0, dropdownController_1.DropdownController)(rounding_1.default);
const ShiftDropdownController = (0, dropdownController_1.DropdownController)(shift_1.default);
const ApprovalDropdownController = (0, dropdownController_1.DropdownController)(approvalFlowType_1.default);
const GenderDropdownController = (0, dropdownController_1.DropdownController)(gender_1.default);
const EmploymentTypeDropdownController = (0, dropdownController_1.DropdownController)(employment_1.default);
const EducationTypeDropdownController = (0, dropdownController_1.DropdownController)(educationType_1.default);
const RelationTypeDropdownController = (0, dropdownController_1.DropdownController)(relation_1.default);
const dayTypeDropdownController = (0, dropdownController_1.DropdownController)(dayType_1.default);
const hafDayTypeDropdownController = (0, dropdownController_1.DropdownController)(halfDayType_1.default);
const leaveTypeDropdownController = (0, leaveTypeController_1.LeaveTypeController)(models_1.LeaveType);
router.get('/accurals', (req, res, next) => AccuralsDropdownController.getAllDropdown(req, res, next));
router.get('/rounding', (req, res, next) => MarkingDropdownController.getAllDropdown(req, res, next));
router.get('/shift', (req, res, next) => ShiftDropdownController.getAllDropdown(req, res, next));
router.get('/approval-flow-type', (req, res, next) => ApprovalDropdownController.getAllDropdown(req, res, next));
router.get('/gender', (req, res, next) => GenderDropdownController.getAllDropdown(req, res, next));
router.get('/employment-type', (req, res, next) => EmploymentTypeDropdownController.getAllDropdown(req, res, next));
router.get('/education-type', (req, res, next) => EducationTypeDropdownController.getAllDropdown(req, res, next));
router.get('/relation', (req, res, next) => RelationTypeDropdownController.getAllDropdown(req, res, next));
router.get('/day-type', (req, res, next) => {
    const options = {
        attribute: ['id', 'name']
    };
    dayTypeDropdownController.getAllDropdown(req, res, next, options);
});
router.get('/half-day-type', (req, res, next) => {
    const options = {
        attribute: ['id', 'name']
    };
    hafDayTypeDropdownController.getAllDropdown(req, res, next, options);
});
router.get('/leave-type', (0, Authorize_1.Authorize)('employee_leaves.view'), (req, res, next) => leaveTypeDropdownController.dropdownForEmployees(req, res, next));
exports.default = router;
