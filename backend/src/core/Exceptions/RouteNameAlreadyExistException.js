import ApiResponse from '../../shared/errors/ApiResponse.js';

export class RouteNameAlreadyExistException extends ApiResponse {
  constructor(message = 'The route name already exists.') {
    super(400, message);
    this.name = 'RouteNameAlreadyExistException';
  }
}
