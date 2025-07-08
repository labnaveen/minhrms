"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shiftPolicyController_1 = require("../controllers/shiftPolicy/shiftPolicyController");
const shiftPolicy_1 = __importDefault(require("../models/shiftPolicy"));
const Authorize_1 = require("../middleware/Authorize");
const RequestValidate_1 = require("../middleware/RequestValidate");
const shiftPolicy_2 = require("../schemas/shiftPolicy");
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
var router = express_1.default.Router();
var shiftPolicyController = (0, shiftPolicyController_1.ShiftPolicyController)(shiftPolicy_1.default);
//Create a Shift Policy
router.post('/', (0, Authorize_1.Authorize)('attendance_policies.add'), (0, RequestValidate_1.validate)(shiftPolicy_2.ShiftPolicyCreation, 'body'), (req, res, next) => shiftPolicyController.create(req, res, next));
//Dropdown
//@ts-ignore
router.get('/dropdown', (0, Authorize_1.Authorize)('attendance_policies.view'), (req, res, next) => (0, dropdownController_1.DropdownController)(shiftPolicy_1.default).getAllDropdown(req, res, next, { attributes: ['id', 'shift_name'] }));
//Get a specific Shift Policy
router.get('/:id', (0, Authorize_1.Authorize)('attendance_policies.view'), (req, res, next) => {
    const options = {
        included: ["shift_type", "attendance_status"],
        where: { id: req.params.id }
    };
    shiftPolicyController.getById(req, res, next, options);
});
//Get All Shift Policies
router.get('/', (0, Authorize_1.Authorize)('attendance_policies.view'), (req, res, next) => shiftPolicyController.getAll(req, res, next));
//Updation
router.put('/:id', (0, Authorize_1.Authorize)('attendance_policies.edit'), (0, RequestValidate_1.validate)(shiftPolicy_2.ShiftPolicyUpdationSchema, 'body'), (req, res, next) => shiftPolicyController.update(req, res, next));
// Deletion
router.delete('/:id', (0, Authorize_1.Authorize)('attendance_policies.delete'), (req, res, next) => shiftPolicyController.destroy(req, res, next));
exports.default = router;
