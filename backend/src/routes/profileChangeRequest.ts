import express, { Router } from 'express'
import { Authorize } from '../middleware/Authorize'
import { PolicyController } from '../controllers/policies/policiesController'
import { User } from '../models'
import { ProfileChangeController } from '../controllers/profileChange/profileChangeController'
import ProfileChangeRequests from '../models/profileChangeRequests'



var router = express.Router()


const profileChangeController = ProfileChangeController(ProfileChangeRequests)


router.get('/requests', Authorize('profile_update_requests.view'), (req, res, next) => profileChangeController.getAll(req, res, next))

router.get('/admin/requests', Authorize('profile_update_requests.view'), (req, res, next) => profileChangeController.getAdminProfileChangeRequests(req, res, next))

router.put("/admin/:id/approve", Authorize('profile_update_requests.view'), (req, res, next) => profileChangeController.adminApprovalProfileChangeRequests(req, res, next))

router.put("/admin/:id/reject", Authorize('profile_update_requests.edit'), (req, res, next) => profileChangeController.adminRejectionProfileChangeRequests(req, res, next))


export default router