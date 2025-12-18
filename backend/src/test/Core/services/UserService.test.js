import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import UserService from '../../../core/service/UserService.js';
import bcrypt from 'bcryptjs';

jest.unstable_mockModule('../../../Infrastructure/repository/UserRepository.js', () => ({
  default: jest.fn().mockImplementation(() => ({
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    countDocuments: jest.fn()
  }))
}));

jest.unstable_mockModule('../../../core/Interceptors/RunInterceptors.js', () => ({
  runInterceptors: jest.fn()
}));

jest.unstable_mockModule('../../../core/Interceptors/User/UniqueUsernameInterceptor.js', () => ({
  validateUniqueUsername: jest.fn()
}));

jest.unstable_mockModule('../../../core/Interceptors/User/UniqueEmailInterceptor.js', () => ({
  validateUniqueEmail: jest.fn()
}));

jest.unstable_mockModule('../../../core/Interceptors/User/PasswordStrengthInterceptor.js', () => ({
  validatePasswordStrength: jest.fn()
}));

const mockCreatePager = jest.fn();
const mockCreateParams = jest.fn();

jest.unstable_mockModule('../../../core/helpers/Pager.js', () => ({
  createPager: mockCreatePager
}));

jest.unstable_mockModule('../../../core/helpers/Params.js', () => ({
  createParams: mockCreateParams
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    genSalt: jest.fn(),
    hash: jest.fn()
  }
}));

