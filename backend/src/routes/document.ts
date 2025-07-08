import express from 'express';
import { Authorize } from '../middleware/Authorize';
import documentController from '../controllers/documents/documentController';


var router = express.Router()


router.get("/letter", Authorize("admin_dashboard.view"), (req, res, next) => documentController.getDocuments(req, res, next))

router.delete('/letter/:id', Authorize("admin_dashboard.view"), (req, res, next) => documentController.deleteDocuments(req, res, next))


export default router;