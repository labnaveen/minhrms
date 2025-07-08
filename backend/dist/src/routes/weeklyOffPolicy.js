"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const weeklyOffPolicyController_1 = require("../controllers/weeklyOffPolicy/weeklyOffPolicyController");
const weeklyOffPolicy_1 = __importDefault(require("../models/weeklyOffPolicy"));
const Authorize_1 = require("../middleware/Authorize");
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
var router = express_1.default.Router();
const weeklyOffPolicyController = (0, weeklyOffPolicyController_1.WeeklyOffPolicyController)(weeklyOffPolicy_1.default);
const weeklyOffPolicyDropdownController = (0, dropdownController_1.DropdownController)(weeklyOffPolicy_1.default);
router.post('/', (0, Authorize_1.Authorize)('weekly_off_policies.add'), (req, res, next) => weeklyOffPolicyController.create(req, res, next));
router.get('/', (0, Authorize_1.Authorize)('weekly_off_policies.view'), (req, res, next) => {
    const options = {
        included: ['weekly_off_association'],
        attributes: {
            weekly_off_association: ['id', 'week_name', 'week_number']
        },
    };
    weeklyOffPolicyController.getAll(req, res, next, options);
});
router.get('/dropdown', (0, Authorize_1.Authorize)('weekly_off_policies.view'), (req, res, next) => {
    const options = {
        attribute: ['id', 'name']
    };
    weeklyOffPolicyDropdownController.getAllDropdown(req, res, next, options);
});
router.get('/:id', (0, Authorize_1.Authorize)('weekly_off_policies.view'), (req, res, next) => {
    // const options = {
    //     included: ['weekly_off_association'],
    //     attributes: {
    //         weekly_off_association: ['id', 'week_name', 'week_number']
    //     }
    // }
    weeklyOffPolicyController.getById(req, res, next);
});
router.put('/:id', (0, Authorize_1.Authorize)('weekly_off_policies.edit'), (req, res, next) => weeklyOffPolicyController.update(req, res, next));
router.delete('/:id', (0, Authorize_1.Authorize)('weekly_off_policies.delete'), (req, res, next) => weeklyOffPolicyController.destroy(req, res, next));
exports.default = router;
