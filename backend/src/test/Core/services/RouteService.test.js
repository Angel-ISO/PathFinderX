import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

const mockCreatePager = jest.fn();
const mockCreateParams = jest.fn();
const mockRunInterceptors = jest.fn();
const mockValidateUniqueRouteName = jest.fn();
const mockToRouteResponse = jest.fn();
const mockToRouteCreate = jest.fn();

jest.unstable_mockModule('../../../Infrastructure/repository/RouteRepository.js', () => ({
  default: jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    countDocuments: jest.fn()
  }))
}));

jest.unstable_mockModule('../../../core/Interceptors/RunInterceptors.js', () => ({
  runInterceptors: mockRunInterceptors
}));

jest.unstable_mockModule('../../../core/Interceptors/Route/RouteNameInterceptor.js', () => ({
  validateUniqueRouteName: mockValidateUniqueRouteName
}));

jest.unstable_mockModule('../../../core/helpers/Pager.js', () => ({
  createPager: mockCreatePager
}));

jest.unstable_mockModule('../../../core/helpers/Params.js', () => ({
  createParams: mockCreateParams
}));

jest.unstable_mockModule('../../../api/dto/Route/RouteResponse.js', () => ({
  toRouteResponse: mockToRouteResponse
}));

jest.unstable_mockModule('../../../api/dto/Route/RouteCreateRequest.js', () => ({
  toRouteCreate: mockToRouteCreate
}));

const { default: RouteService } = await import('../../../core/service/RouteService.js');

