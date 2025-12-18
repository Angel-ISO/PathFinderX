import RouteRepository from '../../Infrastructure/repository/RouteRepository.js';
import { runInterceptors } from '../Interceptors/RunInterceptors.js';
import { validateUniqueRouteName } from '../Interceptors/Route/RouteNameInterceptor.js';
import { createPager } from '../helpers/Pager.js';
import { createParams } from '../helpers/Params.js';
import { toRouteResponse } from '../../api/dto/Route/RouteResponse.js';
import { toRouteCreate } from '../../api/dto/Route/RouteCreateRequest.js';

export default class RouteService {
  constructor() {
    this.routeRepository = new RouteRepository();
  }

 async findByUserContext(userId, { pageIndex = 1, pageSize = 10, search = '' } = {}) {
  if (!userId) throw new Error("No authenticated user found");

  const params = createParams({ pageIndex, pageSize, search });

  const baseQuery = { userId };

  if (params.search) {
    baseQuery.name = { $regex: params.search, $options: 'i' };
  }

  const [total, routes] = await Promise.all([
    this.routeRepository.countDocuments(baseQuery),
    this.routeRepository.findAll({
      query: baseQuery,
      skip: (params.pageIndex - 1) * params.pageSize,
      limit: params.pageSize
    })
  ]);

  const mapped = routes.map(toRouteResponse);

  return createPager({
    registers: mapped,
    total,
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    search: params.search
  });
}

  async findById(id) {
    const route = await this.routeRepository.findById(id);
    return route ? toRouteResponse(route) : null;
  }

  async create(req, userId) {
  const routeData = toRouteCreate(req.body, userId);

  await runInterceptors(
    [
      async ({ name }) => {
        await validateUniqueRouteName(name);
      }
    ],
    routeData
  );

  const newRoute = await this.routeRepository.create(routeData);
  return toRouteResponse(newRoute);
}


  async delete(id) {
    return this.routeRepository.delete(id);
  }

  async findAll({ pageIndex = 1, pageSize = 10, search = '' } = {}) {
    const params = createParams({ pageIndex, pageSize, search });

    const buildQuery = () => {
      if (!params.search) return {};
      return {
        $or: [
          { name: { $regex: params.search, $options: 'i' } }
        ]
      };
    };

    const query = buildQuery();

    const [total, routes] = await Promise.all([
      this.routeRepository.countDocuments(query),
      this.routeRepository.findAll({
        query,
        skip: (params.pageIndex - 1) * params.pageSize,
        limit: params.pageSize
      })
    ]);

    const mapped = routes.map(toRouteResponse);

    return createPager({
      registers: mapped,
      total,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      search: params.search
    });
  }
}