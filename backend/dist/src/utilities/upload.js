"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentUpload = exports.letterUpload = exports.imageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dynamicDestination = (req, file, cb) => {
    let destinationDir = '';
    console.log("URL", req.url);
    if (req.url.startsWith('/image')) {
        destinationDir = 'media!ibrary/images';
    }
    else if (req.url.startsWith('/file')) {
        destinationDir = 'media!ibrary/documents';
    }
    else {
        destinationDir = 'media!ibrary/other';
    }
    const uploadDir = path_1.default.join(__dirname, '../../', destinationDir);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
};
// Function to filter file types for document uploads
const imageFileFilter = (req, file, cb) => {
    const allowedFileTypes = ['.jpeg', '.jpg', '.png'];
    const extname = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(extname)) {
        cb(null, true); // Accept the file
    }
    else {
        console.log('IMAGE ERROR');
        // cb(new Error('Invalid image file type for documents. Allowed types: jpeg, jpg, png'), false);
        cb(null, false);
    }
};
// Function to filter file types for document uploads
const documentFileFilter = (req, file, cb) => {
    const allowedFileTypes = ['.pdf', '.docx', '.doc'];
    const extname = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(extname)) {
        cb(null, true); // Accept the file
    }
    else {
        cb(new Error('Invalid letter type for documents. Allowed types: pdf, docx, doc'));
        // return cb(null, false)
    }
};
const imageStorage = multer_1.default.diskStorage({
    //@ts-ignore
    destination: dynamicDestination,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path_1.default.extname(file.originalname);
        cb(null, 'image-' + uniqueSuffix + extname);
    },
});
const letterStorage = multer_1.default.diskStorage({
    //@ts-ignore
    destination: dynamicDestination,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path_1.default.extname(file.originalname);
        cb(null, 'letter-' + uniqueSuffix + extname);
    },
});
const documentStorage = multer_1.default.diskStorage({
    //@ts-ignore
    destination: dynamicDestination,
    filename: (req, file, cb) => {
        //@ts-ignore
        const uniqueSuffix = Date.now() + '-' + Math.random(Math.random() * 1E9);
        const extname = path_1.default.extname(file.originalname);
        cb(null, 'document-' + uniqueSuffix + extname);
    }
});
//@ts-ignore
exports.imageUpload = (0, multer_1.default)({ storage: imageStorage, fileFilter: imageFileFilter });
//@ts-ignore
exports.letterUpload = (0, multer_1.default)({ storage: letterStorage, fileFilter: documentFileFilter });
exports.documentUpload = (0, multer_1.default)({ storage: documentStorage });
