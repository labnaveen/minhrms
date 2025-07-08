"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dropdownController_1 = require("./../controllers/dropdown/dropdownController");
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const reportingRole_1 = __importDefault(require("../models/reportingRole"));
const reportingManagerController_1 = require("../controllers/reportingStructure/reportingManager/reportingManagerController");
const reportingManagers_1 = __importDefault(require("../models/reportingManagers"));
const reportingRoleController_1 = require("../controllers/reportingStructure/reportingRole/reportingRoleController");
var router = express_1.default.Router();
const reportingRoleControllers = (0, reportingRoleController_1.ReportingRoleController)(reportingRole_1.default);
const reportingDropdownController = (0, dropdownController_1.DropdownController)(reportingRole_1.default);
const reportingManagerController = (0, reportingManagerController_1.ReportingManagerController)(reportingManagers_1.default);
//Creating a Reporting Role
router.post('/', (0, Authorize_1.Authorize)('reporting_structure.add'), (req, res, next) => reportingRoleControllers.create(req, res, next));
//Dropdown to get all the reporting Managers based on reporting role
router.get('/:id/reporting-manager/dropdown', (0, Authorize_1.Authorize)('reporting_structure.view'), (req, res, next) => {
    const { id } = req.params;
    const options = {
        where: { reporting_role_id: id },
        included: ['user'],
        attributes: {
            user: ['id', 'employee_name']
        },
        attribute: ['id']
    };
    (0, dropdownController_1.DropdownController)(reportingManagers_1.default).getAllDropdown(req, res, next, options);
});
//Get Reporting Managers for a specific Reporting Role
router.get('/:id/reporting-manager', (0, Authorize_1.Authorize)('reporting_structure.view'), (req, res, next) => {
    reportingManagerController.getAll(req, res, next);
});
//Dropdown for Reporting Role
router.get('/dropdown', (0, Authorize_1.Authorize)('reporting_structure.view'), (req, res, next) => {
    // const options = {
    //     included:['reporting_managers'],
    //     nestedIncluded:{
    //         reporting_managers: ['user']
    //     }
    // }
    reportingRoleControllers.dropdown(req, res, next);
    // reportingDropdownController.getAllDropdown(req, res, next, options)
});
//Get A specific Reporting Role
router.get('/:id', (0, Authorize_1.Authorize)('reporting_structure.view'), (req, res, next) => reportingRoleControllers.getById(req, res, next));
//Get All Reporting Roles
router.get('/', (0, Authorize_1.Authorize)('reporting_structure.view'), (req, res, next) => {
    const options = {
        included: ['']
    };
    reportingRoleControllers.getAll(req, res, next);
});
//Deleting a Reporting Role
router.delete('/:id', (0, Authorize_1.Authorize)('reporting_structure.delete'), (req, res, next) => reportingRoleControllers.destroy(req, res, next));
//Updating a Reporting Role
router.put('/:id', (0, Authorize_1.Authorize)('reporting_structure.edit'), (req, res, next) => reportingRoleControllers.update(req, res, next));
exports.default = router;
