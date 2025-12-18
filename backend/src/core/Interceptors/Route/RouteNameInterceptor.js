import Route from '../../../Infrastructure/model/Route.js';
import { RouteNameAlreadyExistException } from '../../Exceptions/RouteNameAlreadyExistException.js';

export async function validateUniqueRouteName(name) {
  const exists = await Route.exists({ name });
  if (exists) {
    throw new RouteNameAlreadyExistException();
  }
}
