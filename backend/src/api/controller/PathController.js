import { PathService } from '../../core/service/PathService.js';
import { PathRequest } from '../../api/dto/Path/PathRequest.js';

const pathService = new PathService();

// PRINCIPIO SRP
// Este controlador solo se encarga de recibir y responder solicitudes HTTP relacionadas con "Path".
// Toda la lógica de negocio se delega a los servicios correspondientes, cumpliendo así con el principio de responsabilidad única.

export const calculateRoute = async (req, res, next) => {
  try {
    const dto = PathRequest.from(req.body);
    const response = await pathService.calculateRoute(dto);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
