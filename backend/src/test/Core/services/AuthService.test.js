import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

jest.unstable_mockModule('../../../core/service/UserService.js', () => ({
  default: jest.fn().mockImplementation(() => ({
    findByUsername: jest.fn()
  }))
}));

jest.unstable_mockModule('../../../core/Interceptors/RunInterceptors.js', () => ({
  runInterceptors: jest.fn()
}));

jest.unstable_mockModule('../../../core/Interceptors/User/ConfirmedMailInterceptor.js', () => ({
  validateConfirmedMail: jest.fn()
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    compare: jest.fn()
  }
}));

jest.unstable_mockModule('../../../shared/utils/JwtUtils.js', () => ({
  generateToken: jest.fn().mockImplementation(user => `mock-token-for-${user.username}`)
}));

jest.unstable_mockModule('../../../api/dto/Auth/AuthResponse.js', () => ({
  default: jest.fn().mockImplementation(({ username, message, jwt, status }) => ({
    username,
    message,
    jwt,
    status
  }))
}));

jest.unstable_mockModule('../../../api/dto/Auth/AuthLoginRequest.js', () => ({
  default: jest.fn().mockImplementation((body) => ({
    username: body.username,
    password: body.password
  }))
}));

jest.unstable_mockModule('../../../shared/errors/Result.js', () => {
  const Result = {
    ok: (value) => ({
      isOk: () => true,
      isFail: () => false,
      value,
      flatMap: (fn) => fn(value),
      map: (fn) => Result.ok(fn(value))
    }),
    fail: (error) => ({
      isOk: () => false,
      isFail: () => true,
      error,
      flatMap: () => Result.fail(error),
      map: () => Result.fail(error)
    })
  };
  return { Result };
});

describe('AuthService - login', () => {
  let authService;
  let mockUserService;
  let mockRunInterceptors;
  let mockCompare;
  let mockGenerateToken;
  let mockAuthResponse;

  beforeEach(async () => {
    const { default: AuthService } = await import('../../../core/service/AuthService.js');
    const { default: UserService } = await import('../../../core/service/UserService.js');
    const { runInterceptors } = await import('../../../core/Interceptors/RunInterceptors.js');
    const bcrypt = (await import('bcryptjs')).default;
    const { generateToken } = await import('../../../shared/utils/JwtUtils.js');
    const { default: AuthResponse } = await import('../../../api/dto/Auth/AuthResponse.js');

    mockUserService = new UserService();
    mockUserService.findByUsername = jest.fn();

    mockRunInterceptors = runInterceptors;
    mockCompare = bcrypt.compare;
    mockGenerateToken = generateToken;
    mockAuthResponse = AuthResponse;

    authService = new AuthService();
    authService.userService = mockUserService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fail if user is not found', async () => {
    mockUserService.findByUsername.mockResolvedValue(null);

    const result = await authService.login({ username: 'invalid', password: '1234' });
    
    expect(result.isFail()).toBe(true);
    expect(result.error.message).toBe('User not found');
  });

  test('should fail if email is not confirmed', async () => {
    const user = { username: 'test', password: 'hashed' };
    mockUserService.findByUsername.mockResolvedValue(user);
    mockRunInterceptors.mockRejectedValue(new Error('Email not confirmed'));

    const result = await authService.login({ username: 'test', password: '1234' });

    expect(mockRunInterceptors).toHaveBeenCalled();
    expect(result.isFail()).toBe(true);
    expect(result.error.message).toBe('Email not confirmed');
  });

  test('should fail if password is incorrect', async () => {
    const user = { username: 'test', password: 'hashed' };
    mockUserService.findByUsername.mockResolvedValue(user);
    mockRunInterceptors.mockResolvedValue();
    mockCompare.mockResolvedValue(false);

    const result = await authService.login({ username: 'test', password: 'wrongpass' });

    expect(mockCompare).toHaveBeenCalledWith('wrongpass', 'hashed');
    expect(result.isFail()).toBe(true);
    expect(result.error.message).toBe('Incorrect password');
  });

  test('should return AuthResponse on success', async () => {
    const user = { username: 'testuser', password: 'hashedpass' };
    mockUserService.findByUsername.mockResolvedValue(user);
    mockRunInterceptors.mockResolvedValue();
    mockCompare.mockResolvedValue(true);

    const result = await authService.login({ username: 'testuser', password: 'correctpass' });

    expect(result.isOk()).toBe(true);
    expect(result.value.username).toBe('testuser');
    expect(result.value.message).toBe('User logged in successfully');
    expect(result.value.jwt).toContain('mock-token-for-testuser');
    expect(result.value.status).toBe(true);
  });
});