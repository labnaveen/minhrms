import express from 'express'
import { Authorize } from '../middleware/Authorize'
import { MasterController } from '../controllers/masterController'
import { Permissions } from '../models'
import { DropdownController } from '../controllers/dropdown/dropdownController'
import { PermissionController } from '../controllers/employee/permissionController'


var router = express.Router()

const permissionController = PermissionController(Permissions);



router.get('/', Authorize('role_permissions.view'), (req, res, next) => permissionController.getAll(req, res, next))

router.post('/', Authorize('role_permissions.add'), (req, res, next) => permissionController.create(req, res, next))



export default router