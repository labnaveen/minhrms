"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const divisionUnitController_1 = require("../controllers/division/divisionUnitController");
const divisionUnits_1 = __importDefault(require("../models/divisionUnits"));
const Authorize_1 = require("../middleware/Authorize");
const RequestValidate_1 = require("../middleware/RequestValidate");
const division_1 = require("../schemas/division");
let router = express_1.default.Router();
const divisionUnitController = (0, divisionUnitController_1.DivisionUnitController)(divisionUnits_1.default);
//Unit Creation API
router.post('/', (0, Authorize_1.Authorize)('division.add'), (0, RequestValidate_1.validate)(division_1.DivisionUnitCreationSchema, 'body'), (req, res, next) => divisionUnitController.create(req, res, next));
//Get All Units
// router.get('/', Authorize('users.show'), (req, res, next) => {
//     const options = {
//         included: ['user'],
//         attributes: {
//          user:['employee_name'],
//         },
//     }
//     divisionUnitController.getAll(req, res, next, options)
// })
router.get('/', (0, Authorize_1.Authorize)('division.view'), (req, res, next) => divisionUnitController.getDivisionUsers(req, res, next));
router.get('/:id', (0, Authorize_1.Authorize)('division.view'), (req, res, next) => divisionUnitController.getById(req, res, next));
router.put('/:id', (0, Authorize_1.Authorize)('division.edit'), (0, RequestValidate_1.validate)(division_1.DivisionUnitUpdateSchema, "body"), (req, res, next) => divisionUnitController.update(req, res, next));
router.delete('/:id', (0, Authorize_1.Authorize)('division.delete'), (req, res, next) => divisionUnitController.destroy(req, res, next));
exports.default = router;
