"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dropdownController_1 = require("../../controllers/dropdown/dropdownController");
const relation_1 = __importDefault(require("../../models/dropdown/relation/relation"));
var router = express_1.default.Router();
const relationDropdown = (0, dropdownController_1.DropdownController)(relation_1.default);
router.get('/', (req, res, next) => relationDropdown.getAllDropdown(req, res, next));
exports.default = router;
