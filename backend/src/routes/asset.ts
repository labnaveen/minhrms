import express from 'express';
import { AssetController } from '../controllers/asset/assetController';
import Asset from '../models/asset';
import { Authorize } from '../middleware/Authorize';
import { AssignedAssetController } from '../controllers/asset/assignedAssetController';
import AssignedAsset from '../models/assignedAsset';
import { DropdownController } from '../controllers/dropdown/dropdownController';


var router = express.Router()

const assetController = AssetController(Asset)
const assignedAssetController = AssignedAssetController(AssignedAsset)
const dropdownController = DropdownController(Asset)


router.post('/', Authorize('manage_assets.add'), (req, res, next) => assetController.create(req, res, next))

router.get('/', Authorize('manage_assets.view'), (req, res, next) => {

    const options = {
        included: ['user'],
        attributes: {
            user: ['employee_name', 'employee_generated_id']
        },
    }

    assetController.getAll(req, res, next, options)
})

router.get('/dropdown', Authorize('manage_assets.view'), (req, res, next) => {

    const options = {
        where: {is_assigned: false}
    }

    dropdownController.getAllDropdown(req, res, next, options)
})

router.get('/:id', Authorize('manage_assets.view'), (req, res, next) => {

    const options = {
        included: ['user'],
        attributes: {
            user: ['employee_name', 'employee_generated_id']
        }
    }

    assetController.getById(req, res, next, options)
})

router.put('/:id', Authorize('manage_assets.edit'),(req, res, next) => assetController.update(req, res, next))

router.post('/:id/assign', Authorize('assign_assets.edit'), (req, res, next) => assignedAssetController.assignAsset(req, res, next))

router.patch('/:id/unassign', Authorize('assign_assets.edit'), (req, res, next) => assignedAssetController.unassignAsset(req, res, next))

router.delete('/:id', Authorize('manage_assets.delete'), (req, res, next) => assetController.destroy(req, res, next))

export default router