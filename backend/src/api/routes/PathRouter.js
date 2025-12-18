import express from 'express';
import * as pathController from '../controller/PathController.js';
import { authenticateToken } from '../../api/middleware/authMiddleware.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/path/calculate:
 *   post:
 *     summary: Calculates the optimal route from a starting node to an end node, with optional stops and obstacles
 *     tags: [Path]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start
 *               - end
 *             properties:
 *               start:
 *                 type: number
 *                 example: 12345
 *               end:
 *                 type: number
 *                 example: 67890
 *               stops:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [34567, 45678]
 *               obstacles:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [11111, 22222]
 *     responses:
 *       200:
 *         description: Optimal route calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: number
 *                   lat:
 *                     type: number
 *                   lon:
 *                     type: number
 *       400:
 *         description: Invalid data or route not found
 *       500:
 *         description: Internal server error
 */
router.post('/calculate', authenticateToken, cacheMiddleware({ namespace: 'route:calc:v1', ttlSeconds: Number(process.env.CACHE_TTL_SECONDS) }), pathController.calculateRoute);

export default router;