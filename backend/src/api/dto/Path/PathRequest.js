export class PathRequest {
  constructor({ start, end, stops = [], obstacles = [] }) {
    this.start = start;
    this.end = end;
    this.stops = stops;
    this.obstacles = obstacles;
  }

  static from(body) {
    const { start, end, stops, obstacles } = body;
    return new PathRequest({ start, end, stops, obstacles });
  }
}
