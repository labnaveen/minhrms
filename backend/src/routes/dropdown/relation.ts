import express from 'express'
import { DropdownController } from '../../controllers/dropdown/dropdownController'
import Approval from '../../models/dropdown/status/approval'
import Marking from '../../models/dropdown/status/marking'
import { Authorize } from '../../middleware/Authorize'
import Relation from '../../models/dropdown/relation/relation'


var router = express.Router()

const relationDropdown = DropdownController(Relation)

router.get('/',  (req, res, next) => relationDropdown.getAllDropdown(req, res, next))

export default router;