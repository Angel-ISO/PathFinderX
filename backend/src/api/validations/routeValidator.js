import { body } from 'express-validator';

export const routeCreateValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

  body('totalDistance')
    .notEmpty().withMessage('Total distance is required')
    .isFloat({ min: 0 }).withMessage('Total distance must be a positive number'),

  body('route')
    .isArray({ min: 2 }).withMessage('Route must contain at least 2 nodes'),

  body('route.*.id')
    .notEmpty().withMessage('Each node must have an id'),

  body('route.*.lat')
    .notEmpty().withMessage('Each node must have a latitude')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),

  body('route.*.lon')
    .notEmpty().withMessage('Each node must have a longitude')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180')
];
