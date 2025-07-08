"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const leaveTypeController_1 = require("../controllers/leavePolicy/leaveTypeController");
const Authorize_1 = require("../middleware/Authorize");
const RequestValidate_1 = require("../middleware/RequestValidate");
const leaveType_1 = require("../schemas/leaveType");
const leaveTypePolicyController_1 = require("../controllers/leaveTypePolicy/leaveTypePolicyController");
const leaveTypePolicy_1 = __importDefault(require("../models/leaveTypePolicy"));
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
var router = express_1.default.Router();
const leaveTypeController = (0, leaveTypeController_1.LeaveTypeController)(models_1.LeaveType);
const leaveTypePoliciesController = (0, leaveTypePolicyController_1.LeaveTypePolicyController)(leaveTypePolicy_1.default);
router.get('/', (0, Authorize_1.Authorize)('leave_policies.view'), (req, res, next) => {
    const options = {
        included: ['leave_type_policy']
    };
    leaveTypeController.getAll(req, res, next, options);
});
//Get all leave types as well as leave type policies
router.get('/dropdown', (req, res, next) => (0, dropdownController_1.DropdownController)(models_1.LeaveType).getAllDropdown(req, res, next, { attribute: ['id', 'leave_type_name', 'allow_half_days'], included: ['leave_type_policy'], attributes: { leave_type_policy: ['id', 'leave_policy_name'] } }));
router.get('/:id', (0, Authorize_1.Authorize)('leave_policies.view'), (req, res, next) => {
    const option = {
        included: ['leave_type_policy']
    };
    leaveTypeController.getById(req, res, next, option);
});
//@ts-ignore
router.get('/:id/leave-type-policy/dropdown', (0, Authorize_1.Authorize)('leave_policies.view'), (req, res, next) => (0, dropdownController_1.DropdownController)(leaveTypePolicy_1.default).getAllDropdown(req, res, next, { where: { leave_type_id: req.params.id }, attributes: ['id', 'leave_policy_name'] }));
//Get all the leave type policies for a particular leave type
router.get('/:id/leave-type-policy', (0, Authorize_1.Authorize)('leave_policies.view'), (req, res, next) => {
    const option = {
        where: {
            leave_type_id: req.params.id
        }
    };
    leaveTypePoliciesController.getAll(req, res, next, option);
});
router.post('/', (0, Authorize_1.Authorize)('leave_policies.add'), (0, RequestValidate_1.validate)(leaveType_1.LeaveTypeCreationSchema, 'body'), (req, res, next) => leaveTypeController.create(req, res, next));
router.put('/:id', (0, Authorize_1.Authorize)('leave_policies.edit'), (0, RequestValidate_1.validate)(leaveType_1.LeaveTypeUpdationSchema, 'body'), (req, res, next) => leaveTypeController.update(req, res, next));
router.delete('/:id', (0, Authorize_1.Authorize)('leave_policies.edit'), (req, res, next) => leaveTypeController.destroy(req, res, next));
exports.default = router;
