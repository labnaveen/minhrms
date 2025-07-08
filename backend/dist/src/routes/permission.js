"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const models_1 = require("../models");
const permissionController_1 = require("../controllers/employee/permissionController");
var router = express_1.default.Router();
const permissionController = (0, permissionController_1.PermissionController)(models_1.Permissions);
router.get('/', (0, Authorize_1.Authorize)('role_permissions.view'), (req, res, next) => permissionController.getAll(req, res, next));
router.post('/', (0, Authorize_1.Authorize)('role_permissions.add'), (req, res, next) => permissionController.create(req, res, next));
exports.default = router;
