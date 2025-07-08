"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const templatesController_1 = require("../controllers/templates/templatesController");
let router = express_1.default.Router();
router.get('/employee-bulk-upload', (req, res, next) => (0, templatesController_1.templateForBulkUploadEmployees)(req, res, next));
exports.default = router;
