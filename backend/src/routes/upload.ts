import express from 'express';
import { Authorize } from '../middleware/Authorize';
import { UploadController } from '../controllers/uploadController';
import  path  from 'path'



let router = express.Router()


router.post('/image', (req, res, next) => UploadController().uploadImage(req, res, next))

router.post('/image/profile', Authorize('employee_profile.edit'), (req, res, next) => UploadController().uploadProfileImage(req, res, next))

router.post('/file', (req, res, next) => UploadController().fileUpload(req, res, next))

router.get('/files/:filename', (req, res) => {
    const { filename } = req.params;
    // Construct the full path to the PDF file
    const filePath = path.join(__dirname, '../..', 'media!ibrary/file',filename);
    // Send the PDF file as a response
    res.sendFile(filePath);
});

router.post('/file/document', (req, res, next) => UploadController().documentUploadMultiple(req, res, next))
router.post('/image/document', (req, res, next) => UploadController().uploadImageForDocument(req, res, next))

export default router