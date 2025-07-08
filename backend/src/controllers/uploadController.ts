import { NextFunction, Request, Response } from "express";
import { Model } from "sequelize";
import { internalServerError } from "../services/error/InternalServerError";
import { imageUpload, letterUpload, documentUpload } from "../utilities/upload";
import { generateResponse } from "../services/response/response";
import path from "path";
import { badRequest } from "../services/error/BadRequest";
import ProfileImages from "../models/profileImages";
import Documents from "../models/documents";
import Letter from "../models/letter";
import { User } from "../models";
import moment from "moment";
import multer, { MulterError } from "multer";


export type UploadController = {
    uploadImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fileUpload: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    uploadProfileImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    documentUploadMultiple: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    uploadImageForDocument: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};



export function UploadController<T extends Model>(): UploadController {

    const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            //@ts-ignore
            upload.single('image')(req, res, async(err) => {
                if (err) {
                    return next(internalServerError('File Upload failed: ' + err.message));
                }

                const allowedFileTypes = ['.jpg', '.jpeg', '.png'];


                const uploadedFile = req.file as any;
                if (!uploadedFile) {
                    next(internalServerError("No file provided"));
                }

                const fileExtension = path.extname(uploadedFile?.originalname).toLowerCase();
                if (!allowedFileTypes.includes(fileExtension)) {
                    return next(badRequest('Invalid file type. Allowed types: jpg, jpeg, png'))
                }


                const filePath = uploadedFile?.path;

                const apiUrl = 'uploads'
                const fileArray = uploadedFile?.path
                const fileName = fileArray?.split('images')
                const lastIndex = fileName.length - 1
                const fileURL = apiUrl + fileName[lastIndex]

                const response = generateResponse(201, true,  "File Uploaded Succesfully!", fileURL)
                res.status(200).json(response);
            });
        } catch (err) {
            next(internalServerError("Something went wrong!"));
        }
    }

    const fileUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            documentUpload.single('file')(req, res, async(err) => {
                if (err) {
                    console.log(err)
                    next(internalServerError("File upload Failed: " + err.message))
                }

                const allowedFileTypes = [
                    '.pdf',                          // PDF documents
                    '.doc', '.docx',                 // Word documents
                    '.xls', '.xlsx',                 // Excel spreadsheets
                    '.ppt', '.pptx',                 // PowerPoint presentations
                    '.csv', '.jpg',
                    '.jpeg', '.png',
                ];

                const uploadedFile = req.file;

                if (!uploadedFile) {
                    next(internalServerError("No File provided!"))
                } else {
                    const fileExtension = path.extname(uploadedFile?.originalname).toLowerCase();
                    if (!allowedFileTypes.includes(fileExtension)) {
                        return next(badRequest('Invalid file type. Allowed types'))
                    }

                    const filePath = uploadedFile?.path;

                    // const data = {
                    //     filePath: filePath
                    // }
                    const apiUrl = 'uploads/document'
                    const fileArray = uploadedFile?.path
                    console.log(">>", fileArray)
                    const fileName = fileArray?.split('documents')
                    console.log('>>>>>>>>>>>>>fileName: ', fileName)
                    const lastIndex = fileName.length - 1
                    const fileURL = apiUrl + fileName[lastIndex]
                    const data = {
                        filePath: fileURL
                    }

                    const document = await Documents.create({
                        name: uploadedFile.originalname,
                        path: filePath,
                        public_url: fileURL,
                        is_file: true
                    })

                    const response = generateResponse(200, true, "File Uploaded Succesfully!", document)

                    res.status(200).json(response)
                }
            })

        } catch (err) {
            next(internalServerError("Something went wrong!"))
        }
    }

    const uploadProfileImage = async(req: Request, res: Response, next:NextFunction): Promise<void> => {
        try {
            //@ts-ignore
            const {id} = req.credentials
            imageUpload.single('image')(req, res, async(err) => {
                if (err) {
                    return next(internalServerError('File Upload failed: ' + err.message));
                }

                const allowedFileTypes = ['.jpg', '.jpeg', '.png'];


                const uploadedFile = req.file as any;
                if (!uploadedFile) {
                    next(internalServerError("No file provided"));
                }

                const fileExtension = path.extname(uploadedFile?.originalname).toLowerCase();
                if (!allowedFileTypes.includes(fileExtension)) {
                    return next(badRequest('Invalid file type. Allowed types: jpg, jpeg, png'))
                }

                const filePath = uploadedFile?.path;

                const apiUrl = 'uploads'
                const fileArray = uploadedFile?.path
                const fileName = fileArray?.split('images')
                const lastIndex = fileName?.length - 1
                const fileURL = apiUrl + fileName[lastIndex]

                const uploadedImage = await ProfileImages.findOne({
                    where:{
                        user_id: id
                    }
                })

                if(uploadedImage){
                    await uploadedImage.destroy()
                }

                const data = {
                    user_id: id,
                    name: uploadedFile?.originalname.replace(/[\s\u202F]+/g, '_'),
                    path: filePath,
                    public_url: `${fileURL}`,
                    status: true
                }

                const uploadImage = await ProfileImages.create(data);

                const response = generateResponse(201, true,  "File Uploaded Succesfully!", uploadImage)

                res.status(200).json(response);
            });
        } catch (err) {
            next(internalServerError("Something went wrong!"));
        }
    }

    const documentUploadMultiple = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            letterUpload.array('file', 10)(req, res, async(err) => {
                if(err instanceof multer.MulterError){
                    console.log("HAAAN ERROR HAIN!")
                    console.log(err)
                    return next(badRequest("Only 2 files are allowed to be uploaded at a time!"))
                }

                let invalidFileType = false

                const uploadedFile = req.files as any[]

                for(let document of uploadedFile) {
                    const allowedFileTypes = ['.docx', '.pdf', '.doc'];
                    const fileExtension = path.extname(document?.originalname).toLowerCase();
                    console.log(">>>>>>>>>>>>.FILE EXTENSION", allowedFileTypes.includes(fileExtension))
                    if (!allowedFileTypes.includes(fileExtension)) {
                        console.log("NAHI HAIN TYPE KA", document)
                        invalidFileType = true
                        break;
                    }else{
                        const [document_type, employee_id, date, letter_type] = document.originalname.split('_')

                        if(document.originalname.split('_').length !== 4){
                            return next(badRequest("A file is not correctly named in the list!"))
                            break;
                        }

                        if(!employee_id){
                            return next(badRequest("A file is not correctly named in the list!"))
                        }

                        if(!moment(date, 'DD-MM-YYYY', true).isValid()){
                            return next(badRequest("Please check the date format for all the files, it should be in DD-MM-YYYY"))
                        }

                        const apiUrl = 'uploads/document'
                        const fileArray = document?.path
                        const fileName = fileArray?.split('documents')
                        const lastIndex = fileName.length - 1
                        const fileURL = apiUrl + fileName[lastIndex]

                        const user = await User.findOne({
                            where: {
                                employee_generated_id: employee_id?.trim()
                            }
                        }) as any;

                        if(user){
                            const uploadDocument = await Documents.create({
                                name: document.originalname,
                                path: document.path,
                                public_url: fileURL
                            }) as any;
                            const letter = await Letter.create({
                                user_id: user.id,
                                document_id: uploadDocument?.id,
                                letter_type: letter_type.split('.')[0],
                                date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                                status: 3
                            })
                        }
                    }
                }  
                
                // const response = generateResponse(200, true, "Letters uploaded succesfully!")
                // res.status(200).json(response)
                
                if(invalidFileType){
                    return next(badRequest('A file is of invalid type, please remove the file and try again. Allowed types: docx, doc, pdf'))
                }else{
                    const response = generateResponse(200, true, "Letters uploaded succesfully!")
                    res.status(200).json(response)
                }
                
            })

        }catch(err){
            console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

    const uploadImageForDocument = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            documentUpload.single('file')(req, res, async(err) => {
                if (err) {
                    console.log(err)
                    next(internalServerError("File upload Failed: " + err.message))
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
                    next(internalServerError("No File provided!"))
                } else {
                    const fileExtension = path.extname(uploadedFile?.originalname).toLowerCase();
                    if (!allowedFileTypes.includes(fileExtension)) {
                        return next(badRequest('Invalid file type. Allowed types'))
                    }

                    const filePath = uploadedFile?.path;

                    // const data = {
                    //     filePath: filePath
                    // }
                    const apiUrl = 'uploads'
                    const fileArray = uploadedFile?.path
                    console.log(">>", fileArray)
                    const fileName = fileArray?.split('images')
                    console.log('>>>>>>>>>>>>>fileName: ', fileName)
                    const lastIndex = fileName.length - 1
                    const fileURL = apiUrl + fileName[lastIndex]
                    const data = {
                        filePath: fileURL
                    }

                    const document = await Documents.create({
                        name: uploadedFile.originalname,
                        path: filePath,
                        public_url: fileURL,
                        is_file: false
                    })

                    const response = generateResponse(200, true, "File Uploaded Succesfully!", document)

                    res.status(200).json(response)
                }
            })

        } catch (err) {
            next(internalServerError("Something went wrong!"))
        }
    }


    return { uploadImage, fileUpload, uploadProfileImage, documentUploadMultiple, uploadImageForDocument }
}