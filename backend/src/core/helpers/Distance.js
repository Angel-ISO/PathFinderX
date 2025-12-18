import { distance } from '../../shared/utils/haversine.js';

export function haversineDistance(nodeA, nodeB) {
  return distance(nodeA.lat, nodeA.lon, nodeB.lat, nodeB.lon);
}

export function calculatePathDistance(path, graph) {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    total += haversineDistance(
      graph.get(path[i]).nodeData,
      graph.get(path[i + 1]).nodeData
    );
  }
  return total;
}
