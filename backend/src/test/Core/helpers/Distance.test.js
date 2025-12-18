import { describe, test, expect, jest, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../../../shared/utils/haversine.js', () => ({
  distance: jest.fn()
}));

const { haversineDistance, calculatePathDistance } = await import('../../../core/helpers/Distance.js');
const { distance } = await import('../../../shared/utils/haversine.js');

describe('Distance Helper Functions', () => {
  describe('haversineDistance()', () => {
    beforeEach(() => {
      distance.mockClear();
    });

    test('should calculate distance between two nodes', () => {
      distance.mockReturnValue(1000);
      
      const nodeA = { lat: 40.7128, lon: -74.0060 }; 
      const nodeB = { lat: 34.0522, lon: -118.2437 };
      
      const result = haversineDistance(nodeA, nodeB);
      
      expect(distance).toHaveBeenCalledWith(
        nodeA.lat, nodeA.lon,
        nodeB.lat, nodeB.lon
      );
      expect(result).toBe(1000);
    });

    test('should return 0 for same node', () => {
      distance.mockReturnValue(0);
      
      const node = { lat: 40.7128, lon: -74.0060 };
      const result = haversineDistance(node, node);
      
      expect(result).toBe(0);
      expect(distance).toHaveBeenCalledWith(
        node.lat, node.lon,
        node.lat, node.lon
      );
    });
  });

  describe('calculatePathDistance()', () => {
    let mockGraph;

    beforeEach(() => {
      jest.clearAllMocks();
      
      mockGraph = new Map([
        ['A', { nodeData: { lat: 0, lon: 0 } }],
        ['B', { nodeData: { lat: 1, lon: 1 } }],
        ['C', { nodeData: { lat: 2, lon: 2 } }],
        ['D', { nodeData: { lat: 3, lon: 3 } }]
      ]);

      distance.mockImplementation((lat1, lon1, lat2, lon2) => {
        return Math.abs(lat2 - lat1) * 100; 
      });
    });

    test('should calculate total distance for path', () => {
      const path = ['A', 'B', 'C', 'D'];
      const result = calculatePathDistance(path, mockGraph);
      
      expect(result).toBe(300); 
      expect(distance).toHaveBeenCalledTimes(3);
      expect(distance).toHaveBeenCalledWith(0, 0, 1, 1);
      expect(distance).toHaveBeenCalledWith(1, 1, 2, 2);
      expect(distance).toHaveBeenCalledWith(2, 2, 3, 3);
    });

    test('should return 0 for single-node path', () => {
      const path = ['A'];
      const result = calculatePathDistance(path, mockGraph);
      
      expect(result).toBe(0);
      expect(distance).not.toHaveBeenCalled();
    });

    test('should handle empty path', () => {
      const path = [];
      const result = calculatePathDistance(path, mockGraph);
      
      expect(result).toBe(0);
      expect(distance).not.toHaveBeenCalled();
    });

    test('should sum distances correctly for complex path', () => {
      const complexPath = ['A', 'B', 'A', 'C', 'D'];
      const result = calculatePathDistance(complexPath, mockGraph);
      
      expect(result).toBe(500); 
      expect(distance).toHaveBeenCalledTimes(4);
    });
  });
});