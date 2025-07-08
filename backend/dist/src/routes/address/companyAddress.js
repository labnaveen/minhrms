"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../../models");
const masterController_1 = require("../../controllers/masterController");
var router = express_1.default.Router();
router.get('/', (0, masterController_1.MasterController)(models_1.CompanyAddress).getAll);
exports.default = router;