describe('UserService', () => {
  let userService;
  let mockUserRepository;
  let mockRunInterceptors;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockUserRepository = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      countDocuments: jest.fn()
    };

    mockRunInterceptors = jest.fn();

    bcrypt.genSalt = jest.fn().mockResolvedValue('mock-salt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed-password');

    mockCreateParams.mockImplementation((params = {}) => ({
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
      search: params.search || ''
    }));

    mockCreatePager.mockImplementation((data) => ({
      registers: data.registers,
      total: data.total,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize,
      totalPages: Math.ceil(data.total / data.pageSize),
      hasNext: data.pageIndex < Math.ceil(data.total / data.pageSize),
      hasPrevious: data.pageIndex > 1,
      search: data.search
    }));

    userService = new UserService({
      userRepository: mockUserRepository,
      runInterceptorsFn: mockRunInterceptors
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Constructor', () => {
    test('should create instance with default dependencies', () => {
      const service = new UserService();
      expect(service).toBeDefined();
      expect(service.userRepository).toBeDefined();
      expect(service.runInterceptors).toBeDefined();
    });

    test('should create instance with custom dependencies', () => {
      const customRepo = { findByEmail: jest.fn() };
      const customInterceptor = jest.fn();
      
      const service = new UserService({
        userRepository: customRepo,
        runInterceptorsFn: customInterceptor
      });
      
      expect(service.userRepository).toBe(customRepo);
      expect(service.runInterceptors).toBe(customInterceptor);
    });
  });

  describe('findByEmail', () => {
    test('should call userRepository.findByEmail with correct email', async () => {
      const email = 'test@example.com';
      const expectedUser = { id: 1, email };
      
      mockUserRepository.findByEmail.mockResolvedValue(expectedUser);

      const result = await userService.findByEmail(email);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBe(expectedUser);
    });

    test('should return null when user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await userService.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    test('should call userRepository.findByUsername with correct username', async () => {
      const username = 'testuser';
      const expectedUser = { id: 1, username };
      
      mockUserRepository.findByUsername.mockResolvedValue(expectedUser);

      const result = await userService.findByUsername(username);

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(result).toBe(expectedUser);
    });
  });

  describe('findById', () => {
    test('should call userRepository.findById with correct id', async () => {
      const id = '507f1f77bcf86cd799439011';
      const expectedUser = { id, username: 'testuser' };
      
      mockUserRepository.findById.mockResolvedValue(expectedUser);

      const result = await userService.findById(id);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedUser);
    });
  });

  describe('create', () => {
    const userData = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'plainPassword123',
      firstName: 'John',
      lastName: 'Doe'
    };

    test('should run interceptors before creating user', async () => {
      const expectedUser = { id: 1, ...userData, password: 'hashed-password' };
      mockUserRepository.create.mockResolvedValue(expectedUser);

      await userService.create(userData);

      expect(mockRunInterceptors).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.any(Function), 
          expect.any(Function), 
          expect.any(Function)  
        ]),
        userData
      );
    });

    test('should hash password before creating user', async () => {
      const expectedUser = { id: 1, ...userData, password: 'hashed-password' };
      mockUserRepository.create.mockResolvedValue(expectedUser);

      await userService.create(userData);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 'mock-salt');
    });

    test('should call userRepository.create with hashed password', async () => {
      const expectedUser = { id: 1, ...userData, password: 'hashed-password' };
      mockUserRepository.create.mockResolvedValue(expectedUser);

      const result = await userService.create(userData);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed-password'
      });
      expect(result).toBe(expectedUser);
    });

    test('should throw error if interceptors fail', async () => {
      const interceptorError = new Error('Username already exists');
      mockRunInterceptors.mockRejectedValue(interceptorError);

      await expect(userService.create(userData)).rejects.toThrow(interceptorError);
      
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const userId = '507f1f77bcf86cd799439011';
    const updateData = {
      username: 'updateduser',
      email: 'updated@example.com',
      firstName: 'Jane'
    };

    test('should run interceptors before updating user', async () => {
      const expectedUser = { id: userId, ...updateData };
      mockUserRepository.update.mockResolvedValue(expectedUser);

      await userService.update(userId, updateData);

      expect(mockRunInterceptors).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.any(Function),
          expect.any(Function),
          expect.any(Function)
        ]),
        updateData
      );
    });

    test('should call userRepository.update with correct parameters', async () => {
      const expectedUser = { id: userId, ...updateData };
      mockUserRepository.update.mockResolvedValue(expectedUser);

      const result = await userService.update(userId, updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(result).toBe(expectedUser);
    });

    test('should throw error if interceptors fail', async () => {
      const interceptorError = new Error('Email already exists');
      mockRunInterceptors.mockRejectedValue(interceptorError);

      await expect(userService.update(userId, updateData)).rejects.toThrow(interceptorError);
      
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    test('should call userRepository.delete with correct id', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const deleteResult = { deletedCount: 1 };
      
      mockUserRepository.delete.mockResolvedValue(deleteResult);

      const result = await userService.delete(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
      expect(result).toBe(deleteResult);
    });
  });

  describe('findAll', () => {
    test('should return paginated users without search', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', firstName: 'John', lastName: 'Doe' },
        { id: 2, username: 'user2', firstName: 'Jane', lastName: 'Smith' }
      ];
      const totalCount = 25;

      mockUserRepository.countDocuments.mockResolvedValue(totalCount);
      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.findAll({ pageIndex: 1, pageSize: 10 });

      expect(mockUserRepository.countDocuments).toHaveBeenCalledWith({});
      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        query: {},
        skip: 0,
        limit: 10
      });

      expect(result.registers).toBe(mockUsers);
      expect(result.total).toBe(totalCount);
      expect(result.pageIndex).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    test('should return paginated users with search query', async () => {
      const searchTerm = 'john';
      const mockUsers = [{ id: 1, username: 'john123', firstName: 'John', lastName: 'Doe' }];
      const totalCount = 1;

      mockUserRepository.countDocuments.mockResolvedValue(totalCount);
      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.findAll({ 
        pageIndex: 1, 
        pageSize: 10, 
        search: searchTerm 
      });

      const expectedQuery = {
        $or: [
          { username: { $regex: searchTerm, $options: 'i' } },
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      expect(mockUserRepository.countDocuments).toHaveBeenCalledWith(expectedQuery);
      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        query: expectedQuery,
        skip: 0,
        limit: 10
      });

      expect(result.registers).toBe(mockUsers);
      expect(result.search).toBe(searchTerm);
    });

    test('should handle pagination correctly for second page', async () => {
      const mockUsers = [{ id: 3, username: 'user3' }];
      const totalCount = 25;

      mockUserRepository.countDocuments.mockResolvedValue(totalCount);
      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      await userService.findAll({ pageIndex: 2, pageSize: 10 });

      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        query: {},
        skip: 10, 
        limit: 10
      });
    });

    test('should handle Promise.all correctly', async () => {
      const mockUsers = [{ id: 1, username: 'user1' }];
      const totalCount = 1;

      let countResolve, findAllResolve;
      const countPromise = new Promise(resolve => { countResolve = resolve; });
      const findAllPromise = new Promise(resolve => { findAllResolve = resolve; });

      mockUserRepository.countDocuments.mockReturnValue(countPromise);
      mockUserRepository.findAll.mockReturnValue(findAllPromise);

      const resultPromise = userService.findAll();

      countResolve(totalCount);
      findAllResolve(mockUsers);

      const result = await resultPromise;

      expect(result.registers).toBe(mockUsers);
      expect(result.total).toBe(totalCount);
    });
  });

  describe('Error handling', () => {
    test('should propagate repository errors', async () => {
      const repositoryError = new Error('Database connection failed');
      mockUserRepository.findByEmail.mockRejectedValue(repositoryError);

      await expect(userService.findByEmail('test@example.com'))
        .rejects.toThrow('Database connection failed');
    });

    test('should propagate bcrypt errors during user creation', async () => {
      const bcryptError = new Error('Hashing failed');
      bcrypt.hash.mockRejectedValue(bcryptError);

      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(userService.create(userData)).rejects.toThrow('Hashing failed');
    });
  });
});