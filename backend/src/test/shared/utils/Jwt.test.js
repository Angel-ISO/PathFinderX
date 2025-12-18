import { generateToken, verifyToken } from '../../../shared/utils/JwtUtils.js';
import jwt from 'jsonwebtoken';


describe('JWT Utils', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    isVerified: true,
    email: 'test@gmail.com',
    role: 'admin'
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token string', () => {
      const token = generateToken(mockUser);
      expect(typeof token).toBe('string');
    });

    it('should generate a token with correct payload', () => {
      const token = generateToken(mockUser);
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: process.env.JWT_ISSUER
      });

      expect(decoded.sub).toBe(mockUser.username);
      expect(decoded.userId).toBe(mockUser._id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.fullName).toBe('Test User');
      expect(decoded.authorithies).toBe(mockUser.role);
      expect(decoded.jti).toBeDefined();
      expect(decoded.iat).toBeLessThanOrEqual(Math.floor(Date.now() / 1000));
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const token = generateToken(mockUser);
      const payload = verifyToken(token);

      expect(payload.userId).toBe(mockUser._id);
      expect(payload.sub).toBe(mockUser.username);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid.token.here')).toThrow('Invalid or expired token');
    });
  });
});
