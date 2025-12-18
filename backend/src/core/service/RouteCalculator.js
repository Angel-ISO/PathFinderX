import NodeRepository from '../../Infrastructure/repository/NodeRepository.js';
import WayRepository from '../../Infrastructure/repository/WayRepository.js';
import { GraphBuilder } from '../helpers/Graph.js';
import { aStarAlgorithm } from '../helpers/Algorithm.js';
import { calculatePathDistance } from '../helpers/Distance.js';
import ApiResponse from '../../shared/errors/ApiResponse.js';

export class RouteCalculator {
  constructor() {
    this.nodeRepo = new NodeRepository();
    this.wayRepo = new WayRepository();
    this.graph = new Map();
    this.initialized = false;
    this.TIMEOUT_MS = 5000; 
  }

  async initialize() {
    if (this.initialized) return;

    console.time('GraphInitialization');
    try {
      const [nodes, ways] = await Promise.all([
        this.nodeRepo.findAll({}),
        this.wayRepo.findAll({})
      ]);

      this.graph = new GraphBuilder(nodes, ways).build();
      this.initialized = true;
    } finally {
      console.timeEnd('GraphInitialization');
    }
  }

  validateNodes(nodeIds) {
    const missing = nodeIds.filter(id => !this.graph.has(id));
    if (missing.length > 0) {
      throw new ApiResponse(
        404,
        `The following nodes do not exist in the graph: ${missing.join(', ')}`
      );
    }
  }

  async calculate({ start, end, stops = [], obstacles = [] }) {
    if (!this.initialized) await this.initialize();

    this.validateNodes([start, end, ...stops, ...obstacles]);

    const allStops = [start, ...stops, end];
    const fullPath = [];

    if (!this.#areNodesConnected(start, end, obstacles)) {
      throw new ApiResponse(404, 'There is no connectivity between start and end points');
    }

    for (let i = 0; i < allStops.length - 1; i++) {
      const segment = await this.#calculateSegmentWithTimeout(
        allStops[i],
        allStops[i + 1],
        obstacles
      );

      if (i > 0 && segment[0] === fullPath[fullPath.length - 1]) {
        segment.shift();
      }
      fullPath.push(...segment);
    }

    return {
      path: fullPath,
      totalDistance: calculatePathDistance(fullPath, this.graph)
    };
  }

  async #calculateSegmentWithTimeout(from, to, obstacles) {
    const timeout = new Promise((_, reject) => {
    const t = setTimeout(() => reject(new Error('Timeout trying to calculate segment')), this.TIMEOUT_MS);
    t.unref(); 
});
    try {
      return await Promise.race([
        aStarAlgorithm(from, to, this.graph, obstacles),
        timeout
      ]);
    } catch (error) {
      throw new ApiResponse(404, `cant calculate route between ${from} and ${to}`);
    }
  }

  #areNodesConnected(from, to, obstacles) {
    const visited = new Set(obstacles);
    const queue = [from];
    let steps = 0;
    const MAX_STEPS = 10000;

    while (queue.length > 0 && steps++ < MAX_STEPS) {
      const current = queue.shift();
      
      if (current === to) return true;
      if (!this.graph.has(current)) continue;
      
      for (const neighbor of this.graph.get(current).edges) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    return false;
  }
}