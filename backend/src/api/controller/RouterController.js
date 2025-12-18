import RouteService from "../../core/service/RouteService.js";
import { toRouteCreate } from "../dto/Route/RouteCreateRequest.js";
import { toRouteResponse } from "../dto/Route/RouteResponse.js";
import { userContextService } from "../../shared/utils/UserContextService.js";


const routeService = new RouteService();

export const findByUser = async (req, res, next) => {
  try {
    const userId = userContextService.getUserId(req);
    const { pageIndex, pageSize, search } = req.query;
    const result = await routeService.findByUserContext(userId, { pageIndex, pageSize, search });
    res.json(result);
  } catch (err) {
    next(err);
  }
};


export const create = async (req, res, next) => {
  try {
    const userId = userContextService.getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const created = await routeService.create(req, userId); 
    res.status(201).json(toRouteResponse(created));
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const deleted = await routeService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.status(200).json({ message: "Route deleted successfully" });
  } catch (err) {
    next(err);
  }
};

