import { validationResult } from 'express-validator';
import  ApiResponse  from '../../shared/errors/ApiResponse.js';

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      new ApiResponse(400, errors.array())
    );
  }
  next();
}