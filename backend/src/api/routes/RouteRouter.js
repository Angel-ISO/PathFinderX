import express from 'express';
import * as RouteController from '../../api/controller/RouterController.js';
import { authenticateToken } from '../../api/middleware/authMiddleware.js';
import { ownerAuth } from '../../api/middleware/ownerAuthMiddleware.js';
import { validateRequest } from '../../api/middleware/validateRequest.js';


const router = express.Router();




/**
 * @swagger
 * components:
 *   schemas:
 *     Node:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 123456789
 *         lat:
 *           type: number
 *           example: 7.123456
 *         lon:
 *           type: number
 *           example: -73.123456
 *     RouteResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "64b84fa2891cc93a14a57c90"
 *         userId:
 *           type: string
 *           example: "64b84f934f92cd3a14a57c88"
 *         name:
 *           type: string
 *           example: "Ruta segura al colegio"
 *         route:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Node'
 *         totalDistance:
 *           type: number
 *           example: 1.25
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-26T14:23:45.000Z"
 *     RouteCreateRequest:
 *       type: object
 *       required:
 *         - name
 *         - route
 *         - totalDistance
 *       properties:
 *         name:
 *           type: string
 *           example: "Ruta parque"
 *         route:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Node'
 *         totalDistance:
 *           type: number
 *           example: 3.75
 */




/**
 * @swagger
 * /api/v1/route/user:
 *   get:
 *     summary: Get paginated routes by current user
 *     security:
 *       - bearerAuth: []
 *     tags: [Route]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated user routes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RouteResponse'
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
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     search:
 *                       type: string
 */

router.get('/user', authenticateToken, RouteController.findByUser);



/**
 * @swagger
 * /api/v1/route:
 *   post:
 *     summary: Save a calculated route
 *     security:
 *       - bearerAuth: []
 *     tags: [Route]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RouteCreateRequest'
 *     responses:
 *       201:
 *         description: Route created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RouteResponse'
 *       400:
 *         description: Invalid request
 */

router.post('/', authenticateToken, validateRequest,  RouteController.create);

/**
 * @swagger
 * /api/v1/route/{id}:
 *   delete:
 *     summary: Delete a route
 *     security:
 *       - bearerAuth: []
 *     tags: [Route]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Route deleted
 *       404:
 *         description: Route not found
 */

router.delete('/:id', authenticateToken, ownerAuth('route'), RouteController.remove);



export default router;
