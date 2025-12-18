import Way from '../model/Way.js';

export default class WayRepository {
  async findAll({ query = {}, skip = 0, limit = 0, sort = {} }) {
    return Way.find(query).skip(skip).limit(limit).sort(sort);
  }

  async countDocuments(query = {}) {
    return Way.countDocuments(query);
  }

  async findByNodeId(nodeId) {
    return Way.find({ nodes: nodeId });
  }

  async findWaysConnectingNodes(nodeA, nodeB) {
    return Way.find({
      nodes: { $all: [nodeA, nodeB] } 
    });
  }
}
