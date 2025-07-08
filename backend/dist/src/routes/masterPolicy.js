"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const masterPolicyController_1 = require("../controllers/masterPolicy/masterPolicyController");
const masterPolicy_1 = __importDefault(require("../models/masterPolicy"));
const RequestValidate_1 = require("../middleware/RequestValidate");
const masterPolicy_2 = require("../schemas/masterPolicy");
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
var router = express_1.default.Router();
var masterPolicyController = (0, masterPolicyController_1.MasterPolicyController)(masterPolicy_1.default);
const dropdownController = (0, dropdownController_1.DropdownController)(masterPolicy_1.default);
router.post('/', (0, Authorize_1.Authorize)('master_policies.add'), (0, RequestValidate_1.validate)(masterPolicy_2.MasterPolicyCreationSchema, "body"), (req, res, next) => masterPolicyController.create(req, res, next));
router.get('/', (0, Authorize_1.Authorize)('master_policies.view'), (req, res, next) => {
    const options = {
        included: ['attendance_policy', 'approval_flow', 'leave_type_policies'],
    };
    masterPolicyController.getAll(req, res, next, options);
});
router.get('/dropdown', (0, Authorize_1.Authorize)('master_policies.view'), (req, res, next) => {
    const options = {
        attribute: ['id', 'policy_name']
    };
    dropdownController.getAllDropdown(req, res, next, options);
});
router.get('/:id', (0, Authorize_1.Authorize)('master_policies.view'), (req, res, next) => masterPolicyController.getById(req, res, next));
router.delete('/:id', (0, Authorize_1.Authorize)('master_policies.delete'), (req, res, next) => masterPolicyController.destroy(req, res, next));
router.put('/:id', (0, Authorize_1.Authorize)('master_policies.edit'), (req, res, next) => masterPolicyController.update(req, res, next));
exports.default = router;
