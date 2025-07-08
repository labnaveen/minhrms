import express from 'express'
import { CompanyController } from '../controllers/company/companyController';
import {Company} from '../models/index'
import { Authorize } from '../middleware/Authorize';
var router = express.Router()


const companyController = CompanyController(Company)

const options = {
    included:['company_address', 'user', 'industry'],
}


/**
 * @swagger
 * /api/company?page={page}&records={records}:
 *   get:
 *      summary: Get a list of all Companies
 *      tags:
 *        - Company
 *      description: Get a list of all Companies
 *      parameters:
 *        - name: page
 *          in: path
 *          description: The number of page, which is 1 by default
 *          required: false
 *          type: integer
 *          format: int64
 *          minimum: 1
 *        - name: records
 *          in: path
 *          description: The number of records per page, which is 10 by default
 *          required: false
 *          type: integer
 *          format: int64
 *          minimum: 10
 *      security:
 *        - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Getting a list of all Company 
router.get('/', Authorize('users.show'), (req, res, next) => companyController.getAll(req, res, next, options))



/**
 * @swagger
 * /api/company/{companyId}:
 *   get:
 *     summary: Get a particular Company
 *     description: Get the details of a particular company using Company id.
 *     parameters:
 *       - name: companyId
 *         in: path
 *         description: The id of the company to retrieve.
 *         required: true
 *         type: integer
 *         format: int64
 *         minimum: 1
 *     tags:
 *       - Company
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id',Authorize('users.show'), companyController.getById)


/**
 * @swagger
 * /api/company:
 *   post:
 *      summary: Create a new Company
 *      tags:
 *        - Company
 *      description: Create a new Company in the Database
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: Success
 *      parameters:
 *          - in: body
 *            name: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  company_name:
 *                      type: string
 *                  company_email:
 *                      type: string
 *                  company_mobile:
 *                      type: integer
 *                  teamsize:
 *                      type: integer
 *                  industryId:
 *                      type: integer
 *                  domain:
 *                      type: string
 *                  pan:
 *                      type: string
 *                  gst:
 *                      type: string
 *                  company_prefix:
 *                      type: string
 *              required:
 *                  - company_name
 *                  - company_email
 *                  - company_mobile
 *                  - industryId
 *                  - domain
 *                  - gst
 *                  - pan
 *              example:
 *                  company_name: string
 *                  company_email: string
 *                  company_mobile: number
 *                  teamsize: number
 *                  industryId: number
 *                  domain: string
 *                  pan: string
 *                  gst: string
 *                  company_prefix: string
 *                  
 *                  
 */
//Creating a Company
router.post('/', Authorize('users.show'), companyController.create)



/**
 * @swagger
 * /api/company/{companyId}:
 *   put:
 *      summary: Update a particular Company
 *      tags:
 *        - Company
 *      description: Update a particular Company details in the Database.
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Updating a Company
router.put('/:id',Authorize('users.show'), companyController.update)




/**
 * @swagger
 * /api/company/{companyId}:
 *   delete:
 *      summary: Deleting a Company
 *      tags:
 *        - Company
 *      description: Delete a particular Company from the Database.
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: Success
 */
//Deleting a Company
router.delete('/:id',Authorize,  companyController.destroy)




export default router;