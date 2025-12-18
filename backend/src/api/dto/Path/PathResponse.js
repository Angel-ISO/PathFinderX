export class PathResponse {
constructor(route, totalDistance) {
    this.route = route;
    this.totalDistance = totalDistance;
  }

  static from(path, nodeMap, totalDistance) {
    const formatted = path.map(id => {
      const node = nodeMap.get(id);
      return { id, lat: node.lat, lon: node.lon };
    });

    return new PathResponse(formatted, totalDistance);
  }
}
