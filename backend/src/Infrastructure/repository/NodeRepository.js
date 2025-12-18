import Node from '../model/Node.js';
import { distance } from '../../shared/utils/haversine.js';
import kdTreePkg from 'kd-tree-javascript';
const { kdTree } = kdTreePkg;

export default class NodeRepository {
  #cachedNodes = null;
  #kdTree = null;


  async #loadCache() {
    if (!this.#cachedNodes || !this.#kdTree) {
      const nodes = await Node.find({}, { _id: 1, lat: 1, lon: 1 });
      this.#cachedNodes = nodes;

      const points = nodes.map(node => ({
        id: node._id,
        lat: node.lat,
        lon: node.lon,
      }));

      const distanceFn = (a, b) => distance(a.lat, a.lon, b.lat, b.lon);
      this.#kdTree = new kdTree(points, distanceFn, ['lat', 'lon']);

      console.log(`[NodeRepository] KD-Tree built with ${points.length} nodes`);
    }
  }

  async findClosestNode(lat, lon) {
    await this.#loadCache();

    const nearest = this.#kdTree.nearest({ lat, lon }, 1);
    const closest = nearest?.[0]?.[0]; 

    return closest ? { _id: closest.id, lat: closest.lat, lon: closest.lon } : null;
  }

  async findById(id) {
    return Node.findOne({ _id: id });
  }
  
  async findAll() {
  await this.#loadCache();
  return this.#cachedNodes;
}


  async findByIds(ids = []) {
    return Node.find({ _id: { $in: ids } });
  }

  clearCache() {
    this.#cachedNodes = null;
    this.#kdTree = null;
    console.log('[NodeRepository] Cache and KD-Tree cleared');
  }
}