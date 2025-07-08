"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorize_1 = require("../middleware/Authorize");
const models_1 = require("../models");
const roleController_1 = require("../controllers/employee/roleController");
const dropdownController_1 = require("../controllers/dropdown/dropdownController");
var router = express_1.default.Router();
var roleController = (0, roleController_1.RoleController)(models_1.Roles);
var dropdownController = (0, dropdownController_1.DropdownController)(models_1.Roles);
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
router.get('/', (0, Authorize_1.Authorize)('role_permissions.view'), (req, res, next) => roleController.getAll(req, res, next));
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
router.post('/', (0, Authorize_1.Authorize)('role_permissions.add'), roleController.create);
router.post('/:id/permissions', (0, Authorize_1.Authorize)('role_permissions.add'), roleController.addPermissions);
router.put('/:id/permissions', (0, Authorize_1.Authorize)('role_permissions.edit'), roleController.editPermissions);
router.get('/dropdown', (0, Authorize_1.Authorize)('role_permissions.view'), (req, res, next) => {
    const option = {
        where: { is_deleted: false },
        attribute: ['id', 'name']
    };
    dropdownController.getAllDropdown(req, res, next, option);
});
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
router.get('/:id', (0, Authorize_1.Authorize)('role_permissions.view'), roleController.getById);
router.delete('/:id', (0, Authorize_1.Authorize)('role_permissions.delete'), (req, res, next) => roleController.destroy(req, res, next));
router.put('/:id', (0, Authorize_1.Authorize)('role_permissions.edit'), (req, res, next) => roleController.update(req, res, next));
exports.default = router;
