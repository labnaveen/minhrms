"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const uploadController_1 = require("../controllers/uploadController");
const path_1 = __importDefault(require("path"));
let router = express_1.default.Router();
router.post('/image', (req, res, next) => (0, uploadController_1.UploadController)().uploadImage(req, res, next));
router.post('/image/profile', (0, Authorize_1.Authorize)('employee_profile.edit'), (req, res, next) => (0, uploadController_1.UploadController)().uploadProfileImage(req, res, next));
router.post('/file', (req, res, next) => (0, uploadController_1.UploadController)().fileUpload(req, res, next));
router.get('/files/:filename', (req, res) => {
    const { filename } = req.params;
    // Construct the full path to the PDF file
    const filePath = path_1.default.join(__dirname, '../..', 'media!ibrary/file', filename);
    // Send the PDF file as a response
    res.sendFile(filePath);
});
router.post('/file/document', (req, res, next) => (0, uploadController_1.UploadController)().documentUploadMultiple(req, res, next));
router.post('/image/document', (req, res, next) => (0, uploadController_1.UploadController)().uploadImageForDocument(req, res, next));
exports.default = router;
