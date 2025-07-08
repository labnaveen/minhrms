import express from 'express'
import { Authorize } from '../middleware/Authorize'
import { Roles } from '../models'
import { RoleController } from '../controllers/employee/roleController'
import { DropdownController } from '../controllers/dropdown/dropdownController';


var router = express.Router()

var roleController = RoleController(Roles)

var dropdownController = DropdownController(Roles)


/**
 * @swagger
 * /api/role:
 *   get:
 *      summary: Get a list of all Roles
 *      tags:
 *        - Role
 *      description: Get a list of all Roles
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Getting a list of Roles
router.get('/', Authorize('role_permissions.view'), (req, res, next) => roleController.getAll(req, res, next))


/**
 * @swagger
 * /api/role:
 *   post:
 *      summary: Creating a new role.
 *      tags:
 *        - Role
 *      parameters:
 *         - in: body
 *           name: body
 *           required: true
 *           schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  alias:
 *                      type: string
 *                  description:
 *                      type: string
 *                  status:
 *                      type: boolean
 *                  permissions:
 *                      type: array
 *              required:
 *                  - name
 *              example:
 *                  name: string
 *                  alias: string
 *                  description: string
 *                  status: boolean
 *                  permissions: array
 *      description: API to create new role.
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Creating a new Role
router.post('/', Authorize('role_permissions.add'), roleController.create)

router.post('/:id/permissions', Authorize('role_permissions.add'), roleController.addPermissions)

router.put('/:id/permissions', Authorize('role_permissions.edit'), roleController.editPermissions)


router.get('/dropdown', Authorize('role_permissions.view'), (req, res, next,) => {

    const option = {
        where:{is_deleted: false},
        attribute:['id', 'name']
    }

    dropdownController.getAllDropdown(req, res, next, option)
})




/**
 * @swagger
 * /api/role/{id}:
 *   get:
 *      summary: Get role of a particular employee
 *      tags:
 *        - Role
 *      description: Get the role of a particular employee
 *      parameters:
 *       - name: id
 *         in: path
 *         description: The id of the company to retrieve.
 *         required: true
 *         type: integer
 *         format: int64
 *         minimum: 1
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Getting a list of Roles of a particular user
router.get('/:id', Authorize('role_permissions.view'), roleController.getById)

router.delete('/:id', Authorize('role_permissions.delete'), (req, res, next) => roleController.destroy(req, res, next))

router.put('/:id', Authorize('role_permissions.edit'), (req, res, next) => roleController.update(req, res, next))

export default router