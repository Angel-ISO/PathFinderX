import { body } from 'express-validator';

export const userRegisterValidator = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),

  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),

  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 4, max: 20 }).withMessage('Username must be between 4 and 20 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Must contain at least one number')
];

export const userLoginValidator = [
  body('username')
    .exists().withMessage('Username is required')
    .isString().withMessage('Username must be a string')
    .notEmpty().withMessage('Username cannot be empty'),
    
  body('password')
    .exists().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .notEmpty().withMessage('Password cannot be empty')
];