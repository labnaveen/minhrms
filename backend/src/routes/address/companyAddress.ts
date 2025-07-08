import express from 'express'
import { CompanyAddress } from '../../models'
import { MasterController } from '../../controllers/masterController'
var router = express.Router()


router.get('/', MasterController(CompanyAddress).getAll)


export default router