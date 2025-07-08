import express from "express";
import { Authorize } from "../middleware/Authorize";
import { templateForBulkUploadEmployees } from "../controllers/templates/templatesController";



let router = express.Router()



router.get('/employee-bulk-upload', (req, res, next) => templateForBulkUploadEmployees(req, res, next))




export default router