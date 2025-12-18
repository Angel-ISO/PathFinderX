import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validateRequest.js';

export const validateRouteRequest = [
  body('start')
    .exists().withMessage('Start node is required')
    .isNumeric().withMessage('Start node must be a number'),

  body('end')
    .exists().withMessage('End node is required')
    .isNumeric().withMessage('End node must be a number'),

  body('stops')
    .optional()
    .isArray().withMessage('Stops must be an array of numbers')
    .custom(arr => arr.every(Number.isFinite)).withMessage('Each stop must be a number'),

  body('obstacles')
    .optional()
    .isArray().withMessage('Obstacles must be an array of numbers')
    .custom(arr => arr.every(Number.isFinite)).withMessage('Each obstacle must be a number'),

  validateRequest
];