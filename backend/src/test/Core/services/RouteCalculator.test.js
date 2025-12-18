import ApiResponse from '../../../shared/errors/ApiResponse.js';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';

const mockNodes = [
  { id: 1, lat: 0, lon: 0 },
  { id: 2, lat: 1, lon: 1 },
  { id: 3, lat: 2, lon: 2 },
];

const mockWays = [
  { nodes: [1, 2] },
  { nodes: [2, 3] },
];

jest.unstable_mockModule('../../../Infrastructure/repository/NodeRepository.js', () => ({
  default: class {
    async findAll() {
      return mockNodes;
    }
  }
}));

jest.unstable_mockModule('../../../Infrastructure/repository/WayRepository.js', () => ({
  default: class {
    async findAll() {
      return mockWays;
    }
  }
}));

jest.unstable_mockModule('../../../core/helpers/Graph.js', () => ({
  GraphBuilder: class {
    constructor(nodes, ways) {
      this.nodes = nodes;
      this.ways = ways;
    }

    build() {
      return new Map([
        [1, { edges: [2] }],
        [2, { edges: [1, 3] }],
        [3, { edges: [2] }]
      ]);
    }
  }
}));

jest.unstable_mockModule('../../../core/helpers/Algorithm.js', () => ({
  aStarAlgorithm: jest.fn(async (from, to, graph, obstacles) => {
    if (obstacles.includes(from) || obstacles.includes(to)) throw new Error('Blocked');
    if (from === 1 && to === 3) return [1, 2, 3];
    return [from, to];
  })
}));

jest.unstable_mockModule('../../../core/helpers/Distance.js', () => ({
  calculatePathDistance: (path, graph) => path.length - 1,
}));

const { RouteCalculator } = await import('../../../core/service/RouteCalculator.js');


describe('RouteCalculator', () => {
  let calculator;

  beforeEach(async () => {
    calculator = new RouteCalculator();
    await calculator.initialize();
  });

  test('should calculate direct path with no stops or obstacles', async () => {
    const result = await calculator.calculate({ start: 1, end: 3 });
    expect(result.path).toEqual([1, 2, 3]);
    expect(result.totalDistance).toBe(2);
  });

  test('should throw ApiResponse when node is missing', async () => {
    await expect(calculator.calculate({ start: 1, end: 99 }))
      .rejects.toThrow(ApiResponse);
  });

  test('should throw ApiResponse when nodes are not connected', async () => {
    await expect(calculator.calculate({ start: 1, end: 3, obstacles: [2] }))
      .rejects.toThrow('There is no connectivity between start and end points');
  });

  test('should calculate path with intermediate stops', async () => {
    const result = await calculator.calculate({ start: 1, stops: [2], end: 3 });
    expect(result.path).toEqual([1, 2, 3]);
  });

  test('should throw timeout error if path takes too long', async () => {
    calculator.TIMEOUT_MS = 1;
    const { aStarAlgorithm } = await import('../../../core/helpers/Algorithm.js');
    aStarAlgorithm.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)));

    await expect(calculator.calculate({ start: 1, end: 2 }))
      .rejects.toThrow('cant calculate route between 1 and 2');
  });
});
