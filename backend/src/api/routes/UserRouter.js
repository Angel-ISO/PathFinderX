import express from 'express';
import * as userController from '../../api/controller/UserController.js';
import { userUpdateValidator } from '../../api/validations/userUpdateValidator.js';
import { validateRequest } from '../../api/middleware/validateRequest.js';
import { authenticateToken } from '../../api/middleware/authMiddleware.js';
import { ownerAuth } from '../../api/middleware/ownerAuthMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "687b02437e2366cb3eb9bca9"
 *         firstName:
 *           type: string
 *           example: "angel"
 *         lastName:
 *           type: string
 *           example: "ortega"
 *         username:
 *           type: string
 *           example: "angelito_374"
 *         email:
 *           type: string
 *           example: "angelgabrielorteg@gmail.com"
 *         role:
 *           type: string
 *           example: "user"
 *         isVerified:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-19T02:26:11.171Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-19T02:26:22.374Z"
 */

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get paginated list of users with search capability
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term (username, first name or last name)
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalCount:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     hasPrevious:
 *                       type: boolean
 *                       example: false
 *                     hasNext:
 *                       type: boolean
 *                       example: false
 *                     search:
 *                       type: string
 *                       example: ""
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, userController.getAll);


/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateToken, userController.getOne);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   patch:
 *     summary: Partially update a user
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Angel"
 *               lastName:
 *                 type: string
 *                 example: "Ortega"
 *               username:
 *                 type: string
 *                 example: "angel_ortega"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "angel@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "MySecurePass123"
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid data
 *       404:
 *         description: User not found
 */
router.patch('/:id', authenticateToken, ownerAuth('user'), userUpdateValidator, validateRequest, userController.patch);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticateToken, ownerAuth('user'), userController.remove);

export default router;