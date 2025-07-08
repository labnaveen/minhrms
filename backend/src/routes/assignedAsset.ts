import express from 'express';
import { Authorize } from '../middleware/Authorize';
import { AssignedAssetController } from '../controllers/asset/assignedAssetController';
import AssignedAsset from '../models/assignedAsset';



var router = express.Router()

const assignedAsset = AssignedAssetController(AssignedAsset)


router.get('/', Authorize('manage_assets.view'), (req, res, next) => assignedAsset.getAll(req, res, next))

router.get('/:id', Authorize('manage_assets.view'), (req, res, next) => assignedAsset.getById(req, res, next))




export default router;