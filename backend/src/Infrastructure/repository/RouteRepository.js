import Route from '../model/Route.js';

export default class RouteRepository {

  async findByUserIdPaginated({ userId, search = '', skip = 0, limit = 10, sort = {} }) {
    const query = { userId };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const routes = await Route.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await Route.countDocuments(query);

    return { routes, total };
  }

  async findById(id) {
    return Route.findById(id);
  }

  async create(routeData) {
    return Route.create(routeData);
  }

  async update(id, updateData) {
    return Route.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return Route.findByIdAndDelete(id);
  }

  async countDocuments(query = {}) {
    return Route.countDocuments(query);
  }


  async findAll({ query = {}, skip = 0, limit = 10, sort = {} }) {
    return Route.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }
}