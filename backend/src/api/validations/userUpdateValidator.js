import { body } from 'express-validator';

export const userUpdateValidator = [
  body('firstName')
    .optional()
    .isLength({ min: 2 }).withMessage('The first name must be at least 2 characters long'),

  body('lastName')
    .optional()
    .isLength({ min: 2 }).withMessage('The last name must be at least 2 characters long'),

  body('username')
    .optional()
    .isLength({ min: 4, max: 20 }).withMessage('The username must be between 4 and 20 characters'),

  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email address'),

  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('THe password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Should contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Should contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Should contain at least one number')
];