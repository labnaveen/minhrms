"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const RequestValidate_1 = require("../middleware/RequestValidate");
const division_1 = require("../schemas/division");
const divisionController_1 = require("../controllers/division/divisionController");
const division_2 = __importDefault(require("../models/division"));
const divisionUnitController_1 = require("../controllers/division/divisionUnitController");
const divisionUnits_1 = __importDefault(require("../models/divisionUnits"));
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
let router = express_1.default.Router();
const divisionController = (0, divisionController_1.DivisionController)(division_2.default);
const dropdownController = (0, dropdownController_1.DropdownController)(division_2.default);
const divisionUnitController = (0, divisionUnitController_1.DivisionUnitController)(divisionUnits_1.default);
router.post('/', (0, Authorize_1.Authorize)('division.add'), (0, RequestValidate_1.validate)(division_1.DivisionCreationSchema, 'body'), (req, res, next) => divisionController.create(req, res, next));
router.get('/dropdown', (0, Authorize_1.Authorize)('division.view'), (req, res, next) => {
    const options = {
        included: ['division_units'],
        attribute: ['id', 'division_name', 'system_generated'],
        attributes: {
            division_units: ['id', 'unit_name', 'system_generated']
        }
    };
    dropdownController.getAllDropdown(req, res, next, options);
});
router.get('/:id/dropdown', (0, Authorize_1.Authorize)('division.view'), (req, res, next) => (0, dropdownController_1.DropdownController)(divisionUnits_1.default).getAllDropdown(req, res, next, { where: { division_id: req.params.id }, attribute: ['id', 'unit_name'] }));
router.put('/:id', (0, Authorize_1.Authorize)('division.edit'), (req, res, next) => divisionController.update(req, res, next));
router.post('/:id/division-unit/:unit_id/employee', (req, res, next) => divisionController.addEmployeeToUnit(req, res, next));
router.delete('/:id/division-unit/:unit_id/employee/:user_id', (req, res, next) => divisionController.removeEmployeeFromUnit(req, res, next));
router.get('/', (0, Authorize_1.Authorize)('division.view'), (req, res, next) => {
    const options = {
        included: ['division_units'],
    };
    divisionController.getAll(req, res, next, options);
});
router.get('/:id/division-unit', (0, Authorize_1.Authorize)('division.view'), (req, res, next) => {
    const option = {
        where: {
            division_id: req.params.id
        }
    };
    divisionUnitController.getAll(req, res, next, option);
});
router.get('/:id', (0, Authorize_1.Authorize)('division.view'), (req, res, next) => {
    // const options = {
    //     attribute:['id', 'division_name'],
    //     included: ['division_units'],
    //     attributes:{
    //         division_units: ["id", "unit_name"],
    //     }
    // }
    divisionController.getById(req, res, next);
});
router.delete('/:id', (0, Authorize_1.Authorize)('division.delete'), (req, res, next) => divisionController.destroy(req, res, next));
exports.default = router;
