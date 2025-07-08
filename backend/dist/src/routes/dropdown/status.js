"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dropdownController_1 = require("../../controllers/dropdown/dropdownController");
const approval_1 = __importDefault(require("../../models/dropdown/status/approval"));
const marking_1 = __importDefault(require("../../models/dropdown/status/marking"));
const models_1 = require("../../models");
var router = express_1.default.Router();
const ApprovalDropdownController = (0, dropdownController_1.DropdownController)(approval_1.default);
const MarkingDropdownController = (0, dropdownController_1.DropdownController)(marking_1.default);
const AttendanceStatusDropdownController = (0, dropdownController_1.DropdownController)(models_1.AttendanceStatus);
// const DropdownController = DropdownController(Approval)
router.get('/approval', (req, res, next) => ApprovalDropdownController.getAllDropdown(req, res, next));
router.get('/marking', (req, res, next) => MarkingDropdownController.getAllDropdown(req, res, next));
router.get('/attendance', (req, res, next) => AttendanceStatusDropdownController.getAllDropdown(req, res, next));
exports.default = router;
