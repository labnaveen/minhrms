"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const InternalServerError_1 = require("../services/error/InternalServerError");
const upload_1 = require("../utilities/upload");
const response_1 = require("../services/response/response");
const path_1 = __importDefault(require("path"));
const BadRequest_1 = require("../services/error/BadRequest");
const profileImages_1 = __importDefault(require("../models/profileImages"));
const documents_1 = __importDefault(require("../models/documents"));
const letter_1 = __importDefault(require("../models/letter"));
const models_1 = require("../models");
const moment_1 = __importDefault(require("moment"));
const multer_1 = __importDefault(require("multer"));
function UploadController() {
    const uploadImage = async (req, res, next) => {
        try {
            //@ts-ignore
            upload.single('image')(req, res, async (err) => {
                if (err) {
                    return next((0, InternalServerError_1.internalServerError)('File Upload failed: ' + err.message));
                }
                const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
                const uploadedFile = req.file;
                if (!uploadedFile) {
                    next((0, InternalServerError_1.internalServerError)("No file provided"));
                }
                const fileExtension = path_1.default.extname(uploadedFile?.originalname).toLowerCase();
                if (!allowedFileTypes.includes(fileExtension)) {
                    return next((0, BadRequest_1.badRequest)('Invalid file type. Allowed types: jpg, jpeg, png'));
                }
                const filePath = uploadedFile?.path;
                const apiUrl = 'uploads';
                const fileArray = uploadedFile?.path;
                const fileName = fileArray?.split('images');
                const lastIndex = fileName.length - 1;
                const fileURL = apiUrl + fileName[lastIndex];
                const response = (0, response_1.generateResponse)(201, true, "File Uploaded Succesfully!", fileURL);
                res.status(200).json(response);
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const fileUpload = async (req, res, next) => {
        try {
            upload_1.documentUpload.single('file')(req, res, async (err) => {
                if (err) {
                    console.log(err);
                    next((0, InternalServerError_1.internalServerError)("File upload Failed: " + err.message));
                }
                const allowedFileTypes = [
                    '.pdf',
                    '.doc', '.docx',
                    '.xls', '.xlsx',
                    '.ppt', '.pptx',
                    '.csv', '.jpg',
                    '.jpeg', '.png',
                ];
                const uploadedFile = req.file;
                if (!uploadedFile) {
                    next((0, InternalServerError_1.internalServerError)("No File provided!"));
                }
                else {
                    const fileExtension = path_1.default.extname(uploadedFile?.originalname).toLowerCase();
                    if (!allowedFileTypes.includes(fileExtension)) {
                        return next((0, BadRequest_1.badRequest)('Invalid file type. Allowed types'));
                    }
                    const filePath = uploadedFile?.path;
                    // const data = {
                    //     filePath: filePath
                    // }
                    const apiUrl = 'uploads/document';
                    const fileArray = uploadedFile?.path;
                    console.log(">>", fileArray);
                    const fileName = fileArray?.split('documents');
                    console.log('>>>>>>>>>>>>>fileName: ', fileName);
                    const lastIndex = fileName.length - 1;
                    const fileURL = apiUrl + fileName[lastIndex];
                    const data = {
                        filePath: fileURL
                    };
                    const document = await documents_1.default.create({
                        name: uploadedFile.originalname,
                        path: filePath,
                        public_url: fileURL,
                        is_file: true
                    });
                    const response = (0, response_1.generateResponse)(200, true, "File Uploaded Succesfully!", document);
                    res.status(200).json(response);
                }
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const uploadProfileImage = async (req, res, next) => {
        try {
            //@ts-ignore
            const { id } = req.credentials;
            upload_1.imageUpload.single('image')(req, res, async (err) => {
                if (err) {
                    return next((0, InternalServerError_1.internalServerError)('File Upload failed: ' + err.message));
                }
                const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
                const uploadedFile = req.file;
                if (!uploadedFile) {
                    next((0, InternalServerError_1.internalServerError)("No file provided"));
                }
                const fileExtension = path_1.default.extname(uploadedFile?.originalname).toLowerCase();
                if (!allowedFileTypes.includes(fileExtension)) {
                    return next((0, BadRequest_1.badRequest)('Invalid file type. Allowed types: jpg, jpeg, png'));
                }
                const filePath = uploadedFile?.path;
                const apiUrl = 'uploads';
                const fileArray = uploadedFile?.path;
                const fileName = fileArray?.split('images');
                const lastIndex = fileName?.length - 1;
                const fileURL = apiUrl + fileName[lastIndex];
                const uploadedImage = await profileImages_1.default.findOne({
                    where: {
                        user_id: id
                    }
                });
                if (uploadedImage) {
                    await uploadedImage.destroy();
                }
                const data = {
                    user_id: id,
                    name: uploadedFile?.originalname.replace(/[\s\u202F]+/g, '_'),
                    path: filePath,
                    public_url: `${fileURL}`,
                    status: true
                };
                const uploadImage = await profileImages_1.default.create(data);
                const response = (0, response_1.generateResponse)(201, true, "File Uploaded Succesfully!", uploadImage);
                res.status(200).json(response);
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const documentUploadMultiple = async (req, res, next) => {
        try {
            upload_1.letterUpload.array('file', 10)(req, res, async (err) => {
                if (err instanceof multer_1.default.MulterError) {
                    console.log("HAAAN ERROR HAIN!");
                    console.log(err);
                    return next((0, BadRequest_1.badRequest)("Only 2 files are allowed to be uploaded at a time!"));
                }
                let invalidFileType = false;
                const uploadedFile = req.files;
                for (let document of uploadedFile) {
                    const allowedFileTypes = ['.docx', '.pdf', '.doc'];
                    const fileExtension = path_1.default.extname(document?.originalname).toLowerCase();
                    console.log(">>>>>>>>>>>>.FILE EXTENSION", allowedFileTypes.includes(fileExtension));
                    if (!allowedFileTypes.includes(fileExtension)) {
                        console.log("NAHI HAIN TYPE KA", document);
                        invalidFileType = true;
                        break;
                    }
                    else {
                        const [document_type, employee_id, date, letter_type] = document.originalname.split('_');
                        if (document.originalname.split('_').length !== 4) {
                            return next((0, BadRequest_1.badRequest)("A file is not correctly named in the list!"));
                            break;
                        }
                        if (!employee_id) {
                            return next((0, BadRequest_1.badRequest)("A file is not correctly named in the list!"));
                        }
                        if (!(0, moment_1.default)(date, 'DD-MM-YYYY', true).isValid()) {
                            return next((0, BadRequest_1.badRequest)("Please check the date format for all the files, it should be in DD-MM-YYYY"));
                        }
                        const apiUrl = 'uploads/document';
                        const fileArray = document?.path;
                        const fileName = fileArray?.split('documents');
                        const lastIndex = fileName.length - 1;
                        const fileURL = apiUrl + fileName[lastIndex];
                        const user = await models_1.User.findOne({
                            where: {
                                employee_generated_id: employee_id?.trim()
                            }
                        });
                        if (user) {
                            const uploadDocument = await documents_1.default.create({
                                name: document.originalname,
                                path: document.path,
                                public_url: fileURL
                            });
                            const letter = await letter_1.default.create({
                                user_id: user.id,
                                document_id: uploadDocument?.id,
                                letter_type: letter_type.split('.')[0],
                                date: (0, moment_1.default)(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                                status: 3
                            });
                        }
                    }
                }
                // const response = generateResponse(200, true, "Letters uploaded succesfully!")
                // res.status(200).json(response)
                if (invalidFileType) {
                    return next((0, BadRequest_1.badRequest)('A file is of invalid type, please remove the file and try again. Allowed types: docx, doc, pdf'));
                }
                else {
                    const response = (0, response_1.generateResponse)(200, true, "Letters uploaded succesfully!");
                    res.status(200).json(response);
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const uploadImageForDocument = async (req, res, next) => {
        try {
            upload_1.documentUpload.single('file')(req, res, async (err) => {
                if (err) {
                    console.log(err);
                    next((0, InternalServerError_1.internalServerError)("File upload Failed: " + err.message));
                }
                const allowedFileTypes = [
                    '.jpg',
                    '.jpeg',
                    '.png',
                    '.raw',
                    '.webp',
                    '.heic',
                    '.heiv',
                    '.heif'
                ];
                const uploadedFile = req.file;
                if (!uploadedFile) {
                    next((0, InternalServerError_1.internalServerError)("No File provided!"));
                }
                else {
                    const fileExtension = path_1.default.extname(uploadedFile?.originalname).toLowerCase();
                    if (!allowedFileTypes.includes(fileExtension)) {
                        return next((0, BadRequest_1.badRequest)('Invalid file type. Allowed types'));
                    }
                    const filePath = uploadedFile?.path;
                    // const data = {
                    //     filePath: filePath
                    // }
                    const apiUrl = 'uploads';
                    const fileArray = uploadedFile?.path;
                    console.log(">>", fileArray);
                    const fileName = fileArray?.split('images');
                    console.log('>>>>>>>>>>>>>fileName: ', fileName);
                    const lastIndex = fileName.length - 1;
                    const fileURL = apiUrl + fileName[lastIndex];
                    const data = {
                        filePath: fileURL
                    };
                    const document = await documents_1.default.create({
                        name: uploadedFile.originalname,
                        path: filePath,
                        public_url: fileURL,
                        is_file: false
                    });
                    const response = (0, response_1.generateResponse)(200, true, "File Uploaded Succesfully!", document);
                    res.status(200).json(response);
                }
            });
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return { uploadImage, fileUpload, uploadProfileImage, documentUploadMultiple, uploadImageForDocument };
}
exports.UploadController = UploadController;
