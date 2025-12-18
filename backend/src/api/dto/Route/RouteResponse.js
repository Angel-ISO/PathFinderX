export const toRouteResponse = (route) => ({
  id: route._id,
  name: route.name,
  totalDistance: route.totalDistance,
  route: route.route.map(node => ({
    id: node.id,
    lat: node.lat,
    lon: node.lon
  })),
  createdAt: route.createdAt
});