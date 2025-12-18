import rateLimit from 'express-rate-limit';
import  ApiResponse  from '../../shared/errors/ApiResponse.js';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json(
      new ApiResponse(429, 'The max request are 10 per minute,  please try again later')
    );
  }
});
