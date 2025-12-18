import mongoose from 'mongoose';

export const toRouteCreate = (body, userId) => {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be a valid object');
  }

  const { name, route, totalDistance } = body;

  if (!name || typeof name !== 'string') {
    throw new Error('Route name is required and must be a string');
  }

  if (!Array.isArray(route)) {
    throw new Error('Route must be an array of coordinates');
  }

  if (typeof totalDistance !== 'number') {
    throw new Error('Total distance must be a number');
  }

  return {
    userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId,
    name: name.trim(),
    route,
    totalDistance,
    createdAt: new Date()
  };
};
