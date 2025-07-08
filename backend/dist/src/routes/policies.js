"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const policiesController_1 = require("../controllers/policies/policiesController");
const models_1 = require("../models");
var router = express_1.default.Router();
router.get('/', (0, Authorize_1.Authorize)('policies_summary.view'), (req, res, next) => (0, policiesController_1.PolicyController)(models_1.User).getPolicySummary(req, res, next));
router.get('/employees', (0, Authorize_1.Authorize)('policies_summary.view'), (req, res, next) => (0, policiesController_1.PolicyController)(models_1.User).employeePolicies(req, res, next));
router.get('/attendance', (0, Authorize_1.Authorize)('policies_summary.view'), (req, res, next) => (0, policiesController_1.PolicyController)(models_1.User).attendancePolicies(req, res, next));
router.get('/leave', (0, Authorize_1.Authorize)('policies_summary.view'), (req, res, next) => (0, policiesController_1.PolicyController)(models_1.User).leavePolicies(req, res, next));
router.get('/holidays', (0, Authorize_1.Authorize)('policies_summary.view'), (req, res, next) => (0, policiesController_1.PolicyController)(models_1.User).holidayPolicies(req, res, next));
exports.default = router;
