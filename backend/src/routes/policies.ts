import express, { Router } from 'express'
import { Authorize } from '../middleware/Authorize'
import { PolicyController } from '../controllers/policies/policiesController'
import { User } from '../models'



var router = express.Router()



router.get('/', Authorize('policies_summary.view'), (req, res, next) => PolicyController(User).getPolicySummary(req, res, next) )

router.get('/employees', Authorize('policies_summary.view'), (req, res, next) => PolicyController(User).employeePolicies(req, res, next))

router.get('/attendance', Authorize('policies_summary.view'), (req, res, next) => PolicyController(User).attendancePolicies(req, res, next))

router.get('/leave', Authorize('policies_summary.view'), (req, res, next) => PolicyController(User).leavePolicies(req, res, next))

router.get('/holidays', Authorize('policies_summary.view'), (req, res, next) => PolicyController(User).holidayPolicies(req, res, next))

export default router