describe('RouteService', () => {
  let routeService;
  let mockRouteRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouteRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      countDocuments: jest.fn()
    };

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

    mockToRouteResponse.mockImplementation((route) => ({
      id: route.id,
      name: route.name,
      description: route.description,
      userId: route.userId,
      createdAt: route.createdAt
    }));

    mockToRouteCreate.mockImplementation((body, userId) => ({
      name: body.name,
      description: body.description,
      userId: userId,
      waypoints: body.waypoints || []
    }));

    routeService = new RouteService();
    
    routeService.routeRepository = mockRouteRepository;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Constructor', () => {
    test('should create instance with RouteRepository', () => {
      const service = new RouteService();
      expect(service.routeRepository).toBeDefined();
    });
  });

  describe('findByUserContext', () => {
    const userId = '507f1f77bcf86cd799439011';
    const mockRoutes = [
      { id: 1, name: 'Route 1', userId, description: 'Test route 1' },
      { id: 2, name: 'Route 2', userId, description: 'Test route 2' }
    ];
    const mockMappedRoutes = [
      { id: 1, name: 'Route 1', userId, description: 'Test route 1' },
      { id: 2, name: 'Route 2', userId, description: 'Test route 2' }
    ];

    test('should throw error when userId is not provided', async () => {
      await expect(routeService.findByUserContext(null))
        .rejects.toThrow('No authenticated user found');
      
      await expect(routeService.findByUserContext(undefined))
        .rejects.toThrow('No authenticated user found');
      
      await expect(routeService.findByUserContext(''))
        .rejects.toThrow('No authenticated user found');
    });

    test('should return paginated routes for user without search', async () => {
      const totalCount = 25;
      
      mockRouteRepository.countDocuments.mockResolvedValue(totalCount);
      mockRouteRepository.findAll.mockResolvedValue(mockRoutes);
      mockToRouteResponse.mockImplementation(route => route);

      const result = await routeService.findByUserContext(userId, { 
        pageIndex: 1, 
        pageSize: 10 
      });

      expect(mockRouteRepository.countDocuments).toHaveBeenCalledWith({ userId });
      expect(mockRouteRepository.findAll).toHaveBeenCalledWith({
        query: { userId },
        skip: 0,
        limit: 10
      });

      expect(mockToRouteResponse).toHaveBeenCalledTimes(mockRoutes.length);
      
      expect(result.registers).toBeDefined();
      expect(result.total).toBe(totalCount);
      expect(result.pageIndex).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    test('should return paginated routes for user with search', async () => {
      const searchTerm = 'adventure';
      const totalCount = 5;
      
      mockRouteRepository.countDocuments.mockResolvedValue(totalCount);
      mockRouteRepository.findAll.mockResolvedValue(mockRoutes);
      mockToRouteResponse.mockImplementation(route => route);

      const result = await routeService.findByUserContext(userId, { 
        pageIndex: 1, 
        pageSize: 10, 
        search: searchTerm 
      });

      const expectedQuery = {
        userId,
        name: { $regex: searchTerm, $options: 'i' }
      };

      expect(mockRouteRepository.countDocuments).toHaveBeenCalledWith(expectedQuery);
      expect(mockRouteRepository.findAll).toHaveBeenCalledWith({
        query: expectedQuery,
        skip: 0,
        limit: 10
      });

      expect(result.search).toBe(searchTerm);
    });

    test('should handle pagination correctly for second page', async () => {
      const totalCount = 25;
      
      mockRouteRepository.countDocuments.mockResolvedValue(totalCount);
      mockRouteRepository.findAll.mockResolvedValue([]);
      
      await routeService.findByUserContext(userId, { pageIndex: 2, pageSize: 10 });

      expect(mockRouteRepository.findAll).toHaveBeenCalledWith({
        query: { userId },
        skip: 10, 
        limit: 10
      });
    });

    test('should use default pagination values', async () => {
      mockRouteRepository.countDocuments.mockResolvedValue(0);
      mockRouteRepository.findAll.mockResolvedValue([]);
      
      await routeService.findByUserContext(userId);

      expect(mockCreateParams).toHaveBeenCalledWith({
        pageIndex: 1,
        pageSize: 10,
        search: ''
      });
    });
  });

  describe('findById', () => {
    test('should return mapped route when found', async () => {
      const routeId = '507f1f77bcf86cd799439011';
      const mockRoute = { id: routeId, name: 'Test Route', description: 'Test' };
      const mappedRoute = { id: routeId, name: 'Test Route', description: 'Test' };
      
      mockRouteRepository.findById.mockResolvedValue(mockRoute);
      mockToRouteResponse.mockReturnValue(mappedRoute);

      const result = await routeService.findById(routeId);

      expect(mockRouteRepository.findById).toHaveBeenCalledWith(routeId);
      expect(mockToRouteResponse).toHaveBeenCalledWith(mockRoute);
      expect(result).toBe(mappedRoute);
    });

    test('should return null when route not found', async () => {
      const routeId = '507f1f77bcf86cd799439011';
      
      mockRouteRepository.findById.mockResolvedValue(null);

      const result = await routeService.findById(routeId);

      expect(mockRouteRepository.findById).toHaveBeenCalledWith(routeId);
      expect(mockToRouteResponse).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const userId = '507f1f77bcf86cd799439011';
    const mockReq = {
      body: {
        name: 'New Route',
        description: 'A new adventure route',
        waypoints: [{ lat: 1, lng: 2 }]
      }
    };

    test('should create route successfully', async () => {
      const routeData = {
        name: 'New Route',
        description: 'A new adventure route',
        userId: userId,
        waypoints: [{ lat: 1, lng: 2 }]
      };
      const createdRoute = { id: 1, ...routeData };
      const mappedRoute = { id: 1, ...routeData };

      mockToRouteCreate.mockReturnValue(routeData);
      mockRouteRepository.create.mockResolvedValue(createdRoute);
      mockToRouteResponse.mockReturnValue(mappedRoute);

      const result = await routeService.create(mockReq, userId);

      expect(mockToRouteCreate).toHaveBeenCalledWith(mockReq.body, userId);
      
      expect(mockRunInterceptors).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Function)]),
        routeData
      );
      
      expect(mockRouteRepository.create).toHaveBeenCalledWith(routeData);
      
      expect(mockToRouteResponse).toHaveBeenCalledWith(createdRoute);
      expect(result).toBe(mappedRoute);
    });

    test('should run route name validation interceptor', async () => {
      const routeData = {
        name: 'New Route',
        description: 'A new adventure route',
        userId: userId,
        waypoints: []
      };

      mockToRouteCreate.mockReturnValue(routeData);
      mockRouteRepository.create.mockResolvedValue({ id: 1, ...routeData });
      mockToRouteResponse.mockReturnValue({ id: 1, ...routeData });

      await routeService.create(mockReq, userId);

      expect(mockRunInterceptors).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Function)]),
        routeData
      );

      const interceptorFunctions = mockRunInterceptors.mock.calls[0][0];
      const nameValidatorFn = interceptorFunctions[0];
      
      nameValidatorFn({ name: routeData.name });
      expect(mockValidateUniqueRouteName).toHaveBeenCalledWith(routeData.name);
    });

    test('should throw error if interceptors fail', async () => {
      const interceptorError = new Error('Route name already exists');
      const routeData = { name: 'Duplicate Route', userId };

      mockToRouteCreate.mockReturnValue(routeData);
      mockRunInterceptors.mockRejectedValue(interceptorError);

      await expect(routeService.create(mockReq, userId))
        .rejects.toThrow('Route name already exists');
      
      expect(mockRouteRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    test('should call routeRepository.delete with correct id', async () => {
      const routeId = '507f1f77bcf86cd799439011';
      const deleteResult = { deletedCount: 1 };
      
      mockRouteRepository.delete.mockResolvedValue(deleteResult);

      const result = await routeService.delete(routeId);

      expect(mockRouteRepository.delete).toHaveBeenCalledWith(routeId);
      expect(result).toBe(deleteResult);
    });
  });

  describe('findAll', () => {
    const mockRoutes = [
      { id: 1, name: 'Route A', description: 'First route' },
      { id: 2, name: 'Route B', description: 'Second route' }
    ];

    test('should return paginated routes without search', async () => {
      const totalCount = 20;
      
      mockRouteRepository.countDocuments.mockResolvedValue(totalCount);
      mockRouteRepository.findAll.mockResolvedValue(mockRoutes);
      mockToRouteResponse.mockImplementation(route => route);

      const result = await routeService.findAll({ pageIndex: 1, pageSize: 10 });

      expect(mockRouteRepository.countDocuments).toHaveBeenCalledWith({});
      expect(mockRouteRepository.findAll).toHaveBeenCalledWith({
        query: {},
        skip: 0,
        limit: 10
      });

      expect(mockToRouteResponse).toHaveBeenCalledTimes(mockRoutes.length);
      
      expect(result.total).toBe(totalCount);
      expect(result.pageIndex).toBe(1);
    });

    test('should return paginated routes with search', async () => {
      const searchTerm = 'mountain';
      const totalCount = 5;
      
      mockRouteRepository.countDocuments.mockResolvedValue(totalCount);
      mockRouteRepository.findAll.mockResolvedValue(mockRoutes);
      mockToRouteResponse.mockImplementation(route => route);

      const result = await routeService.findAll({ 
        pageIndex: 1, 
        pageSize: 10, 
        search: searchTerm 
      });

      const expectedQuery = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      expect(mockRouteRepository.countDocuments).toHaveBeenCalledWith(expectedQuery);
      expect(mockRouteRepository.findAll).toHaveBeenCalledWith({
        query: expectedQuery,
        skip: 0,
        limit: 10
      });

      expect(result.search).toBe(searchTerm);
    });

    test('should handle pagination for different pages', async () => {
      mockRouteRepository.countDocuments.mockResolvedValue(30);
      mockRouteRepository.findAll.mockResolvedValue([]);
      mockToRouteResponse.mockImplementation(route => route);

      await routeService.findAll({ pageIndex: 3, pageSize: 5 });

      expect(mockRouteRepository.findAll).toHaveBeenCalledWith({
        query: {},
        skip: 10, 
        limit: 5
      });
    });

    test('should use default parameters when none provided', async () => {
      mockRouteRepository.countDocuments.mockResolvedValue(0);
      mockRouteRepository.findAll.mockResolvedValue([]);
      mockToRouteResponse.mockImplementation(route => route);

      await routeService.findAll();

      expect(mockCreateParams).toHaveBeenCalledWith({
        pageIndex: 1,
        pageSize: 10,
        search: ''
      });
    });
  });

  describe('Error handling', () => {
    test('should propagate repository errors', async () => {
      const repositoryError = new Error('Database connection failed');
      mockRouteRepository.findById.mockRejectedValue(repositoryError);

      await expect(routeService.findById('some-id'))
        .rejects.toThrow('Database connection failed');
    });

    test('should propagate DTO transformation errors', async () => {
      const dtoError = new Error('Invalid route data');
      mockToRouteCreate.mockImplementation(() => {
        throw dtoError;
      });

      const mockReq = { body: { name: 'Test' } };
      const userId = 'user123';

      await expect(routeService.create(mockReq, userId))
        .rejects.toThrow('Invalid route data');
    });
  });

  describe('Promise.all handling', () => {
    test('should handle concurrent operations in findByUserContext', async () => {
      const userId = '507f1f77bcf86cd799439011';
      let countResolve, findAllResolve;
      
      const countPromise = new Promise(resolve => { countResolve = resolve; });
      const findAllPromise = new Promise(resolve => { findAllResolve = resolve; });

      mockRouteRepository.countDocuments.mockReturnValue(countPromise);
      mockRouteRepository.findAll.mockReturnValue(findAllPromise);
      mockToRouteResponse.mockImplementation(route => route);

      const resultPromise = routeService.findByUserContext(userId);

      countResolve(10);
      findAllResolve([{ id: 1, name: 'Test Route' }]);

      const result = await resultPromise;

      expect(result.total).toBe(10);
      expect(result.registers).toHaveLength(1);
    });

    test('should handle concurrent operations in findAll', async () => {
      let countResolve, findAllResolve;
      
      const countPromise = new Promise(resolve => { countResolve = resolve; });
      const findAllPromise = new Promise(resolve => { findAllResolve = resolve; });

      mockRouteRepository.countDocuments.mockReturnValue(countPromise);
      mockRouteRepository.findAll.mockReturnValue(findAllPromise);
      mockToRouteResponse.mockImplementation(route => route);

      const resultPromise = routeService.findAll();

      countResolve(5);
      findAllResolve([{ id: 1, name: 'Route 1' }]);

      const result = await resultPromise;

      expect(result.total).toBe(5);
      expect(result.registers).toHaveLength(1);
    });
  });
});