"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const reportingManagerController_1 = require("../controllers/reportingStructure/reportingManager/reportingManagerController");
const reportingManagers_1 = __importDefault(require("../models/reportingManagers"));
var router = express_1.default.Router();
const reportingManagerControllers = (0, reportingManagerController_1.ReportingManagerController)(reportingManagers_1.default);
router.post('/', (0, Authorize_1.Authorize)('reporting_structure.add'), (req, res, next) => reportingManagerControllers.create(req, res, next));
router.get('/', (0, Authorize_1.Authorize)('reporting_structure.view'), (req, res, next) => {
    const options = {
        included: ['user', 'reporting_role'],
        attributes: {
            user: ['id', 'employee_name', 'employee_generated_id', 'company_id'],
            reporting_role: ['id', 'name', 'priority']
        }
    };
    reportingManagerControllers.getAll(req, res, next, options);
});
//Adding employees under reporting managers
router.put('/:id', (0, Authorize_1.Authorize)('reporting_structure.edit'), (req, res, next) => {
    reportingManagerControllers.update(req, res, next);
});
router.get('/:id', (0, Authorize_1.Authorize)('reporting_structure.view'), (req, res, next) => {
    reportingManagerControllers.getById(req, res, next);
});
router.delete('/:id', (0, Authorize_1.Authorize)('reporting_structure.delete'), (req, res, next) => {
    reportingManagerControllers.destroy(req, res, next);
});
exports.default = router;
