"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveTypePolicyController_1 = require("../controllers/leaveTypePolicy/leaveTypePolicyController");
const leaveTypePolicy_1 = __importDefault(require("../models/leaveTypePolicy"));
const Authorize_1 = require("../middleware/Authorize");
var router = express_1.default.Router();
const leaveTypePolicyController = (0, leaveTypePolicyController_1.LeaveTypePolicyController)(leaveTypePolicy_1.default);
router.post('/', (0, Authorize_1.Authorize)('leave_policies.add'), (req, res, next) => leaveTypePolicyController.create(req, res, next));
// router.get('/:id/leave-type-policy', Authorize('users.show'), (req, res, next) =>{
//     const option = {
//         where:{
//             leave_type_id: req.params.id
//         }
//     }
//     leaveTypePolicyController.getAll(req, res, next, option)
// })
router.get('/:id', (0, Authorize_1.Authorize)('leave_policies.view'), (req, res, next) => leaveTypePolicyController.getById(req, res, next));
router.delete('/:id', (0, Authorize_1.Authorize)('leave_policies.delete'), (req, res, next) => leaveTypePolicyController.destroy(req, res, next));
router.put('/:id', (0, Authorize_1.Authorize)('leave_policies.delete'), (req, res, next) => leaveTypePolicyController.update(req, res, next));
exports.default = router;
