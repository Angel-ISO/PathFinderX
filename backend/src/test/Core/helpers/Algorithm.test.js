import { describe, test, expect, jest } from '@jest/globals';

jest.unstable_mockModule('../../../core/helpers/Distance.js', () => ({
  haversineDistance: (a, b) => {
    const key = `${a.lat},${a.lon}->${b.lat},${b.lon}`;

    const distances = {
      '0,0->0,1': 1,  
      '0,1->0,2': 1,  
      '0,2->1,2': 1,  

      '0,0->1,0': 10, 
      '1,0->1,2': 10, 
      '0,1->1,2': 5,
      '0,0->0,2': 2,
    };

    return distances[key] ?? 100; 
  }
}));

const { aStarAlgorithm } = await import('../../../core/helpers/Algorithm.js');

const graph = new Map([
  [1, { nodeData: { lat: 0, lon: 0 }, edges: [2, 4] }],
  [2, { nodeData: { lat: 0, lon: 1 }, edges: [1, 3] }],
  [3, { nodeData: { lat: 0, lon: 2 }, edges: [2, 5] }],
  [4, { nodeData: { lat: 1, lon: 0 }, edges: [1, 5] }],
  [5, { nodeData: { lat: 1, lon: 2 }, edges: [3, 4] }],
]);

describe('aStarAlgorithm (mocked distances)', () => {
  test('should prefer shortest total distance, not fewest nodes', () => {
    const result = aStarAlgorithm(1, 5, graph);
    expect(result).toEqual([1, 2, 3, 5]);
  });

  test('should return direct path if only one neighbor', () => {
    const result = aStarAlgorithm(1, 2, graph);
    expect(result).toEqual([1, 2]);
  });

  test('should handle when start equals end', () => {
    const result = aStarAlgorithm(2, 2, graph);
    expect(result).toEqual([2]);
  });

  test('should throw error when maxIterations is exceeded', () => {
    const disconnectedGraph = new Map([
      [1, { nodeData: { lat: 0, lon: 0 }, edges: [] }],
      [2, { nodeData: { lat: 0, lon: 1 }, edges: [] }],
    ]);

    expect(() => {
      aStarAlgorithm(1, 2, disconnectedGraph, [], 5); 
    }).toThrow('The route cant be found after 5 iterations');
  });

  test('should prefer shortest total distance, not fewest nodes', () => {
    const customGraph = new Map([
      [1, { nodeData: { lat: 0, lon: 0 }, edges: [2, 4] }],
      [2, { nodeData: { lat: 0, lon: 1 }, edges: [1, 3] }],
      [3, { nodeData: { lat: 0, lon: 2 }, edges: [2, 5] }],
      [4, { nodeData: { lat: 1, lon: 0 }, edges: [1, 5] }],
      [5, { nodeData: { lat: 1, lon: 2 }, edges: [3, 4] }],
    ]);

    const result = aStarAlgorithm(1, 5, customGraph);
    expect(result).toEqual([1, 2, 3, 5]); 
  });

  test('should throw if any node is missing in graph', () => {
    expect(() => {
      aStarAlgorithm(1, 99, graph);
    }).toThrow();
  });

  test('should throw if obstacle is the destination', () => {
    expect(() => {
      aStarAlgorithm(1, 3, graph, [3]);
    }).toThrow();
  });
});
