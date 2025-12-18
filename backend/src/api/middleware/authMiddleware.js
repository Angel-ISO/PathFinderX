import jwt from 'jsonwebtoken';
import ApiResponse from '../../shared/errors/ApiResponse.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.status(401).json(new ApiResponse(401));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json(new ApiResponse(401, 'Token is missing'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(403).json(new ApiResponse(403));
      }

      req.user = {
        userId: payload.userId, 
        username: payload.sub,
        email: payload.email,
        role: payload.authorities, 
        isVerified: payload.isVerified
      };

      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json(new ApiResponse(500));
  }
};