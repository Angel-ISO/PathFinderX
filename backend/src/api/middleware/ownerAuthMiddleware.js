import ApiResponse from "../../shared/errors/ApiResponse.js";
import Route from '../../Infrastructure/model/Route.js';
import { userContextService } from '../../shared/utils/UserContextService.js';

export const ownerAuth = (resourceType, routeIdName = 'id') => {
  return async (req, res, next) => {
    try {
      const userId = userContextService.getUserId(req); 
      
      if (!userId) {
        return res.status(401).json(new ApiResponse(401));
      }

      if (userContextService.getRole(req) === 'admin') {
        return next();
      }

      const resourceId = req.params[routeIdName];
      if (!resourceId) {
        return res.status(400).json(new ApiResponse(400, 'Resource ID is required'));
      }

      const isOwner = await verifyOwnership(resourceType, resourceId, userId);

      if (!isOwner) {
        return res.status(403).json({
          message: `You do not have permission to modify this ${resourceType}`
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


const verifyOwnership = async (resourceType, resourceId, userId) => {
  switch (resourceType.toLowerCase()) {
    case 'route':
      return await verifyRouteOwnership(resourceId, userId);
    case 'user':
      return verifyUserOwnership(resourceId, userId);
    default:
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }
};

const verifyUserOwnership = (userIdToCheck, currentUserId) => {
  return userIdToCheck === currentUserId.toString();
};

const verifyRouteOwnership = async (routeId, currentUserId) => {
  try {
    const route = await Route.findById(routeId);
    if (!route || !route.userId || !currentUserId) return false;
    
    return route.userId.toString() === currentUserId.toString();
  } catch (error) {
    console.error('Error verifying route ownership:', error);
    return false;
  }
};