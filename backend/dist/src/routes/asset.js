"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assetController_1 = require("../controllers/asset/assetController");
const asset_1 = __importDefault(require("../models/asset"));
const Authorize_1 = require("../middleware/Authorize");
const assignedAssetController_1 = require("../controllers/asset/assignedAssetController");
const assignedAsset_1 = __importDefault(require("../models/assignedAsset"));
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
var router = express_1.default.Router();
const assetController = (0, assetController_1.AssetController)(asset_1.default);
const assignedAssetController = (0, assignedAssetController_1.AssignedAssetController)(assignedAsset_1.default);
const dropdownController = (0, dropdownController_1.DropdownController)(asset_1.default);
router.post('/', (0, Authorize_1.Authorize)('manage_assets.add'), (req, res, next) => assetController.create(req, res, next));
router.get('/', (0, Authorize_1.Authorize)('manage_assets.view'), (req, res, next) => {
    const options = {
        included: ['user'],
        attributes: {
            user: ['employee_name', 'employee_generated_id']
        },
    };
    assetController.getAll(req, res, next, options);
});
router.get('/dropdown', (0, Authorize_1.Authorize)('manage_assets.view'), (req, res, next) => {
    const options = {
        where: { is_assigned: false }
    };
    dropdownController.getAllDropdown(req, res, next, options);
});
router.get('/:id', (0, Authorize_1.Authorize)('manage_assets.view'), (req, res, next) => {
    const options = {
        included: ['user'],
        attributes: {
            user: ['employee_name', 'employee_generated_id']
        }
    };
    assetController.getById(req, res, next, options);
});
router.put('/:id', (0, Authorize_1.Authorize)('manage_assets.edit'), (req, res, next) => assetController.update(req, res, next));
router.post('/:id/assign', (0, Authorize_1.Authorize)('assign_assets.edit'), (req, res, next) => assignedAssetController.assignAsset(req, res, next));
router.patch('/:id/unassign', (0, Authorize_1.Authorize)('assign_assets.edit'), (req, res, next) => assignedAssetController.unassignAsset(req, res, next));
router.delete('/:id', (0, Authorize_1.Authorize)('manage_assets.delete'), (req, res, next) => assetController.destroy(req, res, next));
exports.default = router;
