"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const profileChangeController_1 = require("../controllers/profileChange/profileChangeController");
const profileChangeRequests_1 = __importDefault(require("../models/profileChangeRequests"));
var router = express_1.default.Router();
const profileChangeController = (0, profileChangeController_1.ProfileChangeController)(profileChangeRequests_1.default);
router.get('/requests', (0, Authorize_1.Authorize)('profile_update_requests.view'), (req, res, next) => profileChangeController.getAll(req, res, next));
exports.default = router;
