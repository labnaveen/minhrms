"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const baseLeaveConfiguration_1 = __importDefault(require("../models/baseLeaveConfiguration"));
const Authorize_1 = require("../middleware/Authorize");
const baseLeaveConfigurationController_1 = require("../controllers/leavePolicy/baseLeaveConfigurationController");
const RequestValidate_1 = require("../middleware/RequestValidate");
const baseLeaveConfigurationSchema_1 = require("../schemas/baseLeaveConfigurationSchema");
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
let router = express_1.default.Router();
const LeaveConfigurationController = (0, baseLeaveConfigurationController_1.BaseLeaveConfigurationController)(baseLeaveConfiguration_1.default);
//Route to create a new base leave configuration
router.post('/', (0, Authorize_1.Authorize)('leave_policies.add'), (0, RequestValidate_1.validate)(baseLeaveConfigurationSchema_1.BaseLeaveConfigurationCreationSchema, 'body'), LeaveConfigurationController.create);
//Route to get all base leave configurations
router.get('/', (0, Authorize_1.Authorize)('leave_policies.view'), (req, res, next) => LeaveConfigurationController.getAll(req, res, next));
//Route for dropdown
//@ts-ignore
router.get('/dropdown', (0, Authorize_1.Authorize)('leave_policies.view'), (req, res, next) => (0, dropdownController_1.DropdownController)(baseLeaveConfiguration_1.default).getAllDropdown(req, res, next, { attributes: ['id', 'policy_name'] }));
//Route to get a specific base leave configuration
router.get('/:id', (0, Authorize_1.Authorize)('leave_policies.view'), (req, res, next) => LeaveConfigurationController.getById(req, res, next));
//Route to delete a base leave configuration
router.delete('/:id', (0, Authorize_1.Authorize)('leave_policies.delete'), (req, res, next) => LeaveConfigurationController.destroy(req, res, next));
router.put('/:id', (0, Authorize_1.Authorize)('leave_policies.edit'), (req, res, next) => LeaveConfigurationController.update(req, res, next));
exports.default = router;
