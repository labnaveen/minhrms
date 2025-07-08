"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const documentController_1 = __importDefault(require("../controllers/documents/documentController"));
var router = express_1.default.Router();
router.get("/letter", (0, Authorize_1.Authorize)("admin_dashboard.view"), (req, res, next) => documentController_1.default.getDocuments(req, res, next));
router.delete('/letter/:id', (0, Authorize_1.Authorize)("admin_dashboard.view"), (req, res, next) => documentController_1.default.deleteDocuments(req, res, next));
exports.default = router;
