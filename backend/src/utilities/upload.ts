import multer from 'multer';
import path from 'path';
import fs from 'fs'

const dynamicDestination = (req: Request, file: File, cb: any) => {
    let destinationDir = '';

    console.log("URL", req.url)

    if(req.url.startsWith('/image')){
        destinationDir = 'media!ibrary/images'
    }else if(req.url.startsWith('/file')){
        destinationDir = 'media!ibrary/documents'
    }else {
        destinationDir = 'media!ibrary/other';
    }
    const uploadDir = path.join(__dirname, '../../', destinationDir);
    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, {recursive: true});
    }
    cb(null, uploadDir)
}


// Function to filter file types for document uploads
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedFileTypes = ['.jpeg', '.jpg', '.png'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(extname)) {
        cb(null, true); // Accept the file
    } else {
        console.log('IMAGE ERROR')
        // cb(new Error('Invalid image file type for documents. Allowed types: jpeg, jpg, png'), false);
        cb(null, false)
    }
};


// Function to filter file types for document uploads
const documentFileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedFileTypes = ['.pdf', '.docx', '.doc'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(extname)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid letter type for documents. Allowed types: pdf, docx, doc'));
        // return cb(null, false)
    }
};


const imageStorage = multer.diskStorage({
    //@ts-ignore
    destination: dynamicDestination,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        cb(null, 'image-' + uniqueSuffix + extname);
    },
});

const letterStorage = multer.diskStorage({
    //@ts-ignore
    destination: dynamicDestination,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        cb(null, 'letter-' + uniqueSuffix + extname);
    },
});

const documentStorage = multer.diskStorage({
    //@ts-ignore
    destination: dynamicDestination,
    filename: (req, file, cb) => {
        //@ts-ignore
        const uniqueSuffix = Date.now() + '-' + Math.random(Math.random() * 1E9)
        const extname = path.extname(file.originalname);
        cb(null, 'document-' + uniqueSuffix + extname)
    }
})

//@ts-ignore
export const imageUpload = multer({storage: imageStorage, fileFilter: imageFileFilter})
//@ts-ignore
export const letterUpload = multer({storage: letterStorage, fileFilter: documentFileFilter})
export const documentUpload = multer({ storage: documentStorage })