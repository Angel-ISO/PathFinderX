import { PathRequest } from '../../api/dto/Path/PathRequest.js';
import { PathResponse } from '../../api/dto/Path/PathResponse.js';
import { RouteCalculator } from './RouteCalculator.js';
import NodeRepository from '../../Infrastructure/repository/NodeRepository.js';
import ApiResponse from '../../shared/errors/ApiResponse.js';

export class PathService {
  constructor(nodeRepo = new NodeRepository(), calculator = new RouteCalculator()) {
    this.nodeRepo = nodeRepo;
    this.calculator = calculator;
    this.MAX_DISTANCE_METERS = 100; 
  }

  async calculateRoute(routeInput) {
    console.time('TotalRouteCalculation');
    try {
      const dto = PathRequest.from(routeInput);

      console.time('LoadNodes');
      await this.nodeRepo.findAll();
      console.timeEnd('LoadNodes');

      console.time('ResolveCoordinates');
      const { startId, endId, stopIds, obstacleIds } = await this.#resolveNodes(dto);
      console.timeEnd('ResolveCoordinates');

      console.time('PathCalculation');
      const result = await this.calculator.calculate({
        start: startId,
        end: endId,
        stops: stopIds,
        obstacles: obstacleIds
      });
      console.timeEnd('PathCalculation');

      console.time('FormatResponse');
      const response = await this.#formatResponse(result);
      console.timeEnd('FormatResponse');

      return response;
    } catch (error) {
      console.error('Error en calculateRoute:', error);
      if (error instanceof ApiResponse) throw error;
      throw new ApiResponse(500, 'Error calculating route');
    } finally {
      console.timeEnd('TotalRouteCalculation');
    }
  }

  async #resolveNodes(dto) {
    const resolveWithValidation = async (input, type) => {
      if (this.#isCoordinate(input)) {
        const node = await this.nodeRepo.findClosestNode(input.lat, input.lon);
        if (!node) {
          throw new ApiResponse(400, `The closest node for ${type} (${input.lat}, ${input.lon}) was not found`);
        }
        return node._id;
      }
      return input;
    };

    const startId = await resolveWithValidation(dto.start, 'inicio');
    const endId = await resolveWithValidation(dto.end, 'fin');
    const stopIds = await Promise.all(
      (dto.stops || []).map((stop, i) => resolveWithValidation(stop, `parada[${i}]`))
    );
    const obstacleIds = await Promise.all(
      (dto.obstacles || []).map((obs, i) => resolveWithValidation(obs, `obstáculo[${i}]`))
    );

    return { startId, endId, stopIds, obstacleIds };
  }

  async #formatResponse(result) {
    const nodesDetails = await this.nodeRepo.findByIds(result.path);
    const nodeMap = new Map(nodesDetails.map(node => [node._id, node]));
    return PathResponse.from(result.path, nodeMap, result.totalDistance);
  }

  #isCoordinate(input) {
    return input && typeof input === 'object' && 'lat' in input && 'lon' in input;
  }
}