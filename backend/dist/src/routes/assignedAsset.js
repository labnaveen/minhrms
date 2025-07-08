"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const assignedAssetController_1 = require("../controllers/asset/assignedAssetController");
const assignedAsset_1 = __importDefault(require("../models/assignedAsset"));
var router = express_1.default.Router();
const assignedAsset = (0, assignedAssetController_1.AssignedAssetController)(assignedAsset_1.default);
router.get('/', (0, Authorize_1.Authorize)('manage_assets.view'), (req, res, next) => assignedAsset.getAll(req, res, next));
router.get('/:id', (0, Authorize_1.Authorize)('manage_assets.view'), (req, res, next) => assignedAsset.getById(req, res, next));
exports.default = router;
