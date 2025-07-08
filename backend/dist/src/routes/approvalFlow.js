"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const approvalFlowController_1 = require("../controllers/approvalFlow/approvalFlowController");
const approvalFlow_1 = __importDefault(require("../models/approvalFlow"));
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
var router = express_1.default.Router();
const approvalFlowController = (0, approvalFlowController_1.ApprovalFlowController)(approvalFlow_1.default);
const approvalFlowDropdownController = (0, dropdownController_1.DropdownController)(approvalFlow_1.default);
const dropdownOptions = {
    attributes: ['id', 'name']
};
router.post('/', (0, Authorize_1.Authorize)('approval_flow.add'), (req, res, next) => { approvalFlowController.create(req, res, next); });
router.get('/', (0, Authorize_1.Authorize)('approval_flow.view'), (req, res, next) => {
    const options = {
        included: ['approval_flow_type'],
        searchBy: ['name']
    };
    approvalFlowController.getAll(req, res, next, options);
});
//@ts-ignore
router.get('/dropdown', (0, Authorize_1.Authorize)('approval_flow.view'), (req, res, next) => approvalFlowDropdownController.getAllDropdown(req, res, next, dropdownOptions));
router.put('/:id', (0, Authorize_1.Authorize)('approval_flow.edit'), (req, res, next) => approvalFlowController.update(req, res, next));
router.get('/:id', (0, Authorize_1.Authorize)('approval_flow.view'), (req, res, next) => {
    // const options = {
    //     included: ['reporting_role'],
    //     attributes:{
    //         reporting_role:['id', 'name']
    //     },
    //     aliases:{
    //         reporting_role: 'direct',
    //     }
    // }
    approvalFlowController.getById(req, res, next);
});
router.delete('/:id', (0, Authorize_1.Authorize)('approval_flow.delete'), (req, res, next) => approvalFlowController.destroy(req, res, next));
exports.default = router;
