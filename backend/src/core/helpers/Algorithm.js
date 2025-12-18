import { haversineDistance } from './Distance.js';

export function aStarAlgorithm(startId, endId, graph, obstacles = [], maxIterations = 50000) {
  class PriorityQueue {
    constructor() {
      this.elements = [];
    }
    enqueue(element, priority) {
      this.elements.push({element, priority});
      this.elements.sort((a, b) => a.priority - b.priority);
    }
    dequeue() {
      return this.elements.shift().element;
    }
    isEmpty() {
      return this.elements.length === 0;
    }
    has(element) {
      return this.elements.some(e => e.element === element);
    }
  }

  const openSet = new PriorityQueue();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();
  
  gScore.set(startId, 0);
  fScore.set(startId, haversineDistance(
    graph.get(startId).nodeData,
    graph.get(endId).nodeData
  ));
  openSet.enqueue(startId, fScore.get(startId));

  const closedSet = new Set();
  let iterations = 0;

  while (!openSet.isEmpty() && iterations++ < maxIterations) {
    const current = openSet.dequeue();

    if (current === endId) {
      return reconstructPath(cameFrom, current);
    }

    closedSet.add(current);

    for (const neighbor of graph.get(current).edges) {
      if (closedSet.has(neighbor)) continue;
      if (obstacles.includes(neighbor)) continue;

      const tentativeGScore = gScore.get(current) + haversineDistance(
        graph.get(current).nodeData,
        graph.get(neighbor).nodeData
      );

      if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + haversineDistance(
          graph.get(neighbor).nodeData,
          graph.get(endId).nodeData
        ));

        if (!openSet.has(neighbor)) {
          openSet.enqueue(neighbor, fScore.get(neighbor));
        }
      }
    }
  }

  throw new Error(`The route cant be found after ${maxIterations} iterations`);
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current);
    path.unshift(current);
  }
  return path;
}